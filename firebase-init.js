import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getDatabase, ref, get, child, set, remove, push, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCV7G2oYqi5D2D94AkaWXUFQ3zEIgsg40s",
    authDomain: "dottech-website.firebaseapp.com",
    databaseURL: "https://dottech-website-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dottech-website",
    storageBucket: "dottech-website.firebasestorage.app",
    messagingSenderId: "1081481170332",
    appId: "1:1081481170332:web:189c741dd1b21250b48c59",
    measurementId: "G-FL0H9KDFJ2"
};

const app = initializeApp(firebaseConfig);
window.auth = getAuth(app);
window.db = getFirestore(app);
window.rtdb = getDatabase(app);
window.appId = 'dottech-store';

// Expose RTDB methods for other scripts
window.rtdbRef = ref;
window.rtdbSet = set;
window.rtdbGet = get;
window.rtdbChild = child;
window.rtdbPush = push;
window.rtdbRemove = remove;
window.rtdbOnValue = onValue;

// Fetch Global Settings (Exchange Rate)
get(child(ref(window.rtdb), `artifacts/${window.appId}/settings/global`)).then(snap => {
    if (snap.exists() && snap.val().exchangeRate) {
        window.exchangeRate = snap.val().exchangeRate;
        if (window.currentCurrency === 'SYP') {
            document.querySelectorAll('.currency-display').forEach(el => {
                const usd = parseFloat(el.dataset.usd);
                if (!isNaN(usd) && typeof formatPrice === 'function') {
                    el.textContent = formatPrice(usd);
                } else if (!isNaN(usd)) {
                    el.textContent = `${(usd * window.exchangeRate).toLocaleString()} SYP`;
                }
            });
            if (typeof renderCart === 'function') renderCart();
        }
    }
}).catch(e => console.log("Exchange rate ready."));

window.dbAPI = {
    fetchProducts: async () => {
        try {
            const dbRef = ref(window.rtdb);
            const snapshot = await get(child(dbRef, `artifacts/${window.appId}/products`));
            if (!snapshot.exists()) return [];
            const val = snapshot.val();
            // RTDB might return an object or an array with null holes
            const products = Array.isArray(val) ? val.filter(v => v) : Object.values(val);
            return products.map(p => ({
                ...p,
                stock: p.stock || 0,
                stockLeft: p.stockLeft !== undefined ? p.stockLeft : (p.stock || 0)
            }));
        } catch (e) { console.error("Error fetching products:", e); return []; }
    },
    fetchArticles: async () => {
        try {
            const dbRef = ref(window.rtdb);
            const snapshot = await get(child(dbRef, `artifacts/${window.appId}/articles`));
            if (!snapshot.exists()) return [];
            const val = snapshot.val();
            return Array.isArray(val) ? val.filter(v => v) : Object.values(val);
        } catch (e) { console.error("Error fetching articles:", e); return []; }
    },
    syncCart: async (cartItems) => {
        if (!window.auth.currentUser) return;
        await set(ref(window.rtdb, `artifacts/${window.appId}/users/${window.auth.currentUser.uid}/cart`), { items: cartItems });
    },
    placeOrder: async (cartData, totalAmount) => {
        if (!window.auth.currentUser) { window.location.href = 'auth.html'; return false; }
        try {
            const profSnap = await get(ref(window.rtdb, `artifacts/${window.appId}/users/${window.auth.currentUser.uid}/profile`));
            if (!profSnap.exists() || !profSnap.val().phoneNumber) {
                const pModal = document.getElementById('profile-modal');
                if (pModal) {
                    pModal.classList.remove('hidden'); pModal.classList.add('flex');
                    setTimeout(() => { pModal.style.opacity = '1'; document.getElementById('profile-modal-inner').classList.replace('scale-95', 'scale-100'); }, 10);
                } else {
                    alert("Please complete your profile in the dashboard first.");
                    window.location.href = 'profile.html';
                }
                return false;
            }

            const userInfo = profSnap.val();

            await addDoc(collection(window.db, 'artifacts', window.appId, 'orders'), {
                userId: window.auth.currentUser.uid,
                customerName: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
                customerPhone: userInfo.phoneNumber,
                customerEmail: userInfo.email,
                items: cartData,
                subTotal: cartData.reduce((sum, i) => sum + (i.priceUSD * i.qty), 0),
                discountRate: window.currentDiscount || 0,
                total: totalAmount,
                totalCurrency: window.currentCurrency || 'USD',
                status: 'pending',
                date: new Date().toISOString()
            });

            await window.dbAPI.syncCart([]);
            return true;
        } catch (e) { console.error("Order error:", e); if (typeof showToast === 'function') showToast("Error placing order.", "error"); else alert("Error placing order."); return false; }
    },
    saveProfile: async () => {
        const f = document.getElementById('prof-fname')?.value;
        const l = document.getElementById('prof-lname')?.value;
        const p = document.getElementById('prof-phone')?.value;
        if (!f || !l || !p) {
            if (typeof showToast === 'function') showToast("Please fill in all fields.", "error"); else alert("Please fill in all fields.");
            return;
        }
        if (!window.auth.currentUser) return;

        await set(ref(window.rtdb, `artifacts/${window.appId}/users/${window.auth.currentUser.uid}/profile`), {
            firstName: f, lastName: l, phoneNumber: p, email: window.auth.currentUser.email
        });

        const pModal = document.getElementById('profile-modal');
        if (pModal) {
            pModal.style.opacity = '0';
            document.getElementById('profile-modal-inner').classList.replace('scale-100', 'scale-95');
            setTimeout(() => pModal.classList.replace('flex', 'hidden'), 300);
            if (typeof showToast === 'function') showToast("Profile saved successfully.");
        } else {
            alert("Profile saved successfully.");
        }
    },
    getDocs: getDocs,
    collection: collection,
    doc: doc,
    updateDoc: updateDoc,
    deleteDoc: deleteDoc
};

window.authAPI = window.authAPI || {};
window.authAPI.logout = () => {
    signOut(window.auth).then(() => {
        if (window.location.pathname.includes('admin.html')) window.location.href = 'index.html';
        else window.location.reload();
    });
};

onAuthStateChanged(window.auth, async (user) => {
    const loginBtn = document.getElementById('auth-login-btn');
    const profileMenu = document.getElementById('user-profile-menu');
    const avatar = document.getElementById('user-avatar');

    if (user) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (profileMenu) { profileMenu.classList.remove('hidden'); profileMenu.classList.add('flex'); }
        if (avatar) avatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=109B74&color=fff`;

        try {
            const cartSnap = await get(ref(window.rtdb, `artifacts/${window.appId}/users/${user.uid}/cart`));
            if (cartSnap.exists() && typeof window.setCart === 'function') {
                window.setCart(cartSnap.val().items || []);
            }
        } catch (e) { }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (profileMenu) { profileMenu.classList.add('hidden'); profileMenu.classList.remove('flex'); }
        if (typeof window.setCart === 'function') window.setCart([]);
    }
});

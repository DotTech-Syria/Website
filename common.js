window.currentCurrency = localStorage.getItem('dottech_currency') || 'USD';
window.exchangeRate = 14500;
window.currentDiscount = 0;
window.cart = [];

/* --- UI & Theming --- */
window.toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('dottech_theme', isDark ? 'dark' : 'light');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.innerHTML = isDark
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
    }
};

window.formatPrice = (usdValue) => {
    if (typeof usdValue === 'string') {
        const usdNum = parseFloat(usdValue.replace(/[^0-9.-]+/g, ""));
        if (isNaN(usdNum)) return usdValue;
        usdValue = usdNum;
    }
    return window.currentCurrency === 'USD' ? `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${(usdValue * window.exchangeRate).toLocaleString()} SYP`;
};

window.toggleCurrency = () => {
    window.currentCurrency = window.currentCurrency === 'USD' ? 'SYP' : 'USD';
    localStorage.setItem('dottech_currency', window.currentCurrency);
    const currBtn = document.getElementById('currency-toggle-btn');
    if (currBtn) currBtn.textContent = window.currentCurrency;

    const navCurr = document.getElementById('nav-currency');
    if (navCurr) navCurr.innerText = window.currentCurrency;

    document.querySelectorAll('.currency-display').forEach(el => {
        if (el.dataset.usd) el.textContent = window.formatPrice(parseFloat(el.dataset.usd));
    });
    if (typeof window.renderCart === 'function') window.renderCart();

    // Trigger generic price update if function exists
    if (typeof window.updateProductPrices === 'function') window.updateProductPrices();
};

const translations = {
    en: {
        nav_story: "Our Story", nav_expertise: "Expertise", nav_store: "Store", nav_future: "Future", nav_contact: "Initiate Contact",
        hero_est: "Est. March 2025", hero_title: "Tech in <br><span class='text-gradient italic font-light'>Human </span> Service.", hero_desc: "A starting point towards a better, simpler, and more aware tech experience. We simplify the complex.", hero_btn: "Discover Solutions",
        about_title: "More than just a store. A trusted space.", about_p1: "DotTech is an integrated tech project providing smart solutions in the computing world. We believe technology should serve people, not burden them.", about_p2: "We work to simplify tech solutions and provide precise, well-studied services far from complexity or exploitation. We help our clients understand their options, choose what truly fits them, and get the absolute best performance from their devices.",
        srv_title: "Expertise.", srv_1_t: "Diagnostics & Repair", srv_1_d: "Accurate and reliable repair services for PCs and laptops. We diagnose honestly and provide effective solutions without unnecessary costs.", srv_2_t: "Hardware Upgrades", srv_2_d: "Breathe new life into your systems with professional hardware and OS upgrades tailored perfectly to your workflow.", srv_3_t: "Curated Accessories", srv_3_d: "Carefully selected peripherals and accessories, rigorously tested to guarantee high quality and fair value.", srv_4_t: "Consulting", srv_4_d: "Honest advice on what you actually need. We build relationships on trust, ensuring you buy or upgrade intelligently.",
        store_title: "Hardware & Gear.", store_desc: "Premium tech gear curated by experts. No gimmicks.", store_view_all: "View All Products",
        vis_label: "The Vision", vis_desc: "To be a pioneering reference, raising tech awareness and building a community that uses technology safely.", mis_label: "The Mission", mis_desc: "Delivering clear, simplified solutions that put users first, combining transparency and real support.",
        road_title: "The Path Forward.", road_p1_t: "Phase I", road_p1_d: "Establish accurate diagnostics, build reputation on pure honesty, and offer fair-priced quality tech.", road_p2_t: "Phase II", road_p2_d: "Expand consulting, host community tech events, and introduce bespoke software solutions.", road_p3_t: "Phase III", road_p3_d: "Build a trusted global brand, become a comprehensive platform, and integrate ethical AI for users.",
        contact_title: "Let's Talk.", contact_desc: "Ready for a better tech experience? Reach out to optimize your digital life.", footer_rights: "© 2026 DotTech. All rights reserved.", btn_add: "Add",
        store_search: "Search products, brands, categories...", store_sort_def: "Default Sorting", store_sort_low: "Price: Low to High", store_sort_high: "Price: High to Low", store_filters: "Filters", store_reset: "Reset", store_categories: "Categories", store_brand: "Brand", store_price: "Price Range", store_cat_all: "All", store_loading: "Loading catalog..."
    },
    ar: {
        nav_story: "قصتنا", nav_expertise: "خبراتنا", nav_store: "المتجر", nav_future: "المستقبل", nav_contact: "تواصل معنا",
        hero_est: "تأسست في مارس ٢٠٢٥", hero_title: "التكنولوجيا في <br><span class='text-gradient italic font-light px-2'>خدمة</span> الإنسان.", hero_desc: "نقطة انطلاق نحو تجربة تقنية أفضل، أبسط، وأكثر وعيًا. نحن نضع احتياجاتك في المقدمة.", hero_btn: "استكشف الحلول",
        about_title: "أكثر من مجرد متجر. مساحة موثوقة.", about_p1: "دوت تك هو مشروع تقني متكامل يقدّم حلولًا ذكية في عالم الكمبيوتر والتكنولوجيا. نؤمن أن التكنولوجيا يجب أن تكون في خدمة الإنسان، لا عبئًا عليه.", about_p2: "نعمل على تبسيط الحلول التقنية وتقديم خدمات دقيقة ومدروسة بعيدًا عن التعقيد أو الاستغلال. نساعد عملاءنا على فهم خياراتهم، واختيار ما يناسبهم فعلًا، والحصول على أفضل أداء من أجهزتهم.",
        srv_title: "خبراتنا.", srv_1_t: "الصيانة والتشخيص", srv_1_d: "خدمات صيانة دقيقة وموثوقة لأجهزة الكمبيوتر واللابتوب. نشخص الأعطال بصدق ونقدم حلولاً فعالة دون تكاليف غير ضرورية.", srv_2_t: "ترقية الأجهزة", srv_2_d: "أعد الحياة لأجهزتك مع ترقيات احترافية للعتاد وأنظمة التشغيل مصممة خصيصاً لتناسب سير عملك.", srv_3_t: "ملحقات مختارة", srv_3_d: "ملحقات وإكسسوارات مختارة بعناية ومختبرة بدقة لضمان الجودة العالية والقيمة العادلة لمالك.", srv_4_t: "استشارات تقنية", srv_4_d: "نصائح صادقة حول ما تحتاجه فعلياً. نبني علاقاتنا على الثقة والشفافية لنضمن قيامك بالشراء أو الترقية بذكاء.",
        store_title: "العتاد والملحقات.", store_desc: "معدات تقنية متميزة مختارة من قبل الخبراء. جودة مضمونة.", store_view_all: "عرض جميع المنتجات",
        vis_label: "الرؤية", vis_desc: "أن نكون مرجعًا تقنياً رائدًا، يساهم في رفع الوعي التقني وبناء مجتمع يعتمد على التكنولوجيا بشكل فعال وآمن.", mis_label: "الرسالة", mis_desc: "تقديم حلول واضحة ومبسطة تضع المستخدمين في المقام الأول، وتجمع بين الاحترافية، الشفافية والدعم الحقيقي.",
        road_title: "خارطة الطريق.", road_p1_t: "المرحلة الأولى", road_p1_d: "تأسيس خدمة تشخيص دقيقة، بناء سمعة قوية قائمة على الصدق، وتقديم تقنيات عالية الجودة بأسعار عادلة.", road_p2_t: "المرحلة الثانية", road_p2_d: "توسيع نطاق الاستشارات التقنية، استضافة فعاليات مجتمعية، وإدخال حلول برمجية مخصصة للعملاء.", road_p3_t: "المرحلة الثالثة", road_p3_d: "بناء علامة تجارية معروفة وموثوقة، التحول لمنصة تقنية شاملة، ودمج الذكاء الاصطناعي لخدمة المستخدمين.",
        contact_title: "لنتحدث.", contact_desc: "مستعد لتجربة تقنية أفضل؟ تواصل معنا لتحسين كفاءة أجهزتك وحياتك الرقمية.", footer_rights: "© ٢٠٢٦ دوت تك. جميع الحقوق محفوظة.", btn_add: "أضف",
        store_search: "ابحث عن المنتجات...", store_sort_def: "الترتيب الافتراضي", store_sort_low: "السعر: من الأقل للأعلى", store_sort_high: "السعر: من الأعلى للأقل", store_filters: "التصفية", store_reset: "إعادة ضبط", store_categories: "الفئات", store_brand: "الشركة المصنعة", store_price: "نطاق السعر", store_cat_all: "الكل", store_loading: "جار التحميل..."
    }
};

window.currentLang = localStorage.getItem('dottech_lang') || 'en';

window.applyLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) langBtn.textContent = lang === 'en' ? 'AR' : 'EN';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'SELECT') el.placeholder = translations[lang][key];
            else el.innerHTML = translations[lang][key];
        }
    });
    if (typeof window.updateSpherePosition === 'function') window.updateSpherePosition(lang === 'ar');
    if (typeof window.renderFilters === 'function') window.renderFilters();
};

window.toggleLanguage = () => {
    window.currentLang = window.currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('dottech_lang', window.currentLang);
    window.applyLanguage(window.currentLang);
};

window.toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        setTimeout(() => menu.classList.remove('translate-x-full', 'rtl:-translate-x-full'), 10);
    } else {
        menu.classList.add('translate-x-full', 'rtl:-translate-x-full');
        setTimeout(() => menu.classList.add('hidden'), 300);
    }
};

window.toggleUserDropdown = () => {
    const menu = document.getElementById('user-dropdown');
    if (menu) menu.classList.toggle('hidden');
};

/* --- Cart & Promo Logic --- */
window.setCart = (newCart) => {
    window.cart = newCart;
    window.updateCartBadge();
    window.renderCart();
};

window.toggleCart = () => {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!drawer || !backdrop) return;

    if (backdrop.classList.contains('hidden')) {
        backdrop.classList.remove('hidden');
        setTimeout(() => backdrop.style.opacity = '1', 10);
        drawer.classList.remove('translate-x-full', 'rtl:-translate-x-full');
    } else {
        backdrop.style.opacity = '0';
        setTimeout(() => backdrop.classList.add('hidden'), 300);
        drawer.classList.add('translate-x-full', 'rtl:-translate-x-full');
    }
};

window.addToCart = (id, name, priceUSD, img) => {
    const existing = window.cart.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else window.cart.push({ id, name, priceUSD: parseFloat(priceUSD), img, qty: 1 });

    window.updateCartBadge();
    window.renderCart();
    window.showToast("Added to cart", "success");
    if (window.dbAPI && window.dbAPI.syncCart) window.dbAPI.syncCart(window.cart);
};

window.updateCartQty = (id, change) => {
    const idx = window.cart.findIndex(i => i.id === id);
    if (idx > -1) {
        if (change === -99) window.cart.splice(idx, 1);
        else {
            window.cart[idx].qty += change;
            if (window.cart[idx].qty <= 0) window.cart.splice(idx, 1);
        }
        window.updateCartBadge();
        window.renderCart();
        if (window.dbAPI && window.dbAPI.syncCart) window.dbAPI.syncCart(window.cart);
    }
};

window.updateCartBadge = () => {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = window.cart.reduce((sum, i) => sum + i.qty, 0);
};

window.renderCart = () => {
    const container = document.getElementById('cart-items-container');
    const totalContainer = document.getElementById('cart-total-container');
    if (!container || !totalContainer) return;

    container.innerHTML = '';

    if (window.cart.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-500 mt-10">Your cart is empty.</div>`;
        totalContainer.innerHTML = `<span>Total</span><span class="currency-display font-bold text-gray-900 dark:text-white" data-usd="0">${window.formatPrice(0)}</span>`;
        return;
    }

    let subtotalUSD = 0;
    window.cart.forEach(item => {
        let pUSD = item.priceUSD || item.priceNum; // handle different naming conventions
        subtotalUSD += pUSD * item.qty;
        container.innerHTML += `
            <div class="flex gap-4 items-center p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                <img src="${item.img}" class="w-16 h-16 object-contain rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-1">
                <div class="flex-1">
                    <h4 class="font-display font-semibold text-sm line-clamp-1 text-gray-900 dark:text-white">${item.name}</h4>
                    <div class="text-brand-green font-bold text-sm mt-1">${window.formatPrice(pUSD)}</div>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1">
                        <button onclick="window.updateCartQty('${item.id}', -1)" class="text-gray-500 dark:text-gray-400 font-bold px-1 hover:text-brand-green">-</button>
                        <span class="text-xs font-semibold w-4 text-center text-gray-900 dark:text-white">${item.qty}</span>
                        <button onclick="window.updateCartQty('${item.id}', 1)" class="text-gray-500 dark:text-gray-400 font-bold px-1 hover:text-brand-green">+</button>
                    </div>
                    <button onclick="window.updateCartQty('${item.id}', -99)" class="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                </div>
            </div>`;
    });

    if (window.currentDiscount > 0) {
        const discountAmount = subtotalUSD * (window.currentDiscount / 100);
        const finalUSD = subtotalUSD - discountAmount;
        totalContainer.innerHTML = `
            <div class="flex flex-col w-full">
                <div class="flex justify-between items-center text-sm text-gray-500 line-through mb-1">
                    <span>Subtotal</span><span>${window.formatPrice(subtotalUSD)}</span>
                </div>
                <div class="flex justify-between items-center text-sm text-brand-green mb-2">
                    <span>Discount (${window.currentDiscount}%)</span><span>- ${window.formatPrice(discountAmount)}</span>
                </div>
                <div class="flex justify-between items-center font-display font-bold text-xl text-gray-900 dark:text-white">
                    <span>Final Total</span><span class="currency-display" data-usd="${finalUSD}">${window.formatPrice(finalUSD)}</span>
                </div>
            </div>`;
        window.finalCheckoutTotal = finalUSD;
    } else {
        totalContainer.innerHTML = `
            <span>Total</span><span class="currency-display font-bold text-gray-900 dark:text-white" data-usd="${subtotalUSD}">${window.formatPrice(subtotalUSD)}</span>`;
        window.finalCheckoutTotal = subtotalUSD;
    }
};

window.applyPromo = async () => {
    const inputEl = document.getElementById('promo-input');
    if (!inputEl) return;
    const code = inputEl.value.trim().toUpperCase();
    if (!code) return window.showToast("Please enter a promo code first.", "error");

    const btn = document.getElementById('apply-promo-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = "...";
    btn.disabled = true;

    try {
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
        const promoDoc = await getDoc(doc(window.db, 'artifacts', window.appId, 'promos', code));

        if (promoDoc.exists() && promoDoc.data().active !== false) {
            window.currentDiscount = promoDoc.data().discount;
            window.showToast(`Promo applied! ${window.currentDiscount}% off.`, "success");
            window.renderCart();
        } else {
            window.showToast("Invalid or expired promo code.", "error");
            window.currentDiscount = 0;
            window.renderCart();
        }
    } catch (error) {
        console.error("Promo Error:", error);
        window.showToast("Error verifying code.", "error");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

window.checkout = async () => {
    if (window.cart.length === 0) {
        if (typeof window.showToast === 'function') return window.showToast("Your cart is empty.", "error");
        else return alert("Your cart is empty.");
    }
    if (window.dbAPI && window.dbAPI.placeOrder) {
        const btn = document.querySelector('#cart-drawer button[onclick="checkout()"]');
        let orig = "Checkout Securely";
        if (btn) { orig = btn.innerHTML; btn.innerHTML = "Processing..."; btn.disabled = true; }

        const totalToPay = window.finalCheckoutTotal || window.cart.reduce((sum, i) => {
            let pUSD = i.priceUSD || i.priceNum;
            return sum + (pUSD * i.qty);
        }, 0);

        const success = await window.dbAPI.placeOrder(window.cart, totalToPay);
        if (success) {
            window.setCart([]);
            window.currentDiscount = 0;
            const promoInput = document.getElementById('promo-input');
            if (promoInput) promoInput.value = '';
            window.toggleCart();
            if (typeof window.showToast === 'function') window.showToast("Order placed securely!", "success");
            else alert("Order placed securely!");
        }
        if (btn) { btn.innerHTML = orig; btn.disabled = false; }
    } else {
        alert("Please sign in to checkout.");
        window.location.href = "auth.html";
    }
};

window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) { alert(message); return; }

    const toast = document.createElement('div');
    const isError = type === 'error';
    toast.className = `px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-sans toast-enter pointer-events-auto border ${isError ? 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 border-red-200 dark:border-red-800' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-700 dark:border-gray-200'}`;
    const icon = isError ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>` : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`;
    toast.innerHTML = `<svg class="w-5 h-5 ${isError ? 'text-red-500' : 'text-brand-green'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg> <span class="font-medium text-sm">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.replace('toast-enter', 'toast-exit'); setTimeout(() => toast.remove(), 300); }, 3000);
};

/* --- CSV Parser --- */
window.parseCSV = (str) => {
    const arr = []; let quote = false; let row = 0, col = 0;
    for (let c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c + 1];
        arr[row] = arr[row] || []; arr[row][col] = arr[row][col] || '';
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
};

// Initialize Theme & Language on load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('dottech_theme') === 'dark' || (!localStorage.getItem('dottech_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
    }
    const currBtn = document.getElementById('currency-toggle-btn');
    if (currBtn) currBtn.textContent = window.currentCurrency;

    window.applyLanguage(window.currentLang);
});

document.addEventListener('DOMContentLoaded', () => {
    // Default Cart State
    const DEFAULT_CART = {
        runner: {
            name: 'Ultra-Speed Runner X2',
            price: 129.00,
            quantity: 1
        },
        smartwatch: {
            name: 'Zenith Core Smartwatch',
            price: 299.00,
            quantity: 1
        }
    };

    const taxRate = 0.08; // 8%
    const giftWrapPrice = 5.00;

    // Default Products Catalog
    const DEFAULT_PRODUCTS = [
        {
            id: 'runner',
            name: 'Ultra-Speed Runner X2',
            price: 129.00,
            desc: 'Size: 42 | Color: Crimson',
            image: 'assets/ultra_speed_runner_x2.png',
            tag: 'Best Seller',
            rating: '★★★★★',
            ratingNum: 120,
            category: 'footwear'
        },
        {
            id: 'smartwatch',
            name: 'Zenith Core Smartwatch',
            price: 299.00,
            desc: 'Edition: Sport | Silver',
            image: 'assets/zenith_core_smartwatch.png',
            tag: '',
            rating: '★★★★★',
            ratingNum: 84,
            category: 'wearables'
        },
        {
            id: 'earbuds',
            name: 'AeroPulse Wireless Earbuds',
            price: 159.00,
            desc: 'Edition: White | ANC',
            image: 'assets/aeropulse_earbuds.png',
            tag: 'New',
            rating: '★★★★☆',
            ratingNum: 62,
            category: 'audio'
        }
    ];

    // Helper: Get Products from localStorage
    function getProducts() {
        const prodData = localStorage.getItem('click_basket_products');
        if (!prodData) {
            localStorage.setItem('click_basket_products', JSON.stringify(DEFAULT_PRODUCTS));
            return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
        }
        return JSON.parse(prodData);
    }

    // Helper: Save Products to localStorage
    function saveProducts(products) {
        localStorage.setItem('click_basket_products', JSON.stringify(products));
    }

    // Helper: Get Cart from localStorage
    function getCart() {
        const cartData = localStorage.getItem('click_basket_cart');
        if (!cartData) {
            // Initialize with default cart items on first visit
            localStorage.setItem('click_basket_cart', JSON.stringify(DEFAULT_CART));
            return JSON.parse(JSON.stringify(DEFAULT_CART));
        }
        return JSON.parse(cartData);
    }

    // Helper: Save Cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('click_basket_cart', JSON.stringify(cart));
    }

    // Helper: Get Gift Wrap state from localStorage
    function getGiftWrap() {
        return localStorage.getItem('click_basket_gift_wrap') === 'true';
    }

    // Helper: Save Gift Wrap state
    function saveGiftWrap(state) {
        localStorage.setItem('click_basket_gift_wrap', state ? 'true' : 'false');
    }

    // DOM Elements (Shared)
    const cartBadge = document.getElementById('cart-badge');
    const toast = document.getElementById('toast-message');
    const toastText = document.getElementById('toast-text-content');
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');

    // DOM Elements (Cart Page Specific)
    const itemsList = document.getElementById('items-list');
    const giftWrapBtn = document.getElementById('gift-wrap-btn');
    const giftCard = document.getElementById('gift-card');
    const subtotalEl = document.getElementById('summary-subtotal');
    const taxEl = document.getElementById('summary-tax');
    const totalEl = document.getElementById('summary-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalTotalAmt = document.getElementById('modal-total-amt');

    // DOM Elements (Homepage Specific)
    const subscribeForm = document.getElementById('subscribe-form');
    const subEmail = document.getElementById('sub-email');

    // Helper: Show Toast
    function showToast(message) {
        if (!toast || !toastText) return;
        toastText.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Helper: Update Header Cart Badge
    function updateCartBadge() {
        if (!cartBadge) return;
        const cart = getCart();
        let totalItems = 0;
        Object.keys(cart).forEach(key => {
            totalItems += cart[key].quantity;
        });
        cartBadge.textContent = totalItems;
    }

    // Helper: Update Cart Page Totals
    function updateCartTotals() {
        if (!subtotalEl || !taxEl || !totalEl) return;

        const cart = getCart();
        const giftWrap = getGiftWrap();
        let subtotal = 0;
        let totalItems = 0;

        Object.keys(cart).forEach(key => {
            const item = cart[key];
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;
        });

        // Add gift wrap if enabled
        if (giftWrap && Object.keys(cart).length > 0) {
            subtotal += giftWrapPrice;
        }

        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Update DOM
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
        if (cartBadge) cartBadge.textContent = totalItems;
        if (modalTotalAmt) modalTotalAmt.textContent = `$${total.toFixed(2)}`;

        // If no items
        if (Object.keys(cart).length === 0) {
            subtotalEl.textContent = '$0.00';
            taxEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            if (cartBadge) cartBadge.textContent = '0';
        }
    }

    // Helpers: Dynamic SVG visual card utilities
    function getProductGradientClass(imageName) {
        if (imageName === 'svg-headphones') return 'audio-grad';
        if (imageName === 'svg-keyboard') return 'electronics-grad';
        if (imageName === 'svg-backpack') return 'lifestyle-grad';
        return 'audio-grad';
    }

    function getProductSvgMarkup(imageName) {
        if (imageName === 'svg-headphones') {
            return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`;
        }
        if (imageName === 'svg-keyboard') {
            return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>`;
        }
        if (imageName === 'svg-backpack') {
            return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path><path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"></path><path d="M16 8h2v11h-2zM12 2v6H2V2z"></path></svg>`;
        }
        return '';
    }

    // Render Cart Page Items list
    function renderCartItems() {
        if (!itemsList) return;

        const cart = getCart();
        const products = getProducts();
        itemsList.innerHTML = '';

        if (Object.keys(cart).length === 0) {
            checkEmptyState(cart);
            return;
        }

        Object.keys(cart).forEach(key => {
            const item = cart[key];
            const product = products.find(p => p.id === key);

            let imageContent = '';
            let specText = product ? product.desc : 'Size: Standard | Color: Custom';

            if (product && product.image.startsWith('svg-')) {
                imageContent = `
                    <div class="item-svg-box ${getProductGradientClass(product.image)}">
                        ${getProductSvgMarkup(product.image)}
                    </div>
                `;
            } else {
                let imgUrl = product ? product.image : 'assets/ultra_speed_runner_x2.png';
                imageContent = `<img src="${imgUrl}" alt="${item.name}" class="item-img">`;
            }

            const card = document.createElement('div');
            card.className = 'cart-item-card';
            card.setAttribute('data-id', key);
            card.innerHTML = `
                <div class="item-image-wrapper">
                    ${imageContent}
                </div>
                <div class="item-content">
                    <div class="item-header-row">
                        <h2 class="item-name">${item.name}</h2>
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="item-specs-row">
                        <p class="item-specs">${specText}</p>
                    </div>
                    <div class="item-actions-row">
                        <div class="quantity-selector">
                            <button class="qty-btn minus-btn" aria-label="Decrease quantity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn plus-btn" aria-label="Increase quantity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                        </div>
                        <button class="remove-btn" aria-label="Remove item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trash-icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Remove
                        </button>
                    </div>
                </div>
            `;
            itemsList.appendChild(card);
        });

        // Initialize Gift Wrap button visuals
        const giftWrap = getGiftWrap();
        if (giftCard && giftWrapBtn) {
            giftCard.style.display = 'flex';
            if (giftWrap) {
                giftWrapBtn.textContent = 'Remove Wrap';
                giftWrapBtn.classList.add('active');
                giftCard.classList.add('wrap-added');
            } else {
                giftWrapBtn.textContent = 'Add Wrap';
                giftWrapBtn.classList.remove('active');
                giftCard.classList.remove('wrap-added');
            }
        }
    }

    // Render Empty State
    function checkEmptyState(cart) {
        if (Object.keys(cart).length === 0 && itemsList) {
            if (giftCard) giftCard.style.display = 'none';

            itemsList.innerHTML = `
                <div class="empty-cart-state">
                    <div class="empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                    </div>
                    <h2 class="empty-title">Your shopping basket is empty</h2>
                    <p class="empty-desc">Looks like you haven't added anything to your cart yet. Browse our collections to find amazing deals!</p>
                    <button class="restore-btn" id="restore-cart-btn">Restore Sample Cart</button>
                </div>
            `;

            document.getElementById('restore-cart-btn').addEventListener('click', () => {
                localStorage.setItem('click_basket_cart', JSON.stringify(DEFAULT_CART));
                saveGiftWrap(false);
                renderCartItems();
                updateCartTotals();
                showToast('Cart items restored successfully!');
            });
        }
    }

    // Homepage "Add to Basket" Logic
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (!addBtn) return;

        const productId = addBtn.getAttribute('data-id');
        const products = getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) return;

        const cart = getCart();

        if (cart[productId]) {
            cart[productId].quantity += 1;
        } else {
            cart[productId] = {
                name: product.name,
                price: product.price,
                quantity: 1
            };
        }

        saveCart(cart);
        updateCartBadge();
        showToast(`${product.name} added to basket!`);
    });

    // Cart Page Adjustments
    if (itemsList) {
        itemsList.addEventListener('click', (e) => {
            const card = e.target.closest('.cart-item-card');
            if (!card) return;

            const itemId = card.getAttribute('data-id');
            const cart = getCart();
            const item = cart[itemId];

            // Plus Click
            if (e.target.closest('.plus-btn')) {
                item.quantity += 1;
                card.querySelector('.qty-val').textContent = item.quantity;
                saveCart(cart);
                updateCartTotals();
                showToast(`${item.name} quantity increased.`);
            }

            // Minus Click
            if (e.target.closest('.minus-btn')) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    card.querySelector('.qty-val').textContent = item.quantity;
                    saveCart(cart);
                    updateCartTotals();
                    showToast(`${item.name} quantity decreased.`);
                } else {
                    showToast(`Minimum quantity is 1. Click Remove to delete the item.`);
                }
            }

            // Remove Click
            if (e.target.closest('.remove-btn')) {
                card.classList.add('removing');
                card.addEventListener('transitionend', () => {
                    delete cart[itemId];
                    saveCart(cart);
                    card.remove();
                    updateCartTotals();
                    checkEmptyState(cart);
                    showToast(`${item.name} removed from basket.`);
                }, { once: true });
            }
        });
    }

    // Gift Wrap Action (Cart Page)
    if (giftWrapBtn) {
        giftWrapBtn.addEventListener('click', () => {
            const giftWrap = !getGiftWrap();
            saveGiftWrap(giftWrap);

            if (giftWrap) {
                giftWrapBtn.textContent = 'Remove Wrap';
                giftWrapBtn.classList.add('active');
                giftCard.classList.add('wrap-added');
                showToast('Gift wrap option added to order.');
            } else {
                giftWrapBtn.textContent = 'Add Wrap';
                giftWrapBtn.classList.remove('active');
                giftCard.classList.remove('wrap-added');
                showToast('Gift wrap option removed.');
            }
            updateCartTotals();
        });
    }

    // Payment Elements & Handlers (Cart Page)
    const paymentCard = document.getElementById('payment-card');
    const tabButtons = document.querySelectorAll('.payment-tab-btn');
    const tabContents = document.querySelectorAll('.payment-tab-content');
    const cardHolderName = document.getElementById('card-holder-name');
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');
    const cardNameDisplay = document.getElementById('card-name-display');
    const cardNumDisplay = document.getElementById('card-num-display');
    const cardDateDisplay = document.getElementById('card-date-display');
    const cardBrandLogo = document.getElementById('card-brand-logo');
    const inputBrandIcon = document.getElementById('input-brand-icon');

    // OTP Elements
    const otpModal = document.getElementById('otp-modal');
    const otpFields = document.querySelectorAll('.otp-field');
    const otpCancelBtn = document.getElementById('otp-cancel-btn');
    const otpSubmitBtn = document.getElementById('otp-submit-btn');
    const otpShortcutBtn = document.getElementById('otp-shortcut-btn');
    const otpTimerCount = document.getElementById('otp-timer-count');

    // Receipt Elements
    const receiptContainer = document.getElementById('receipt-container');
    const receiptId = document.getElementById('receipt-id');
    const receiptDate = document.getElementById('receipt-date');
    const receiptPaymentType = document.getElementById('receipt-payment-type');
    const receiptItemsList = document.getElementById('receipt-items-list');
    const receiptSubtotal = document.getElementById('receipt-subtotal');
    const receiptShipping = document.getElementById('receipt-shipping');
    const receiptTax = document.getElementById('receipt-tax');
    const receiptGrandTotalVal = document.getElementById('receipt-grand-total-val');

    let activePaymentTab = 'card';
    let otpTimerInterval;

    // Tab Switching
    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                activePaymentTab = targetTab;

                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                tabContents.forEach(content => {
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Real-time Credit Card Live Sync & Formatters
    if (cardHolderName) {
        cardHolderName.addEventListener('input', (e) => {
            e.target.classList.remove('input-error');
            const val = e.target.value.toUpperCase();
            if (cardNameDisplay) {
                cardNameDisplay.textContent = val.trim() || 'YOUR NAME';
            }
        });
    }

    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            e.target.classList.remove('input-error');
            let val = e.target.value.replace(/[^0-9]/g, '');
            
            // Format number with spaces
            let formatted = '';
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += val[i];
            }
            e.target.value = formatted;

            if (cardNumDisplay) {
                cardNumDisplay.textContent = formatted || '•••• •••• •••• ••••';
            }

            // Detect card brand
            let brand = 'Visa';
            let brandText = 'Visa';
            if (val.startsWith('4')) {
                brand = 'Visa';
                brandText = 'Visa';
            } else if (val.startsWith('5') || (val.startsWith('2') && val.length >= 2 && parseInt(val.substring(0,2)) >= 22)) {
                brand = 'Mastercard';
                brandText = 'Mastercard';
            } else if (val.startsWith('34') || val.startsWith('37')) {
                brand = 'AMEX';
                brandText = 'Amex';
            } else if (val.startsWith('6')) {
                brand = 'Discover';
                brandText = 'Discover';
            } else if (val.length > 0) {
                brand = 'Card';
                brandText = 'Card';
            }

            if (cardBrandLogo) cardBrandLogo.textContent = brand;
            if (inputBrandIcon) {
                if (val.length > 0 && brand !== 'Card') {
                    inputBrandIcon.textContent = brandText;
                    inputBrandIcon.style.color = 'var(--primary)';
                } else {
                    inputBrandIcon.textContent = '';
                }
            }
        });
    }

    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            e.target.classList.remove('input-error');
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
            if (cardDateDisplay) {
                cardDateDisplay.textContent = val || 'MM/YY';
            }
        });
    }

    if (cardCvv) {
        cardCvv.addEventListener('input', (e) => {
            e.target.classList.remove('input-error');
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
        });
    }

    // Input Focus / Remove Errors
    const allCcInputs = [cardHolderName, cardNumber, cardExpiry, cardCvv];
    allCcInputs.forEach(input => {
        if (input) {
            input.addEventListener('focus', () => {
                input.classList.remove('input-error');
            });
        }
    });

    // Reset Form Elements
    function resetPaymentForm() {
        if (cardHolderName) cardHolderName.value = '';
        if (cardNumber) cardNumber.value = '';
        if (cardExpiry) cardExpiry.value = '';
        if (cardCvv) cardCvv.value = '';
        if (cardNameDisplay) cardNameDisplay.textContent = 'YOUR NAME';
        if (cardNumDisplay) cardNumDisplay.textContent = '•••• •••• •••• ••••';
        if (cardDateDisplay) cardDateDisplay.textContent = 'MM/YY';
        if (cardBrandLogo) cardBrandLogo.textContent = 'Visa';
        if (inputBrandIcon) inputBrandIcon.textContent = '';
        
        allCcInputs.forEach(input => {
            if (input) input.classList.remove('input-error');
        });

        // Reset OTP fields
        otpFields.forEach(f => { if (f) f.value = ''; });
        if (otpSubmitBtn) otpSubmitBtn.disabled = true;
    }

    // Luhn Algorithm Card Validation Check
    function checkLuhn(cardNumberVal) {
        let value = cardNumberVal.replace(/\s/g, '');
        if (!/^\d+$/.test(value)) return false;
        let sum = 0;
        let shouldDouble = false;
        for (let i = value.length - 1; i >= 0; i--) {
            let digit = parseInt(value.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    }

    // Compile dynamic ticket receipt values
    function compileReceipt(paymentMethod, payerEmail = '') {
        const cart = getCart();
        const giftWrap = getGiftWrap();
        let subtotal = 0;

        if (!receiptItemsList) return;
        receiptItemsList.innerHTML = '';

        Object.keys(cart).forEach(key => {
            const item = cart[key];
            subtotal += item.price * item.quantity;

            const row = document.createElement('div');
            row.className = 'receipt-item-row';
            row.innerHTML = `
                <span class="receipt-item-name">${item.name} (x${item.quantity})</span>
                <span class="receipt-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            receiptItemsList.appendChild(row);
        });

        if (giftWrap && Object.keys(cart).length > 0) {
            subtotal += giftWrapPrice;
            const row = document.createElement('div');
            row.className = 'receipt-item-row';
            row.innerHTML = `
                <span class="receipt-item-name">Premium Gift Wrapping</span>
                <span class="receipt-item-price">$${giftWrapPrice.toFixed(2)}</span>
            `;
            receiptItemsList.appendChild(row);
        }

        const tax = subtotal * taxRate;
        const grandTotal = subtotal + tax;

        if (receiptSubtotal) receiptSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (receiptTax) receiptTax.textContent = `$${tax.toFixed(2)}`;
        if (receiptGrandTotalVal) receiptGrandTotalVal.textContent = `$${grandTotal.toFixed(2)}`;
        
        if (receiptId) {
            receiptId.textContent = 'CB-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
        }
        
        if (receiptDate) {
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            receiptDate.textContent = new Date().toLocaleDateString('en-US', dateOptions);
        }

        if (receiptPaymentType) {
            if (paymentMethod === 'card') {
                const cleanCard = cardNumber.value.replace(/\s/g, '');
                const last4 = cleanCard.substring(cleanCard.length - 4);
                const brand = cardBrandLogo ? cardBrandLogo.textContent : 'Visa';
                receiptPaymentType.textContent = `${brand} (Ending in ${last4})`;
            } else if (paymentMethod === 'paypal') {
                receiptPaymentType.textContent = `PayPal (${payerEmail || 'sandbox-buyer@paypal.com'})`;
            } else {
                receiptPaymentType.textContent = `Google Pay (Stored Card)`;
            }
        }
    }

    // Validate Credit Card Form Inputs
    function validateCardForm() {
        if (activePaymentTab !== 'card') return true;

        if (!cardHolderName || !cardHolderName.value.trim() || cardHolderName.value.trim().length < 3) {
            if (cardHolderName) {
                cardHolderName.classList.add('input-error');
                cardHolderName.focus();
            }
            showToast('Please enter a valid cardholder name (minimum 3 characters).');
            return false;
        }

        const cleanNum = cardNumber ? cardNumber.value.replace(/\s/g, '') : '';
        if (!cleanNum || cleanNum.length < 15 || cleanNum.length > 16) {
            if (cardNumber) {
                cardNumber.classList.add('input-error');
                cardNumber.focus();
            }
            showToast('Please enter a valid 15 or 16-digit card number.');
            return false;
        }

        // Luhn Algorithm check
        if (!checkLuhn(cardNumber.value)) {
            if (cardNumber) {
                cardNumber.classList.add('input-error');
                cardNumber.focus();
            }
            showToast('Invalid card number (Luhn checksum failed). Please check the digits.');
            return false;
        }

        if (!cardExpiry) return false;
        const expiryParts = cardExpiry.value.split('/');
        if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
            cardExpiry.classList.add('input-error');
            cardExpiry.focus();
            showToast('Please enter a valid expiry date in MM/YY format.');
            return false;
        }
        
        const month = parseInt(expiryParts[0], 10);
        const year = parseInt('20' + expiryParts[1], 10);
        
        if (isNaN(month) || month < 1 || month > 12) {
            cardExpiry.classList.add('input-error');
            cardExpiry.focus();
            showToast('Expiry month must be between 01 and 12.');
            return false;
        }
        
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            cardExpiry.classList.add('input-error');
            cardExpiry.focus();
            showToast('Card has expired or the expiry date is invalid.');
            return false;
        }

        if (!cardCvv || cardCvv.value.length < 3) {
            if (cardCvv) {
                cardCvv.classList.add('input-error');
                cardCvv.focus();
            }
            showToast('Please enter a valid CVV security code (3 or 4 digits).');
            return false;
        }

        return true;
    }

    // Checkout Modal functions (Cart Page)
    function showModal() {
        if (checkoutModal) checkoutModal.classList.add('show');
    }

    function hideModal() {
        if (checkoutModal) checkoutModal.classList.remove('show');
    }

    // OTP 3D Secure Verification Logic
    function startOtpTimer() {
        let timeLeft = 30;
        if (otpTimerCount) otpTimerCount.textContent = timeLeft;
        clearInterval(otpTimerInterval);
        otpTimerInterval = setInterval(() => {
            timeLeft--;
            if (otpTimerCount) otpTimerCount.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(otpTimerInterval);
                const timerRow = document.querySelector('.otp-timer-row');
                if (timerRow) timerRow.textContent = 'Verification code expired. Please cancel and retry.';
            }
        }, 1000);
    }

    if (otpFields.length > 0) {
        otpFields.forEach((field, index) => {
            field.addEventListener('input', (e) => {
                // Allow only numbers
                field.value = field.value.replace(/[^0-9]/g, '');
                
                if (field.value && index < otpFields.length - 1) {
                    otpFields[index + 1].focus();
                }
                
                let allFilled = true;
                otpFields.forEach(f => {
                    if (!f.value) allFilled = false;
                });
                if (otpSubmitBtn) otpSubmitBtn.disabled = !allFilled;
            });

            field.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !field.value && index > 0) {
                    otpFields[index - 1].focus();
                }
            });
        });
    }

    if (otpShortcutBtn) {
        otpShortcutBtn.addEventListener('click', () => {
            const mockCode = '1234';
            otpFields.forEach((field, index) => {
                field.value = mockCode[index];
            });
            if (otpSubmitBtn) otpSubmitBtn.disabled = false;
        });
    }

    if (otpCancelBtn) {
        otpCancelBtn.addEventListener('click', () => {
            clearInterval(otpTimerInterval);
            if (otpModal) otpModal.classList.remove('show');
            showToast('Payment verification cancelled.');
        });
    }

    if (otpSubmitBtn) {
        otpSubmitBtn.addEventListener('click', () => {
            // Verify code (simulated check)
            let enteredCode = '';
            otpFields.forEach(f => enteredCode += f.value);

            if (enteredCode !== '1234') {
                showToast('Incorrect verification code. Please enter 1234 to authorize.');
                otpFields.forEach((f, idx) => {
                    f.value = '';
                    if (idx === 0) f.focus();
                });
                otpSubmitBtn.disabled = true;
                return;
            }

            clearInterval(otpTimerInterval);
            if (otpSubmitBtn) {
                otpSubmitBtn.disabled = true;
                otpSubmitBtn.textContent = 'Processing...';
            }

            setTimeout(() => {
                if (otpModal) otpModal.classList.remove('show');
                if (otpSubmitBtn) {
                    otpSubmitBtn.disabled = false;
                    otpSubmitBtn.textContent = 'Verify Payment';
                }

                // Compile Receipt
                compileReceipt('card');

                // Clear Cart
                localStorage.setItem('click_basket_cart', JSON.stringify({}));
                saveGiftWrap(false);
                resetPaymentForm();
                renderCartItems();
                updateCartTotals();

                // Open Checkout Success Modal
                showModal();
                showToast('Credit card payment authorized successfully!');
            }, 1200);
        });
    }

    // Handle checkout button flow with validation and processing simulation
    function handleCheckout() {
        const cart = getCart();
        if (Object.keys(cart).length === 0) {
            showToast('Your basket is empty! Add items before checking out.');
            return;
        }

        if (activePaymentTab === 'card') {
            if (!validateCardForm()) return;
        }

        // Show loading spinner state on checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('btn-loading');
            const btnText = checkoutBtn.querySelector('.btn-text');
            const btnSpinner = checkoutBtn.querySelector('.btn-spinner');
            if (btnSpinner) btnSpinner.style.display = 'block';
            if (btnText) btnText.style.opacity = '0';
        }

        setTimeout(() => {
            // Restore button state
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.classList.remove('btn-loading');
                const btnText = checkoutBtn.querySelector('.btn-text');
                const btnSpinner = checkoutBtn.querySelector('.btn-spinner');
                if (btnSpinner) btnSpinner.style.display = 'none';
                if (btnText) btnText.style.opacity = '1';
            }

            // Open OTP Verification Modal instead of showing checkout success modal directly
            if (otpModal) {
                otpModal.classList.add('show');
                startOtpTimer();
                // Focus first input
                setTimeout(() => {
                    if (otpFields[0]) otpFields[0].focus();
                }, 100);
            }
        }, 1500);
    }

    // Google Pay Mock Checkout Handler
    const gpayBtn = document.querySelector('.gpay-checkout-mock-btn');
    if (gpayBtn) {
        gpayBtn.addEventListener('click', () => {
            const cart = getCart();
            if (Object.keys(cart).length === 0) {
                showToast('Your basket is empty! Add items before checking out.');
                return;
            }

            gpayBtn.disabled = true;
            const originalText = gpayBtn.innerHTML;
            gpayBtn.innerHTML = '<span class="btn-spinner" style="position:static; display:inline-block; margin-right:8px; width:14px; height:14px; border-width:2px;"></span> Connecting Google Pay...';

            setTimeout(() => {
                gpayBtn.disabled = false;
                gpayBtn.innerHTML = originalText;

                // Compile Receipt
                compileReceipt('gpay');

                // Clear Cart
                localStorage.setItem('click_basket_cart', JSON.stringify({}));
                saveGiftWrap(false);
                resetPaymentForm();
                renderCartItems();
                updateCartTotals();

                // Open Checkout Success Modal
                showModal();
                showToast('Google Pay payment authorized successfully!');
            }, 1800);
        });
    }

    // PayPal JS SDK Buttons Implementation
    function initializePayPalButtons() {
        if (typeof paypal === 'undefined') {
            setTimeout(initializePayPalButtons, 100);
            return;
        }

        const container = document.getElementById('paypal-button-container');
        if (container) container.innerHTML = '';

        paypal.Buttons({
            style: {
                layout: 'vertical',
                color:  'gold',
                shape:  'rect',
                label:  'paypal',
                height: 44
            },
            createOrder: function(data, actions) {
                const total = parseFloat(totalEl.textContent.replace('$', ''));
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Compile receipt with PayPal payer email details
                    compileReceipt('paypal', details.payer.email_address);

                    // Clear Cart
                    localStorage.setItem('click_basket_cart', JSON.stringify({}));
                    saveGiftWrap(false);
                    resetPaymentForm();
                    renderCartItems();
                    updateCartTotals();

                    // Open Checkout Success Modal
                    showModal();
                    showToast('Payment captured successfully via PayPal!');
                });
            },
            onError: function(err) {
                showToast('PayPal load or checkout error occurred.');
            }
        }).render('#paypal-button-container');
    }

    // Initialize PayPal Buttons on Load
    if (document.getElementById('paypal-button-container')) {
        initializePayPalButtons();
    }

    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
    if (modalClose) modalClose.addEventListener('click', hideModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', () => {
        hideModal();
        showToast('Thank you for shopping at Click Basket!');
    });

    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) hideModal();
        });
    }

    // Search Box Autocomplete Suggestion Logic
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            if (searchDropdown) searchDropdown.classList.add('show');
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (searchDropdown) searchDropdown.classList.remove('show');
            }, 200);
        });

        searchInput.addEventListener('input', (e) => {
            if (!searchDropdown) return;
            const query = e.target.value.toLowerCase().trim();
            if (query.length > 0) {
                searchDropdown.innerHTML = `
                    <div class="dropdown-item">Search for "<strong>${query}</strong>"</div>
                    <div class="dropdown-item">Found in store: "<strong>${query} accessories</strong>"</div>
                `;
            } else {
                searchDropdown.innerHTML = `
                    <div class="dropdown-item">Trending: running shoes</div>
                    <div class="dropdown-item">Trending: smart watch</div>
                    <div class="dropdown-item">Trending: wireless earbuds</div>
                `;
            }
        });

        if (searchDropdown) {
            searchDropdown.addEventListener('click', (e) => {
                const item = e.target.closest('.dropdown-item');
                if (item) {
                    const text = item.textContent.replace('Trending:', '').trim();
                    searchInput.value = text;
                    showToast(`Searching store for "${text}"...`);
                }
            });
        }
    }

    // Newsletter Subscribe Form (Homepage)
    if (subscribeForm && subEmail) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = subEmail.value;
            showToast(`Awesome! Subscription success for ${email}. Check inbox for 15% discount.`);
            subEmail.value = '';
        });
    }

    // Support chat click
    const chatLink = document.getElementById('footer-chat-link');
    if (chatLink) {
        chatLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Opening live chat customer support assistance...');
        });
    }

    // Dynamic Grid Renderer for Homepage
    function renderStorefrontProducts() {
        const gridContainer = document.getElementById('store-products-grid');
        if (!gridContainer) return;

        const products = getProducts();
        gridContainer.innerHTML = '';

        products.forEach(p => {
            let tagHtml = p.tag ? `<span class="prod-tag">${p.tag}</span>` : '';
            let imageHtml = '';

            if (p.image.startsWith('svg-')) {
                imageHtml = `
                    <div class="prod-svg-wrapper ${getProductGradientClass(p.image)}">
                        <div class="prod-svg-box">
                            ${getProductSvgMarkup(p.image)}
                        </div>
                        ${tagHtml}
                    </div>
                `;
            } else {
                imageHtml = `
                    <div class="prod-img-wrapper">
                        <img src="${p.image}" alt="${p.name}" class="prod-img">
                        ${tagHtml}
                    </div>
                `;
            }

            const card = document.createElement('div');
            card.className = 'product-item-card';
            card.setAttribute('data-id', p.id);
            card.innerHTML = `
                ${imageHtml}
                <div class="prod-details">
                    <div class="prod-rating">
                        <span class="stars">${p.rating || '★★★★★'}</span>
                        <span class="rating-num">(${p.ratingNum || 50})</span>
                    </div>
                    <h3 class="prod-name">${p.name}</h3>
                    <p class="prod-desc">${p.desc}</p>
                    <div class="prod-price-row">
                        <span class="prod-price">$${p.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${p.id}">Add to Basket</button>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    // Store Control Drawer Functionality
    const storeManagerFabBtn = document.getElementById('store-manager-fab-btn');
    const storeManagerCloseBtn = document.getElementById('store-manager-close-btn');
    const storeManagerDrawer = document.getElementById('store-manager-drawer');
    const storeManagerOverlay = document.getElementById('store-manager-drawer-overlay');

    function openDrawer() {
        if (storeManagerDrawer) storeManagerDrawer.classList.add('open');
        if (storeManagerOverlay) storeManagerOverlay.classList.add('show');
        renderInventoryList();
    }

    // Handle closing image preset triggers
    function closeDrawer() {
        if (storeManagerDrawer) storeManagerDrawer.classList.remove('open');
        if (storeManagerOverlay) storeManagerOverlay.classList.remove('show');
    }

    if (storeManagerFabBtn) storeManagerFabBtn.addEventListener('click', openDrawer);
    if (storeManagerCloseBtn) storeManagerCloseBtn.addEventListener('click', closeDrawer);
    if (storeManagerOverlay) storeManagerOverlay.addEventListener('click', closeDrawer);

    // Segmented tab toggling inside Drawer
    const drawerTabs = document.querySelectorAll('.drawer-tab-btn');
    const drawerContents = document.querySelectorAll('.drawer-tab-content');

    if (drawerTabs.length > 0) {
        drawerTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-drawer-tab');
                drawerTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                drawerContents.forEach(content => {
                    if (content.id === `drawer-tab-${target}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Form Image Preset Grid Selectors
    const presetOptions = document.querySelectorAll('.preset-option');
    const customImageInput = document.getElementById('new-prod-image-url');
    let selectedPreset = 'runner';

    if (presetOptions.length > 0) {
        presetOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                presetOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                
                const preset = opt.getAttribute('data-preset');
                selectedPreset = preset;

                if (customImageInput) customImageInput.value = '';
            });
        });
    }

    // Add Product Form Submit Handler
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('new-prod-name').value.trim();
            const desc = document.getElementById('new-prod-desc').value.trim();
            const price = parseFloat(document.getElementById('new-prod-price').value);
            const category = document.getElementById('new-prod-category').value;
            const tag = document.getElementById('new-prod-tag').value.trim();
            
            let image = '';
            const customUrl = customImageInput ? customImageInput.value.trim() : '';
            if (customUrl) {
                image = customUrl;
            } else {
                if (selectedPreset === 'runner') image = 'assets/ultra_speed_runner_x2.png';
                else if (selectedPreset === 'smartwatch') image = 'assets/zenith_core_smartwatch.png';
                else if (selectedPreset === 'earbuds') image = 'assets/aeropulse_earbuds.png';
                else image = selectedPreset; // custom SVG presets
            }

            if (!name || name.length < 3) {
                showToast('Product title must be at least 3 characters.');
                return;
            }

            if (isNaN(price) || price <= 0) {
                showToast('Price must be greater than $0.');
                return;
            }

            const newProduct = {
                id: 'prod_' + Date.now(),
                name,
                price,
                desc,
                image,
                tag,
                rating: '★★★★★',
                ratingNum: Math.floor(10 + Math.random() * 90),
                category
            };

            const products = getProducts();
            products.push(newProduct);
            saveProducts(products);

            addProductForm.reset();
            presetOptions.forEach(o => o.classList.remove('active'));
            if (presetOptions[0]) {
                presetOptions[0].classList.add('active');
                selectedPreset = 'runner';
            }

            renderStorefrontProducts();
            renderInventoryList();
            closeDrawer();
            showToast(`Product "${name}" added to store!`);
        });
    }

    // Inventory Renderer & Delete Actions
    const inventoryListContainer = document.getElementById('inventory-list-container');
    const restoreDefaultsBtn = document.getElementById('restore-defaults-btn');

    function renderInventoryList() {
        if (!inventoryListContainer) return;

        const products = getProducts();
        inventoryListContainer.innerHTML = '';

        products.forEach(p => {
            let thumbContent = '';
            if (p.image.startsWith('svg-')) {
                thumbContent = `
                    <div class="inventory-thumb-svg ${getProductGradientClass(p.image)}">
                        ${getProductSvgMarkup(p.image)}
                    </div>
                `;
            } else {
                thumbContent = `<img src="${p.image}" alt="${p.name}">`;
            }

            const isDefault = ['runner', 'smartwatch', 'earbuds'].includes(p.id);

            const row = document.createElement('div');
            row.className = 'inventory-item-row';
            row.innerHTML = `
                <div class="inventory-thumb">
                    ${thumbContent}
                </div>
                <div class="inventory-info">
                    <div class="inventory-name">${p.name}</div>
                    <div class="inventory-price">$${p.price.toFixed(2)}</div>
                </div>
                <button class="inventory-delete-btn ${isDefault ? 'disabled' : ''}" 
                        data-id="${p.id}" 
                        title="${isDefault ? 'Cannot delete default products' : 'Delete Product'}"
                        ${isDefault ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            inventoryListContainer.appendChild(row);
        });

        const deleteBtns = inventoryListContainer.querySelectorAll('.inventory-delete-btn:not(.disabled)');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteProduct(id);
            });
        });
    }

    function deleteProduct(id) {
        let products = getProducts();
        const productToDelete = products.find(p => p.id === id);
        
        if (!productToDelete) return;

        products = products.filter(p => p.id !== id);
        saveProducts(products);

        const cart = getCart();
        if (cart[id]) {
            delete cart[id];
            saveCart(cart);
            updateCartBadge();
        }

        renderStorefrontProducts();
        renderInventoryList();
        showToast(`Product "${productToDelete.name}" deleted.`);
    }

    if (restoreDefaultsBtn) {
        restoreDefaultsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all inventory? Custom products will be deleted.')) {
                localStorage.removeItem('click_basket_products');
                
                const cart = getCart();
                let cartUpdated = false;
                Object.keys(cart).forEach(key => {
                    if (!['runner', 'smartwatch', 'earbuds'].includes(key)) {
                        delete cart[key];
                        cartUpdated = true;
                     }
                });
                if (cartUpdated) {
                    saveCart(cart);
                    updateCartBadge();
                }

                renderStorefrontProducts();
                renderInventoryList();
                closeDrawer();
                showToast('Store inventory reset to default items.');
            }
        });
    }

    // Initial Setup
    updateCartBadge();
    renderStorefrontProducts();
    renderCartItems();
    updateCartTotals();
});

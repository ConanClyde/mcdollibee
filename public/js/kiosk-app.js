// McDollibee Kiosk System JavaScript - Complete System

class KioskManager {
    constructor() {
        this.messageHistory = new Set(); // Track messages to prevent duplicates
        this.historyCleanupInterval = 10000; // Clear history every 10 seconds
        this.cart = this.getCart();
        this.init();
    }

    init() {
        this.bindEvents();
        this.initNotifications();
        this.initQuantityControls();
        this.initCartFunctionality();
        this.initFormHandling();
        this.handleFlashMessages();

        // Clean up message history periodically
        setInterval(() => {
            this.messageHistory.clear();
        }, this.historyCleanupInterval);
    }

    bindEvents() {
        // Add smooth scrolling to anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Add click effects to buttons
        document.querySelectorAll('.nav-btn, .category-btn, .add-btn, .confirm-btn, .new-order-btn, .view-cart-btn').forEach(btn => {
            btn.addEventListener('click', this.handleButtonClick);
        });

        // Handle form submissions with loading states
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });

        // Add touch effects for mobile
        this.addTouchEffects();
    }

    handleButtonClick(e) {
        const btn = e.target.closest('button, a');
        if (!btn) return;

        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }

    handleFormSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (submitBtn && !submitBtn.disabled) {
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;

            // Re-enable button after 5 seconds if form hasn't been submitted
            setTimeout(() => {
                if (submitBtn && document.body.contains(submitBtn)) {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }
            }, 5000);
        }
    }

    addTouchEffects() {
        // Add touch effects for better mobile interaction
        const touchElements = document.querySelectorAll('.menu-card, .cart-item, .category-btn');

        touchElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            el.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    }

    initNotifications() {
        // Initialize notification system
        window.showNotification = this.showNotification.bind(this);
        window.hideNotification = this.hideNotification.bind(this);
        window.clearNotificationHistory = this.clearMessageHistory.bind(this);
    }

    // Generate unique message key for duplicate detection
    generateMessageKey(type, title, message) {
        return `${type}:${title}:${message}`.toLowerCase().trim();
    }

    // Check if message is duplicate
    isDuplicateMessage(type, title, message) {
        const key = this.generateMessageKey(type, title, message);
        return this.messageHistory.has(key);
    }

    // Add message to history
    addToMessageHistory(type, title, message) {
        const key = this.generateMessageKey(type, title, message);
        this.messageHistory.add(key);
    }

    // Clear message history manually
    clearMessageHistory() {
        this.messageHistory.clear();
    }

    handleFlashMessages() {
        // Handle Laravel flash messages
        const checkFlashMessages = () => {
            if (window.flashMessages) {
                if (window.flashMessages.success && !this.isDuplicateMessage('success', 'Success', window.flashMessages.success)) {
                    this.showNotification('success', 'Success!', window.flashMessages.success);
                }
                if (window.flashMessages.error && !this.isDuplicateMessage('error', 'Error', window.flashMessages.error)) {
                    this.showNotification('error', 'Error!', window.flashMessages.error);
                }
                if (window.flashMessages.warning && !this.isDuplicateMessage('warning', 'Warning', window.flashMessages.warning)) {
                    this.showNotification('warning', 'Warning!', window.flashMessages.warning);
                }
                if (window.flashMessages.info && !this.isDuplicateMessage('info', 'Info', window.flashMessages.info)) {
                    this.showNotification('info', 'Info!', window.flashMessages.info);
                }
            }

            // Also check laravelFlash if available
            if (typeof laravelFlash !== 'undefined') {
                if (laravelFlash.success && !this.isDuplicateMessage('success', 'Success', laravelFlash.success)) {
                    this.showNotification('success', 'Success!', laravelFlash.success);
                }
                if (laravelFlash.error && !this.isDuplicateMessage('error', 'Error', laravelFlash.error)) {
                    this.showNotification('error', 'Error!', laravelFlash.error);
                }
                if (laravelFlash.warning && !this.isDuplicateMessage('warning', 'Warning', laravelFlash.warning)) {
                    this.showNotification('warning', 'Warning!', laravelFlash.warning);
                }
                if (laravelFlash.info && !this.isDuplicateMessage('info', 'Info', laravelFlash.info)) {
                    this.showNotification('info', 'Info!', laravelFlash.info);
                }
            }
        };

        // Check immediately and also when DOM is ready
        checkFlashMessages();
        document.addEventListener('DOMContentLoaded', checkFlashMessages);
    }

    showNotification(type, title, message, duration = 4000) {
        // Check for duplicate messages
        if (this.isDuplicateMessage(type, title, message)) {
            console.log('Duplicate notification prevented:', { type, title, message });
            return null;
        }

        // Add to message history
        this.addToMessageHistory(type, title, message);

        // Remove existing notification if any
        const existing = document.querySelector('.notification-overlay');
        if (existing) {
            existing.remove();
        }

        // Create notification overlay - CENTERED
        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
            backdrop-filter: blur(3px);
        `;

        // Create notification content
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--white);
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 6px solid ${this.getNotificationColor(type)};
            position: relative;
        `;

        notification.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: ${this.getNotificationColor(type)};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                ">
                    ${this.getNotificationIcon(type)}
                </div>
                <div class="notification-title" style="
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    color: var(--mcdonalds-red);
                ">${title}</div>
                <div class="notification-message" style="
                    color: var(--dark-gray);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                    font-size: 1.1rem;
                ">${message}</div>
                <button class="notification-close" style="
                    background: linear-gradient(135deg, var(--mcdonalds-yellow) 0%, var(--mcdonalds-light-yellow) 100%);
                    color: var(--mcdonalds-red);
                    border: none;
                    padding: 0.875rem 2rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    min-width: 120px;
                ">OK</button>
            </div>
        `;

        overlay.appendChild(notification);
        document.body.appendChild(overlay);

        // Show notification with animation
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            notification.style.transform = 'scale(1)';
        }, 10);

        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(overlay);
        });

        // Add hover effect to close button
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.transform = 'translateY(-2px)';
            closeBtn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
        });

        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.transform = 'translateY(0)';
            closeBtn.style.boxShadow = 'none';
        });

        // Auto-hide after specified duration
        if (duration > 0) {
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    this.hideNotification(overlay);
                }
            }, duration);
        }

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideNotification(overlay);
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideNotification(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return overlay;
    }

    hideNotification(overlay) {
        const notification = overlay.querySelector('.notification');
        overlay.style.opacity = '0';
        if (notification) {
            notification.style.transform = 'scale(0.8)';
        }

        setTimeout(() => {
            if (document.body.contains(overlay)) {
                overlay.remove();
            }
        }, 400);
    }

    getNotificationColor(type) {
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            warning: 'var(--warning)',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '!',
            warning: '⚠',
            info: 'i'
        };
        return icons[type] || icons.info;
    }

    initQuantityControls() {
        // Remove the event listener approach since we're using onclick handlers in HTML
        // This prevents double execution
    }

    submitQuantityForm(form) {
        const submitBtn = form.querySelector('.update-btn');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                if (submitBtn && document.body.contains(submitBtn)) {
                    form.submit();
                }
            }, 300);
        }
    }

    initCartFunctionality() {
        // Initialize cart-related functionality
        this.initAddToCartForms();
        this.initRemoveButtons();
        this.updateCartDisplay();
    }

    initAddToCartForms() {
        const addForms = document.querySelectorAll('.add-form');
        addForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleAddToCart(e);
            });
        });
    }

    handleAddToCart(e) {
        const form = e.target;
        const addBtn = form.querySelector('.add-btn');
        const qtyInput = form.querySelector('.qty-input');

        if (addBtn && !addBtn.disabled) {
            const itemName = form.closest('.menu-card').querySelector('.menu-name').textContent;
            const quantity = qtyInput ? qtyInput.value : 1;

            // Show immediate feedback
            const originalHTML = addBtn.innerHTML;
            addBtn.innerHTML = '<span class="loading"></span> Adding...';
            addBtn.disabled = true;

            // Show success notification after a short delay
            setTimeout(() => {
                if (!this.isDuplicateMessage('success', 'Added to Cart', `${itemName} (x${quantity}) added to your cart!`)) {
                    this.showNotification('success', 'Added to Cart!', `${itemName} (x${quantity}) added to your cart!`, 2000);
                }
            }, 500);
        }
    }

    initRemoveButtons() {
        const removeForms = document.querySelectorAll('.remove-form');
        removeForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRemoveFromCart(form);
            });
        });
    }

    handleRemoveFromCart(form) {
        const cartItem = form.closest('.cart-item');
        const itemName = cartItem.querySelector('.item-name').textContent;

        // Show confirmation
        this.showConfirmDialog(
            'Remove Item',
            `Are you sure you want to remove "${itemName}" from your cart?`,
            () => {
                form.submit();
            }
        );
    }

    showConfirmDialog(title, message, onConfirm) {
        // Check for duplicates
        if (this.isDuplicateMessage('confirm', title, message)) {
            return null;
        }

        this.addToMessageHistory('confirm', title, message);

        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
            backdrop-filter: blur(3px);
        `;

        const dialog = document.createElement('div');
        dialog.className = 'notification notification-warning';
        dialog.style.cssText = `
            background: var(--white);
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 6px solid var(--warning);
        `;

        dialog.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: var(--warning);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                ">⚠</div>
                <div class="notification-title" style="
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    color: var(--mcdonalds-red);
                ">${title}</div>
                <div class="notification-message" style="
                    color: var(--dark-gray);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                    font-size: 1.1rem;
                ">${message}</div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="confirm-cancel" style="
                        padding: 0.875rem 2rem;
                        background: var(--white);
                        color: var(--mcdonalds-red);
                        border: 2px solid var(--mcdonalds-red);
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 1rem;
                        min-width: 120px;
                    ">Cancel</button>
                    <button class="confirm-remove" style="
                        padding: 0.875rem 2rem;
                        background: var(--error);
                        color: var(--white);
                        border: none;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 1rem;
                        min-width: 120px;
                    ">Remove</button>
                </div>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // Handle buttons
        dialog.querySelector('.confirm-cancel').addEventListener('click', () => {
            this.hideNotification(overlay);
        });

        dialog.querySelector('.confirm-remove').addEventListener('click', () => {
            this.hideNotification(overlay);
            setTimeout(onConfirm, 100);
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideNotification(overlay);
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideNotification(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return overlay;
    }

    initFormHandling() {
        // Handle confirm order form
        const confirmForm = document.querySelector('.confirm-form');
        if (confirmForm) {
            confirmForm.addEventListener('submit', (e) => {
                const confirmBtn = confirmForm.querySelector('.confirm-btn');
                if (confirmBtn && !confirmBtn.disabled) {
                    confirmBtn.innerHTML = '<span class="loading"></span> Processing Order...';
                    confirmBtn.disabled = true;

                    // Show processing notification
                    setTimeout(() => {
                        this.showNotification('info', 'Processing Order', 'Please wait while we process your order...', 0);
                    }, 200);
                }
            });
        }
    }

    updateCartDisplay() {
        // Update cart count display if needed
        const cartCount = document.querySelectorAll('.cart-item').length;
        const cartBadges = document.querySelectorAll('.cart-badge');

        cartBadges.forEach(badge => {
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
        });
    }

    getCart() {
        // Get cart from session storage if available
        try {
            return JSON.parse(sessionStorage.getItem('cart') || '{}');
        } catch (e) {
            return {};
        }
    }

    saveCart() {
        // Save cart to session storage
        try {
            sessionStorage.setItem('cart', JSON.stringify(this.cart));
        } catch (e) {
            console.warn('Unable to save cart to session storage');
        }
    }

    // Utility functions moved to global scope to prevent duplication

    // Idle timeout for kiosk (return to start screen after inactivity)
    setupIdleTimeout() {
        let idleTime = 0;
        const idleLimit = 300000; // 5 minutes in milliseconds

        const resetIdleTime = () => {
            idleTime = 0;
        };

        const checkIdleTime = () => {
            idleTime += 1000;
            if (idleTime >= idleLimit) {
                this.showIdleWarning();
            }
        };

        // Reset idle time on user activity
        document.addEventListener('click', resetIdleTime);
        document.addEventListener('touch', resetIdleTime);
        document.addEventListener('keypress', resetIdleTime);
        document.addEventListener('scroll', resetIdleTime);

        // Check idle time every second
        setInterval(checkIdleTime, 1000);
    }

    showIdleWarning() {
        this.showNotification(
            'warning',
            'Session Timeout',
            'Your session will expire in 60 seconds due to inactivity. Tap anywhere to continue.',
            60000
        );
    }
}

// Global functions for HTML onclick handlers
function increaseQty(button) {
    const input = button.parentNode.querySelector('.qty-input');
    if (input) {
        const currentValue = parseInt(input.value) || 1;
        input.value = currentValue + 1;

        // Add visual feedback
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);

        // DON'T auto-submit for add-to-cart forms (let user click Add to Cart)
        const form = button.closest('.add-form');
        if (!form) {
            // Only auto-submit for cart quantity forms
            const qtyForm = button.closest('.qty-form');
            if (qtyForm) {
                // Add loading state to the button
                const originalText = button.innerHTML;
                button.innerHTML = '<span class="loading"></span>';
                button.disabled = true;

                // Submit the form after a short delay for visual feedback
                setTimeout(() => {
                    qtyForm.submit();
                }, 300);
            }
        }
    }
}

function decreaseQty(button) {
    const input = button.parentNode.querySelector('.qty-input');
    if (input) {
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
            input.value = currentValue - 1;

            // Add visual feedback
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);

            // DON'T auto-submit for add-to-cart forms (let user click Add to Cart)
            const form = button.closest('.add-form');
            if (!form) {
                // Only auto-submit for cart quantity forms
                const qtyForm = button.closest('.qty-form');
                if (qtyForm) {
                    // Add loading state to the button
                    const originalText = button.innerHTML;
                    button.innerHTML = '<span class="loading"></span>';
                    button.disabled = true;

                    // Submit the form after a short delay for visual feedback
                    setTimeout(() => {
                        qtyForm.submit();
                    }, 300);
                }
            }
        }
    }
}

function updateCartQty(button, change) {
    const input = button.parentNode.querySelector('.qty-input');
    if (input) {
        const currentValue = parseInt(input.value) || 1;
        const newValue = currentValue + change;

        if (newValue >= 1) {
            input.value = newValue;

            // Add visual feedback
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);

            // Auto-submit immediately for cart quantity forms
            const form = button.closest('.qty-form');
            if (form) {
                // Add loading state to the button
                const originalText = button.innerHTML;
                button.innerHTML = '<span class="loading"></span>';
                button.disabled = true;

                // Submit the form after a short delay for visual feedback
                setTimeout(() => {
                    form.submit();
                }, 300);
            }
        }
    }
}

function handleCartQuantityChange(input) {
    const form = input.closest('.qty-form');
    if (form) {
        // Add a small delay to allow user to finish typing
        clearTimeout(input.updateTimeout);
        input.updateTimeout = setTimeout(() => {
            const quantity = parseInt(input.value) || 1;
            if (quantity >= 1) {
                input.value = quantity; // Ensure it's a valid number
                form.submit();
            } else {
                input.value = 1; // Reset to 1 if invalid
            }
        }, 1500); // Wait 1.5 seconds after user stops typing
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.kioskManager = new KioskManager();

    // Setup idle timeout for kiosk mode
    if (window.location.pathname.includes('/orders/')) {
        window.kioskManager.setupIdleTimeout();
    }

    // Handle category button active states
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add loading state
            this.innerHTML = '<span class="loading"></span> Loading...';
        });
    });

    // Handle menu card hover effects on mobile
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-3px)';
        });

        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });

    // Auto-focus quantity inputs when changed
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.select();
        });
    });

    // Handle print receipt functionality (if needed)
    const printButtons = document.querySelectorAll('.print-btn');
    printButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            window.print();
        });
    });
});

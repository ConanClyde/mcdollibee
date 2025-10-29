// McDonald's Menu Management JavaScript - Complete System

class MenuManager {
    constructor() {
        this.messageHistory = new Set(); // Track messages to prevent duplicates
        this.historyCleanupInterval = 10000; // Clear history every 10 seconds
        this.init();
    }

    init() {
        this.bindEvents();
        this.initNotifications();
        this.initImagePreviews();
        this.initConfirmDialogs();
        this.initFilterForm();
        this.setupFormValidation();
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
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', this.handleButtonClick);
        });

        // Handle form submissions with loading states
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
    }

    handleButtonClick(e) {
        const btn = e.target;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }

    handleFormSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;

            // Re-enable button after 3 seconds if form hasn't been submitted
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 3000);
        }
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

    showNotification(type, title, message, duration = 5000) {
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

    initImagePreviews() {
        const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');

        imageInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleImagePreview(e.target);
            });
        });
    }

    handleImagePreview(input) {
        const file = input.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('error', 'Invalid File', 'Please select a valid image file.');
            input.value = '';
            return;
        }

        // Validate file size (4MB limit)
        if (file.size > 4 * 1024 * 1024) {
            this.showNotification('error', 'File Too Large', 'Please select an image smaller than 4MB.');
            input.value = '';
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showImagePreview(input, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(input, src) {
        // Remove existing preview
        const existingPreview = input.parentNode.querySelector('.image-preview-new');
        if (existingPreview) {
            existingPreview.remove();
        }

        // Create new preview
        const preview = document.createElement('img');
        preview.src = src;
        preview.className = 'image-preview image-preview-new';
        preview.style.marginTop = '0.5rem';

        input.parentNode.appendChild(preview);
    }

    initConfirmDialogs() {
        const deleteButtons = document.querySelectorAll('.delete-btn');

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showConfirmDialog(
                    'Delete Menu Item',
                    'Are you sure you want to delete this menu item? This action cannot be undone.',
                    () => {
                        btn.closest('form').submit();
                    }
                );
            });
        });
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
                    <button class="btn btn-secondary btn-small confirm-cancel" style="
                        min-width: 100px;
                        height: auto;
                        padding: 0.75rem 1.5rem;
                    ">Cancel</button>
                    <button class="btn btn-danger btn-small confirm-delete" style="
                        min-width: 100px;
                        height: auto;
                        padding: 0.75rem 1.5rem;
                    ">Delete</button>
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

        dialog.querySelector('.confirm-delete').addEventListener('click', () => {
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

    initFilterForm() {
        const filterForm = document.querySelector('.filter-form');
        if (!filterForm) return;

        // Auto-submit filter form on change
        const filterInputs = filterForm.querySelectorAll('select');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                // Add loading state
                const submitBtn = filterForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = '<span class="loading"></span> Filtering...';
                    submitBtn.disabled = true;
                }
                filterForm.submit();
            });
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Number validation
        if (field.type === 'number' && value) {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
                isValid = false;
                errorMessage = 'Please enter a valid positive number.';
            }
        }

        // File validation
        if (field.type === 'file' && field.files.length > 0) {
            const file = field.files[0];
            if (field.accept.includes('image') && !file.type.startsWith('image/')) {
                isValid = false;
                errorMessage = 'Please select a valid image file.';
            }
            if (file.size > 4 * 1024 * 1024) {
                isValid = false;
                errorMessage = 'File size must be less than 4MB.';
            }
        }

        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    showLoading() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div>Loading...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
    }
}

// Kiosk-specific functions for user mode
function increaseQty(button) {
    const input = button.parentNode.querySelector('.qty-input');
    const currentValue = parseInt(input.value) || 1;
    input.value = currentValue + 1;
}

function decreaseQty(button) {
    const input = button.parentNode.querySelector('.qty-input');
    const currentValue = parseInt(input.value) || 1;
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

function updateCartQty(button, change) {
    const input = button.parentNode.querySelector('.qty-input');
    const currentValue = parseInt(input.value) || 1;
    const newValue = currentValue + change;

    if (newValue >= 1) {
        input.value = newValue;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.menuManager = new MenuManager();

    // Handle cart animations
    const cartButtons = document.querySelectorAll('.add-btn');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.innerHTML = '<span class="loading"></span> Adding...';
            this.disabled = true;
        });
    });

    // Auto-submit quantity forms after delay
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const form = this.closest('form');
                if (form && form.classList.contains('qty-form')) {
                    form.submit();
                }
            }, 1000);
        });
    });
});

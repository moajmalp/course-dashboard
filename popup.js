// Popup Component Class
class CustomPopup {
    constructor() {
        this.init();
    }

    init() {
        this.addStyles();
    }

    addStyles() {
        if (!document.getElementById('popupStyles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'popupStyles';
            styleSheet.textContent = `
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.2s ease;
                }

                .popup-content {
                    background: #fff;
                    padding: 20px;
                    border-radius: 12px;
                    min-width: 300px;
                    max-width: 90%;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    animation: slideIn 0.3s ease;
                }

                .popup-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .popup-icon {
                    font-size: 24px;
                }

                .popup-body {
                    margin-bottom: 20px;
                }

                .popup-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .popup-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .popup-btn.confirm {
                    background: #00b764;
                    color: white;
                }

                .popup-btn.cancel {
                    background: #00203f;
                    color: white;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }

    show(options) {
        const {
            title = 'Confirm Action',
            icon = '⚠️',
            message,
            confirmText = 'OK',
            type = 'default',
            showCancel = false,
            autoClose = false,
            onConfirm = () => {}
        } = options;

        // Create popup element
        const popup = document.createElement('div');
        popup.id = 'customPopup';
        
        // Set popup HTML
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content ${type}">
                    <div class="popup-header">
                        <span class="popup-icon">${icon}</span>
                        <h3>${title}</h3>
                    </div>
                    <div class="popup-body">
                        <p>${message}</p>
                    </div>
                    <div class="popup-footer">
                        ${showCancel ? `<button class="popup-btn cancel">Cancel</button>` : ''}
                        <button class="popup-btn confirm">${confirmText}</button>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(popup);

        // Setup event listeners
        const confirmBtn = popup.querySelector('.confirm');
        const cancelBtn = popup.querySelector('.cancel');
        
        confirmBtn.onclick = () => {
            onConfirm();
            this.close(popup);
        };

        if (cancelBtn) {
            cancelBtn.onclick = () => this.close(popup);
        }

        // Close on overlay click
        popup.querySelector('.popup-overlay').onclick = (e) => {
            if (e.target.classList.contains('popup-overlay')) {
                this.close(popup);
            }
        };

        // Close on ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close(popup);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Auto close if specified
        if (autoClose) {
            setTimeout(() => this.close(popup), autoClose);
        }
    }

    close(popup) {
        popup.remove();
    }
}

// Create global popup instance
const popup = new CustomPopup();

// Make it globally available
window.popup = popup;
class SWN {
    constructor(options = {}) {
        this.options = {
            titleText: options.titleText || 'Notice',
            buttonText: options.buttonText || 'OK',
            cancelText: options.cancelText || 'Cancel',
            template: options.template || null,
            position: options.position || 'center',
            bgColor: options.bgColor || '#000000',
            bgOpacity: options.bgOpacity || 0.5,
            bgBlur: options.bgBlur || 0,
            zIndex: options.zIndex || 9999,
            inputPlaceholder: options.inputPlaceholder || 'Enter your response...',
            defaultValue: options.defaultValue || ''
        };

        // Store original functions
        this.originalAlert = window.alert;
        this.originalConfirm = window.confirm;
        this.originalPrompt = window.prompt;
    }

    getPositionStyles(position) {
        const styles = {
            position: 'fixed',
            display: 'flex',
        };

        // Only set full width for center position
        if (position === 'center') {
            styles.width = '100%';
        }

        switch (position) {
            case 'center':
                styles.top = '0';
                styles.left = '0';
                styles.right = '0';
                styles.bottom = '0';
                styles.alignItems = 'center';
                styles.justifyContent = 'center';
                styles.padding = '1rem';
                break;
            case 'top':
                styles.top = '1rem';
                styles.left = '50%';
                styles.transform = 'translateX(-50%)';
                break;
            case 'top left':
                styles.top = '1rem';
                styles.left = '1rem';
                styles.alignItems = 'flex-start';
                break;
            case 'top right':
                styles.top = '1rem';
                styles.right = '1rem';
                styles.alignItems = 'flex-start';
                styles.justifyContent = 'flex-end';
                break;
            case 'bottom':
                styles.bottom = '1rem';
                styles.left = '50%';
                styles.transform = 'translateX(-50%)';
                break;
            case 'bottom left':
                styles.bottom = '1rem';
                styles.left = '1rem';
                styles.alignItems = 'flex-end';
                break;
            case 'bottom right':
                styles.bottom = '1rem';
                styles.right = '1rem';
                styles.alignItems = 'flex-end';
                styles.justifyContent = 'flex-end';
                break;
            case 'left':
                styles.left = '1rem';
                styles.top = '50%';
                styles.transform = 'translateY(-50%)';
                break;
            case 'right':
                styles.right = '1rem';
                styles.top = '50%';
                styles.transform = 'translateY(-50%)';
                break;
            default:
                // Default to center
                styles.top = '0';
                styles.left = '0';
                styles.right = '0';
                styles.bottom = '0';
                styles.alignItems = 'center';
                styles.justifyContent = 'center';
                styles.width = '100%';
                styles.padding = '1rem';
        }

        return styles;
    }

    applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    createOverlay() {
        // Create wrapper for backdrop-filter
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-swn-overlay-wrapper', '');

        // Wrapper styles
        const wrapperStyles = {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: this.options.zIndex,
        };

        // If blur is enabled, apply backdrop-filter to wrapper
        if (this.options.bgBlur > 0) {
            wrapperStyles.backdropFilter = `blur(${this.options.bgBlur}px)`;
            wrapperStyles.WebkitBackdropFilter = `blur(${this.options.bgBlur}px)`; // For Safari
        }

        this.applyStyles(wrapper, wrapperStyles);

        // Create the colored overlay
        const overlay = document.createElement('div');
        overlay.setAttribute('data-swn-overlay', '');

        // Apply base styles to colored overlay
        const overlayStyles = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: this.options.bgColor,
            opacity: this.options.bgOpacity,
        };

        this.applyStyles(overlay, overlayStyles);

        // Add overlay to wrapper
        wrapper.appendChild(overlay);
        return wrapper;
    }

    createNoticeElement(message, type = 'alert') {
        let noticeElement;
        const container = document.createElement('div');
        container.setAttribute('data-swn-container', '');

        const positionStyles = this.getPositionStyles(this.options.position);
        positionStyles.zIndex = this.options.zIndex + 1;
        this.applyStyles(container, positionStyles);

        const templateId = type === 'prompt' ? '#prompt-template' :
            type === 'confirm' ? '#confirm-template' :
            this.options.template;

        if (templateId) {
            const template = document.querySelector(templateId);
            if (template) {
                noticeElement = template.content.cloneNode(true);
            }
        } else {
            noticeElement = document.createElement('div');
            noticeElement.setAttribute('data-swn', '');

            switch (type) {
                case 'prompt':
                    noticeElement.innerHTML = `
                            <div data-swn-title></div>
                            <div data-swn-body></div>
                            <input type="text" data-swn-input class="w-full px-3 py-2 border rounded-md mb-4">
                            <div data-swn-buttons>
                                <button data-swn-cancel></button>
                                <button data-swn-ok></button>
                            </div>
                        `;
                    break;
                case 'confirm':
                    noticeElement.innerHTML = `
                            <div data-swn-title></div>
                            <div data-swn-body></div>
                            <div data-swn-buttons>
                                <button data-swn-cancel></button>
                                <button data-swn-ok></button>
                            </div>
                        `;
                    break;
                default:
                    noticeElement.innerHTML = `
                            <div data-swn-title></div>
                            <div data-swn-body></div>
                            <div data-swn-buttons>
                                <button data-swn-ok></button>
                            </div>
                        `;
            }
        }

        // Apply content
        const titleElement = noticeElement.querySelector('[data-swn-title]');
        const bodyElement = noticeElement.querySelector('[data-swn-body]');
        const okButton = noticeElement.querySelector('[data-swn-ok]');
        const cancelButton = noticeElement.querySelector('[data-swn-cancel]');
        const inputElement = noticeElement.querySelector('[data-swn-input]');

        if (titleElement) titleElement.textContent = this.options.titleText;
        if (bodyElement) bodyElement.textContent = message;
        if (okButton) okButton.textContent = this.options.buttonText;
        if (cancelButton) cancelButton.textContent = this.options.cancelText;
        if (inputElement) {
            inputElement.placeholder = this.options.inputPlaceholder;
            inputElement.value = this.options.defaultValue;
        }

        // Apply custom attributes
        const notice = noticeElement.querySelector('[data-swn]');
        if (notice) {
            notice.setAttribute('data-swn-position', this.options.position);
            notice.setAttribute('data-swn-bg-color', this.options.bgColor);
            notice.setAttribute('data-swn-bg-opacity', this.options.bgOpacity);
            notice.setAttribute('data-swn-bg-blur', this.options.bgBlur);
            notice.setAttribute('data-swn-z-index', this.options.zIndex);
        }

        container.appendChild(noticeElement);
        return {
            overlay: this.createOverlay(),
            container
        };
    }

    show(message) {
        return this.showNotice(message, 'alert');
    }

    showPrompt(message) {
        return this.showNotice(message, 'prompt');
    }

    showConfirm(message) {
        return this.showNotice(message, 'confirm');
    }

    showNotice(message, type) {
        return new Promise(resolve => {
            const {
                overlay,
                container
            } = this.createNoticeElement(message, type);
            document.body.appendChild(overlay);
            document.body.appendChild(container);
            document.body.style.overflow = 'hidden';

            const okButton = container.querySelector('[data-swn-ok]');
            const cancelButton = container.querySelector('[data-swn-cancel]');
            const inputElement = container.querySelector('[data-swn-input]');

            const cleanup = () => {
                document.body.removeChild(overlay);
                document.body.removeChild(container);
                document.body.style.overflow = '';
            };

            if (okButton) {
                okButton.addEventListener('click', () => {
                    cleanup();
                    if (type === 'prompt') {
                        resolve(inputElement ? inputElement.value : null);
                    } else if (type === 'confirm') {
                        resolve(true);
                    } else {
                        resolve();
                    }
                });
            }

            if (cancelButton) {
                cancelButton.addEventListener('click', () => {
                    cleanup();
                    resolve(type === 'prompt' ? null : false);
                });
            }

            if (inputElement) {
                inputElement.focus();
            } else if (okButton) {
                okButton.focus();
            }
        });
    }

    install() {
        window.alert = async (message) => {
            await this.show(message);
        };

        window.confirm = async (message) => {
            return await this.showConfirm(message);
        };

        window.prompt = async (message, defaultValue = '') => {
            this.options.defaultValue = defaultValue;
            return await this.showPrompt(message);
        };
    }

    uninstall() {
        window.alert = this.originalAlert;
        window.confirm = this.originalConfirm;
        window.prompt = this.originalPrompt;
    }
}

export default SWN;
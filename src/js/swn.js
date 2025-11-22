class SWN {
  constructor(options = {}) {
    this.options = {
      titleText: options.titleText || "Notice",
      buttonText: options.buttonText || "OK",
      cancelText: options.cancelText || "Cancel",
      template: options.template || null,
      position: options.position || "center",
      bgColor: options.bgColor || "#000000",
      bgOpacity: options.bgOpacity || 0.5,
      bgBlur: options.bgBlur || 0,
      zIndex: options.zIndex || 9999,
      inputPlaceholder: options.inputPlaceholder || "Enter your response...",
      defaultValue: options.defaultValue || "",
    };

    // Store original functions
    this.originalAlert = window.alert;
    this.originalConfirm = window.confirm;
    this.originalPrompt = window.prompt;

    // Track open dialogs
    this.openCount = 0;
  }

  getPositionStyles(position) {
    const styles = {
      position: "fixed",
      display: "flex",
    };

    // Only set full width for center position
    if (position === "center") {
      styles.width = "100%";
    }

    switch (position) {
      case "center":
        styles.top = "0";
        styles.left = "0";
        styles.right = "0";
        styles.bottom = "0";
        styles.alignItems = "center";
        styles.justifyContent = "center";
        styles.padding = "1rem";
        break;
      case "top":
        styles.top = "1rem";
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
        break;
      case "top left":
        styles.top = "1rem";
        styles.left = "1rem";
        styles.alignItems = "flex-start";
        break;
      case "top right":
        styles.top = "1rem";
        styles.right = "1rem";
        styles.alignItems = "flex-start";
        styles.justifyContent = "flex-end";
        break;
      case "bottom":
        styles.bottom = "1rem";
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
        break;
      case "bottom left":
        styles.bottom = "1rem";
        styles.left = "1rem";
        styles.alignItems = "flex-end";
        break;
      case "bottom right":
        styles.bottom = "1rem";
        styles.right = "1rem";
        styles.alignItems = "flex-end";
        styles.justifyContent = "flex-end";
        break;
      case "left":
        styles.left = "1rem";
        styles.top = "50%";
        styles.transform = "translateY(-50%)";
        break;
      case "right":
        styles.right = "1rem";
        styles.top = "50%";
        styles.transform = "translateY(-50%)";
        break;
      default:
        // Default to center
        styles.top = "0";
        styles.left = "0";
        styles.right = "0";
        styles.bottom = "0";
        styles.alignItems = "center";
        styles.justifyContent = "center";
        styles.width = "100%";
        styles.padding = "1rem";
    }

    return styles;
  }

  applyStyles(element, styles) {
    Object.assign(element.style, styles);
  }

  createOverlay(options) {
    // Create wrapper for backdrop-filter
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-swn-overlay-wrapper", "");

    // Wrapper styles
    const wrapperStyles = {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: options.zIndex,
    };

    // If blur is enabled, apply backdrop-filter to wrapper
    if (options.bgBlur > 0) {
      wrapperStyles.backdropFilter = `blur(${options.bgBlur}px)`;
      wrapperStyles.WebkitBackdropFilter = `blur(${options.bgBlur}px)`; // For Safari
    }

    this.applyStyles(wrapper, wrapperStyles);

    // Create the colored overlay
    const overlay = document.createElement("div");
    overlay.setAttribute("data-swn-overlay", "");

    // Apply base styles to colored overlay
    const overlayStyles = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: options.bgColor,
      opacity: options.bgOpacity,
    };

    this.applyStyles(overlay, overlayStyles);

    // Add overlay to wrapper
    wrapper.appendChild(overlay);
    return wrapper;
  }

  createNoticeElement(message, type, options) {
    let noticeElement;
    const container = document.createElement("div");
    container.setAttribute("data-swn-container", "");

    // ARIA attributes
    container.setAttribute("role", "dialog");
    container.setAttribute("aria-modal", "true");

    const positionStyles = this.getPositionStyles(options.position);
    positionStyles.zIndex = options.zIndex + 1;
    this.applyStyles(container, positionStyles);

    const templateId =
      type === "prompt"
        ? "#prompt-template"
        : type === "confirm"
        ? "#confirm-template"
        : options.template;

    let template = null;
    if (templateId) {
      template = document.querySelector(templateId);
    }

    if (template) {
      noticeElement = template.content.cloneNode(true);
    } else {
      noticeElement = document.createElement("div");
      noticeElement.setAttribute("data-swn", "");

      switch (type) {
        case "prompt":
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
        case "confirm":
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
    const titleElement = noticeElement.querySelector("[data-swn-title]");
    const bodyElement = noticeElement.querySelector("[data-swn-body]");
    const okButton = noticeElement.querySelector("[data-swn-ok]");
    const cancelButton = noticeElement.querySelector("[data-swn-cancel]");
    const inputElement = noticeElement.querySelector("[data-swn-input]");

    if (titleElement) {
      titleElement.textContent = options.titleText;
      titleElement.id = "swn-title-" + Date.now();
      container.setAttribute("aria-labelledby", titleElement.id);
    }
    if (bodyElement) {
      bodyElement.textContent = message;
      bodyElement.id = "swn-body-" + Date.now();
      container.setAttribute("aria-describedby", bodyElement.id);
    }
    if (okButton) okButton.textContent = options.buttonText;
    if (cancelButton) cancelButton.textContent = options.cancelText;
    if (inputElement) {
      inputElement.placeholder = options.inputPlaceholder;
      inputElement.value = options.defaultValue;
    }

    // Apply custom attributes
    const notice = noticeElement.querySelector("[data-swn]");
    if (notice) {
      notice.setAttribute("data-swn-position", options.position);
      notice.setAttribute("data-swn-bg-color", options.bgColor);
      notice.setAttribute("data-swn-bg-opacity", options.bgOpacity);
      notice.setAttribute("data-swn-bg-blur", options.bgBlur);
      notice.setAttribute("data-swn-z-index", options.zIndex);
    }

    container.appendChild(noticeElement);
    return {
      overlay: this.createOverlay(options),
      container,
    };
  }

  show(message, options = {}) {
    return this.showNotice(message, "alert", options);
  }

  showPrompt(message, options = {}) {
    return this.showNotice(message, "prompt", options);
  }

  showConfirm(message, options = {}) {
    return this.showNotice(message, "confirm", options);
  }

  showNotice(message, type, callOptions = {}) {
    const currentOptions = {
      ...this.options,
      ...callOptions,
    };

    return new Promise((resolve) => {
      this.openCount++;
      const { overlay, container } = this.createNoticeElement(
        message,
        type,
        currentOptions
      );
      document.body.appendChild(overlay);
      document.body.appendChild(container);
      document.body.style.overflow = "hidden";

      const okButton = container.querySelector("[data-swn-ok]");
      const cancelButton = container.querySelector("[data-swn-cancel]");
      const inputElement = container.querySelector("[data-swn-input]");

      // Focus management
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      const cleanup = () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.removeChild(overlay);
        document.body.removeChild(container);
        this.openCount--;
        if (this.openCount === 0) {
          document.body.style.overflow = "";
        }
      };

      const handleKeyDown = (e) => {
        const isTabPressed = e.key === "Tab" || e.keyCode === 9;
        const isEscPressed = e.key === "Escape" || e.keyCode === 27;

        if (isEscPressed) {
          cleanup();
          resolve(type === "prompt" ? null : false);
          return;
        }

        if (!isTabPressed) {
          return;
        }

        if (e.shiftKey) {
          // if shift key pressed for shift + tab combination
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus(); // add focus for the last focusable element
            e.preventDefault();
          }
        } else {
          // if tab key is pressed
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus(); // add focus for the first focusable element
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      if (okButton) {
        okButton.addEventListener("click", () => {
          cleanup();
          if (type === "prompt") {
            resolve(inputElement ? inputElement.value : null);
          } else if (type === "confirm") {
            resolve(true);
          } else {
            resolve();
          }
        });
      }

      if (cancelButton) {
        cancelButton.addEventListener("click", () => {
          cleanup();
          resolve(type === "prompt" ? null : false);
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

    window.prompt = async (message, defaultValue = "") => {
      this.options.defaultValue = defaultValue;
      return await this.showPrompt(message, {
        defaultValue,
      });
    };
  }

  uninstall() {
    window.alert = this.originalAlert;
    window.confirm = this.originalConfirm;
    window.prompt = this.originalPrompt;
  }
}

// Auto-initialization
document.addEventListener("DOMContentLoaded", () => {
  // Check for template with child having data-swn
  const templates = document.querySelectorAll("template");
  let hasValidTemplate = false;

  for (const template of templates) {
    if (template.content.querySelector("[data-swn]")) {
      hasValidTemplate = true;
      break;
    }
  }

  // Check for trigger element
  const trigger = document.querySelector("[data-swn-trigger]");

  if (hasValidTemplate && trigger) {
    const options = {};
    const dataset = trigger.dataset;

    // Map data attributes to options
    if (dataset.swnTitle) options.titleText = dataset.swnTitle;
    if (dataset.swnOkText) options.buttonText = dataset.swnOkText;
    if (dataset.swnCancelText) options.cancelText = dataset.swnCancelText;
    if (dataset.swnTemplate) options.template = dataset.swnTemplate;
    if (dataset.swnPosition) options.position = dataset.swnPosition;
    if (dataset.swnBgColor) options.bgColor = dataset.swnBgColor;
    if (dataset.swnBgOpacity)
      options.bgOpacity = parseFloat(dataset.swnBgOpacity);
    if (dataset.swnBgBlur) options.bgBlur = parseInt(dataset.swnBgBlur);
    if (dataset.swnZIndex) options.zIndex = parseInt(dataset.swnZIndex);

    const swn = new SWN(options);
    swn.install();
  }
});

export default SWN;

let _idCounter = 0;

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
      closeOnOverlayClick: options.closeOnOverlayClick !== undefined ? options.closeOnOverlayClick : false,
      animation: options.animation || null,
      onOpen: options.onOpen || null,
      onClose: options.onClose || null,
    };

    this.originalAlert = window.alert;
    this.originalConfirm = window.confirm;
    this.originalPrompt = window.prompt;

    this.openCount = 0;
    this._activeOverlays = [];
  }

  _generateId() {
    return ++_idCounter;
  }

  _getAnimationStyles(animation) {
    if (!animation) return { enter: {}, exit: {} };

    const duration = animation.duration || 200;
    const type = animation.type || "fade";

    switch (type) {
      case "fade":
        return {
          enter: { opacity: "0", transition: `opacity ${duration}ms ease` },
          active: { opacity: "1" },
          exit: { opacity: "0", transition: `opacity ${duration}ms ease` },
        };
      case "slide-up":
        return {
          enter: { opacity: "0", transform: "translateY(20px)", transition: `opacity ${duration}ms ease, transform ${duration}ms ease` },
          active: { opacity: "1", transform: "translateY(0)" },
          exit: { opacity: "0", transform: "translateY(20px)", transition: `opacity ${duration}ms ease, transform ${duration}ms ease` },
        };
      case "slide-down":
        return {
          enter: { opacity: "0", transform: "translateY(-20px)", transition: `opacity ${duration}ms ease, transform ${duration}ms ease` },
          active: { opacity: "1", transform: "translateY(0)" },
          exit: { opacity: "0", transform: "translateY(-20px)", transition: `opacity ${duration}ms ease, transform ${duration}ms ease` },
        };
      case "scale":
        return {
          enter: { opacity: "0", transform: "scale(0.9)", transition: `opacity ${duration}ms ease, transform ${duration}ms ease` },
          active: { opacity: "1", transform: "scale(1)" },
          exit: { opacity: "0", transform: "scale(0.9)", transition: `opacity ${duration}ms ease, transform ${duration}ms ease` },
        };
      default:
        return { enter: {}, exit: {} };
    }
  }

  getPositionStyles(position) {
    const styles = {
      position: "fixed",
      display: "flex",
    };

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
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-swn-overlay-wrapper", "");

    const wrapperStyles = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: String(options.zIndex),
    };

    if (options.bgBlur > 0) {
      wrapperStyles.backdropFilter = `blur(${options.bgBlur}px)`;
      wrapperStyles.WebkitBackdropFilter = `blur(${options.bgBlur}px)`;
    }

    this.applyStyles(wrapper, wrapperStyles);

    const overlay = document.createElement("div");
    overlay.setAttribute("data-swn-overlay", "");

    const overlayStyles = {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: options.bgColor,
      opacity: String(options.bgOpacity),
    };

    this.applyStyles(overlay, overlayStyles);
    wrapper.appendChild(overlay);
    return wrapper;
  }

  createNoticeElement(message, type, options) {
    let noticeElement;
    const container = document.createElement("div");
    container.setAttribute("data-swn-container", "");

    container.setAttribute("role", "dialog");
    container.setAttribute("aria-modal", "true");

    const positionStyles = this.getPositionStyles(options.position);
    positionStyles.zIndex = String(options.zIndex + 1);
    this.applyStyles(container, positionStyles);

    const templateId = options.template
      ? options.template
      : type === "prompt"
      ? "#prompt-template"
      : type === "confirm"
      ? "#confirm-template"
      : null;

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

    const titleElement = noticeElement.querySelector("[data-swn-title]");
    const bodyElement = noticeElement.querySelector("[data-swn-body]");
    const okButton = noticeElement.querySelector("[data-swn-ok]");
    const cancelButton = noticeElement.querySelector("[data-swn-cancel]");
    const inputElement = noticeElement.querySelector("[data-swn-input]");

    const id = this._generateId();

    if (titleElement) {
      titleElement.textContent = options.titleText;
      titleElement.id = "swn-title-" + id;
      container.setAttribute("aria-labelledby", titleElement.id);
    }
    if (bodyElement) {
      bodyElement.textContent = message;
      bodyElement.id = "swn-body-" + id;
      container.setAttribute("aria-describedby", bodyElement.id);
    }
    if (okButton) okButton.textContent = options.buttonText;

    if (cancelButton) {
      if (type === "alert") {
        cancelButton.style.display = "none";
      } else {
        cancelButton.textContent = options.cancelText;
        cancelButton.style.display = "";
      }
    }

    if (inputElement) {
      if (type === "prompt") {
        inputElement.placeholder = options.inputPlaceholder;
        inputElement.value = options.defaultValue;
        inputElement.style.display = "";
      } else {
        inputElement.style.display = "none";
      }
    }

    const notice = noticeElement.querySelector("[data-swn]");
    if (notice) {
      notice.setAttribute("data-swn-position", options.position);
      notice.setAttribute("data-swn-bg-color", options.bgColor);
      notice.setAttribute("data-swn-bg-opacity", String(options.bgOpacity));
      notice.setAttribute("data-swn-bg-blur", String(options.bgBlur));
      notice.setAttribute("data-swn-z-index", String(options.zIndex));
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

      this._activeOverlays.push({ overlay, container });

      const okButton = container.querySelector("[data-swn-ok]");
      const cancelButton = container.querySelector("[data-swn-cancel]");
      const inputElement = container.querySelector("[data-swn-input]");

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      let resolved = false;

      const cleanup = () => {
        if (resolved) return;
        resolved = true;
        document.removeEventListener("keydown", handleKeyDown);

        const animation = currentOptions.animation;
        if (animation) {
          const animStyles = this._getAnimationStyles(animation);
          const noticeEl = container.querySelector("[data-swn]") || container;
          if (animStyles.exit) {
            this.applyStyles(noticeEl, animStyles.exit);
          }
          const exitDuration = animation.duration || 200;
          setTimeout(() => {
            if (overlay.parentNode) document.body.removeChild(overlay);
            if (container.parentNode) document.body.removeChild(container);
          }, exitDuration);
        } else {
          if (overlay.parentNode) document.body.removeChild(overlay);
          if (container.parentNode) document.body.removeChild(container);
        }

        this.openCount--;
        this._activeOverlays = this._activeOverlays.filter(
          (item) => item.container !== container
        );
        if (this.openCount === 0) {
          document.body.style.overflow = "";
        }

        if (typeof currentOptions.onClose === "function") {
          currentOptions.onClose();
        }
      };

      const resolveAndCleanup = (value) => {
        cleanup();
        resolve(value);
      };

      const handleKeyDown = (e) => {
        const isTabPressed = e.key === "Tab" || e.keyCode === 9;
        const isEscPressed = e.key === "Escape" || e.keyCode === 27;

        if (isEscPressed) {
          resolveAndCleanup(type === "prompt" ? null : false);
          return;
        }

        if (!isTabPressed) {
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      if (okButton) {
        okButton.addEventListener("click", () => {
          if (type === "prompt") {
            resolveAndCleanup(inputElement ? inputElement.value : null);
          } else if (type === "confirm") {
            resolveAndCleanup(true);
          } else {
            resolveAndCleanup();
          }
        });
      }

      if (cancelButton) {
        cancelButton.addEventListener("click", () => {
          resolveAndCleanup(type === "prompt" ? null : false);
        });
      }

      if (currentOptions.closeOnOverlayClick) {
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay || e.target.hasAttribute("data-swn-overlay")) {
            resolveAndCleanup(type === "prompt" ? null : false);
          }
        });
      }

      if (currentOptions.animation) {
        const animStyles = this._getAnimationStyles(currentOptions.animation);
        const noticeEl = container.querySelector("[data-swn]") || container;
        if (animStyles.enter) {
          this.applyStyles(noticeEl, animStyles.enter);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              this.applyStyles(noticeEl, animStyles.active || {});
            });
          });
        }
      }

      if (type === "prompt" && inputElement) {
        inputElement.focus();
      } else if (firstFocusableElement) {
        firstFocusableElement.focus();
      }

      if (typeof currentOptions.onOpen === "function") {
        currentOptions.onOpen();
      }
    });
  }

  destroy() {
    for (const item of this._activeOverlays.slice()) {
      if (item.overlay.parentNode) document.body.removeChild(item.overlay);
      if (item.container.parentNode) document.body.removeChild(item.container);
    }
    this._activeOverlays = [];
    this.openCount = 0;
    document.body.style.overflow = "";
  }

  getOptionsFromElement(element) {
    const options = {};
    const dataset = element.dataset;

    if (dataset.swnTitle) options.titleText = dataset.swnTitle;
    if (dataset.swnOkText) options.buttonText = dataset.swnOkText;
    if (dataset.swnCancelText) options.cancelText = dataset.swnCancelText;
    if (dataset.swnTemplate) options.template = dataset.swnTemplate;
    if (dataset.swnPosition) options.position = dataset.swnPosition;
    if (dataset.swnBgColor) options.bgColor = dataset.swnBgColor;
    if (dataset.swnBgOpacity)
      options.bgOpacity = parseFloat(dataset.swnBgOpacity);
    if (dataset.swnBgBlur) options.bgBlur = parseInt(dataset.swnBgBlur, 10);
    if (dataset.swnZIndex) options.zIndex = parseInt(dataset.swnZIndex, 10);
    if (dataset.swnCloseOnOverlayClick)
      options.closeOnOverlayClick = dataset.swnCloseOnOverlayClick === "true";
    if (dataset.swnAnimation) {
      try {
        options.animation = JSON.parse(dataset.swnAnimation);
      } catch (e) {
        options.animation = { type: dataset.swnAnimation };
      }
    }

    return options;
  }

  install() {
    window.alert = async (message) => {
      let options = {};
      if (
        document.activeElement &&
        document.activeElement.hasAttribute("data-swn-trigger")
      ) {
        options = this.getOptionsFromElement(document.activeElement);
      }
      await this.show(message, options);
    };

    window.confirm = async (message) => {
      let options = {};
      if (
        document.activeElement &&
        document.activeElement.hasAttribute("data-swn-trigger")
      ) {
        options = this.getOptionsFromElement(document.activeElement);
      }
      return await this.showConfirm(message, options);
    };

    window.prompt = async (message, defaultValue = "") => {
      let options = {};
      if (
        document.activeElement &&
        document.activeElement.hasAttribute("data-swn-trigger")
      ) {
        options = this.getOptionsFromElement(document.activeElement);
      }
      return await this.showPrompt(message, {
        defaultValue,
        ...options,
      });
    };
  }

  uninstall() {
    window.alert = this.originalAlert;
    window.confirm = this.originalConfirm;
    window.prompt = this.originalPrompt;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const templates = document.querySelectorAll("template");
  let hasValidTemplate = false;

  for (const template of templates) {
    if (template.content.querySelector("[data-swn]")) {
      hasValidTemplate = true;
      break;
    }
  }

  const trigger = document.querySelector("[data-swn-trigger]");

  if (hasValidTemplate && trigger) {
    const swn = new SWN();
    swn.install();
  }
});

export default SWN;
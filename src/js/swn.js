import '../css/swn.css';

let _idCounter = 0;
let _globalOpenCount = 0;

function createResult(isConfirmed, value) {
  return {
    isConfirmed: isConfirmed,
    isDismissed: !isConfirmed,
    value: value,
  };
}

function calcStackOffset(position, existingToasts) {
  var offset = 0;
  for (var i = 0; i < existingToasts.length; i++) {
    var t = existingToasts[i];
    var rect = t.container.getBoundingClientRect();
    if (rect.height > 0) {
      offset += rect.height + 8;
    } else {
      offset += 60;
    }
  }
  return offset;
}

function getStackBaseline(position) {
  var topPositions = ["top", "top left", "top right"];
  var bottomPositions = ["bottom", "bottom left", "bottom right"];
  if (topPositions.indexOf(position) !== -1) return "top";
  if (bottomPositions.indexOf(position) !== -1) return "bottom";
  return "top";
}

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
      inputType: options.inputType || "text",
      inputAttributes: options.inputAttributes || {},
      preConfirm: options.preConfirm || null,
      closeOnOverlayClick: options.closeOnOverlayClick !== undefined ? options.closeOnOverlayClick : false,
      showCloseButton: options.showCloseButton || false,
      animation: options.animation || null,
      timer: options.timer || null,
      timerProgressBar: options.timerProgressBar || false,
      html: options.html || false,
      onOpen: options.onOpen || null,
      onClose: options.onClose || null,
    };

    this.originalAlert = window.alert;
    this.originalConfirm = window.confirm;
    this.originalPrompt = window.prompt;

    this._activeOverlays = [];
    this._queueRunning = false;
  }

  get openCount() {
    return this._activeOverlays.length;
  }

  _generateId() {
    return ++_idCounter;
  }

  _getAnimationStyles(animation) {
    if (!animation) return { enter: {}, active: {}, exit: {} };

    var duration = animation.duration || 200;
    var type = animation.type || "fade";

    switch (type) {
      case "fade":
        return {
          enter: { opacity: "0", transition: "opacity " + duration + "ms ease" },
          active: { opacity: "1" },
          exit: { opacity: "0", transition: "opacity " + duration + "ms ease" },
        };
      case "slide-up":
        return {
          enter: { opacity: "0", transform: "translateY(20px)", transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease" },
          active: { opacity: "1", transform: "translateY(0)" },
          exit: { opacity: "0", transform: "translateY(20px)", transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease" },
        };
      case "slide-down":
        return {
          enter: { opacity: "0", transform: "translateY(-20px)", transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease" },
          active: { opacity: "1", transform: "translateY(0)" },
          exit: { opacity: "0", transform: "translateY(-20px)", transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease" },
        };
      case "scale":
        return {
          enter: { opacity: "0", transform: "scale(0.9)", transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease" },
          active: { opacity: "1", transform: "scale(1)" },
          exit: { opacity: "0", transform: "scale(0.9)", transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease" },
        };
      default:
        return { enter: {}, active: {}, exit: {} };
    }
  }

  _getToastPositionStyles(position, offset) {
    var isTop = getStackBaseline(position) === "top";

    var styles = {
      position: "fixed",
      display: "flex",
      zIndex: String((this.options.zIndex || 9999) + 1),
    };

    if (isTop) {
      styles.top = (16 + offset) + "px";
    } else {
      styles.bottom = (16 + offset) + "px";
    }

    switch (position) {
      case "top":
      case "bottom":
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
        break;
      case "top left":
      case "bottom left":
        styles.left = "16px";
        break;
      case "top right":
      case "bottom right":
        styles.right = "16px";
        break;
      case "left":
        styles.left = "16px";
        styles.top = (16 + offset) + "px";
        delete styles.bottom;
        break;
      case "right":
        styles.right = "16px";
        styles.top = (16 + offset) + "px";
        delete styles.bottom;
        break;
      default:
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
    }

    return styles;
  }

  getPositionStyles(position) {
    var styles = {
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
    var wrapper = document.createElement("div");
    wrapper.setAttribute("data-swn-overlay-wrapper", "");

    var wrapperStyles = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: String(options.zIndex),
    };

    if (options.bgBlur > 0) {
      wrapperStyles.backdropFilter = "blur(" + options.bgBlur + "px)";
      wrapperStyles.WebkitBackdropFilter = "blur(" + options.bgBlur + "px)";
    }

    this.applyStyles(wrapper, wrapperStyles);

    var overlay = document.createElement("div");
    overlay.setAttribute("data-swn-overlay", "");

    var overlayStyles = {
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

  _applyInputAttributes(inputEl, attributes) {
    if (!attributes || typeof attributes !== "object") return;
    var keys = Object.keys(attributes);
    for (var i = 0; i < keys.length; i++) {
      inputEl.setAttribute(keys[i], attributes[keys[i]]);
    }
  }

  _createInput(type, options) {
    if (type === "textarea") {
      var ta = document.createElement("textarea");
      ta.setAttribute("data-swn-input", "");
      ta.className = "w-full px-3 py-2 border rounded-md mb-4";
      ta.placeholder = options.inputPlaceholder || "Enter your response...";
      ta.value = options.defaultValue || "";
      this._applyInputAttributes(ta, options.inputAttributes);
      return ta;
    }
    var input = document.createElement("input");
    input.setAttribute("data-swn-input", "");
    input.setAttribute("type", type || "text");
    input.className = "w-full px-3 py-2 border rounded-md mb-4";
    input.placeholder = options.inputPlaceholder || "Enter your response...";
    input.value = options.defaultValue || "";
    this._applyInputAttributes(input, options.inputAttributes);
    return input;
  }

  createNoticeElement(message, type, options) {
    var noticeElement;
    var container = document.createElement("div");
    container.setAttribute("data-swn-container", "");

    var isToast = type === "toast";

    if (isToast) {
      container.setAttribute("role", "status");
      container.setAttribute("aria-live", "polite");
    } else {
      container.setAttribute("role", "dialog");
      container.setAttribute("aria-modal", "true");
    }

    var positionStyles = this.getPositionStyles(options.position);
    positionStyles.zIndex = String(options.zIndex + 1);
    this.applyStyles(container, positionStyles);

    var templateId = options.template
      ? options.template
      : type === "prompt"
      ? "#prompt-template"
      : type === "confirm"
      ? "#confirm-template"
      : isToast
      ? "#toast-template"
      : null;

    var template = null;
    if (templateId) {
      template = document.querySelector(templateId);
    }

    var needsInput = type === "prompt";
    var needsCancel = type === "confirm" || type === "prompt";

    if (template) {
      noticeElement = template.content.cloneNode(true);
    } else {
      noticeElement = document.createElement("div");
      noticeElement.setAttribute("data-swn", "");

      if (isToast) {
        noticeElement.innerHTML =
          '<button data-swn-close type="button" aria-label="Close" style="position:absolute;top:4px;right:8px;background:transparent;border:none;font-size:18px;cursor:pointer;line-height:1;padding:0;color:inherit;opacity:0.5;">\u00d7</button>' +
          '<div data-swn-title></div>' +
          '<div data-swn-body></div>';
      } else if (needsInput) {
        var inputHtml = this._createInput(options.inputType, options).outerHTML;
        noticeElement.innerHTML =
          '<div data-swn-title></div>' +
          '<div data-swn-body></div>' +
          inputHtml +
          '<div data-swn-validation></div>' +
          '<div data-swn-buttons>' +
            '<button data-swn-cancel></button>' +
            '<button data-swn-ok></button>' +
          '</div>';
      } else if (needsCancel) {
        noticeElement.innerHTML =
          '<div data-swn-title></div>' +
          '<div data-swn-body></div>' +
          '<div data-swn-buttons>' +
            '<button data-swn-cancel></button>' +
            '<button data-swn-ok></button>' +
          '</div>';
      } else {
        noticeElement.innerHTML =
          '<div data-swn-title></div>' +
          '<div data-swn-body></div>' +
          '<div data-swn-buttons>' +
            '<button data-swn-ok></button>' +
          '</div>';
      }
    }

    var titleElement = noticeElement.querySelector("[data-swn-title]");
    var bodyElement = noticeElement.querySelector("[data-swn-body]");
    var okButton = noticeElement.querySelector("[data-swn-ok]");
    var cancelButton = noticeElement.querySelector("[data-swn-cancel]");
    var inputElement = noticeElement.querySelector("[data-swn-input]");
    var closeButton = noticeElement.querySelector("[data-swn-close]");
    var validationElement = noticeElement.querySelector("[data-swn-validation]");

    var id = this._generateId();

    if (titleElement) {
      titleElement.textContent = options.titleText;
      titleElement.id = "swn-title-" + id;
      if (!isToast) {
        container.setAttribute("aria-labelledby", titleElement.id);
      }
    }
    if (bodyElement) {
      if (options.html) {
        bodyElement.innerHTML = message;
      } else {
        bodyElement.textContent = message;
      }
      bodyElement.id = "swn-body-" + id;
      if (!isToast) {
        container.setAttribute("aria-describedby", bodyElement.id);
      }
    }

    if (okButton && !isToast) {
      okButton.textContent = options.buttonText;
    }

    if (cancelButton) {
      if (!needsCancel && !isToast) {
        cancelButton.style.display = "none";
      } else {
        cancelButton.textContent = options.cancelText;
        cancelButton.style.display = "";
      }
    }

    if (inputElement && needsInput) {
      if (template) {
        inputElement.placeholder = options.inputPlaceholder;
        inputElement.value = options.defaultValue || "";
        if (options.inputType && options.inputType !== "textarea") {
          inputElement.setAttribute("type", options.inputType);
        }
        this._applyInputAttributes(inputElement, options.inputAttributes);
        inputElement.style.display = "";
      }
    } else if (inputElement) {
      inputElement.style.display = "none";
    }

    if (closeButton) {
      if (options.showCloseButton || isToast) {
        closeButton.style.display = "";
      } else {
        closeButton.style.display = "none";
      }
    }

    if (validationElement) {
      validationElement.textContent = "";
    }

    var notice = noticeElement.querySelector("[data-swn]");
    if (notice) {
      notice.setAttribute("data-swn-type", type);
      notice.setAttribute("data-swn-position", options.position);
      notice.setAttribute("data-swn-bg-color", options.bgColor);
      notice.setAttribute("data-swn-bg-opacity", String(options.bgOpacity));
      notice.setAttribute("data-swn-bg-blur", String(options.bgBlur));
      notice.setAttribute("data-swn-z-index", String(options.zIndex));
    }

    container.appendChild(noticeElement);
    return {
      container: container,
    };
  }

  show(message, options) {
    if (options === undefined) options = {};
    return this._showInternal(message, "alert", options).then(function (result) {
      return undefined;
    });
  }

  showPrompt(message, options) {
    if (options === undefined) options = {};
    return this._showInternal(message, "prompt", options).then(function (result) {
      return result.isConfirmed ? result.value : null;
    });
  }

  showConfirm(message, options) {
    if (options === undefined) options = {};
    return this._showInternal(message, "confirm", options).then(function (result) {
      return result.isConfirmed;
    });
  }

  showToast(message, options) {
    if (options === undefined) options = {};
    return this._showInternal(message, "toast", options).then(function (result) {
      return result;
    });
  }

  showNotice(message, type, callOptions) {
    if (callOptions === undefined) callOptions = {};
    return this._showInternal(message, type, callOptions).then(function (result) {
      if (type === "alert") return undefined;
      if (type === "confirm") return result.isConfirmed;
      if (type === "prompt") return result.isConfirmed ? result.value : null;
      return result;
    });
  }

  fire(options) {
    var type = options.type || "alert";
    var message = options.body !== undefined ? options.body : (options.message || "");
    var callOptions = {};
    var keys = Object.keys(options);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] !== "type" && keys[i] !== "body" && keys[i] !== "message") {
        callOptions[keys[i]] = options[keys[i]];
      }
    }
    return this._showInternal(message, type, callOptions);
  }

  queue(steps) {
    var self = this;
    var results = [];

    function runNext(index) {
      if (index >= steps.length) {
        return Promise.resolve(results);
      }
      return self.fire(steps[index]).then(function (result) {
        results.push(result);
        return runNext(index + 1);
      });
    }

    return runNext(0);
  }

  _showInternal(message, type, callOptions) {
    var self = this;
    var currentOptions = {};
    var optsKeys = Object.keys(this.options);
    for (var i = 0; i < optsKeys.length; i++) {
      currentOptions[optsKeys[i]] = this.options[optsKeys[i]];
    }
    var callKeys = Object.keys(callOptions);
    for (var j = 0; j < callKeys.length; j++) {
      currentOptions[callKeys[j]] = callOptions[callKeys[j]];
    }

    var isToast = type === "toast";

    return new Promise(function (resolve) {
      var previousActiveElement = document.activeElement;
      _globalOpenCount++;

      var result = self.createNoticeElement(message, type, currentOptions);
      var container = result.container;
      var overlay = null;

      var dismissReason = null;

      if (!isToast) {
        overlay = self.createOverlay(currentOptions);
        document.body.appendChild(overlay);
      } else {
        var toastsAtPosition = self._activeOverlays.filter(function (item) {
          return item.type === "toast" && item.currentOptions.position === currentOptions.position;
        });
        var offset = calcStackOffset(currentOptions.position, toastsAtPosition);
        var toastStyles = self._getToastPositionStyles(currentOptions.position, offset);
        self.applyStyles(container, toastStyles);
      }

      document.body.appendChild(container);

      if (!isToast) {
        document.body.style.overflow = "hidden";
      }

      var activeNotice = {
        overlay: overlay,
        container: container,
        currentOptions: currentOptions,
        type: type,
        resolve: resolve,
        previousActiveElement: previousActiveElement,
        handleKeyDown: null,
        timerId: null,
        pauseTimer: null,
        resumeTimer: null,
      };

      self._activeOverlays.push(activeNotice);

      var okButton = container.querySelector("[data-swn-ok]");
      var cancelButton = container.querySelector("[data-swn-cancel]");
      var inputElement = container.querySelector("[data-swn-input]");
      var closeButton = container.querySelector("[data-swn-close]");
      var validationElement = container.querySelector("[data-swn-validation]");
      var timerBarElement = container.querySelector("[data-swn-timer-bar]");

      var focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      var firstFocusableElement = focusableElements[0];
      var lastFocusableElement = focusableElements[focusableElements.length - 1];

      var resolved = false;

      var resolveWithResult = function (resultVal, reason) {
        if (resolved) return;
        resolved = true;
        if (reason) dismissReason = reason;
        cleanup();
        resolve(resultVal);
      };

      var handleConfirm = function () {
        var inputValue = inputElement ? inputElement.value : undefined;

        if (typeof currentOptions.preConfirm === "function" && type === "prompt") {
          var preResult;
          try {
            preResult = currentOptions.preConfirm(inputValue);
          } catch (err) {
            if (validationElement) {
              validationElement.textContent = err.message || String(err);
            }
            return;
          }

          if (preResult && typeof preResult.then === "function") {
            if (okButton) {
              okButton.disabled = true;
              okButton.textContent = "...";
            }
            preResult.then(function (validatedValue) {
              resolveWithResult(createResult(true, validatedValue), "confirm");
            }).catch(function (err) {
              if (okButton) {
                okButton.disabled = false;
                okButton.textContent = currentOptions.buttonText;
              }
              if (validationElement) {
                validationElement.textContent = err.message || String(err);
              }
            });
            return;
          }

          resolveWithResult(createResult(true, preResult !== undefined ? preResult : inputValue), "confirm");
          return;
        }

        if (type === "prompt") {
          resolveWithResult(createResult(true, inputValue), "confirm");
        } else if (type === "confirm") {
          resolveWithResult(createResult(true, true), "confirm");
        } else {
          resolveWithResult(createResult(true, undefined), "confirm");
        }
      };

      var dismiss = function (dismissVal) {
        if (type === "prompt") {
          resolveWithResult(createResult(false, null), dismissVal);
        } else if (type === "confirm") {
          resolveWithResult(createResult(false, false), dismissVal);
        } else {
          resolveWithResult(createResult(false, undefined), dismissVal);
        }
      };

      var cleanup = function () {
        if (activeNotice.handleKeyDown) {
          document.removeEventListener("keydown", activeNotice.handleKeyDown);
        }

        if (activeNotice.timerId) {
          clearTimeout(activeNotice.timerId);
          activeNotice.timerId = null;
        }

        var animation = currentOptions.animation;
        if (animation) {
          var animStyles = self._getAnimationStyles(animation);
          var noticeEl = container.querySelector("[data-swn]") || container;
          if (animStyles.exit) {
            self.applyStyles(noticeEl, animStyles.exit);
          }
          var exitDuration = animation.duration || 200;
          setTimeout(function () {
            if (overlay && overlay.parentNode) overlay.remove();
            if (container.parentNode) container.remove();
          }, exitDuration);
        } else {
          if (overlay && overlay.parentNode) overlay.remove();
          if (container.parentNode) container.remove();
        }

        _globalOpenCount--;
        self._activeOverlays = self._activeOverlays.filter(function (item) { return item.container !== container; });

        if (!isToast) {
          if (_globalOpenCount <= 0) {
            _globalOpenCount = 0;
            document.body.style.overflow = "";
          }
          if (previousActiveElement && typeof previousActiveElement.focus === "function") {
            try {
              previousActiveElement.focus();
            } catch (e) {}
          }
        }

        if (isToast) {
          self._repositionToasts(currentOptions.position);
        }

        self._dispatchEvent(container, "swn:close", { type: type });

        if (typeof currentOptions.onClose === "function") {
          currentOptions.onClose();
        }
      };

      var handleKeyDown;
      if (!isToast) {
        handleKeyDown = function (e) {
          var isTabPressed = e.key === "Tab" || e.keyCode === 9;
          var isEscPressed = e.key === "Escape" || e.keyCode === 27;

          if (isEscPressed) {
            dismiss("esc");
            return;
          }

          if (!isTabPressed) return;

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

        activeNotice.handleKeyDown = handleKeyDown;
        document.addEventListener("keydown", handleKeyDown);
      }

      if (okButton && !isToast) {
        okButton.addEventListener("click", function () {
          handleConfirm();
          self._dispatchEvent(container, "swn:confirm", { type: type });
        });
      }

      if (cancelButton) {
        cancelButton.addEventListener("click", function () {
          dismiss("cancel");
          self._dispatchEvent(container, "swn:cancel", { type: type });
        });
      }

      if (closeButton) {
        closeButton.addEventListener("click", function () {
          dismiss("close");
        });
      }

      if (inputElement && (type === "prompt")) {
        inputElement.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.keyCode === 13) {
            if (inputElement.tagName === "TEXTAREA") return;
            e.preventDefault();
            handleConfirm();
          }
        });
      }

      if (currentOptions.closeOnOverlayClick && overlay) {
        overlay.addEventListener("click", function (e) {
          if (e.target === overlay || e.target.hasAttribute("data-swn-overlay")) {
            dismiss("overlay");
          }
        });
      }

      if (currentOptions.timer && currentOptions.timer > 0) {
        var timerDuration = currentOptions.timer;
        var startTimer = Date.now();
        var remainingTime = timerDuration;

        if (timerBarElement && currentOptions.timerProgressBar) {
          timerBarElement.classList.add("swn-timer-active");
          timerBarElement.style.transition = "none";
          timerBarElement.style.width = "100%";
          requestAnimationFrame(function () {
            timerBarElement.style.transition = "width " + timerDuration + "ms linear";
            timerBarElement.style.width = "0%";
          });
        }

        activeNotice.timerId = setTimeout(function () {
          if (!resolved) {
            dismiss("timer");
          }
        }, timerDuration);

        activeNotice.pauseTimer = function () {
          if (activeNotice.timerId) {
            clearTimeout(activeNotice.timerId);
            activeNotice.timerId = null;
            remainingTime -= (Date.now() - startTimer);
          }
          if (timerBarElement && currentOptions.timerProgressBar) {
            var computedWidth = getComputedStyle(timerBarElement).width;
            timerBarElement.style.transition = "none";
            timerBarElement.style.width = computedWidth;
          }
        };

        activeNotice.resumeTimer = function () {
          startTimer = Date.now();
          if (timerBarElement && currentOptions.timerProgressBar && remainingTime > 0) {
            timerBarElement.style.transition = "width " + remainingTime + "ms linear";
            requestAnimationFrame(function () {
              timerBarElement.style.width = "0%";
            });
          }
          activeNotice.timerId = setTimeout(function () {
            if (!resolved) {
              dismiss("timer");
            }
          }, remainingTime);
        };

        var hoverTarget = isToast ? container : (container.querySelector("[data-swn]") || container);
        hoverTarget.addEventListener("mouseenter", function () {
          if (activeNotice.pauseTimer) activeNotice.pauseTimer();
        });
        hoverTarget.addEventListener("mouseleave", function () {
          if (activeNotice.resumeTimer) activeNotice.resumeTimer();
        });
      }

      if (currentOptions.animation) {
        var animStyles2 = self._getAnimationStyles(currentOptions.animation);
        var noticeEl2 = container.querySelector("[data-swn]") || container;
        if (animStyles2.enter) {
          self.applyStyles(noticeEl2, animStyles2.enter);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              self.applyStyles(noticeEl2, animStyles2.active || {});
            });
          });
        }
      }

      if (!isToast) {
        if (type === "prompt" || (inputElement && type === "prompt")) {
          inputElement.focus();
          if (inputElement.select) inputElement.select();
        } else if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }

      self._dispatchEvent(container, "swn:open", { type: type });

      if (typeof currentOptions.onOpen === "function") {
        currentOptions.onOpen();
      }
    });
  }

  _repositionToasts(position) {
    var toastsAtPosition = this._activeOverlays.filter(function (item) {
      return item.type === "toast" && item.currentOptions.position === position;
    });

    var offset = 0;
    for (var i = 0; i < toastsAtPosition.length; i++) {
      var item = toastsAtPosition[i];
      var rect = item.container.getBoundingClientRect();
      var toastStyles = this._getToastPositionStyles(position, offset);

      var isTop = getStackBaseline(position) === "top";
      var currentTransform = item.container.style.transform || "";

      if (isTop || position === "left" || position === "right") {
        item.container.style.top = toastStyles.top || "";
        item.container.style.bottom = toastStyles.bottom || "";
      } else {
        item.container.style.bottom = toastStyles.bottom || "";
        item.container.style.top = toastStyles.top || "";
      }

      if (toastStyles.left) item.container.style.left = toastStyles.left;
      if (toastStyles.right) item.container.style.right = toastStyles.right;

      var h = rect.height > 0 ? rect.height : 60;
      offset += h + 8;
    }
  }

  _dispatchEvent(element, eventName, detail) {
    var event;
    if (typeof CustomEvent === "function") {
      event = new CustomEvent(eventName, {
        bubbles: true,
        detail: detail || {},
      });
    } else {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(eventName, true, true, detail || {});
    }
    try {
      element.dispatchEvent(event);
    } catch (e) {}
  }

  destroy() {
    for (var i = 0; i < this._activeOverlays.length; i++) {
      var item = this._activeOverlays[i];
      var isToast = item.type === "toast";

      item.resolve(createResult(false, item.type === "prompt" ? null : item.type === "confirm" ? false : undefined));

      if (item.handleKeyDown) {
        document.removeEventListener("keydown", item.handleKeyDown);
      }

      if (item.timerId) {
        clearTimeout(item.timerId);
      }

      if (item.overlay && item.overlay.parentNode) item.overlay.remove();
      if (item.container.parentNode) item.container.remove();

      if (typeof item.currentOptions.onClose === "function") {
        item.currentOptions.onClose();
      }

      _globalOpenCount--;
    }

    this._activeOverlays = [];

    if (_globalOpenCount <= 0) {
      _globalOpenCount = 0;
      document.body.style.overflow = "";
    }
  }

  getOptionsFromElement(element) {
    var options = {};
    var dataset = element.dataset;

    if (dataset.swnTitle) options.titleText = dataset.swnTitle;
    if (dataset.swnOkText) options.buttonText = dataset.swnOkText;
    if (dataset.swnCancelText) options.cancelText = dataset.swnCancelText;
    if (dataset.swnTemplate) options.template = dataset.swnTemplate;
    if (dataset.swnPosition) options.position = dataset.swnPosition;
    if (dataset.swnBgColor) options.bgColor = dataset.swnBgColor;
    if (dataset.swnBgOpacity) options.bgOpacity = parseFloat(dataset.swnBgOpacity);
    if (dataset.swnBgBlur) options.bgBlur = parseInt(dataset.swnBgBlur, 10);
    if (dataset.swnZIndex) options.zIndex = parseInt(dataset.swnZIndex, 10);
    if (dataset.swnCloseOnOverlayClick) options.closeOnOverlayClick = dataset.swnCloseOnOverlayClick === "true";
    if (dataset.swnShowCloseButton) options.showCloseButton = dataset.swnShowCloseButton === "true";
    if (dataset.swnHtml) options.html = dataset.swnHtml === "true";
    if (dataset.swnTimer) options.timer = parseInt(dataset.swnTimer, 10);
    if (dataset.swnTimerProgressBar) options.timerProgressBar = dataset.swnTimerProgressBar === "true";
    if (dataset.swnInputType) options.inputType = dataset.swnInputType;
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
    var self = this;

    window.alert = async function (message) {
      var options = {};
      if (document.activeElement && document.activeElement.hasAttribute("data-swn-trigger")) {
        options = self.getOptionsFromElement(document.activeElement);
      }
      await self.show(message, options);
    };

    window.confirm = async function (message) {
      var options = {};
      if (document.activeElement && document.activeElement.hasAttribute("data-swn-trigger")) {
        options = self.getOptionsFromElement(document.activeElement);
      }
      return await self.showConfirm(message, options);
    };

    window.prompt = async function (message, defaultValue) {
      var options = {};
      if (document.activeElement && document.activeElement.hasAttribute("data-swn-trigger")) {
        options = self.getOptionsFromElement(document.activeElement);
      }
      return await self.showPrompt(message, {
        defaultValue: defaultValue !== undefined ? defaultValue : "",
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

document.addEventListener("DOMContentLoaded", function () {
  var templates = document.querySelectorAll("template");
  var hasValidTemplate = false;

  for (var i = 0; i < templates.length; i++) {
    if (templates[i].content.querySelector("[data-swn]")) {
      hasValidTemplate = true;
      break;
    }
  }

  var triggers = document.querySelectorAll("[data-swn-trigger]");

  if (hasValidTemplate && triggers.length > 0) {
    var swn = new SWN();
    swn.install();
  }
});

export default SWN;
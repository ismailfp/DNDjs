/* 
DNDAlert is a simple JavaScript library alert for web developers.
by İsmail Döndü - 2023
*/

class ALERT_CONTEXT {
  constructor(props = {}) {
    this._context = { ...props };

    this.CONTEXT_QUERY_NAME = {
      message: "message",
      title: "title",
      type: "type",
      html: "html",
      buttons: "buttons",
      closeBackgroundClick: "closeBackgroundClick",
      portalElement: "portalElement",
      text_align: "text_align",
      theme: "theme",
      onOpen: "onOpen",
      onClose: "onClose",
      opacity: "opacity",
      autoCloseDuration: "autoCloseDuration",
      draggable: "draggable",

      containerRef: "containerRef",
      content_boxRef: "content_boxRef",
      alert_titleRef: "alert_titleRef",
      alert_messageRef: "alert_messageRef",
      headerRef: "headerRef",
      button_groupRef: "button_groupRef",
    };
    this.CONTEXT_DEFAULT_VALUES = {
      closeBackgroundClick: true,
      type: false,
      html: false,
      autoCloseDuration: false,
      buttons: [],
      text_align: "left",
      opacity: 1,
      portalElement: document.body,
      draggable: false,

      containerRef: null,
      content_boxRef: null,
      alert_titleRef: null,
      alert_messageRef: null,
      headerRef: null,
      button_groupRef: null,
    };
    this.CONTEXT_PRIVATE_RESPONSE_LIST = [
      this.CONTEXT_QUERY_NAME.closeBackgroundClick,
      this.CONTEXT_QUERY_NAME.type,
      this.CONTEXT_QUERY_NAME.html,
      this.CONTEXT_QUERY_NAME.buttons,
      this.CONTEXT_QUERY_NAME.text_align,
      this.CONTEXT_QUERY_NAME.opacity,
      this.CONTEXT_QUERY_NAME.portalElement,
      this.CONTEXT_QUERY_NAME.containerRef,
      this.CONTEXT_QUERY_NAME.content_boxRef,
      this.CONTEXT_QUERY_NAME.alert_titleRef,
      this.CONTEXT_QUERY_NAME.alert_messageRef,
      this.CONTEXT_QUERY_NAME.headerRef,
      this.CONTEXT_QUERY_NAME.button_groupRef,
      this.CONTEXT_QUERY_NAME.autoCloseDuration,
      this.CONTEXT_QUERY_NAME.draggable,
    ];
  }

  CONTEXT_QUERY_NAME_CHECKER(key) {
    if (this.CONTEXT_QUERY_NAME[key] === undefined) return false;
  }

  CONTEXT_PROVIDER_SET(key, value) {
    this.CONTEXT_QUERY_NAME_CHECKER(key);
    this._context[key] = value;
  }
  CONTEXT_PROVIDER_GET(key) {
    this.CONTEXT_QUERY_NAME_CHECKER(key);

    if (this.CONTEXT_PRIVATE_RESPONSE_LIST.includes(key)) {
      if (this._context[key] === undefined)
        return this.CONTEXT_DEFAULT_VALUES[key];
      return this._context[key];
    } else {
      return this._context[key];
    }
  }
  CONTEXT_PROVIDER_REMOVE(key) {
    this.CONTEXT_QUERY_NAME_CHECKER(key);
    delete this._context[key];
  }
  CONTEXT_PROVIDER_CLEAR() {
    this._context = {};
  }
  CONTEXT_PROVIDER_GET_ALL() {
    return this._context;
  }
}

class DNDAlert extends ALERT_CONTEXT {
  constructor(props) {
    super(props); // <- ALERT_CONTEXT
    this.STARTER();
  }

  INIT() {
    this.createMainElements();

    const CONTENT_BOX = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.content_boxRef
    );
    const ALERT_MESSAGE = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.alert_messageRef
    );
    const CONTAINER = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.containerRef
    );
    const HEADER = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.headerRef);
    const BUTTON_GROUP = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.button_groupRef
    );

    this.contextBoxDrag();
    this.appendChild(CONTENT_BOX, [HEADER, ALERT_MESSAGE]);
    if (BUTTON_GROUP) {
      this.appendChild(CONTENT_BOX, [BUTTON_GROUP]);
    }

    this.appendChild(CONTAINER, [CONTENT_BOX]);

    this.containerClickClose(CONTAINER);
  }
  DRAW() {
    let onOpen = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.onOpen);
    let autoCloseDuration = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.autoCloseDuration
    );
    this.setBodyOverflow(this.OVERFLOW_ENUM.HIDDEN);
    this.appendChild(this.BODY, [
      this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.containerRef),
    ]);
    if (onOpen) {
      onOpen(this.bagCreator());
    }
    if (
      autoCloseDuration &&
      Number.isInteger(autoCloseDuration) &&
      autoCloseDuration > 0
    ) {
      setTimeout(() => {
        if (!this.IS_CLOSE) this.removeContainer();
      }, autoCloseDuration);
    }
  }

  enumLoader() {
    this.OVERFLOW_ENUM = {
      HIDDEN: "hidden",
      AUTO: "auto",
    };
    this.THEME_ENUM = {
      WHITE: "white",
      DARK: "dark",
    };
    this.TYPE_LIST = ["success", "error", "warning", "info"];
  }

  themeLoader() {
    const theme = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.theme);
    switch (theme) {
      case this.THEME_ENUM.WHITE:
        this.THEME = this.THEME_ENUM.WHITE;
        break;
      case this.THEME_ENUM.DARK:
        this.THEME = this.THEME_ENUM.DARK;
        break;
      default:
        this.THEME = this.THEME_ENUM.WHITE;
        break;
    }
  }

  PRE_INIT() {
    this.IS_CLOSE = false; //  autoCloseDuration and onClose avoid conflict
    this.CREATED_TIME = new Date().getTime();

    this.enumLoader();
    this.classListLoader();
    this.errorOptionsLoader();
    this.themeLoader();
    this.svgLoader();

    this.BODY = this.getBodyElement();
  }

  STARTER() {
    this.PRE_INIT();
    this.ERROR_CONTROL();
    this.INIT();
    this.DRAW();
  }

  createContainer() {
    let container = document.createElement("div");
    container.classList.add(this.CLASS_LIST.container);
    this.CONTEXT_PROVIDER_SET("containerRef", container);
  }
  createContentBox() {
    let opacity = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.opacity);
    let content_box = document.createElement("div");
    content_box.classList.add(this.CLASS_LIST[this.THEME].content);
    content_box.style.opacity = opacity;
    this.CONTEXT_PROVIDER_SET("content_boxRef", content_box);
  }
  createAlertTitle() {
    let title = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.title);
    let alert_title = document.createElement("h1");
    alert_title.classList.add(this.CLASS_LIST[this.THEME].title);
    alert_title.innerText = title;
    this.CONTEXT_PROVIDER_SET("alert_titleRef", alert_title);
  }

  createSvgElement() {
    let type = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.type);
    if (!type) return;
    let svgDiv = document.createElement("div");
    svgDiv.classList.add(this.CLASS_LIST[this.THEME].svg);
    svgDiv.innerHTML = this.SVG_LIST[type];
    return svgDiv;
  }

  createAlertMessage() {
    let message = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.message);
    let type = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.type);
    let html = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.html);
    let text_align = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.text_align
    );
    let alert_message = document.createElement("p");
    alert_message.classList.add(this.CLASS_LIST[this.THEME].message);

    if (html) {
      alert_message.innerHTML = message;
    } else {
      alert_message.innerText = message;
    }

    alert_message.style.textAlign = text_align;

    if (type) alert_message.prepend(this.createSvgElement());

    this.CONTEXT_PROVIDER_SET("alert_messageRef", alert_message);
  }

  createTopRightCloseButton() {
    let close_button = document.createElement("button");
    close_button.classList.add(this.CLASS_LIST[this.THEME].close_button);
    close_button.innerHTML = this.SVG_LIST.close;
    if (this.THEME === this.THEME_ENUM.DARK) {
      close_button.style.color = "#000";
    }
    close_button.addEventListener("click", () => {
      this.removeContainer();
    });
    return close_button;
  }

  createHeader() {
    let header = document.createElement("div");
    header.classList.add(this.CLASS_LIST[this.THEME].header);
    header.appendChild(
      this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.alert_titleRef)
    );
    header.appendChild(this.createTopRightCloseButton());

    this.CONTEXT_PROVIDER_SET("headerRef", header);
  }

  bagCreator() {
    let CONTEXT = this.CONTEXT_PROVIDER_GET_ALL();
    delete CONTEXT.theme;
    const BAG_ELEMENT = {
      CLOSE_MODAL: () => {
        this.removeContainer();
      },
      PROPETIES: {
        CREATED_TIME: this.CREATED_TIME,
        THEME: this.THEME,
        CONTEXT,
      },
    };

    return BAG_ELEMENT;
  }

  createButtonGroup() {
    let buttons = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.buttons);
    if (buttons.length === 0) return false;

    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add(this.CLASS_LIST[this.THEME].button_group);

    buttons.forEach((button) => {
      let className = button.class || this.CLASS_LIST[this.THEME].button;
      let buttonElement = document.createElement("button");
      buttonElement.innerText = button.text;
      buttonElement.className = className;
      buttonElement.addEventListener("click", async () => {
        await button.click(this.bagCreator());
      });
      buttonGroup.appendChild(buttonElement);
    });

    this.CONTEXT_PROVIDER_SET("button_groupRef", buttonGroup);
  }

  createMainElements() {
    this.createContainer();
    this.createContentBox();
    this.createAlertTitle();
    this.createAlertMessage();
    this.createHeader();
    this.createButtonGroup();
  }

  ERROR_CONTROL() {
    this.ERROR_PROCESSOR.forEach((error) => {
      if (error.condition) {
        error.success();
      }
    });
    this.button_ERROR_CONTROL();
  }
  button_ERROR_CONTROL() {
    let buttons = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.buttons);
    if (!Array.isArray(buttons) && buttons) {
      throw new Error(this.ERROR_LIST.buttons_array);
    } else if (buttons.length > 0) {
      buttons.forEach((button) => {
        if (!button.text) {
          throw new Error(this.ERROR_LIST.button_text);
        }
        if (!button.click) {
          throw new Error(this.ERROR_LIST.button_click);
        }
        if (typeof button.click !== "function") {
          throw new Error(this.ERROR_LIST.button_click_type);
        }
      });
    } else {
      return false;
    }
  }

  containerClickClose() {
    let closeBackgroundClick = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.closeBackgroundClick
    );

    if (closeBackgroundClick) {
      this.CONTEXT_PROVIDER_GET(
        this.CONTEXT_QUERY_NAME.containerRef
      ).addEventListener("click", (e) => {
        if (e.target.classList.contains(this.CLASS_LIST.container)) {
          this.removeContainer();
        }
      });
    }
  }

  contextBoxDrag() {
    let contextBox = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.content_boxRef
    );

    let header = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.headerRef);
    let draggable = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.draggable
    );

    const defaultPosition = {
      x: contextBox.offsetLeft,
      y: contextBox.offsetTop,
    };

    if (draggable) {
      window.addEventListener("resize", () => {
        let viewPortWidth = window.innerWidth;

        if (viewPortWidth <= 700) {
          contextBox.position = "relative";
          contextBox.style.left = defaultPosition.x + "px";
          contextBox.style.top = defaultPosition.y + "px";
          return false;
        }
      });
      header.addEventListener("mousedown", (e) => {
        let viewPortWidth = window.innerWidth;
        if (viewPortWidth <= 700) return false;

        contextBox.style.position = "absolute";
        contextBox.style.zIndex = 9999;
        let shiftX = e.clientX - contextBox.getBoundingClientRect().left;
        let shiftY = e.clientY - contextBox.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
          contextBox.style.left = pageX - shiftX + "px";
          contextBox.style.top = pageY - shiftY + "px";
        }
        moveAt(e.pageX, e.pageY);

        function onMouseMove(e) {
          moveAt(e.pageX, e.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        contextBox.onmouseup = function () {
          document.removeEventListener("mousemove", onMouseMove);
        };

        contextBox.ondragstart = function () {
          return false;
        };
      });

      let title = this.CONTEXT_PROVIDER_GET(
        this.CONTEXT_QUERY_NAME.alert_titleRef
      );
      title.style.cursor = "auto";
      header.style.cursor = "move";
    }
  }

  getBodyElement() {
    let portalElement = this.CONTEXT_PROVIDER_GET(
      this.CONTEXT_QUERY_NAME.portalElement
    );

    return portalElement;
  }

  classListLoader() {
    this.CLASS_LIST = {
      container: "dnd-alert-container",
      white: {
        content: "dnd-alert-content-box",
        title: "dnd-alert-title",
        message: "dnd-alert-message",
        close_button: "dnd-alert-close-button",
        header: "dnd-alert-header",
        svg: "dnd-alert-svg",
        button_group: "dnd-alert-button-group",
        button: "dnd-alert-default-button",
      },
      dark: {
        content: "dnd-alert-content-box-dark",
        title: "dnd-alert-title-dark",
        message: "dnd-alert-message-dark",
        close_button: "dnd-alert-close-button-dark",
        header: "dnd-alert-header-dark",
        svg: "dnd-alert-svg-dark",
        button_group: "dnd-alert-button-group-dark",
        button: "dnd-alert-default-button-dark",
      },
    };
  }

  appendChild(container, [...children]) {
    children.forEach((child) => {
      container.appendChild(child);
    });
  }

  errorOptionsLoader() {
    let props = this.CONTEXT_PROVIDER_GET_ALL();

    this.ERROR_PREFIX = "DNDAlert: ";
    this.ERROR_LIST = {
      title: this.ERROR_PREFIX + "Title is required.",
      message: this.ERROR_PREFIX + "Message is required.",
      portalElement: this.ERROR_PREFIX + "Portal element not found.",
      type:
        this.ERROR_PREFIX +
        "Type is not valid. Type must be one of these: " +
        this.TYPE_LIST.join(", "),
      buttons_array: this.ERROR_PREFIX + "Buttons must be an array.",
      button_text: this.ERROR_PREFIX + "Button text is required.",
      button_click: this.ERROR_PREFIX + "Button click is required.",
      button_click_type: this.ERROR_PREFIX + "Button click must be a function.",
      theme:
        this.ERROR_PREFIX +
        "Theme is not valid. Theme must be one of these: " +
        Object.values(this.THEME_ENUM).join(", "),
      overflow: this.ERROR_PREFIX + "Overflow is not valid.",
      onOpen: this.ERROR_PREFIX + "onOpen must be a function.",
      onClose: this.ERROR_PREFIX + "onClose must be a function.",
      opacity: this.ERROR_PREFIX + "Opacity must be between 0 and 1.",
    };
    this.ERROR_PROCESSOR = [
      {
        condition: eval("!props.title"),
        success: () => {
          throw new Error(this.ERROR_LIST.title);
        },
      },
      {
        condition: eval("!props.message"),
        success: () => {
          throw new Error(this.ERROR_LIST.message);
        },
      },
      {
        condition: eval(
          "props.portalElement && props.portalElement instanceof Element === false"
        ),
        success: () => {
          throw new Error(this.ERROR_LIST.portalElement);
        },
      },
      {
        condition: eval("props.type && !this.TYPE_LIST.includes(props.type)"),
        success: () => {
          throw new Error(this.ERROR_LIST.type);
        },
      },
      {
        condition: eval(
          "props.theme && !Object.values(this.THEME_ENUM).includes(props.theme)"
        ),
        success: () => {
          throw new Error(this.ERROR_LIST.theme);
        },
      },
      {
        condition: eval("props.onOpen && typeof props.onOpen !== 'function'"),
        success: () => {
          throw new Error(this.ERROR_LIST.onOpen);
        },
      },
      {
        condition: eval("props.onClose && typeof props.onClose !== 'function'"),
        success: () => {
          throw new Error(this.ERROR_LIST.onClose);
        },
      },
      {
        condition: eval(
          "props.opacity && (props.opacity <= 0 || props.opacity > 1)"
        ),
        success: () => {
          throw new Error(this.ERROR_LIST.opacity);
        },
      },
    ];
  }

  svgLoader() {
    let theme = this.THEME;
    this.SVG_COLOR_LIST = {
      white: {
        success: "#0ca678",
        error: "#e74c3c",
        warning: "#fab005",
        info: "#3498db",
        close: "#212529",
      },
      dark: {
        success: "#40c057",
        error: "#ff6b6b",
        warning: "#fcc419",
        info: "#3bc9db",
        close: "#fff",
      },
    };
    this.SVG_LIST = {
      success: ` 
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke=${this.SVG_COLOR_LIST[theme].success} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      `,
      error: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke=${this.SVG_COLOR_LIST[theme].error} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      `,
      warning: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke=${this.SVG_COLOR_LIST[theme].warning} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      `,
      info: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke=${this.SVG_COLOR_LIST[theme].info} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      `,
      close: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${this.SVG_COLOR_LIST[theme].close}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      `,
    };
  }

  removeContainer() {
    this.setBodyOverflow(this.OVERFLOW_ENUM.AUTO);
    this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.containerRef).remove();

    let onClose = this.CONTEXT_PROVIDER_GET(this.CONTEXT_QUERY_NAME.onClose);
    if (onClose && !this.IS_CLOSE) {
      this.IS_CLOSE = true;
      onClose(this.bagCreator());
    }
  }
  setBodyOverflow(ENUM_VALUE) {
    if (Object.values(this.OVERFLOW_ENUM).includes(ENUM_VALUE)) {
      this.BODY.style.overflow = ENUM_VALUE;
    } else {
      throw new Error(this.ERROR_LIST.overflow);
    }
  }
}

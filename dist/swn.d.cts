declare namespace SWN {
  type NoticeType = 'alert' | 'confirm' | 'prompt' | 'toast';
  type Position = 'center' | 'top' | 'top left' | 'top right' | 'bottom' | 'bottom left' | 'bottom right' | 'left' | 'right';
  type InputType = 'text' | 'email' | 'password' | 'number' | 'textarea';
  interface Animation { type?: 'fade' | 'slide-up' | 'slide-down' | 'scale'; duration?: number; }
  interface SwNResult<T = unknown> { isConfirmed: boolean; isDismissed: boolean; value: T; }
  interface Options<T = string> {
    titleText?: string; buttonText?: string; cancelText?: string; template?: string | null;
    position?: Position; bgColor?: string; bgOpacity?: number; bgBlur?: number; zIndex?: number;
    inputPlaceholder?: string; defaultValue?: string | number; inputType?: InputType;
    inputAttributes?: Record<string, string | number | boolean | null | undefined>;
    preConfirm?: ((value: string) => T | undefined | PromiseLike<T | undefined>) | null;
    closeOnOverlayClick?: boolean; showCloseButton?: boolean; animation?: Animation | null;
    timer?: number | null; timerProgressBar?: boolean; html?: boolean;
    onOpen?: (() => void) | null; onClose?: (() => void) | null;
  }
  interface FireOptions<T = string> extends Options<T> { type?: NoticeType; body?: string; message?: string; }
}

declare class SWN<T = string> {
  constructor(options?: SWN.Options<T>);
  options: SWN.Options<T>;
  readonly openCount: number;
  originalAlert: typeof window.alert | undefined;
  originalConfirm: typeof window.confirm | undefined;
  originalPrompt: typeof window.prompt | undefined;
  show(message: string, options?: SWN.Options<unknown>): Promise<undefined>;
  showConfirm(message: string, options?: SWN.Options<unknown>): Promise<boolean>;
  showPrompt<U = T>(message: string, options?: SWN.Options<U>): Promise<U | string | null>;
  showToast(message: string, options?: SWN.Options<unknown>): Promise<SWN.SwNResult<undefined>>;
  showNotice(message: string, type: SWN.NoticeType, options?: SWN.Options<unknown>): Promise<unknown>;
  fire<U = T>(options?: SWN.FireOptions<U>): Promise<SWN.SwNResult<U | string | boolean | null | undefined>>;
  queue(steps: SWN.FireOptions<unknown>[]): Promise<SWN.SwNResult[]>;
  install(): void;
  uninstall(): void;
  destroy(): void;
  getOptionsFromElement(element: HTMLElement): SWN.Options<unknown>;
  getPositionStyles(position: SWN.Position): Partial<CSSStyleDeclaration>;
  applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void;
  createOverlay(options: SWN.Options<unknown>): HTMLDivElement;
  createNoticeElement(message: string, type: SWN.NoticeType, options: SWN.Options<unknown>): { container: HTMLDivElement };
}

export = SWN;

---
name: senangwebs-notices
description: Custom alert, confirm, prompt, toast, and queued dialogs with a template-driven API.
version: 2.0.2
package: senangwebs-notices
---

# SenangWebs Notices (SWN)

## Quick Reference

- **Purpose**: Replace native dialogs and display modal notices or stackable toasts
- **Source**: `src/js/swn.js` and `src/css/swn.css`
- **Build output**: UMD `dist/swn.js` / `dist/swn.min.js`, ESM `dist/swn.mjs`, CommonJS `dist/swn.cjs`, CSS, source maps, and TypeScript declarations
- **Dependencies**: None at runtime
- **Validation**: `npm run build`, `npm test`, `npm run test:package`, `npm run test:browser`, and `npm audit --audit-level=high`. Obtain user permission before running unit tests unless already authorized in the session.

## Workflow

Work from the repository root. Read `README.md`, `package.json`, and the relevant source before editing. Preserve the instance-based API, existing `data-swn-*` attributes, and backward-compatible result shapes. Run `npm run build` after source or CSS changes because `dist/` is published.

## JavaScript API

Create an instance before calling methods:

```js
const swn = new SWN({
  titleText: "Notice",
  position: "center",
});
```

### Convenience Methods

```js
await swn.show("Saved");                         // undefined
const confirmed = await swn.showConfirm("OK?"); // boolean
const value = await swn.showPrompt("Name?");     // string | null
const result = await swn.showToast("Saved", {
  position: "top right",
  timer: 3000,
});
```

### Structured Results

```js
const result = await swn.fire({
  type: "confirm",
  body: "Delete this item?",
  titleText: "Confirm",
  buttonText: "Delete",
  cancelText: "Cancel",
});

// { isConfirmed: boolean, isDismissed: boolean, value: any }
```

Valid `type` values are `alert`, `confirm`, `prompt`, and `toast`.

### Queue and Lifecycle

```js
const results = await swn.queue([
  { type: "confirm", body: "Continue?" },
  { type: "prompt", body: "Enter a name" },
]);

swn.install();   // replace window.alert/confirm/prompt with async functions
swn.uninstall(); // restore the original browser functions
swn.destroy();   // close notices owned by this instance
```

### Custom Events

`swn:open`, `swn:close`, `swn:confirm`, `swn:cancel`

## Options Reference

| Option | Values | Description |
|---|---|---|
| `titleText` | string | Notice title |
| `buttonText` | string | Confirm button label |
| `cancelText` | string | Cancel button label |
| `position` | `center`, `top`, `top left`, `top right`, `bottom`, `bottom left`, `bottom right`, `left`, `right` | Notice position |
| `animation` | `{ type, duration? }` | `fade`, `slide-up`, `slide-down`, or `scale` |
| `timer` | number | Auto-dismiss duration in milliseconds |
| `timerProgressBar` | boolean | Animate `[data-swn-timer-bar]` when present |
| `showCloseButton` | boolean | Show `[data-swn-close]` |
| `closeOnOverlayClick` | boolean | Dismiss a modal from its overlay |
| `inputType` | `text`, `email`, `password`, `number`, `textarea` | Prompt input type |
| `inputPlaceholder` | string | Prompt placeholder |
| `inputAttributes` | object | Attributes applied to the prompt control |
| `preConfirm` | function | Sync or async prompt validation/transformation |
| `html` | boolean | Render the body as HTML instead of text |
| `template` | string | CSS selector for a `<template>` element |
| `bgColor`, `bgOpacity`, `bgBlur` | color/number | Modal overlay appearance |
| `zIndex` | number | Overlay stacking level |
| `onOpen`, `onClose` | function | Lifecycle callbacks |

## Implementation Guidance

- Keep modal scroll locking global across instances; toasts must not lock body scrolling.
- Restore the original inline `body.style.overflow` after the last modal closes.
- Keep toast stacking independent for each position.
- Coordinate ownership across instances and module formats; only the top modal handles keyboard input.
- Use the shared finalization path for every dismissal, including destruction, and ignore late async validation.
- Destruction stops existing queues; normal dismissal continues them. Instances remain reusable.
- A rejected or thrown `preConfirm` must leave the prompt open and show validation text.
- Preserve focus trapping, Escape dismissal, and focus restoration for modals.
- Treat `html: true` as trusted-content mode; plain text is the safe default.
- Verify `install()` and `uninstall()` as a round trip when changing native-dialog integration.

## Validation

```bash
npm run build
npm test
npm run test:package
npm run test:browser
npm audit --audit-level=high
```

Also exercise the affected flow in `examples/index.html` or `examples/simple.html` for DOM behavior that the build cannot validate.

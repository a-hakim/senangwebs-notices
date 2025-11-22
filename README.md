# SenangWebs Notices (SWN)

SenangWebs Notices (SWN) is a lightweight JavaScript library that replaces native browser dialogs (alert, confirm, prompt) with customizable, modern-looking notifications. It provides a flexible way to create stylish modal dialogs with various positioning options and visual effects.

## Features

- Replace native browser dialogs (alert, confirm, prompt) with customizable alternatives
- Multiple positioning options (center, top, bottom, corners, etc.)
- Backdrop blur effect support
- Customizable overlay colors and opacity
- Template-based customization
- Promise-based async/await support
- Focus management for accessibility
- No external dependencies

## Installation

### Using npm

```bash
npm install senangwebs-notices
```

### Using a CDN

Include SenangWebs Notices directly in your HTML file using unpkg:

```html
<script src="https://unpkg.com/senangwebs-notices@latest/dist/swn.js"></script>
```

## Usage

1. Initialize the library:

```javascript
const notices = new SWN({
  // Optional configuration
  titleText: "Custom Title",
  buttonText: "OK",
  cancelText: "Cancel",
  position: "center",
  bgColor: "#000000",
  bgOpacity: 0.5,
  bgBlur: 3,
  zIndex: 9999,
});

// Replace native dialogs (optional)
notices.install();
```

2. Use directly or through native dialog functions:

```javascript
// Using native functions (after install())
alert("Hello World!");
const confirmed = await confirm("Are you sure?");
const name = await prompt("Enter your name:", "John Doe");

// Using library methods directly
await notices.show("Hello World!");
const confirmed = await notices.showConfirm("Are you sure?");
const name = await notices.showPrompt("Enter your name:");
```

3. Custom template example:

```html
<template id="custom-template">
  <div data-swn class="your-custom-classes">
    <div data-swn-title></div>
    <div data-swn-body></div>
    <div data-swn-buttons>
      <button data-swn-cancel></button>
      <button data-swn-ok></button>
    </div>
  </div>
</template>

<script>
  const notices = new SWN({
    template: "#custom-template",
  });
</script>
```

### 4. Auto-Initialization via HTML Attributes

You can automatically initialize the library without writing any JavaScript by using HTML attributes.

1.  **Create a Template**: Define a template with the `data-swn` attribute on a child element.
2.  **Add Triggers**: Add `data-swn-trigger` to any element (e.g., a button) and configure options using `data-swn-*` attributes.

**Example:**

```html
<!-- Template -->
<template id="my-notice">
  <div data-swn class="custom-modal">
    <div data-swn-title></div>
    <div data-swn-body></div>
    <!-- Input is automatically shown for prompt() -->
    <input type="text" data-swn-input class="custom-input" />
    <div data-swn-buttons>
      <!-- Cancel button is automatically shown for confirm() and prompt() -->
      <button data-swn-cancel>Cancel</button>
      <button data-swn-ok>OK</button>
    </div>
  </div>
</template>

<!-- Trigger Button -->
<button
  onclick="alert('Hello World!')"
  data-swn-trigger
  data-swn-template="#my-notice"
  data-swn-title="My Custom Alert"
  data-swn-position="top-right"
  data-swn-ok-text="Got it!"
>
  Show Alert
</button>
```

**Supported Attributes on Trigger:**

- `data-swn-title`: Custom title text
- `data-swn-ok-text`: OK button text
- `data-swn-cancel-text`: Cancel button text
- `data-swn-template`: Selector for the template to use (e.g., `#my-notice`)
- `data-swn-position`: Position of the modal (e.g., `center`, `top right`)
- `data-swn-bg-color`: Overlay background color
- `data-swn-bg-opacity`: Overlay opacity
- `data-swn-bg-blur`: Overlay blur amount
- `data-swn-z-index`: Z-index of the modal

**Note:** When using auto-initialization, the library dynamically resolves options from the element that triggered the alert/confirm/prompt. This means you can have multiple buttons with different configurations (e.g., different positions or titles) all using the same global `alert()` function.

## Configuration Options

### Initialization Options

```javascript
const notices = new SWN({
  titleText: "Notice", // Default title
  buttonText: "OK", // Text for OK button
  cancelText: "Cancel", // Text for Cancel button
  template: "#custom-template", // Template selector
  position: "center", // Dialog position
  bgColor: "#000000", // Overlay color
  bgOpacity: 0.5, // Overlay opacity (0-1)
  bgBlur: 0, // Background blur in pixels
  zIndex: 9999, // Base z-index
  inputPlaceholder: "Enter your response...", // Prompt input placeholder
  defaultValue: "", // Default value for prompt input
});
```

### Supported Positions

- `center` (default): Center of the screen
- `top`: Top center
- `top left`: Top left corner
- `top right`: Top right corner
- `bottom`: Bottom center
- `bottom left`: Bottom left corner
- `bottom right`: Bottom right corner
- `left`: Middle left
- `right`: Middle right

### Data Attributes

The library uses these data attributes for templating:

- `data-swn`: Main notice container
- `data-swn-title`: Title container
- `data-swn-body`: Message body container
- `data-swn-buttons`: Buttons container
- `data-swn-ok`: OK button
- `data-swn-cancel`: Cancel button (for confirm/prompt)
- `data-swn-input`: Input field (for prompt)

## Methods

- `show(message)`: Display an alert dialog
- `showConfirm(message)`: Display a confirmation dialog
- `showPrompt(message)`: Display a prompt dialog
- `install()`: Replace native dialog functions
- `uninstall()`: Restore native dialog functions

## Browser Support

SenangWebs Notices works on all modern browsers that support:

- ES6+ features (Promise, async/await)
- CSS Flexbox
- backdrop-filter (optional, for blur effects)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Inspired by the need for more customizable dialog alternatives
- Thanks to all contributors who have helped improve this library

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

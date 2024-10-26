[![SenangWebs](https://raw.githubusercontent.com/a-hakim/senangwebs-notices/refs/heads/main/src/sw_banner.webp)](https://use.senangwebs.com)
Learn more at [SenangWebs.com](https://use.senangwebs.com)

# SenangWebs Notices (SWN)

SenangWebs Notices (SWN) is a lightweight JavaScript library that replaces native browser dialogs (alert, confirm, prompt) with customizable, modern-looking notifications. It provides a flexible way to create stylish modal dialogs with various positioning options and visual effects.

## Features

- Replace native browser dialogs with customizable alternatives
- Support for alert(), confirm(), and prompt() replacements
- Customizable positioning and styling via data attributes
- Background blur effects and overlay customization
- Flexible templating system
- Promises-based API
- Responsive design support
- No dependencies required

## Installation

### Using npm

```bash
npm install senangwebs-notice
```

### Using a CDN

Include SenangWebs Notices directly in your HTML file using unpkg:

```html
<script src="https://unpkg.com/senangwebs-notice@latest/dist/swn.js"></script>
```

## Usage

1. Include the JavaScript file in your HTML:

```html
<!-- If installed via npm -->
<script src="path/to/swn.js"></script>

<!-- Or if using unpkg -->
<script src="https://unpkg.com/senangwebs-notice@latest/dist/swn.js"></script>
```

2. Initialize the library:

```javascript
const notice = new SenangWebsNotice({
    // Optional global configuration
    position: 'center',
    bgColor: '#000000',
    bgOpacity: 0.5,
    bgBlur: 3,
    zIndex: 9999
});

// Replace native dialogs
notice.install();
```

3. Create a custom template (optional):

```html
<template id="custom-notice">
    <div data-swn 
         data-swn-position="center"
         data-swn-bg-color="#000000"
         data-swn-bg-opacity="0.5"
         data-swn-bg-blur="3"
         data-swn-z-index="9999"
         class="your-custom-classes">
        <div data-swn-title></div>
        <div data-swn-body></div>
        <div data-swn-buttons>
            <button data-swn-ok></button>
        </div>
    </div>
</template>
```

4. Use the dialogs:

```javascript
// Alert
alert('Hello World!');

// Confirm
const result = await confirm('Are you sure?');
if (result) {
    // User clicked OK
}

// Prompt
const name = await prompt('Enter your name:', 'John Doe');
if (name) {
    console.log(`Hello, ${name}!`);
}
```

## Configuration Options

### Initialization Options

You can configure the notice system with these options:

```javascript
const notice = new SenangWebsNotice({
    titleText: 'Notice',           // Default title for dialogs
    buttonText: 'OK',             // Text for OK button
    cancelText: 'Cancel',         // Text for Cancel button
    template: '#custom-notice',   // Custom template ID
    position: 'center',          // Dialog position
    bgColor: '#000000',         // Overlay background color
    bgOpacity: 0.5,            // Overlay opacity
    bgBlur: 3,                // Background blur effect (pixels)
    zIndex: 9999,            // Base z-index for the dialog
    inputPlaceholder: 'Enter your response...', // Placeholder for prompt input
    defaultValue: ''        // Default value for prompt input
});
```

### Data Attributes

Customize the notice appearance using these data attributes:

- `data-swn`: Main notice container
- `data-swn-position`: Position of the notice
- `data-swn-bg-color`: Background overlay color
- `data-swn-bg-opacity`: Background overlay opacity
- `data-swn-bg-blur`: Background blur effect
- `data-swn-z-index`: Z-index for the notice

### Supported Positions

- `center`: Center of the screen
- `top`: Top center
- `top left`: Top left corner
- `top right`: Top right corner
- `bottom`: Bottom center
- `bottom left`: Bottom left corner
- `bottom right`: Bottom right corner
- `left`: Middle left
- `right`: Middle right

## Browser Support

SenangWebs Notices works on all modern browsers that support:

- Promises
- CSS Flexbox
- backdrop-filter (for blur effects)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Inspired by the need for more customizable dialog alternatives
- Thanks to all contributors who have helped improve this library

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

Happy notifying!
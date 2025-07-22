# react-compare-2d

A React component for creating interactive 2D comparison sliders with multidirectional sliding. Perfect for before/after comparisons, image reveals, and interactive content exploration.

## Features

- 🎯 **2D multidirectional sliding** - Move crosshair in both X and Y directions
- 🎨 **Zero dependencies** - Lightweight with no external dependencies
- ♿ **Fully accessible** - WCAG compliant with keyboard navigation and ARIA support
- 📱 **Touch/mouse support** - Works on all devices
- 🎨 **Completely customizable** - Style with CSS data attributes
- 🖼️ **Flexible content** - Support for images and custom React components
- ⚡ **TypeScript ready** - Full TypeScript support

## Installation

```bash
npm install react-compare-2d
```

## Quick Start

### Basic Usage

```tsx
import { React2DComparisonSlider } from 'react-compare-2d'
import 'react-compare-2d/basic.css' // Optional basic styling

function MyApp() {
  const handlePositionChange = (position) => {
    console.log(`X: ${position.x}%, Y: ${position.y}%`)
  }

  return (
    <React2DComparisonSlider
      beforeImage="/before.jpg"
      afterImage="/after.jpg"
      onPositionChange={handlePositionChange}
      width={600}
      height={400}
    />
  )
}
```

### Custom Content

```tsx
<React2DComparisonSlider
  beforeContent={
    <div style={{ background: '#000', color: '#fff', width: '100%', height: '100%' }}>
      Before State
    </div>
  }
  afterContent={
    <div style={{ background: '#fff', color: '#000', width: '100%', height: '100%' }}>
      After State
    </div>
  }
  initialPosition={{ x: 25, y: 75 }}
  onPositionChange={(pos) => console.log(pos)}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `beforeImage` | `string` | - | URL for the "before" image |
| `afterImage` | `string` | - | URL for the "after" image |
| `beforeContent` | `ReactNode` | - | Custom React content for "before" state |
| `afterContent` | `ReactNode` | - | Custom React content for "after" state |
| `onPositionChange` | `(position: Position2D) => void` | - | Callback fired when crosshair position changes |
| `initialPosition` | `Position2D` | `{ x: 50, y: 50 }` | Initial crosshair position (0-100%) |
| `width` | `number \| string` | `"100%"` | Component width |
| `height` | `number \| string` | `400` | Component height |
| `disabled` | `boolean` | `false` | Disable interaction |
| `className` | `string` | `""` | Additional CSS class |
| `style` | `CSSProperties` | `{}` | Inline styles |
| `aria-label` | `string` | `"2D comparison slider"` | ARIA label for accessibility |
| `aria-labelledby` | `string` | - | ID of element that labels the slider |

### Types

```tsx
interface Position2D {
  x: number // X position as percentage (0-100)
  y: number // Y position as percentage (0-100)
}
```

## Styling

The component is completely unstyled by default, giving you full control over the appearance.

### Basic Styling

Include the basic stylesheet for minimal default styles:

```tsx
import 'react-compare-2d/basic.css'
```

This provides:
- Black handle (16px circle)
- Black crosshair lines (1px)
- Focus outline for accessibility

### Custom Styling with Data Attributes

Style any part of the component using data attribute selectors:

```css
/* Container */
[data-react-2d-slider="container"] {
  border: 2px solid #000;
  border-radius: 8px;
}

/* Handle */
[data-react-2d-slider="handle"] {
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: 3px solid white;
  border-radius: 50%;
}

/* Lines */
[data-react-2d-slider="line"] {
  background: #fff;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}

/* State-based styling */
[data-react-2d-slider="handle"][data-state="dragging"] {
  transform: translate(-50%, -50%) scale(1.2);
}

/* Position-based styling */
[data-react-2d-slider="container"][data-x="0"] [data-react-2d-slider="handle"] {
  border-color: #ff0000;
}
```

### Available Data Attributes

#### Component Parts
- `[data-react-2d-slider="container"]` - Main container
- `[data-react-2d-slider="handle"]` - Draggable crosshair handle
- `[data-react-2d-slider="line"]` - Grid lines
- `[data-react-2d-slider="before-container"]` - Before content area
- `[data-react-2d-slider="after-container"]` - After content area
- `[data-react-2d-slider="before-image"]` - Before image element
- `[data-react-2d-slider="after-image"]` - After image element
- `[data-react-2d-slider="before-content"]` - Before custom content wrapper
- `[data-react-2d-slider="after-content"]` - After custom content wrapper

#### Dynamic Attributes
- `[data-state="idle|dragging|disabled"]` - Current interaction state
- `[data-x="0-100"]` - Current X position (updates live)
- `[data-y="0-100"]` - Current Y position (updates live)
- `[data-orientation="horizontal|vertical"]` - Line orientation
- `[data-content-type="image|custom"]` - Content type

## Accessibility

The component is fully accessible out of the box:

### Keyboard Navigation
- **Arrow keys**: Move crosshair (1% per press)
- **Shift + Arrow keys**: Large steps (10% per press)
- **Alt + Arrow keys**: Fine steps (0.1% per press)
- **Home**: Move to top-left corner (0%, 0%)
- **End**: Move to bottom-right corner (100%, 100%)

### Screen Reader Support
- Proper ARIA roles and attributes
- Live position announcements
- Descriptive labels for all interactive elements

### Focus Management
- Keyboard focusable with proper tab order
- Visible focus indicators
- Focus trapping when interacting

## Advanced Examples

### Position-based Styling

```css
/* Change handle color based on position */
[data-react-2d-slider="container"][data-x="0"] [data-react-2d-slider="handle"] {
  background: #ff4444; /* Red at left edge */
}

[data-react-2d-slider="container"][data-x="100"] [data-react-2d-slider="handle"] {
  background: #44ff44; /* Green at right edge */
}

/* Animate lines based on Y position */
[data-react-2d-slider="container"][data-y="0"] [data-react-2d-slider="line"] {
  box-shadow: 0 0 10px #ff4444;
}

[data-react-2d-slider="container"][data-y="100"] [data-react-2d-slider="line"] {
  box-shadow: 0 0 10px #4444ff;
}
```

### Interactive States

```css
/* Dragging state */
[data-react-2d-slider="handle"][data-state="dragging"] {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* Hover effects */
[data-react-2d-slider="container"]:hover [data-react-2d-slider="line"] {
  background: #0066cc;
}

/* Disabled state */
[data-react-2d-slider="container"][data-state="disabled"] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Custom Content Examples

```tsx
// Data visualization comparison
<React2DComparisonSlider
  beforeContent={<LineChart data={oldData} />}
  afterContent={<LineChart data={newData} />}
  onPositionChange={(pos) => updateVisualization(pos)}
/>

// UI state comparison
<React2DComparisonSlider
  beforeContent={<Dashboard theme="dark" />}
  afterContent={<Dashboard theme="light" />}
/>

// Interactive maps
<React2DComparisonSlider
  beforeContent={<Map year={2000} />}
  afterContent={<Map year={2024} />}
/>
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

- Install dependencies:

```bash
pnpm install
```

- Run the playground:

```bash
pnpm playground
```

- Run the unit tests:

```bash
pnpm test
```

- Build the library:

```bash
pnpm build
```

## Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) for details.

## License

MIT

## Related Projects

- [react-comparison-slider](https://github.com/nerdyman/react-comparison-slider) - 1D comparison slider
- [react-colorful](https://github.com/omgovich/react-colorful) - Inspiration for accessibility patterns

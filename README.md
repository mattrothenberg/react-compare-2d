# react-compare-2d

A React component for creating interactive comparison sliders with support for horizontal, vertical, and 2D sliding modes. Perfect for before/after comparisons, image reveals, and interactive content exploration.

## Features

- 🎯 **Multiple orientations** - Horizontal, vertical, or full 2D sliding
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
import { Compare2D } from 'react-compare-2d'
import 'react-compare-2d/basic.css' // Optional basic styling

function MyApp() {
  const handlePositionChange = (position) => {
    console.log(`X: ${position.x}%, Y: ${position.y}%`)
  }

  return (
    <Compare2D
      beforeImage="/before.jpg"
      afterImage="/after.jpg"
      onPositionChange={handlePositionChange}
      width={600}
      height={400}
      orientation="2d" // Default - can be "horizontal", "vertical", or "2d"
    />
  )
}
```

### Horizontal Slider (like react-comparison-slider)

```tsx
<Compare2D
  beforeImage="/before.jpg"
  afterImage="/after.jpg"
  orientation="horizontal"
  onPositionChange={(pos) => console.log(`Position: ${pos.x}%`)}
/>
```

### Vertical Slider

```tsx
<Compare2D
  beforeImage="/before.jpg"
  afterImage="/after.jpg"
  orientation="vertical"
  onPositionChange={(pos) => console.log(`Position: ${pos.y}%`)}
/>
```

### Custom Content

```tsx
<Compare2D
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
  defaultPosition={{ x: 25, y: 75 }}
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
| `onPositionChange` | `(position: Position2D) => void` | - | Callback fired when slider position changes |
| `defaultPosition` | `Position2D` | `{ x: 50, y: 50 }` | Initial slider position (0-100%) |
| `orientation` | `'horizontal' \| 'vertical' \| '2d'` | `'2d'` | Slider orientation mode |
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

## Orientation Modes

### Horizontal Mode (`orientation="horizontal"`)
- Slider moves only left/right
- Y position is fixed at 50% (center)
- Shows only vertical divider line
- Behaves like traditional comparison sliders (e.g., react-comparison-slider)
- Perfect for before/after image comparisons

### Vertical Mode (`orientation="vertical"`)
- Slider moves only up/down
- X position is fixed at 50% (center)
- Shows only horizontal divider line
- Great for top/bottom content comparisons

### 2D Mode (`orientation="2d"`) - Default
- Full 2D movement in both X and Y directions
- Shows both horizontal and vertical guide lines
- Crosshair handle allows multidirectional sliding
- Original behavior of the component

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
[data-compare-2d="container"] {
  border: 2px solid #000;
  border-radius: 8px;
}

/* Handle */
[data-compare-2d="handle"] {
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: 3px solid white;
  border-radius: 50%;
}

/* Lines */
[data-compare-2d="line"] {
  background: #fff;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}

/* State-based styling */
[data-compare-2d="handle"][data-state="dragging"] {
  transform: translate(-50%, -50%) scale(1.2);
}

/* Position-based styling */
[data-compare-2d="container"][data-x="0"] [data-compare-2d="handle"] {
  border-color: #ff0000;
}
```

### Available Data Attributes

#### Component Parts
- `[data-compare-2d="container"]` - Main container
- `[data-compare-2d="handle"]` - Draggable crosshair handle
- `[data-compare-2d="line"]` - Grid lines
- `[data-compare-2d="before-container"]` - Before content area
- `[data-compare-2d="after-container"]` - After content area
- `[data-compare-2d="before-image"]` - Before image element
- `[data-compare-2d="after-image"]` - After image element
- `[data-compare-2d="before-content"]` - Before custom content wrapper
- `[data-compare-2d="after-content"]` - After custom content wrapper

#### Dynamic Attributes
- `[data-state="idle|dragging|disabled"]` - Current interaction state
- `[data-x="0-100"]` - Current X position (updates live)
- `[data-y="0-100"]` - Current Y position (updates live)
- `[data-orientation="horizontal|vertical|2d"]` - Slider orientation
- `[data-content-type="image|custom"]` - Content type

## Accessibility

The component is fully accessible out of the box:

### Keyboard Navigation
- **Arrow keys**: Move slider (1% per press)
  - Horizontal mode: Left/Right arrows only
  - Vertical mode: Up/Down arrows only
  - 2D mode: All arrow keys
- **Shift + Arrow keys**: Large steps (10% per press)
- **Alt + Arrow keys**: Fine steps (0.1% per press)
- **Home**: Move to start position
  - Horizontal: Left edge (0%, 50%)
  - Vertical: Top edge (50%, 0%)
  - 2D: Top-left corner (0%, 0%)
- **End**: Move to end position
  - Horizontal: Right edge (100%, 50%)
  - Vertical: Bottom edge (50%, 100%)
  - 2D: Bottom-right corner (100%, 100%)

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
[data-compare-2d="container"][data-x="0"] [data-compare-2d="handle"] {
  background: #ff4444; /* Red at left edge */
}

[data-compare-2d="container"][data-x="100"] [data-compare-2d="handle"] {
  background: #44ff44; /* Green at right edge */
}

/* Animate lines based on Y position */
[data-compare-2d="container"][data-y="0"] [data-compare-2d="line"] {
  box-shadow: 0 0 10px #ff4444;
}

[data-compare-2d="container"][data-y="100"] [data-compare-2d="line"] {
  box-shadow: 0 0 10px #4444ff;
}
```

### Interactive States

```css
/* Dragging state */
[data-compare-2d="handle"][data-state="dragging"] {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* Hover effects */
[data-compare-2d="container"]:hover [data-compare-2d="line"] {
  background: #0066cc;
}

/* Disabled state */
[data-compare-2d="container"][data-state="disabled"] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Custom Content Examples

```tsx
// Data visualization comparison
<Compare2D
  beforeContent={<LineChart data={oldData} />}
  afterContent={<LineChart data={newData} />}
  onPositionChange={(pos) => updateVisualization(pos)}
/>

// UI state comparison
<Compare2D
  beforeContent={<Dashboard theme="dark" />}
  afterContent={<Dashboard theme="light" />}
/>

// Interactive maps
<Compare2D
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

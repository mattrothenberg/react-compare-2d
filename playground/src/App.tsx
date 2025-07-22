import { React2DComparisonSlider, type Position2D } from "../../src"
import "./basic-styles.css"

export function App() {
  const handlePositionChange = (position: Position2D) => {
    console.log('Position changed:', position)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '8px' }}>React 2D Comparison Slider Demo</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>
        Zero dependencies • Fully customizable with CSS data attributes • Accessible
      </p>
      
      <h2 style={{ color: '#374151', marginBottom: '16px' }}>📦 Unstyled (No CSS)</h2>
      <div style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
        Component with no styling - you'll barely see anything!
      </div>
      <React2DComparisonSlider
        beforeContent={<div style={{ background: '#ef4444', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Before</div>}
        afterContent={<div style={{ background: '#3b82f6', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>After</div>}
        onPositionChange={handlePositionChange}
        width={500}
        height={200}
        className="unstyled-demo"
      />
      
      {/* <h2 style={{ color: '#374151', marginTop: '40px', marginBottom: '16px' }}>⚡ Basic Styles</h2>
      <div style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
        Simple white lines and handle - include <code>basic-styles.css</code>
      </div>
      <React2DComparisonSlider
        beforeImage="https://picsum.photos/500/200?random=3"
        afterImage="https://picsum.photos/500/200?random=4"
        onPositionChange={handlePositionChange}
        width={500}
        height={200}
      />
      
      <h2 style={{ color: '#374151', marginTop: '40px', marginBottom: '16px' }}>🎨 Custom Styled</h2>
      <div style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
        Advanced styling with data attributes
      </div>
      <React2DComparisonSlider
        beforeImage="https://picsum.photos/500/300?random=1"
        afterImage="https://picsum.photos/500/300?random=2"
        onPositionChange={handlePositionChange}
        width={500}
        height={300}
        className="styled-slider"
      />
      
      <h2 style={{ color: '#374151', marginTop: '40px', marginBottom: '16px' }}>🌈 Custom Content (Fixed!)</h2>
      <React2DComparisonSlider
        beforeContent={
          <div style={{
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Before State ✨
          </div>
        }
        afterContent={
          <div style={{
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            After State 🎯
          </div>
        }
        onPositionChange={handlePositionChange}
        width={500}
        height={300}
        initialPosition={{ x: 25, y: 75 }}
      /> */}

      <div style={{ 
        marginTop: '40px', 
        padding: '24px', 
        background: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#1e293b', marginBottom: '16px' }}>📋 Styling Options</h3>
        
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
          <h4 style={{ color: '#374151', margin: '0 0 8px 0' }}>Basic Stylesheet:</h4>
          <pre style={{ margin: 0, fontSize: '12px', color: '#475569', overflow: 'auto' }}>{`/* basic-styles.css - Simple starting point */
[data-react-2d-slider="container"] { border: 1px solid #ccc; }
[data-react-2d-slider="handle"] { 
  width: 20px; height: 20px; background: white; 
  border: 2px solid #333; border-radius: 50%; 
}
[data-react-2d-slider="line"] { background: white; }
[data-react-2d-slider="line"][data-orientation="vertical"] { width: 2px; }
[data-react-2d-slider="line"][data-orientation="horizontal"] { height: 2px; }`}</pre>
        </div>

        <h4 style={{ color: '#374151', margin: '0 0 8px 0' }}>Available Data Attributes:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
          <div>
            <strong>Component Parts:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#64748b' }}>
              <li><code>[data-react-2d-slider="container"]</code></li>
              <li><code>[data-react-2d-slider="handle"]</code></li>
              <li><code>[data-react-2d-slider="line"]</code></li>
              <li><code>[data-react-2d-slider="before-container"]</code></li>
              <li><code>[data-react-2d-slider="after-container"]</code></li>
            </ul>
          </div>
          <div>
            <strong>States & Properties:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#64748b' }}>
              <li><code>[data-state="idle|dragging|disabled"]</code></li>
              <li><code>[data-x="0-100"]</code> - X position</li>
              <li><code>[data-y="0-100"]</code> - Y position</li>
              <li><code>[data-orientation="horizontal|vertical"]</code></li>
              <li><code>[data-content-type="image|custom"]</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

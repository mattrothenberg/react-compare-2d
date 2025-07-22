import { React2DComparisonSlider, type Position2D } from "../../src"

export function App() {
  const handlePositionChange = (position: Position2D) => {
    console.log('Position changed:', position)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React 2D Comparison Slider Demo</h1>
      
      <h2>Basic Usage with Images</h2>
      <React2DComparisonSlider
        beforeImage="https://picsum.photos/400/300?random=1"
        afterImage="https://picsum.photos/400/300?random=2"
        onPositionChange={handlePositionChange}
        width={500}
        height={300}
      />
      
      <h2>With Custom Content</h2>
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
            fontWeight: 'bold'
          }}>
            Before State
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
            fontWeight: 'bold'
          }}>
            After State
          </div>
        }
        onPositionChange={handlePositionChange}
        width={500}
        height={300}
        initialPosition={{ x: 25, y: 75 }}
      />

      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Instructions:</h3>
        <ul>
          <li><strong>Mouse/Touch:</strong> Click and drag anywhere to move the crosshair</li>
          <li><strong>Keyboard:</strong> Use arrow keys to move (Shift for large steps, Alt for small steps)</li>
          <li><strong>Home/End:</strong> Jump to corners (0,0) and (100,100)</li>
          <li><strong>Accessibility:</strong> Fully keyboard navigable with ARIA labels</li>
        </ul>
      </div>
    </div>
  )
}

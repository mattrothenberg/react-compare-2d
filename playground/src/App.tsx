import { type Position2D, React2DComparisonSlider } from '../../src'
import './basic-styles.css'

export function App() {
  const handlePositionChange = (position: Position2D) => {
    console.log('Position changed:', position)
  }

  return (
    <div className="p-4">
      <div className="size-64">
        <React2DComparisonSlider
          beforeContent={
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🌑</div>
                <div className="text-xl font-bold">Before</div>
              </div>
            </div>
          }
          afterContent={
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-black text-center">
                <div className="text-6xl mb-4">☀️</div>
                <div className="text-xl font-bold">After</div>
              </div>
            </div>
          }
          onPositionChange={handlePositionChange}
          width="100%"
          height={'100%'}
          initialPosition={{ x: 75, y: 25 }}
        />
      </div>
    </div>
  )
}

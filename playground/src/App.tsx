import { useState } from 'react'
import { Compare2D, type DragTarget, type Position2D } from '../../src'
import './basic-styles.css'

export function App() {
  // All orientations now use Position2D for full flexibility
  const [horizontalPosition, setHorizontalPosition] = useState<Position2D>({
    x: 75,
    y: 50,
  })
  const [verticalPosition, setVerticalPosition] = useState<Position2D>({
    x: 50,
    y: 25,
  })
  const [twoDPosition, setTwoDPosition] = useState<Position2D>({ x: 75, y: 75 })

  // Example: Constrain horizontal handle to center Y
  const [constrainHorizontal, setConstrainHorizontal] = useState(false)
  const [constrainVertical, setConstrainVertical] = useState(false)

  // Demo drag target options
  const [horizontalDragTarget, setHorizontalDragTarget] =
    useState<DragTarget>('all')
  const [verticalDragTarget, setVerticalDragTarget] =
    useState<DragTarget>('all')
  const [twoDDragTarget, setTwoDDragTarget] = useState<DragTarget>('all')

  const handleHorizontalChange = (position: Position2D) => {
    setHorizontalPosition(
      constrainHorizontal ? { x: position.x, y: 50 } : position
    )
  }

  const handleVerticalChange = (position: Position2D) => {
    setVerticalPosition(constrainVertical ? { x: 50, y: position.y } : position)
  }

  return (
    <div className="p-8 flex gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Horizontal Slider</h2>
        <div className="w-96 h-64 border border-gray-300">
          <Compare2D
            beforeContent={
              <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">👈</div>
                  <div className="text-lg font-bold">Before</div>
                </div>
              </div>
            }
            afterContent={
              <div className="w-full h-full bg-green-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">👉</div>
                  <div className="text-lg font-bold">After</div>
                </div>
              </div>
            }
            width="100%"
            height="100%"
            onPositionChange={handleHorizontalChange}
            position={horizontalPosition}
            orientation="horizontal"
            dragTarget={horizontalDragTarget}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Position: X: {horizontalPosition.x.toFixed(0)}%, Y:{' '}
          {horizontalPosition.y.toFixed(0)}%
        </p>
        <label className="flex items-center mt-2 text-sm">
          <input
            type="checkbox"
            checked={constrainHorizontal}
            onChange={(e) => setConstrainHorizontal(e.target.checked)}
            className="mr-2"
          />
          Constrain handle to center Y (y=50)
        </label>
        <div className="mt-2">
          <label
            htmlFor="horizontal-drag-target"
            className="block text-sm font-medium mb-1"
          >
            Drag Target:
          </label>
          <select
            id="horizontal-drag-target"
            value={horizontalDragTarget}
            onChange={(e) =>
              setHorizontalDragTarget(e.target.value as DragTarget)
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">All (click anywhere)</option>
            <option value="handle">Handle only</option>
            <option value="handle-lines">Handle + Lines</option>
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Vertical Slider</h2>
        <div className="w-96 h-64 border border-gray-300">
          <Compare2D
            beforeContent={
              <div className="w-full h-full bg-red-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">👆</div>
                  <div className="text-lg font-bold">Before</div>
                </div>
              </div>
            }
            afterContent={
              <div className="w-full h-full bg-yellow-500 flex items-center justify-center">
                <div className="text-black text-center">
                  <div className="text-4xl mb-2">👇</div>
                  <div className="text-lg font-bold">After</div>
                </div>
              </div>
            }
            width="100%"
            height="100%"
            onPositionChange={handleVerticalChange}
            position={verticalPosition}
            orientation="vertical"
            dragTarget={verticalDragTarget}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Position: X: {verticalPosition.x.toFixed(0)}%, Y:{' '}
          {verticalPosition.y.toFixed(0)}%
        </p>
        <label className="flex items-center mt-2 text-sm">
          <input
            type="checkbox"
            checked={constrainVertical}
            onChange={(e) => setConstrainVertical(e.target.checked)}
            className="mr-2"
          />
          Constrain handle to center X (x=50)
        </label>
        <div className="mt-2">
          <label
            htmlFor="vertical-drag-target"
            className="block text-sm font-medium mb-1"
          >
            Drag Target:
          </label>
          <select
            id="vertical-drag-target"
            value={verticalDragTarget}
            onChange={(e) =>
              setVerticalDragTarget(e.target.value as DragTarget)
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">All (click anywhere)</option>
            <option value="handle">Handle only</option>
            <option value="handle-lines">Handle + Lines</option>
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">2D Slider</h2>
        <div className="w-96 h-64 border border-gray-300">
          <Compare2D
            beforeContent={
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🌑</div>
                  <div className="text-lg font-bold">Before</div>
                </div>
              </div>
            }
            afterContent={
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-black text-center">
                  <div className="text-4xl mb-2">☀️</div>
                  <div className="text-lg font-bold">After</div>
                </div>
              </div>
            }
            width="100%"
            height="100%"
            onPositionChange={setTwoDPosition}
            position={twoDPosition}
            orientation="2d"
            dragTarget={twoDDragTarget}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Position: X: {twoDPosition.x.toFixed(0)}%, Y:{' '}
          {twoDPosition.y.toFixed(0)}%
        </p>
        <div className="mt-2">
          <label
            htmlFor="2d-drag-target"
            className="block text-sm font-medium mb-1"
          >
            Drag Target:
          </label>
          <select
            id="2d-drag-target"
            value={twoDDragTarget}
            onChange={(e) => setTwoDDragTarget(e.target.value as DragTarget)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">All (click anywhere)</option>
            <option value="handle">Handle only</option>
            <option value="handle-lines">Handle + Lines</option>
          </select>
        </div>
      </div>
    </div>
  )
}

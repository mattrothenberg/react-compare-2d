import { useState } from 'react'
import {
  Compare2D,
  type Position2D,
  type PositionHorizontal,
  type PositionVertical,
} from '../../src'
import './basic-styles.css'

export function App() {
  // Each position type only contains the relevant properties for type safety
  const [horizontalPosition, setHorizontalPosition] =
    useState<PositionHorizontal>({ x: 75 })
  const [verticalPosition, setVerticalPosition] = useState<PositionVertical>({
    y: 25,
  })
  const [twoDPosition, setTwoDPosition] = useState<Position2D>({ x: 75, y: 75 })

  // TypeScript prevents accessing irrelevant properties:
  // horizontalPosition.y ❌ - TypeScript error, y doesn't exist on PositionHorizontal
  // verticalPosition.x ❌ - TypeScript error, x doesn't exist on PositionVertical
  // twoDPosition.x ✅ - Both x and y are available on Position2D
  // twoDPosition.y ✅

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
            onPositionChange={setHorizontalPosition}
            position={horizontalPosition}
            orientation="horizontal"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Position: {horizontalPosition.x.toFixed(0)}% (X only)
        </p>
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
            onPositionChange={setVerticalPosition}
            position={verticalPosition}
            orientation="vertical"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Position: {verticalPosition.y.toFixed(0)}% (Y only)
        </p>
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
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Position: X: {twoDPosition.x.toFixed(0)}%, Y:{' '}
          {twoDPosition.y.toFixed(0)}% (Both X & Y)
        </p>
      </div>
    </div>
  )
}

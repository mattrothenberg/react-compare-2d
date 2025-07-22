/** biome-ignore-all lint/style/useImportType: Not necessary */
import React, { useCallback, useEffect, useRef, useState } from 'react'

export interface Position2D {
  x: number
  y: number
}

interface Compare2DProps {
  beforeImage?: string
  afterImage?: string
  beforeContent?: React.ReactNode
  afterContent?: React.ReactNode
  onPositionChange?: (position: Position2D) => void
  position?: Position2D
  defaultPosition?: Position2D
  initialPosition?: Position2D
  width?: number | string
  height?: number | string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const Compare2D: React.FC<
  Compare2DProps
> = ({
  beforeImage,
  afterImage,
  beforeContent,
  afterContent,
  onPositionChange,
  position: controlledPosition,
  defaultPosition,
  initialPosition = { x: 50, y: 50 },
  width = '100%',
  height = 400,
  disabled = false,
  className = '',
  style = {},
  'aria-label': ariaLabel = '2D comparison slider',
  'aria-labelledby': ariaLabelledby,
}) => {
  const isControlled = controlledPosition !== undefined
  const [internalPosition, setInternalPosition] = useState<Position2D>(
    defaultPosition || initialPosition
  )
  const position = isControlled ? controlledPosition : internalPosition
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      )
      const y = Math.max(
        0,
        Math.min(100, ((clientY - rect.top) / rect.height) * 100)
      )

      const newPosition = { x, y }
      if (!isControlled) {
        setInternalPosition(newPosition)
      }
      onPositionChange?.(newPosition)
    },
    [isControlled, onPositionChange]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(true)
      updatePosition(e.clientX, e.clientY)
    },
    [disabled, updatePosition]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      updatePosition(e.clientX, e.clientY)
    },
    [isDragging, updatePosition]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(true)
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    },
    [disabled, updatePosition]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    },
    [isDragging, updatePosition]
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      let newX = position.x
      let newY = position.y
      const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          newX = Math.max(0, position.x - step)
          break
        case 'ArrowRight':
          e.preventDefault()
          newX = Math.min(100, position.x + step)
          break
        case 'ArrowUp':
          e.preventDefault()
          newY = Math.max(0, position.y - step)
          break
        case 'ArrowDown':
          e.preventDefault()
          newY = Math.min(100, position.y + step)
          break
        case 'Home':
          e.preventDefault()
          newX = 0
          newY = 0
          break
        case 'End':
          e.preventDefault()
          newX = 100
          newY = 100
          break
        default:
          return
      }

      const newPosition = { x: newX, y: newY }
      if (!isControlled) {
        setInternalPosition(newPosition)
      }
      onPositionChange?.(newPosition)
    },
    [disabled, position, isControlled, onPositionChange]
  )

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    overflow: 'visible',
    ...style,
  }

  const clippingContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  }

  const beforeContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    clipPath: `polygon(0% 0%, ${position.x}% 0%, ${position.x}% ${position.y}%, 0% ${position.y}%)`,
  }

  const afterContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  }

  const verticalLineStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}%`,
    top: 0,
    height: '100%',
    transform: 'translateX(-50%)',
    zIndex: 5,
  }

  const horizontalLineStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position.y}%`,
    left: 0,
    width: '100%',
    transform: 'translateY(-50%)',
    zIndex: 5,
  }

  return (
    <div
      ref={containerRef}
      className={`compare-2d ${className}`}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="application"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      data-compare-2d="container"
      data-state={disabled ? 'disabled' : isDragging ? 'dragging' : 'idle'}
      data-x={Math.round(position.x)}
      data-y={Math.round(position.y)}
    >
      <div
        style={clippingContainerStyle}
        data-compare-2d="clip"
      >
        <div
          style={afterContainerStyle}
          data-compare-2d="after-container"
          data-content-type={afterImage ? 'image' : 'custom'}
        >
          {afterImage && (
            <img
              src={afterImage}
              alt="After"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              data-compare-2d="after-image"
            />
          )}
          {afterContent && (
            <div
              data-compare-2d="after-content"
              style={{ width: '100%', height: '100%' }}
            >
              {afterContent}
            </div>
          )}
        </div>

        <div
          style={beforeContainerStyle}
          data-compare-2d="before-container"
          data-content-type={beforeImage ? 'image' : 'custom'}
        >
          {beforeImage && (
            <img
              src={beforeImage}
              alt="Before"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              data-compare-2d="before-image"
            />
          )}
          {beforeContent && (
            <div
              data-compare-2d="before-content"
              style={{ width: '100%', height: '100%' }}
            >
              {beforeContent}
            </div>
          )}
        </div>

        <div
          style={verticalLineStyle}
          data-compare-2d="line"
          data-orientation="vertical"
          data-x={Math.round(position.x)}
        />
        <div
          style={horizontalLineStyle}
          data-compare-2d="line"
          data-orientation="horizontal"
          data-y={Math.round(position.y)}
        />
      </div>

      <div
        tabIndex={disabled ? -1 : 0}
        ref={handleRef}
        style={handleStyle}
        role="slider"
        aria-label="2D slider handle"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((position.x + position.y) / 2)}
        aria-valuetext={`X: ${Math.round(position.x)}%, Y: ${Math.round(position.y)}%`}
        aria-orientation="horizontal"
        data-compare-2d="handle"
        data-state={disabled ? 'disabled' : isDragging ? 'dragging' : 'idle'}
        data-x={Math.round(position.x)}
        data-y={Math.round(position.y)}
      />

      {/** biome-ignore lint/a11y/useFocusableInteractive: Unnecessary */}
      <div
        style={{ ...handleStyle, visibility: 'hidden' }}
        role="slider"
        aria-label="Y coordinate slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position.y)}
        aria-valuetext={`Y: ${Math.round(position.y)}%`}
        aria-orientation="vertical"
        data-compare-2d="handle-a11y"
        data-orientation="vertical"
      />
    </div>
  )
}

/** biome-ignore-all lint/style/useImportType: Not necessary */
import React, { useCallback, useEffect, useRef, useState } from 'react'

// Position types based on orientation
export type PositionHorizontal = { x: number }
export type PositionVertical = { y: number }
export type Position2D = { x: number; y: number }

// Conditional type that returns the appropriate position type based on orientation
export type PositionForOrientation<T extends 'horizontal' | 'vertical' | '2d'> = 
  T extends 'horizontal' ? PositionHorizontal :
  T extends 'vertical' ? PositionVertical :
  Position2D

// Helper functions to handle position conversions
const getDefaultPosition = <T extends 'horizontal' | 'vertical' | '2d'>(
  orientation: T,
  userDefault?: PositionForOrientation<T>
): Position2D => {
  if (userDefault) {
    // Convert user-provided position to full Position2D
    if (orientation === 'horizontal') {
      return { x: (userDefault as PositionHorizontal).x, y: 50 }
    } else if (orientation === 'vertical') {
      return { x: 50, y: (userDefault as PositionVertical).y }
    } else {
      return userDefault as Position2D
    }
  }
  
  // Default positions based on orientation
  switch (orientation) {
    case 'horizontal':
      return { x: 50, y: 50 }
    case 'vertical':
      return { x: 50, y: 50 }
    case '2d':
    default:
      return { x: 50, y: 50 }
  }
}

const getPositionForOrientation = <T extends 'horizontal' | 'vertical' | '2d'>(
  fullPosition: Position2D,
  orientation: T
): PositionForOrientation<T> => {
  switch (orientation) {
    case 'horizontal':
      return { x: fullPosition.x } as PositionForOrientation<T>
    case 'vertical':
      return { y: fullPosition.y } as PositionForOrientation<T>
    case '2d':
    default:
      return fullPosition as PositionForOrientation<T>
  }
}

interface Compare2DProps<T extends 'horizontal' | 'vertical' | '2d' = '2d'> {
  beforeImage?: string
  afterImage?: string
  beforeContent?: React.ReactNode
  afterContent?: React.ReactNode
  onPositionChange?: (position: PositionForOrientation<T>) => void
  position?: PositionForOrientation<T>
  defaultPosition?: PositionForOrientation<T>
  width?: number | string
  height?: number | string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
  'aria-labelledby'?: string
  orientation?: T
}

export const Compare2D = <T extends 'horizontal' | 'vertical' | '2d' = '2d'>({
  beforeImage,
  afterImage,
  beforeContent,
  afterContent,
  onPositionChange,
  position: controlledPosition,
  defaultPosition,
  width = '100%',
  height = 400,
  disabled = false,
  className = '',
  style = {},
  'aria-label': ariaLabel = '2D comparison slider',
  'aria-labelledby': ariaLabelledby,
  orientation = '2d' as T,
}: Compare2DProps<T>) => {
  // Convert the controlled position to full Position2D if provided
  const fullControlledPosition = controlledPosition 
    ? getDefaultPosition(orientation, controlledPosition)
    : undefined
  
  const isControlled = controlledPosition !== undefined
  const [internalPosition, setInternalPosition] = useState<Position2D>(
    getDefaultPosition(orientation, defaultPosition)
  )
  
  // Use full Position2D internally for all calculations
  const fullPosition = isControlled ? fullControlledPosition! : internalPosition
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      let x = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      )
      let y = Math.max(
        0,
        Math.min(100, ((clientY - rect.top) / rect.height) * 100)
      )

      // Apply orientation constraints
      if (orientation === 'horizontal') {
        y = 50 // Fixed at center for horizontal mode
      } else if (orientation === 'vertical') {
        x = 50 // Fixed at center for vertical mode
      }

      const newPosition = { x, y }
      if (!isControlled) {
        setInternalPosition(newPosition)
      }
      // Only call callback with position data relevant to the orientation
      onPositionChange?.(getPositionForOrientation(newPosition, orientation))
    },
    [isControlled, onPositionChange, orientation]
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

      let newX = fullPosition.x
      let newY = fullPosition.y
      const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1

      switch (e.key) {
        case 'ArrowLeft':
          if (orientation === 'vertical') return
          e.preventDefault()
          newX = Math.max(0, fullPosition.x - step)
          break
        case 'ArrowRight':
          if (orientation === 'vertical') return
          e.preventDefault()
          newX = Math.min(100, fullPosition.x + step)
          break
        case 'ArrowUp':
          if (orientation === 'horizontal') return
          e.preventDefault()
          newY = Math.max(0, fullPosition.y - step)
          break
        case 'ArrowDown':
          if (orientation === 'horizontal') return
          e.preventDefault()
          newY = Math.min(100, fullPosition.y + step)
          break
        case 'Home':
          e.preventDefault()
          if (orientation === 'horizontal') {
            newX = 0
            newY = 50
          } else if (orientation === 'vertical') {
            newX = 50
            newY = 0
          } else {
            newX = 0
            newY = 0
          }
          break
        case 'End':
          e.preventDefault()
          if (orientation === 'horizontal') {
            newX = 100
            newY = 50
          } else if (orientation === 'vertical') {
            newX = 50
            newY = 100
          } else {
            newX = 100
            newY = 100
          }
          break
        default:
          return
      }

      // Apply orientation constraints
      if (orientation === 'horizontal') {
        newY = 50
      } else if (orientation === 'vertical') {
        newX = 50
      }

      const newPosition = { x: newX, y: newY }
      if (!isControlled) {
        setInternalPosition(newPosition)
      }
      // Only call callback with position data relevant to the orientation
      onPositionChange?.(getPositionForOrientation(newPosition, orientation))
    },
    [disabled, fullPosition, isControlled, onPositionChange, orientation]
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

  const getClipPath = () => {
    if (orientation === 'horizontal') {
      return `polygon(0% 0%, ${fullPosition.x}% 0%, ${fullPosition.x}% 100%, 0% 100%)`
    } else if (orientation === 'vertical') {
      return `polygon(0% 0%, 100% 0%, 100% ${fullPosition.y}%, 0% ${fullPosition.y}%)`
    } else {
      return `polygon(0% 0%, ${fullPosition.x}% 0%, ${fullPosition.x}% ${fullPosition.y}%, 0% ${fullPosition.y}%)`
    }
  }

  const beforeContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    clipPath: getClipPath(),
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
    left: `${fullPosition.x}%`,
    top: `${fullPosition.y}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  }

  const verticalLineStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${fullPosition.x}%`,
    top: 0,
    height: '100%',
    transform: 'translateX(-50%)',
    zIndex: 5,
  }

  const horizontalLineStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${fullPosition.y}%`,
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
      data-x={Math.round(fullPosition.x)}
      data-y={Math.round(fullPosition.y)}
    >
      <div style={clippingContainerStyle} data-compare-2d="clip">
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

        {(orientation === 'horizontal' || orientation === '2d') && (
          <div
            style={verticalLineStyle}
            data-compare-2d="line"
            data-orientation="vertical"
            data-x={Math.round(fullPosition.x)}
          />
        )}
        {(orientation === 'vertical' || orientation === '2d') && (
          <div
            style={horizontalLineStyle}
            data-compare-2d="line"
            data-orientation="horizontal"
            data-y={Math.round(fullPosition.y)}
          />
        )}
      </div>

      <div
        tabIndex={disabled ? -1 : 0}
        ref={handleRef}
        style={handleStyle}
        role="slider"
        aria-label={
          orientation === 'horizontal' 
            ? 'Horizontal comparison slider' 
            : orientation === 'vertical' 
            ? 'Vertical comparison slider' 
            : '2D slider handle'
        }
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={
          orientation === 'horizontal' 
            ? Math.round(fullPosition.x)
            : orientation === 'vertical'
            ? Math.round(fullPosition.y)
            : Math.round((fullPosition.x + fullPosition.y) / 2)
        }
        aria-valuetext={
          orientation === 'horizontal' 
            ? `${Math.round(fullPosition.x)}%`
            : orientation === 'vertical'
            ? `${Math.round(fullPosition.y)}%`
            : `X: ${Math.round(fullPosition.x)}%, Y: ${Math.round(fullPosition.y)}%`
        }
        aria-orientation={orientation === '2d' ? 'horizontal' : orientation}
        data-compare-2d="handle"
        data-state={disabled ? 'disabled' : isDragging ? 'dragging' : 'idle'}
        data-orientation={orientation}
        data-x={Math.round(fullPosition.x)}
        data-y={Math.round(fullPosition.y)}
      />

      {orientation === '2d' && (
        /** biome-ignore lint/a11y/useFocusableInteractive: Unnecessary */
        <div
          style={{ ...handleStyle, visibility: 'hidden' }}
          role="slider"
          aria-label="Y coordinate slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(fullPosition.y)}
          aria-valuetext={`Y: ${Math.round(fullPosition.y)}%`}
          aria-orientation="vertical"
          data-compare-2d="handle-a11y"
          data-orientation="vertical"
        />
      )}
    </div>
  )
}

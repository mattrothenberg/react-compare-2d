/** biome-ignore-all lint/style/useImportType: Not necessary */
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type Position2D = { x: number; y: number }

export type DragTarget = 'all' | 'handle' | 'handle-lines'

interface Compare2DProps {
  beforeImage?: string
  afterImage?: string
  beforeContent?: React.ReactNode
  afterContent?: React.ReactNode
  onPositionChange?: (position: Position2D) => void
  position?: Position2D
  defaultPosition?: Position2D
  width?: number | string
  height?: number | string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
  'aria-labelledby'?: string
  orientation?: 'horizontal' | 'vertical' | '2d'
  dragTarget?: DragTarget
}

export const Compare2D = ({
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
  orientation = '2d',
  dragTarget = 'all',
}: Compare2DProps) => {
  const isControlled = controlledPosition !== undefined
  const [internalPosition, setInternalPosition] = useState<Position2D>(
    defaultPosition || { x: 50, y: 50 }
  )

  // Use Position2D directly for all calculations
  const fullPosition = isControlled ? controlledPosition : internalPosition
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

      let newX = fullPosition.x
      let newY = fullPosition.y
      const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          newX = Math.max(0, fullPosition.x - step)
          break
        case 'ArrowRight':
          e.preventDefault()
          newX = Math.min(100, fullPosition.x + step)
          break
        case 'ArrowUp':
          e.preventDefault()
          newY = Math.max(0, fullPosition.y - step)
          break
        case 'ArrowDown':
          e.preventDefault()
          newY = Math.min(100, fullPosition.y + step)
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
    [disabled, fullPosition, isControlled, onPositionChange]
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
    cursor: dragTarget !== 'all' ? 'move' : undefined,
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

  const verticalLineTouchTargetStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${fullPosition.x}%`,
    top: 0,
    height: '100%',
    width: '16px',
    transform: 'translateX(-50%)',
    zIndex: 6,
    cursor: 'ew-resize',
  }

  const horizontalLineTouchTargetStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${fullPosition.y}%`,
    left: 0,
    width: '100%',
    height: '16px',
    transform: 'translateY(-50%)',
    zIndex: 6,
    cursor: 'ns-resize',
  }

  return (
    <div
      ref={containerRef}
      className={`compare-2d ${className}`}
      style={containerStyle}
      {...(dragTarget === 'all' && {
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
      })}
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
          <>
            <div
              style={verticalLineStyle}
              data-compare-2d="line"
              data-orientation="vertical"
              data-x={Math.round(fullPosition.x)}
            />
            {dragTarget === 'handle-lines' && (
              <div
                style={verticalLineTouchTargetStyle}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                data-compare-2d="line-touch-target"
                data-orientation="vertical"
              />
            )}
          </>
        )}
        {(orientation === 'vertical' || orientation === '2d') && (
          <>
            <div
              style={horizontalLineStyle}
              data-compare-2d="line"
              data-orientation="horizontal"
              data-y={Math.round(fullPosition.y)}
            />
            {dragTarget === 'handle-lines' && (
              <div
                style={horizontalLineTouchTargetStyle}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                data-compare-2d="line-touch-target"
                data-orientation="horizontal"
              />
            )}
          </>
        )}
      </div>

      <div
        tabIndex={disabled ? -1 : 0}
        ref={handleRef}
        style={handleStyle}
        {...((dragTarget === 'handle' || dragTarget === 'handle-lines') && {
          onMouseDown: handleMouseDown,
          onTouchStart: handleTouchStart,
        })}
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

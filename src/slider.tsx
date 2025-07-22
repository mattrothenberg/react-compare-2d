import React, { useState, useRef, useCallback, useEffect } from 'react'

export interface Position2D {
  x: number
  y: number
}

interface React2DComparisonSliderProps {
  beforeImage?: string
  afterImage?: string
  beforeContent?: React.ReactNode
  afterContent?: React.ReactNode
  onPositionChange?: (position: Position2D) => void
  initialPosition?: Position2D
  width?: number | string
  height?: number | string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const React2DComparisonSlider: React.FC<React2DComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeContent,
  afterContent,
  onPositionChange,
  initialPosition = { x: 50, y: 50 },
  width = '100%',
  height = 400,
  disabled = false,
  className = '',
  style = {},
  'aria-label': ariaLabel = '2D comparison slider',
  'aria-labelledby': ariaLabelledby
}) => {
  const [position, setPosition] = useState<Position2D>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    
    const newPosition = { x, y }
    setPosition(newPosition)
    onPositionChange?.(newPosition)
  }, [onPositionChange])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX, e.clientY)
  }, [disabled, updatePosition])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    updatePosition(e.clientX, e.clientY)
  }, [isDragging, updatePosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
    const touch = e.touches[0]
    updatePosition(touch.clientX, touch.clientY)
  }, [disabled, updatePosition])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const touch = e.touches[0]
    updatePosition(touch.clientX, touch.clientY)
  }, [isDragging, updatePosition])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
    setPosition(newPosition)
    onPositionChange?.(newPosition)
  }, [disabled, position, onPositionChange])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    overflow: 'hidden',
    cursor: disabled ? 'default' : 'crosshair',
    border: '1px solid #ccc',
    ...style
  }

  const beforeContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    clipPath: `polygon(0% 0%, ${position.x}% 0%, ${position.x}% ${position.y}%, 0% ${position.y}%)`
  }

  const afterContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '2px solid #333',
    transform: 'translate(-50%, -50%)',
    cursor: disabled ? 'default' : 'grab',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 10
  }

  const lineStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: 'white',
    boxShadow: '0 0 2px rgba(0,0,0,0.5)',
    zIndex: 5
  }

  const verticalLineStyle: React.CSSProperties = {
    ...lineStyle,
    left: `${position.x}%`,
    top: 0,
    width: 2,
    height: '100%',
    transform: 'translateX(-50%)'
  }

  const horizontalLineStyle: React.CSSProperties = {
    ...lineStyle,
    top: `${position.y}%`,
    left: 0,
    width: '100%',
    height: 2,
    transform: 'translateY(-50%)'
  }

  return (
    <div
      ref={containerRef}
      className={`react-2d-comparison-slider ${className}`}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="application"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <div style={afterContainerStyle}>
        {afterImage && <img src={afterImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        {afterContent}
      </div>
      
      <div style={beforeContainerStyle}>
        {beforeImage && <img src={beforeImage} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        {beforeContent}
      </div>

      <div style={verticalLineStyle} />
      <div style={horizontalLineStyle} />
      
      <div
        ref={handleRef}
        style={handleStyle}
        role="slider"
        aria-label="2D slider handle"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((position.x + position.y) / 2)}
        aria-valuetext={`X: ${Math.round(position.x)}%, Y: ${Math.round(position.y)}%`}
        aria-orientation="horizontal"
      />
      
      <div
        style={{ ...handleStyle, visibility: 'hidden' }}
        role="slider"
        aria-label="Y coordinate slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position.y)}
        aria-valuetext={`Y: ${Math.round(position.y)}%`}
        aria-orientation="vertical"
      />
    </div>
  )
}

import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { MyButton, React2DComparisonSlider } from '../src'

test('button', () => {
  render(<MyButton type="primary" />)

  const buttonElement = screen.getByText(/hello button: type primary/i)

  expect(buttonElement).toBeInTheDocument()
  expect(buttonElement).toHaveTextContent('hello button: type primary')
  expect(buttonElement.outerHTML).toMatchInlineSnapshot(
    `"<button class="my-button">hello button: type primary</button>"`,
  )

  expect(buttonElement).toHaveClass('my-button')
})

describe('React2DComparisonSlider', () => {
  test('renders with default props', () => {
    render(<React2DComparisonSlider />)
    
    const slider = screen.getByRole('application')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('aria-label', '2D comparison slider')
    
    const handle = screen.getByRole('slider', { name: '2D slider handle' })
    expect(handle).toBeInTheDocument()
    expect(handle).toHaveAttribute('aria-valuemin', '0')
    expect(handle).toHaveAttribute('aria-valuemax', '100')
  })

  test('calls onPositionChange when position is updated', () => {
    const onPositionChange = vi.fn()
    render(<React2DComparisonSlider onPositionChange={onPositionChange} />)
    
    const slider = screen.getByRole('application')
    
    // Mock getBoundingClientRect
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => {}
    })
    
    fireEvent.mouseDown(slider, { clientX: 200, clientY: 150 })
    
    expect(onPositionChange).toHaveBeenCalledWith({ x: 50, y: 50 })
  })

  test('handles keyboard navigation', () => {
    const onPositionChange = vi.fn()
    render(
      <React2DComparisonSlider 
        onPositionChange={onPositionChange} 
        initialPosition={{ x: 50, y: 50 }} 
      />
    )
    
    const slider = screen.getByRole('application')
    
    // Test arrow key navigation
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onPositionChange).toHaveBeenCalledWith({ x: 51, y: 50 })
    
    fireEvent.keyDown(slider, { key: 'ArrowDown' })
    expect(onPositionChange).toHaveBeenCalledWith({ x: 51, y: 51 })
    
    // Test shift modifier for large steps
    fireEvent.keyDown(slider, { key: 'ArrowLeft', shiftKey: true })
    expect(onPositionChange).toHaveBeenCalledWith({ x: 41, y: 51 })
  })

  test('respects disabled state', () => {
    const onPositionChange = vi.fn()
    render(<React2DComparisonSlider disabled onPositionChange={onPositionChange} />)
    
    const slider = screen.getByRole('application')
    expect(slider).toHaveAttribute('tabindex', '-1')
    
    fireEvent.mouseDown(slider)
    expect(onPositionChange).not.toHaveBeenCalled()
    
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onPositionChange).not.toHaveBeenCalled()
  })

  test('renders images when provided', () => {
    render(
      <React2DComparisonSlider
        beforeImage="/before.jpg"
        afterImage="/after.jpg"
      />
    )
    
    const beforeImage = screen.getByAltText('Before')
    const afterImage = screen.getByAltText('After')
    
    expect(beforeImage).toBeInTheDocument()
    expect(beforeImage).toHaveAttribute('src', '/before.jpg')
    expect(afterImage).toBeInTheDocument()
    expect(afterImage).toHaveAttribute('src', '/after.jpg')
  })

  test('applies custom className and styles', () => {
    const customStyle = { backgroundColor: 'red' }
    render(
      <React2DComparisonSlider
        className="custom-slider"
        style={customStyle}
      />
    )
    
    const slider = screen.getByRole('application')
    expect(slider).toHaveClass('react-2d-comparison-slider', 'custom-slider')
    expect(slider).toHaveStyle('background-color: red')
  })

  test('handles touch events', () => {
    const onPositionChange = vi.fn()
    render(<React2DComparisonSlider onPositionChange={onPositionChange} />)
    
    const slider = screen.getByRole('application')
    
    // Mock getBoundingClientRect
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => {}
    })
    
    fireEvent.touchStart(slider, {
      touches: [{ clientX: 100, clientY: 75 }]
    })
    
    expect(onPositionChange).toHaveBeenCalledWith({ x: 25, y: 25 })
  })

  test('constrains position to valid range', () => {
    const onPositionChange = vi.fn()
    render(
      <React2DComparisonSlider 
        onPositionChange={onPositionChange}
        initialPosition={{ x: 0, y: 100 }}
      />
    )
    
    const slider = screen.getByRole('application')
    
    // Test boundary constraints
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(onPositionChange).toHaveBeenCalledWith({ x: 0, y: 100 }) // x shouldn't go below 0
    
    fireEvent.keyDown(slider, { key: 'ArrowDown' })
    expect(onPositionChange).toHaveBeenCalledWith({ x: 0, y: 100 }) // y shouldn't go above 100
  })
})

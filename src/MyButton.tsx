import React from 'react'

interface MyButtonProps {
  type?: 'primary'
}

export const MyButton: React.FC<MyButtonProps> = ({ type }) => {
  return <button className="my-button">hello button: type {type}</button>
}

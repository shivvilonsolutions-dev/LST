import React from 'react'
const colors = {
  blue: "bg-blue-600 hover:bg-blue-700",
  red: "bg-red-600 hover:bg-red-700",
  green: "bg-green-600 hover:bg-green-700",
  white: "bg-white hover:bg-gray-100",
};

const textColors = {
  white: "text-white",
  black: "text-black",
};

const Button = ({btnName, btnWidth, onClick, btnColor = "blue", txtCol = "white"}) => {
  return (
    <button className={`${btnWidth} py-2 p-4 mt-6 ${textColors[txtCol]} ${colors[btnColor]}  rounded-lg`} onClick={onClick}>
        {btnName}
    </button>
  )
}

export default Button

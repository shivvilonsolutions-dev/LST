import React from 'react'

const StatsCard = ({ title, value, active }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-xl border
        ${active ? "border-purple-500 shadow-md" : "border-gray-300"}
        bg-white w-full sm:w-[30%]`
      }
    >
      <h2 className="text-lg text-center font-medium">{title}</h2>

      <p className="mt-2 text-xl text-center font-semibold">{value}</p>
    </div>
  )
}

export default StatsCard

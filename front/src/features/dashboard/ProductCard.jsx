import React from 'react'

const ProductCard = ({productName, property, quantity}) => {
  console.log(productName, property, quantity)
  return (
    <div className="bg-white border rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition">

      {/* Product Name */}
      <h2 className="text-lg font-semibold text-center">
        {productName}
      </h2>

      {/* Property */}
      <p className="text-gray-500 text-sm">
        {property["thickness"]} mm
      </p>

      {/* Quantity Box */}
      <div className="border px-4 py-1 rounded-lg text-gray-700">
        {quantity}
      </div>

      {/* Action Button */}
      <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition">
        View Material
      </button>

    </div>
  )
}

export default ProductCard

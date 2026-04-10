import React from 'react'
import ProductCard from "./ProductCard";

const materials = [
  {
    index: 1,
    name: "Track",
    quantity: 234,
    properties:
    {
      weight: 2000,
      thickness: 5,
      height: 3,
      length: 20
    }
  },
  {
    index: 2,
    name: "Pieces",
    quantity: 654,
    properties:
    {
      weight: 1000,
      thickness: 8,
      height: 2,
      length: 10
    }
  },
  {
    index: 3,
    name: "Single Size",
    quantity: 84,
    properties:
    {
      weight: 2150,
      thickness: 6,
      height: 20,
      length: 12
    }
  },
  {
    index: 4,
    name: "Seat",
    quantity: 16,
    properties:
    {
      weight: 50,
      thickness: 150,
      height: 2,
      length: 2.3
    }
  },
  {
    index: 5,
    name: "Design",
    quantity: 23,
    properties:
    {
      weight: 0,
      thickness: 7,
      height: 30,
      length: 64
    }
  },
]

const DashboardArea = () => {
  return (

    <div className="flex flex-wrap gap-6">

      {materials.map((item) => (
        <div key={item.index} className="flex-1 min-w-[220px] max-w-[300px] shadow-md">
          <ProductCard
            productName={item.name}
            property={item.properties}
            quantity={item.quantity}
          />
        </div>
      ))}

    </div>

  )
}

export default DashboardArea

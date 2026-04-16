import { useState, useEffect } from "react";
import { InventoryContext } from "./inventoryContext";
import { getData, setData } from "../../utils/localStorage";

const InventoryProvider = ({children}) => {
  const [inventories, setInventories] = useState(() => {
    return getData("inventories")
  })

  useEffect(() => {
    setData("inventories", inventories);
  }, [inventories])

  return <InventoryContext.Provider value={{ inventories, setInventories }}>
    {children}
  </InventoryContext.Provider>
}

export default InventoryProvider;
import { useState, useEffect } from "react";
import { ClientContext } from "./clientContext";
import { getData, setData } from "../../utils/localStorage";

const InventoryProvider = ({children}) => {
  const [clients, setClients] = useState(() => {
    return getData("clients")
  })

  useEffect(() => {
    setData("clients", clients);
  }, [clients])

  return <ClientContext.Provider value={{ clients, setClients }}>
    {children}
  </ClientContext.Provider>
}

export default InventoryProvider;
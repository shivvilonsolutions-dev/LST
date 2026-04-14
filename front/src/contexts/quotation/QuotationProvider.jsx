import { useState, useEffect } from "react";
import { QuotationContext } from "./quotationContext";
import { getData, setData } from "../../utils/localStorage";

const QuotationProvider = ({ children }) => {
  const [quotations, setQuotations] = useState(() => {
    return getData("quotations");
  });

  useEffect(() => {
    setData("quotations", quotations);
  }, [quotations]);


  return (
    <QuotationContext.Provider value={{ quotations, setQuotations }}>
      {children}
    </QuotationContext.Provider>
  );
};

export default QuotationProvider;
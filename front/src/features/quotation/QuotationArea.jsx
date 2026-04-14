import QuotationStats from "./components/QuotationStats";
import QuotationActions from "./components/QuotationActions";
import ShowQuotations from "./components/ShowQuotations"
import { useContext, useState } from "react";
import QuotationProvider from "../../contexts/quotation/QuotationProvider";
import { QuotationContext } from "../../contexts/quotation/quotationContext";

const QuotationArea = () => {
  const { quotations } = useContext(QuotationContext)
  const [filter, setFilter] = useState("ALL");

  const filteredData =
  filter === "ALL"
    ? quotations
    : quotations.filter((item) => item.status === filter);

  return (
    <QuotationProvider>
      <div className="flex flex-col gap-4">
        <QuotationStats />
        <QuotationActions setFilter={setFilter} />

        {
          quotations.length > 0 ?
            (
              <ShowQuotations data={filteredData} />
            ) :
            (
              <div className="mt-4 py-10 bg-white rounded-xl border overflow-hidden">
                <h2 className="text-center text-2xl">No Quotations</h2>
              </div>
            )
        }
      </div>
    </QuotationProvider>
  );
};

export default QuotationArea;
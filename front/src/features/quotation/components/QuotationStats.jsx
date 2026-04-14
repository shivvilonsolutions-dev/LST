import { useContext } from "react";
import StatsCard from "./StatsCard";
import { QuotationContext } from "../../../contexts/quotation/quotationContext"

const QuotationStats = () => {
  const { quotations } = useContext(QuotationContext)

  const confirmCount = quotations.filter(
    (item) => item.status === "CONFIRM"
  ).length;

  const pendingCount = quotations.length - confirmCount;

  return (
    <div className="flex flex-row justify-between gap-5">
      
      <StatsCard title="Total Quotations" value={quotations.length} />
      <StatsCard title="Pending Quotations" value={pendingCount} />
      <StatsCard title="Responded Quotations" value={confirmCount} />

    </div>
  );
};

export default QuotationStats;
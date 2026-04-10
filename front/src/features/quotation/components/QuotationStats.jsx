import StatsCard from "./StatsCard";

const QuotationStats = () => {
  return (
    <div className="flex flex-wrap justify-between gap-4">
      
      <StatsCard title="Total Quotations" value="234" />
      <StatsCard title="Pending Quotations" value="120" />
      <StatsCard title="Responded Quotations" value="114" />

    </div>
  );
};

export default QuotationStats;
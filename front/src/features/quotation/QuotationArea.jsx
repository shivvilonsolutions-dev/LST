import QuotationStats from "./components/QuotationStats";
import QuotationActions from "./components/QuotationActions";
import ShowQuotations from "./components/ShowQuotations"

const QuotationArea = () => {
  return (
    <div className="flex flex-col gap-4">
      <QuotationStats />
      <QuotationActions />
      <ShowQuotations />
    </div>
  );
};

export default QuotationArea;
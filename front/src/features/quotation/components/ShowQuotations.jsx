
import QuotationCard from "./QuotationCard";
import FetchQuotationData from "../services/FetchQuotationData";

const data = FetchQuotationData()

const ShowQuotations = () => {

  return (
    <div className="mt-4 bg-white rounded-xl border overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">

        {data.map(
          (item) => (
          <QuotationCard
            key={item.id}
            
            id={item.id}
            name={item.cliName}
            mobile={item.mobile}
            amount={item.amount}
            status={item.status}
          />
        ))}

      </div>
    </div>
  );
};

export default ShowQuotations;
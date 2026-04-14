import QuotationCard from "./QuotationCard";

const ShowQuotations = ({ data }) => {
  console.log(data)
  return (
    <div className="mt-4 bg-white rounded-xl border overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">

        {
          data.length > 0 ?
            (
              data.map(
                (item) => (
                  <QuotationCard
                    key={item.id}

                    id={item.id}
                    name={item.cliName}
                    mobile={item.mobile}
                    amount={item.amount}
                    status={item.status}
                  />
                ))
            )
            :
            (
              <h2>No Quotations Data</h2>
            )
        }

      </div>
    </div>
  );
};

export default ShowQuotations;
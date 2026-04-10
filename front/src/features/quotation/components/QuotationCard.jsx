import Button from "../../../components/ui/Button";
import { getData, setData } from "../../../utils/localStorage";

const QuotationCard = ({ id, name, mobile, amount, status }) => {
  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-lg transition
      ${status === "CONFIRM"
        ? "bg-green-100"
        : "bg-red-100"
      }
    `}>

      {/* Top Row */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {name}
        </h2>

        <span
          className={`text-xs px-2 py-1 rounded-full
            ${status === "CONFIRM"
              ? "bg-green-200 text-green-700"
              : "bg-yellow-200 text-yellow-700"
            }
          `}
        >
          {status}
        </span>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>{mobile}</span>
        <span>₹ {amount}</span>
      </div>

      {/* Action Button */}
      {status === "PENDING" && (
        <Button
          btnName="Confirm"
          btnColor="green"
          btnWidth="w-auto px-2"
          onClick={() => {
            const data = getData("quotations");

            const updatedData = data.map((item) =>
              item.id === id ? { ...item, status: "CONFIRM" } : item
            );

            setData("quotations", updatedData);

            alert("Quotation confirmed");
          }}
        />
      )}

    </div>
  );
};

export default QuotationCard;
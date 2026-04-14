import { useContext, useState } from "react";
import Button from "../../../components/ui/Button";
import Popup from "../../../components/ui/Popup";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import { useNavigate } from "react-router-dom";

const QuotationCard = ({ id, name, mobile, amount, status }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navi = useNavigate()
  const {quotations, setQuotations} = useContext(QuotationContext)

  return (
    <div 
    onClick={() => {navi(`/quotations/${id}`)}}
      className={`border cursor-pointer rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-lg transition
        ${status === "CONFIRM"
          ? "bg-green-100"
          : "bg-red-100"
        }
      `}
    >

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

      {/* Action */}
      {status === "PENDING" && (
        <Button
          btnName="Confirm"
          btnColor="green"
          btnWidth="w-auto px-2"
          onClick={(e) => {
            e.stopPropagation();   
            setShowPopup(true)
          }}
        />
      )}

      {/* Popup */}
      <Popup
        isOpen={showPopup}
        title="Confirm Action"
        message="Are you sure you want to confirm this quotation?"
        onConfirm={() => {
          
          const updatedData = quotations.map((item) =>
            item.id === Number(id) ? { ...item, status: "CONFIRM" } : item
          );

          setQuotations(updatedData)

          setShowPopup(false);
        }}

        onCancel={() => setShowPopup(false)}
      />

    </div>
  );
};

export default QuotationCard;
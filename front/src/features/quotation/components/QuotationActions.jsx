import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";

const QuotationActions = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">

      {/* Left Buttons */}
      <div className="flex gap-3">
        <Button btnName="Pending" btnColor="white" btnWidth="w-auto" txtCol="black" />
        <Button btnName="Confirmed" btnColor="green" btnWidth="w-auto" />
      </div>

      {/* Right Button */}
      <Button btnName="+ Send Quotation" btnColor="blue" btnWidth="w-auto" onClick={() => navigate("/quotation/send-quotation")}/>
    </div>
  );
};

export default QuotationActions;
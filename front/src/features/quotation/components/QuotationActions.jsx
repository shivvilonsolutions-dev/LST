import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";

const QuotationActions = ({setFilter}) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">

      {/* Left Buttons */}
      <div className="flex gap-3">
        <Button btnName="All" btnColor="white" btnWidth="w-auto" txtCol="black" onClick={()=>{setFilter("ALL")}} />
        <Button btnName="Pending" btnColor="yellow" btnWidth="w-auto" txtCol="black" onClick={()=>{setFilter("PENDING")}} />
        <Button btnName="Confirmed" btnColor="green" btnWidth="w-auto" onClick={()=>{setFilter("CONFIRM")}} />
      </div>

      {/* Right Button */}
      <Button btnName="+ Send Quotation" btnColor="blue" btnWidth="w-auto" onClick={() => navigate("/quotations/send-quotation")}/>
    </div>
  );
};

export default QuotationActions;
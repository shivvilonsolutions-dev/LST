import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Popup from "../../../utils/PopUp";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { addItem } from "../../../utils/localStorage";

const getCurrentDateTime = () => {
  const now = new Date();

  return now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const QuotationForm = () => {
  const navi = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [time, setTime] = useState(getCurrentDateTime());
  const [formData, setFormData] = useState({
    id: "",
    cliName: "",
    mobile: "",
    amount: "",
    materials: Array(5).fill({
      nameOfMaterial: "",
      gej: "",
      pic: "",
      qty: ""
    }),
    rateB: "",
    bending: "",
    add: "",
    status: "PENDING"
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...formData.materials];
    
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value
    };
    
    console.log(updatedMaterials)
    setFormData({
      ...formData,
      materials: updatedMaterials
    });
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value)

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      id: Date.now()
    })
  
    console.log("Form data: ", formData)
    addItem("quotations",formData)
    navi("/quotation")
  }

  return (
    <div className="bg-white border rounded-xl p-6 w-full max-w-7xl mx-auto">

      <form onSubmit={handleSubmit}>
        {/* Top Row */}
        <div className="flex flex-wrap gap-4 items-center justify-between">

          <div className="flex items-center justify-between w-full md:w-[63%]">
            <label className="text-lg font-medium mr-2" htmlFor="cliName">Client Name:</label>
            <Input
              inpType="text"
              inpName="cliName"
              inpPlaceholder="Enter name"
              inpWidth="w-[82%]"
              onChange={handleChange}
              inpValue={formData.cliName}
            />
          </div>

          <div className="w-full md:w-[35%]">
            <label className="text-lg font-medium">Date & Time: </label>
            {time}
          </div>

        </div>

        {/* Main Section */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">

          {/* Table Section */}
          <div className="flex-1 border rounded-lg overflow-hidden">

            <table className="w-full text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">No.</th>
                  <th className="border p-2 w-[55%]">Name of Material</th>
                  <th className="border p-2 w-[10%]">Gej</th>
                  <th className="border p-2 w-[10%]">Price</th>
                  <th className="border p-2 w-[15%]">Quantity</th>
                </tr>
              </thead>

              <tbody>
                {formData.materials.map((row, i) => {
                  
                  const isRowFilled = row.nameOfMaterial || row.gej || row.pic || row.qty;
                  return(
                  <tr key={i}>
                    
                    <td className="border">{i + 1}</td>

                    <td className="border py-1 px-2">
                      <Input
                        inpName="nameOfMaterial"
                        inpValue={row.nameOfMaterial}
                        rColor="black"
                        isReq={isRowFilled}
                        onChange={(e) =>
                          handleMaterialChange(i, "nameOfMaterial", e.target.value)
                        }
                        />
                    </td>

                    <td className="border py-1 px-2">
                      <Input
                        inpName="gej"
                        inpValue={row.gej}
                        rColor="black"
                        isReq={isRowFilled}
                        onChange={(e) =>
                          handleMaterialChange(i, "gej", e.target.value)
                        }
                        />
                    </td>

                    <td className="border py-1 px-2">
                      <Input
                        inpName="pic"
                        inpValue={row.pic}
                        rColor="black"
                        isReq={isRowFilled}
                        onChange={(e) =>
                          handleMaterialChange(i, "pic", e.target.value)
                        }
                        />
                    </td>

                    <td className="border py-1 px-2">
                      <Input
                        inpName="qty"
                        inpValue={row.qty}
                        rColor="black"
                        isReq={isRowFilled}
                        onChange={(e) =>
                          handleMaterialChange(i, "qty", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>

          </div>

          {/* Right Form - Mobile, Rate B, Bending, Add, Quotation Amount */}
          <div className="w-full md:w-[35%] flex flex-col gap-3">

            <div className="flex items-center gap-3">
              <label className="w-32" htmlFor="mobile">Mobile No.:</label>
              <Input inpType="text" inpName="mobile" inpValue={formData.mobile} onChange={handleChange} inpPlaceholder="0000000000" isReq={true} />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-32" htmlFor="rateB">Rate B:</label>
              <Input inpType="text" inpName="rateB" inpValue={formData.rateB} inpPlaceholder="-----" />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-32" htmlFor="bending">Bending:</label>
              <Input inpType="text" inpName="bending" inpValue={formData.bending} inpPlaceholder="-----" />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-32" htmlFor="add">Add:</label>
              <Input inpType="text" inpName="add" inpValue={formData.add} inpPlaceholder="-----" />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-32" htmlFor="amount">Quotation Amt:</label>
              <Input inpType="text" inpName="amount" inpValue={formData.amount} onChange={handleChange} inpPlaceholder="30000" isReq={true} />
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-gray-600">
          ----- Warning msg or Instructions -----
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-2">
          <Button btnName="Send Quotation" btnColor="blue" btnWidth="w-auto px-6" onClick={() => { setShowPopup(true)}} />
          <Button btnName="Cancel" btnColor="white" txtCol="black" btnWidth="w-auto px-6" onClick={() => { navi("/quotation") }} />
        </div>

        <Popup
          isOpen={showPopup}
          title="Confirm Action"
          message="Quotation send"
          onConfirm={() => {
            console.log("Confirmed");
            setShowPopup(false);
          }}
          onCancel={() => setShowPopup(false)}
        />

      </form>
    </div>
  );
};

export default QuotationForm;
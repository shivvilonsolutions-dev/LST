import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import getCurrentDateTime from "../../../utils/getCurrentDateAndTime";
import calculateAmount from "../../../utils/calculateQuotationAmount";

const QuotationDetail = () => {
  const { quotations, setQuotations } = useContext(QuotationContext);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false)
  const navi = useNavigate();
  const quotation = quotations.find((q) => q.id == Number(id));

  const [editData, setEditData] = useState(quotation)

  const renderCell = (field, index) => {
    const value = editData.materials[index][field]

    return (
      <td className="border py-1 px-2">
        {isEditing ? (
          <Input
            inpValue={value}
            inpWidth="w-full"
            onChange={(e) =>
              handleMaterialChange(index, field, e.target.value)
            }
          />
        ) : (
          <span className="px-1">{value}</span>
        )}
      </td>
    );
  };

  useEffect(() => {
    setEditData(quotation);
  }, [quotation]);

  const total = calculateAmount(editData);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMaterialChange = (index, field, value) => {
    const updated = [...editData.materials];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setEditData({
      ...editData,
      materials: updated,
    });
  };

  const handleSave = () => {
    const updatedItem = {
      ...editData,
      quotationDate: getCurrentDateTime(),
      amount: total,
    };

    const updatedData = quotations.map((item) =>
      item.id == id ? updatedItem : item
    );

    setQuotations(updatedData);
    setEditData(updatedItem);
    setIsEditing(false);
  };

  if (!quotation) return <div className="p-6">Quotation Not Found</div>;

  return (
    <div className="border rounded-xl p-6 bg-white">

      {/* Top Actions */}
      <div className="flex justify-end gap-4 mt-[-20px] mb-4">
        {!isEditing ? (
          <Button
            btnName="Edit"
            btnColor="blue"
            btnWidth="w-auto px-6"
            onClick={() => setIsEditing(true)}
          />
        ) : (
          <Button
            btnName="Save"
            btnColor="green"
            btnWidth="w-auto px-6"
            onClick={handleSave}
          />
        )}
        <Button btnName="PRINT" btnColor="red" btnWidth="w-auto px-6" onClick={() => window.print()} />
        <Button btnName="BACK" btnColor="white" txtCol="black" btnWidth="w-auto px-6" onClick={() => navi("/quotations")} />
      </div>

      {/* Top Row */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">

        {/* Client Name */}
        <div className="flex items-center gap-3 flex-1">
          <span className="text-lg font-medium">Client Name:</span>
          <Input inpName={"cliName"} readOnly={!isEditing} onChange={handleChange} inpValue={editData.cliName} inpWidth="w-[80%]" />
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <Input readOnly={!isEditing} onChange={handleChange} inpValue={editData.quotationDate} inpWidth="w-70" />
        </div>

      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 w-[5%]">No.</th>
              <th className="border p-2 w-[50%]">Name of Material</th>
              <th className="border p-2 w-[10%]">Gej</th>
              <th className="border p-2 w-[10%]">Price</th>
              <th className="border p-2 w-[15%]">Quantity</th>
            </tr>
          </thead>

          <tbody>
            {
              editData.materials ?
                (
                  editData.materials.map((row, i) => (
                    <tr key={i}>
                      <td className="border p-2">{i + 1}</td>
                      {renderCell("nameOfMaterial", i)}
                      {renderCell("gej", i)}
                      {renderCell("pic", i)}
                      {renderCell("qty", i)}
                    </tr>
                  ))
                ) : (
                  <h2 className="p-3 text-2xl">No materials</h2>
                )
            }
          </tbody>

        </table>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6">

        {/* Left */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span>Mobile No.:</span>
            <Input inpName={"mobile"} readOnly={!isEditing} onChange={handleChange} inpValue={editData.mobile} inpWidth="w-40" />
          </div>

          <div className="flex items-center gap-3">
            <span>Rate B:</span>
            <Input inpName={"rateB"} readOnly={!isEditing} onChange={handleChange} inpValue={editData.rateB} inpWidth="w-40" />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span>Bending:</span>
            <Input inpName={"bending"} readOnly={!isEditing} onChange={handleChange} inpValue={editData.bending} inpWidth="w-40" />
          </div>

          <div className="flex items-center gap-3">
            <span>Add:</span>
            <Input inpName={"add"} readOnly={!isEditing} onChange={handleChange} inpValue={editData.add} inpWidth="w-40" />
          </div>

          <div className="flex items-center gap-3">
            <span>Quotation Amount:</span>
            <Input inpName={total} readOnly  inpValue={editData.amount} inpWidth="w-40" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default QuotationDetail;
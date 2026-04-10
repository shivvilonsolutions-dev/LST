import Button from "../components/ui/Button";

const Popup = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          
          <Button
            btnName="Cancel"
            btnColor="gray"
            txtCol="black"
            btnWidth="w-auto px-4"
            onClick={onCancel}
          />

          <Button
            btnName="OK"
            btnColor="blue"
            btnWidth="w-auto px-4"
            onClick={onConfirm}
          />

        </div>

      </div>

    </div>
  );
};

export default Popup;
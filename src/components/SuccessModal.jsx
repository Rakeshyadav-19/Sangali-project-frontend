import { useEffect } from "react";

function SuccessModal({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // auto-close after 2 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#00A6FB] p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold text-[#051923] mb-2">Success ✅</h2>
        <p className="text-[#003554]">{message}</p>
      </div>
    </div>
  );
}

export default SuccessModal;

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"; 
import Header from "@/components/Header";  
import PaymentSuccess from "./components/PaymentSuccess";

const Payment= () => {
    return (
        <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full p-6 rounded-lg shadow-md">
            <PaymentSuccess></PaymentSuccess>
      </div>
    </div>
        </>
    );
}

export default Payment;
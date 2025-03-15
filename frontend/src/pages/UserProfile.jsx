import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"; 
import Header from "../components/Header";  
import Profile from "../components/Profile";

const Payment = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
    
    return (
        <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full p-6 rounded-lg shadow-md">
            <Profile></Profile>
      </div>
    </div>
        </>
    );
}

export default Payment;
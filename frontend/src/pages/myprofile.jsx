import { useNavigate } from "react-router-dom"; 
import Header from "../components/Header";  
import Profile from "../components/Profile";

const UserProfile = () => {
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

export default UserProfile;
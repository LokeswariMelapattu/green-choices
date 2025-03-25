import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkout from "./pages/Checkout/Checkout";
import NotFound from "./pages/NotFound";
import { TransportProvider } from '@/context/transport-context';
import Cart from "./pages/Cart/Cart"; 
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import UserProfile from "./pages/Profile/MyProfile";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import { Provider } from "react-redux"
import { store } from "./redux/store"
import OrderTrackingPage from "./pages/OrderTracking/OrderTracking";
import './styles/style.css'


const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <TransportProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="/tracking" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TransportProvider>
    </TooltipProvider>
  </Provider>
);

export default App;

import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkout from "./pages/checkout";
import NotFound from "./pages/NotFound";
import { TransportProvider } from '@/context/transport-context';
import Cart from "./pages/cart"; 
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { Provider } from "react-redux"
import { store } from "./redux/store"

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TransportProvider>
    </TooltipProvider>
  </Provider>
);

export default App;

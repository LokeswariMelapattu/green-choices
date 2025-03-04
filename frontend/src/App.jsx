import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import NotFound from "./pages/NotFound";
import { TransportProvider } from '@/context/transport-context';
import Cart from "./pages/cart";
import { Provider } from "react-redux"
import { store } from "./redux/store"

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <TransportProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TransportProvider>
    </TooltipProvider>
  </Provider>
);

export default App;

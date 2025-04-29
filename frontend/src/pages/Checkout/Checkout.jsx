import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RouteMap from '@/components/RouteMap';
import RouteSelector from '@/components/RouteSelector';
import RouteDetails from '@/components/RouteDetails';
import { Card } from '@/components/ui/Card';
import useRoutes from '../../hooks/useRoutes';
import Comparision from './components/Comparision';
import EmissionMeter from './components/EmissionMeter';
import OrderSummary from './components/OrderSummary';
import CarbonModal from './components/CarbonModal';
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { setUser } from "../../redux/slices/authSlice";
import styles from './Checkout.module.css'
const Checkout = () => {
  const { routes, selectedRoute, setSelectedRoute, totalEmissions, greenestRoute, isLoading } = useRoutes();
  const [selectedModes, setSelectedModes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const location = useLocation(); // Get location object
  const totalAmount = location.state?.totalAmount; // Retrieve total amount from state (optional chaining)
  const cartItems = location.state?.cartItems || []; // Retrieve cart items
  const [isLowSustainable, setIsLowSustainable] = useState("");
  const user = JSON.parse(localStorage.getItem('user')).data;

  useEffect(() => {
    dispatch(setUser({
      id: user.userid,
      userName: user.username,
      shippingAddress: user.address
    }));
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.gridSection}>
            <div className={styles.sectionLeft}>
              <Card className={styles.mapCard}>
                <RouteMap route={selectedRoute} />
              </Card>

              {routes && (
                <Card className={styles.routeCard}>
                  <RouteSelector
                    routes={routes.routes}
                    selectedRoute={selectedRoute}
                    onRouteSelect={setSelectedRoute}
                  />
                </Card>
              )}
              <div>
                {selectedRoute && (
                  <div>
                    <RouteDetails
                      route={selectedRoute}
                      selectedModes={selectedModes}
                      setSelectedModes={setSelectedModes}
                      greenestRoute={greenestRoute}
                    />
                  </div>
                )}
              </div>

            </div>

            <div className={styles.sectionRight}>
              <Card className={styles.comparision}>
                <Comparision maxValue={500} />
              </Card>
              <Card className={styles.emissionMeter}>
                <EmissionMeter
                  currentValue={
                    totalEmissions?.find(e => e.name === selectedRoute?.routeNumber)?.minTotalEmissions || 0
                  } maxValue={500}
                  // maxValue={
                  //   Math.max(...(totalEmissions?.map(e => e.maxTotalEmissions) || []))
                  // }
                  onEmissionsClick={() => setShowModal(true)}
                  setLowSustainable={setIsLowSustainable}
                />
              </Card>

              <OrderSummary
                selectedRoute={selectedRoute}
                selectedModes={selectedModes}
                isLowSustainable={isLowSustainable}
                greenestRoute={greenestRoute}
                totalAmount={totalAmount}
                cartItems={cartItems}
              />
            </div>
          </div>

          {showModal && (
            <CarbonModal showModal={showModal} setShowModal={setShowModal} />
          )}
        </main>
      </div>
    </>
  );
};

export default Checkout;

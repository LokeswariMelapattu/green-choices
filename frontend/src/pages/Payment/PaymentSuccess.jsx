import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"; 
import Header from "@/components/Header";  
import PaymentSuccess from "./components/PaymentSuccess";
import styles from './PaymentSuccess.module.css'
const Payment= () => {
    return (
        <>
            <Header />
            <div className={styles.section}>
                <div className={styles.sectionDiv}>
                        <PaymentSuccess></PaymentSuccess>
                </div>
            </div>
        </>
    );
}

export default Payment;
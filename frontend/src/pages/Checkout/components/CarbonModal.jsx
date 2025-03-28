import Cloud from "../../../components/ui/Cloud";
import styles from "./OrderComponents.module.css"
const CarbonModal = ({ showModal, setShowModal }) => {
    const emissionReasons = [
        "Availability of only flight transport",
        "Weather conditions affecting green transport",
        "Longer distance requiring traditional delivery"
    ]

    if (!showModal) return null;

    const handleOverlayClick = (event) => {
        if (showModal) {
            setShowModal(false);
        }
    };

    return (
        <div className={styles.container} onClick={handleOverlayClick}>
            <div className={styles.section}>
                <div className={styles.header}>
                    <h3 className={styles.heading}>Why Can't We Find More <span className="text-green-600">Sustainable</span> Routes?</h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className={styles.closeButton}
                    >
                        &times;
                    </button>
                </div>

                <div className="absolute" style={{ marginTop: '25px', left: '-10px' }}>
                    <Cloud text={emissionReasons[0]} />
                </div>

                <div className="absolute" style={{ marginTop: '250px', left: '0' }}>
                    <Cloud text={emissionReasons[1]} />
                </div>

                <div className="absolute" style={{ marginTop: '130px', marginLeft: '500px' }}>
                    <Cloud text={emissionReasons[2]} />
                </div>

                <div className={styles.imgDiv}>
                    <img src="imgs/earth-emissions.png" alt="An earth emitting CO2" className="h-80" />
                </div>
            </div>
        </div>
    );
}

export default CarbonModal;
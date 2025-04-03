import styles from "./CarbonModal.module.css" 

const CarbonModal = ({ showModal, setShowModal }) => { 
    if (!showModal) return null;

    const handleOverlayClick = (event) => {
        if (showModal) {
            setShowModal(false);
        }
    };
 
    return (
       <div className={styles.container}>
            <div className={styles.section}>
            <img 
                src="/imgs/earth-light.png" 
                alt="Earth Light" 
                className={styles.earthImg}
            />
            <div className={styles.header}>
                <h3 className={styles.heading}>
                Why can’t we find more <span className={styles.greenText}>sustainable</span> routes ?</h3>
                <button
                    onClick={() => setShowModal(false)}
                    className={styles.closeButton}
                >
                    &times;
                </button>
            </div>
            <div className={styles.item1}>
                    <img
                    src="/imgs/gas-pump.png"
                    alt="Fuel icon"
                    className={styles.itemImage1}
                    /> 
                    <p className={styles.itemContent1}>
                    In the USA, many older ships are still in operation. Older cargo ships can emit 0.5-1.0 kg of CO₂ per tonne-kilometer, whereas newer ships might emit only 0.35-0.4 kg.
                    </p> 
            </div>
            <div className={styles.item2}> 
                    <p className={styles.itemContent2}>
                        Maritime routes between Asia and Europe are outdated, forcing ships to take longer journeys, which increases emissions and fuel costs. Shipping companies also continue to use inefficient routes to avoid regulatory issues or geopolitical tensions.
                    </p> 
                    <img
                        src="/imgs/woman.png"
                        alt="Fuel icon"
                        className={styles.itemImage2}
                        />
            </div>
            <div className={styles.item3}>
                <img
                    src="/imgs/battery.png"
                    alt="Fuel icon"
                    className={styles.itemImage3}
                    />
                <div>
                    <button className={styles.btnPetition}>
                        Petition
                    </button>
                    <p className={styles.itemContent3}>
                        Take action for a 
                        <span className={styles.greenText}>greener future!</span>
                        Support sustainable shipping by signing this petition to mandate biofuel-powered ships and reduce carbon emissions. 
                        <span className={styles.greenerShipping}>Sign Now to Demand Greener Shipping!</span>
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
}

export default CarbonModal;
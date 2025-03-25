import Cloud from "../../../components/ui/Cloud";

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] h-[500px] relative">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-center w-full">Why Can't We Find More <span className="text-green-600">Sustainable</span> Routes?</h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
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

                <div className="flex justify-center py-10">
                    <img src="imgs/earth-emissions.png" alt="An earth emitting CO2" className="h-80" />
                </div>
            </div>
        </div>
    );
}

export default CarbonModal;
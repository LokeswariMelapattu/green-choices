const CarbonModal = ({ showModal, setShowModal }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] h-[500px]">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-center w-full">Why Can't We Find More Sustainable Routes?</h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex justify-center py-10">
                    <img src='imgs/earth-emissions.png' alt="An earth emitting CO2" className="h-80" />
                </div>
            </div>
        </div>
    );
}

export default CarbonModal;
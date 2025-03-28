const Cloud = ({ text }) => (
    <div style={{ margin: 0, padding: 0, border: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="container" style={{ width: '50%', margin: '25px 35%' }}>
            <div className="cloud" style={{
                position: 'relative',
                width: '250px',
                height: '120px',
                backgroundColor: 'white',
                borderRadius: '50px 50px',
            }}>
                <div style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderRadius: '50px 50px',
                    zIndex: 0,
                    top: '50px',
                    width: '100%',
                    height: '75px',
                    background: '#ffffff',
                    zIndex: 1,
                    borderBottom: '2px solid #000000',
                    borderLeft: '2px solid #000000',
                    borderRight: '2px solid #000000'
                }}></div>
                <div style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderRadius: '50px 50px',
                    left: '15%',
                    top: '15px',
                    width: '100px',
                    height: '100px',
                    background: '#ffffff',
                    borderTop: '2px solid #000000'
                }}></div>
                <div style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderRadius: '50px 50px',
                    right: '15%',
                    width: '100px',
                    height: '100px',
                    background: '#ffffff',
                    borderTop: '2px solid #000000'
                }}></div>

                <div className="cloud-text" style={{
                    position: 'absolute',
                    top: '60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    // maxWidth: '80%',
                    minWidth: '200px'
                }}>
                    {text}
                </div>
            </div>
        </div>
    </div>
);

export default Cloud

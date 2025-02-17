const Card = ({ children, className = "" }) => {
    return (
        <div className={`border rounded-lg shadow-md bg-white p-4 ${className}`}>
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = "" }) => {
    return (
        <div className={`text-lg font-semibold border-b pb-2 mb-2 ${className}`}>
            {children}
        </div>
    );
};

const CardContent = ({ children, className = "" }) => {
    return <div className={className}>{children}</div>;
};

export { Card, CardHeader, CardContent };

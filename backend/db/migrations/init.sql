-- Create tables
CREATE TABLE IF NOT EXISTS User_Info (
    UserID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Address TEXT,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS User_Info_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    UserID INT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Address TEXT,
    Email VARCHAR(100),
    Password VARCHAR(255),
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Route_Info (
    RouteID SERIAL PRIMARY KEY,
    OrderID INT, -- REFERENCES Order_info(OrderID), -- No Order_info yet
    Source VARCHAR(100) NOT NULL,
    Destination VARCHAR(100) NOT NULL,
    CarbonEmission INT,
    Duration INT,
    TotalCost INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS Route_Info_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    RouteID INT,
    OrderID INT,
    Source VARCHAR(100),
    Destination VARCHAR(100),
    CarbonEmission INT,
    Duration INT,
    TotalCost INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Route_Details (
    RouteDetailID SERIAL PRIMARY KEY,
    RouteID INT REFERENCES Route_Info(RouteID),
    SeqNo INT NOT NULL,
    Source VARCHAR(100) NOT NULL,
    Destination VARCHAR(100) NOT NULL,
    TransportMode VARCHAR(50) NOT NULL,
    CarbonEmission INT,
    Duration INT,
    Cost INT,
    Distance INT,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS Route_Details_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    RouteDetailID INT,
    RouteID INT,
    SeqNo INT NOT NULL,
    Source VARCHAR(100) NOT NULL,
    Destination VARCHAR(100) NOT NULL,
    TransportMode VARCHAR(50) NOT NULL,
    CarbonEmission INT,
    Duration INT,
    Cost INT,
    Distance INT,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Route_Status (
    RouteStatusID SERIAL PRIMARY KEY,
    RouteID INT REFERENCES Route_Info(RouteId),
    RouteDetailID INT REFERENCES Route_Details(RouteDetailID),
    SeqNo INT NOT NULL,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS Route_Status_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    RouteStatusID INT,
    RouteID INT,
    RouteDetailID INT,
    SeqNo INT NOT NULL,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Order_Info table
CREATE TABLE IF NOT EXISTS Order_Info (
    OrderID SERIAL PRIMARY KEY,
    UserID INT REFERENCES User_Info(UserID) ON DELETE CASCADE,
    ShippingAddress TEXT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    DeliveryCharge DECIMAL(10,2) NOT NULL,
    OrderStatus VARCHAR(50) DEFAULT 'Pending',
    IsSustainableOption BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Order_Details table
CREATE TABLE IF NOT EXISTS Order_Details (
    OrderDetailID SERIAL PRIMARY KEY,
    OrderID INT REFERENCES Order_Info(OrderID) ON DELETE CASCADE,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    ProductColor VARCHAR(50),
    ProductSize VARCHAR(50),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Order_Info_A audit table
CREATE TABLE IF NOT EXISTS Order_Info_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    OrderID INT,
    UserID INT,
    ShippingAddress TEXT,
    TotalAmount DECIMAL(10,2),
    DeliveryCharge DECIMAL(10,2),
    OrderStatus VARCHAR(50),
    IsSustainableOption BOOLEAN,
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
);

-- Create Order_Details_A audit table
CREATE TABLE IF NOT EXISTS Order_Details_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    OrderDetailID INT,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    Price DECIMAL(10,2),
    ProductColor VARCHAR(50),
    ProductSize VARCHAR(50),
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
);
-- End of Create Tables

-- Trigger function for audit
CREATE OR REPLACE FUNCTION fn_User_Info_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO User_Info_A (
            Operation, UserID, FirstName, LastName, Address, 
            Email, Password, CreatedAt, UpdatedAt
        ) VALUES (
            'I', NEW.UserID, NEW.FirstName, NEW.LastName, NEW.Address, 
            NEW.Email, NEW.Password, NEW.CreatedAt, NEW.UpdatedAt
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO User_Info_A (
            Operation, UserID, FirstName, LastName, Address, 
            Email, Password, CreatedAt, UpdatedAt
        ) VALUES (
            'U', NEW.UserID, NEW.FirstName, NEW.LastName, NEW.Address, 
            NEW.Email, NEW.Password, NEW.CreatedAt, NEW.UpdatedAt
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO User_Info_A (
            Operation, UserID, FirstName, LastName, Address, 
            Email, Password, CreatedAt, UpdatedAt
        ) VALUES (
            'D', OLD.UserID, OLD.FirstName, OLD.LastName, OLD.Address, 
            OLD.Email, OLD.Password, OLD.CreatedAt, OLD.UpdatedAt
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_Route_Info_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Route_Info_A (
            Operation, RouteID, OrderID, Source, Destination, 
            CarbonEmission, Duration, TotalCost, LastUpdatedUserID,
            LastUpdatedDate
        ) VALUES (
            'I', NEW.RouteID, NEW.OrderID, NEW.Source, NEW.Destination, 
            NEW.CarbonEmission, NEW.Duration, NEW.TotalCost, NEW.LastUpdatedUserID,
            NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Route_Info_A (
            Operation, RouteID, OrderID, Source, Destination, 
            CarbonEmission, Duration, TotalCost, LastUpdatedUserID,
            LastUpdatedDate
        ) VALUES (
            'U', NEW.RouteID, NEW.OrderID, NEW.Source, NEW.Destination, 
            NEW.CarbonEmission, NEW.Duration, NEW.TotalCost, NEW.LastUpdatedUserID,
            NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Route_Info_A (
            Operation, RouteID, OrderID, Source, Destination, 
            CarbonEmission, Duration, TotalCost, LastUpdatedUserID,
            LastUpdatedDate
        ) VALUES (
            'D', OLD.RouteID, OLD.OrderID, OLD.Source, OLD.Destination, 
            OLD.CarbonEmission, OLD.Duration, OLD.TotalCost, OLD.LastUpdatedUserID,
            OLD.LastUpdatedDate
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_Route_Details_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Route_Details_A (
            Operation, RouteDetailID, RouteID, SeqNo, Source, Destination, 
            TransportMode, CarbonEmission, Duration, Cost, Distance,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'I', NEW.RouteDetailID, NEW.RouteID, NEW.SeqNo, NEW.Source, NEW.Destination, 
            NEW.TransportMode, NEW.CarbonEmission, NEW.Duration, NEW.Cost, NEW.Distance,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Route_Details_A (
            Operation, RouteDetailID, RouteID, SeqNo, Source, Destination, 
            TransportMode, CarbonEmission, Duration, Cost, Distance,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'U', NEW.RouteDetailID, NEW.RouteID, NEW.SeqNo, NEW.Source, NEW.Destination, 
            NEW.TransportMode, NEW.CarbonEmission, NEW.Duration, NEW.Cost, NEW.Distance,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Route_Details_A (
            Operation, RouteDetailID, RouteID, SeqNo, Source, Destination, 
            TransportMode, CarbonEmission, Duration, Cost, Distance,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'D', OLD.RouteDetailID, OLD.RouteID, OLD.SeqNo, OLD.Source, OLD.Destination, 
            OLD.TransportMode, OLD.CarbonEmission, OLD.Duration, OLD.Cost, OLD.Distance,
            OLD.LastUpdatedUserID, OLD.LastUpdatedDate
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_Route_Status_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Route_Status_A (
            Operation, RouteStatusID, RouteID, RouteDetailID, SeqNo,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'I', NEW.RouteStatusID, NEW.RouteID, NEW.RouteDetailID, NEW.SeqNo,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Route_Status_A (
            Operation, RouteStatusID, RouteID, RouteDetailID, SeqNo,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'U', NEW.RouteStatusID, NEW.RouteID, NEW.RouteDetailID, NEW.SeqNo,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Route_Status_A (
            Operation, RouteStatusID, RouteID, RouteDetailID, SeqNo,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'D', OLD.RouteStatusID, OLD.RouteID, OLD.RouteDetailID, OLD.SeqNo,
            OLD.LastUpdatedUserID, OLD.LastUpdatedDate
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_Order_Info_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Order_Info_A (
            Operation, OrderID, UserID, ShippingAddress, TotalAmount,
            DeliveryCharge, OrderStatus, IsSustainableOption, CreatedAt, UpdatedAt)
        VALUES (
            'I', NEW.OrderID, NEW.UserID, NEW.ShippingAddress, NEW.TotalAmount, 
            NEW.DeliveryCharge, NEW.OrderStatus, NEW.IsSustainableOption, NEW.CreatedAt, NEW.UpdatedAt
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Order_Info_A (
            Operation, OrderID, UserID, ShippingAddress, TotalAmount, DeliveryCharge,
             OrderStatus, IsSustainableOption, CreatedAt, UpdatedAt
        ) VALUES (
                'U', NEW.OrderID, NEW.UserID, NEW.ShippingAddress, NEW.TotalAmount, NEW.DeliveryCharge, 
                NEW.OrderStatus, NEW.IsSustainableOption, NEW.CreatedAt, NEW.UpdatedAt
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Order_Info_A (
            Operation, OrderID, UserID, ShippingAddress, TotalAmount, DeliveryCharge,
             OrderStatus, IsSustainableOption, CreatedAt, UpdatedAt
        ) VALUES (
            'D', OLD.OrderID, OLD.UserID, OLD.ShippingAddress, OLD.TotalAmount, 
            OLD.DeliveryCharge, OLD.OrderStatus, OLD.IsSustainableOption, OLD.CreatedAt, OLD.UpdatedAt);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for Order_Details audit
CREATE OR REPLACE FUNCTION fn_Order_Details_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Order_Details_A (Operation, OrderDetailID, OrderID, ProductID, Quantity, Price, ProductColor, ProductSize)
        VALUES ('I', NEW.OrderDetailID, NEW.OrderID, NEW.ProductID, NEW.Quantity, NEW.Price, NEW.ProductColor, NEW.ProductSize);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Order_Details_A (Operation, OrderDetailID, OrderID, ProductID, Quantity, Price, ProductColor, ProductSize)
        VALUES ('U', NEW.OrderDetailID, NEW.OrderID, NEW.ProductID, NEW.Quantity, NEW.Price, NEW.ProductColor, NEW.ProductSize);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Order_Details_A (Operation, OrderDetailID, OrderID, ProductID, Quantity, Price, ProductColor, ProductSize)
        VALUES ('D', OLD.OrderDetailID, OLD.OrderID, OLD.ProductID, OLD.Quantity, OLD.Price, OLD.ProductColor, OLD.ProductSize);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- End of Trigger function for audit

-- Create triggers
CREATE OR REPLACE TRIGGER tr_User_Info_Insert
AFTER INSERT ON User_Info
FOR EACH ROW
EXECUTE FUNCTION fn_User_Info_Audit();

CREATE OR REPLACE TRIGGER tr_User_Info_Update
AFTER UPDATE ON User_Info
FOR EACH ROW
EXECUTE FUNCTION fn_User_Info_Audit();

CREATE OR REPLACE TRIGGER tr_User_Info_Delete
AFTER DELETE ON User_Info
FOR EACH ROW
EXECUTE FUNCTION fn_User_Info_Audit();

-- Route_Info Triggers
CREATE OR REPLACE TRIGGER tr_Route_Info_Insert
AFTER INSERT ON Route_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Info_Audit();

CREATE OR REPLACE TRIGGER tr_Route_Info_Update
AFTER UPDATE ON Route_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Info_Audit();

CREATE OR REPLACE TRIGGER tr_Route_Info_Delete
AFTER DELETE ON Route_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Info_Audit();

-- Route_Details Triggers
CREATE OR REPLACE TRIGGER tr_Route_Details_Insert
AFTER INSERT ON Route_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Details_Audit();

CREATE OR REPLACE TRIGGER tr_Route_Details_Update
AFTER UPDATE ON Route_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Details_Audit();

CREATE OR REPLACE TRIGGER tr_Route_Details_Delete
AFTER DELETE ON Route_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Details_Audit();

-- Route_Status Triggers
CREATE OR REPLACE TRIGGER tr_Route_Status_Insert
AFTER INSERT ON Route_Status
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Status_Audit();

CREATE OR REPLACE TRIGGER tr_Route_Status_Update
AFTER UPDATE ON Route_Status
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Status_Audit();

CREATE OR REPLACE TRIGGER tr_Route_Status_Delete
AFTER DELETE ON Route_Status
FOR EACH ROW
EXECUTE FUNCTION fn_Route_Status_Audit();


-- Create triggers for Order_Info
CREATE OR REPLACE TRIGGER tr_Order_Info_Insert
AFTER INSERT ON Order_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Info_Audit();

CREATE OR REPLACE TRIGGER tr_Order_Info_Update
AFTER UPDATE ON Order_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Info_Audit();

CREATE OR REPLACE TRIGGER tr_Order_Info_Delete
AFTER DELETE ON Order_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Info_Audit();

-- Create triggers for Order_Details
CREATE OR REPLACE TRIGGER tr_Order_Details_Insert
AFTER INSERT ON Order_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Details_Audit();

CREATE OR REPLACE TRIGGER tr_Order_Details_Update
AFTER UPDATE ON Order_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Details_Audit();

CREATE OR REPLACE TRIGGER tr_Order_Details_Delete
AFTER DELETE ON Order_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Details_Audit();

-- End of Create triggers

-- Create stored procedures
CREATE OR REPLACE PROCEDURE sp_InsertUser(
    p_FirstName VARCHAR(50),
    p_LastName VARCHAR(50),
    p_Address TEXT,
    p_Email VARCHAR(100),
    p_Password VARCHAR(255),
    OUT p_UserID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO User_Info (FirstName, LastName, Address, Email, Password)
    VALUES (p_FirstName, p_LastName, p_Address, p_Email, p_Password)
    RETURNING UserID INTO p_UserID;
    
    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_UpdateUser(
    p_UserID INT,
    p_FirstName VARCHAR(50),
    p_LastName VARCHAR(50),
    p_Address TEXT,
    p_Email VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE User_Info
    SET FirstName = p_FirstName,
        LastName = p_LastName,
        Address = p_Address,
        Email = p_Email,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE UserID = p_UserID;
    
    COMMIT;
END;
$$;

-- Route_info SPs
CREATE OR REPLACE PROCEDURE sp_InsertRoute(
    p_OrderID INT,
    p_Source VARCHAR(100),
    p_Destination VARCHAR(100),
    p_CarbonEmission INT,
    p_Duration INT,
    p_TotalCost INT,
    p_LastUpdatedUserID INT,
    OUT p_RouteID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Route_Info (OrderID, Source, Destination, CarbonEmission, Duration, TotalCost, LastUpdatedUserID)
    VALUES (p_OrderID, p_Source, p_Destination, p_CarbonEmission, p_Duration, p_TotalCost, p_LastUpdatedUserID)
    RETURNING RouteID INTO p_RouteID;

    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_UpdateRoute(
    p_RouteID INT,
    p_OrderID INT,
    p_Source VARCHAR(100),
    p_Destination VARCHAR(100),
    p_CarbonEmission INT,
    p_Duration INT,
    p_TotalCost INT,
    p_LastUpdatedUserID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Route_Info
    SET Source = p_Source,
        Destination = p_Destination,
        CarbonEmission = p_CarbonEmission,
        Duration = p_Duration,
        TotalCost = p_TotalCost,
        LastUpdatedUserID = p_LastUpdatedUserID,
        LastUpdatedDate = CURRENT_TIMESTAMP
    WHERE RouteID = p_RouteID AND OrderID = p_OrderID;
    
    COMMIT;
END;
$$;

-- Route_Details SPs
CREATE OR REPLACE PROCEDURE sp_InsertRouteDetails(
    p_RouteID INT,
    p_SeqNo INT,
    p_Source VARCHAR(100),
    p_Destination VARCHAR(100),
    p_TransportMode VARCHAR(50),
    p_CarbonEmission INT,
    p_Duration INT,
    p_Cost INT,
    p_Distance INT,
    p_StatusID INT,
    p_LastUpdatedUserID INT,
    OUT p_RouteDetailID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Route_Details (RouteID, SeqNo, Source, Destination, TransportMode, 
                                CarbonEmission, Duration, Cost, Distance, StatusID, LastUpdatedUserID)
    VALUES (p_RouteID, p_SeqNo, p_Source, p_Destination, p_TransportMode, 
                                p_CarbonEmission, p_Duration, p_Cost, p_Distance, p_StatusID, p_LastUpdatedUserID)
    RETURNING RouteDetailID INTO p_RouteDetailID;

    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_UpdateRouteDetails(
    p_RouteDetailID INT,
    p_RouteID INT,
    p_SeqNo INT,
    p_Source VARCHAR(100),
    p_Destination VARCHAR(100),
    p_TransportMode VARCHAR(50),
    p_CarbonEmission INT,
    p_Duration INT,
    p_Cost INT,
    p_Distance INT,
    p_StatusID INT,
    p_LastUpdatedUserID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Route_Details
    SET SeqNo = p_SeqNo,
        Source = p_Source,
        Destination = p_Destination,
        TransportMode = p_TransportMode,
        CarbonEmission = p_CarbonEmission,
        Duration= p_Duration,
        Cost = p_Cost,
        Distance = p_Distance,
        StatusID = p_StatusID,
        LastUpdatedUserID = p_LastUpdatedUserID,
        LastUpdatedDate = CURRENT_TIMESTAMP
    WHERE RouteDetailID = p_RouteDetailID AND RouteID = p_RouteID;
    
    COMMIT;
END;
$$;

-- Route_Detail SPs
CREATE OR REPLACE PROCEDURE sp_InsertRouteStatus(
    p_RouteID INT,
    p_RouteDetailID INT,
    p_SeqNo INT,
    p_StatusID INT,
    p_LastUpdatedUserID INT,
    OUT p_RouteStatusID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Route_Status (RouteID, RouteDetailID, SeqNo, StatusID, LastUpdatedUserID)
    VALUES (p_RouteID, p_RouteDetailID, p_SeqNo, p_StatusID, p_LastUpdatedUserID)
    RETURNING RouteStatusID INTO p_RouteStatusID;

    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_UpdateRouteStatus(
    p_RouteStatusID INT,
    p_RouteID INT,
    p_RouteDetailID INT,
    p_SeqNo INT,
    p_StatusID INT,
    p_LastUpdatedUserID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Route_Status
    SET RouteDetailID = p_RouteDetailID,
        SeqNo = p_SeqNo,
        StatusID = p_StatusID,
        LastUpdatedUserID = p_LastUpdatedUserID,
        LastUpdatedDate = CURRENT_TIMESTAMP
    WHERE RouteStatusID = p_RouteStatusID AND RouteID = p_RouteID;
    
    COMMIT;
END;
$$;

-- Create stored procedure to insert Order_Info
CREATE OR REPLACE PROCEDURE sp_InsertOrder(
    IN p_UserID INT,
    IN p_ShippingAddress TEXT,
    IN p_TotalAmount DECIMAL(10,2),
    IN p_DeliveryCharge DECIMAL(10,2),
    IN p_OrderStatus VARCHAR(50),
    IN p_IsSustainableOption BOOLEAN,
    OUT p_OrderID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Order_Info (UserID, ShippingAddress, TotalAmount, DeliveryCharge, OrderStatus, IsSustainableOption)
    VALUES (p_UserID, p_ShippingAddress, p_TotalAmount, p_DeliveryCharge, p_OrderStatus, p_IsSustainableOption)
    RETURNING OrderID INTO p_OrderID;
END;
$$;

-- Create stored procedure to update Order_Info
CREATE OR REPLACE PROCEDURE sp_UpdateOrder(
    p_OrderID INT,
    p_ShippingAddress TEXT,
    p_TotalAmount DECIMAL(10,2),
    p_DeliveryCharge DECIMAL(10,2),
    p_OrderStatus VARCHAR(50),
    p_IsSustainableOption BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Order_Info
    SET ShippingAddress = p_ShippingAddress,
        TotalAmount = p_TotalAmount,
        DeliveryCharge = p_DeliveryCharge,
        OrderStatus = p_OrderStatus,
        IsSustainableOption = p_IsSustainableOption,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE OrderID = p_OrderID;
END;
$$;

-- Create stored procedure to insert Order_Details
CREATE OR REPLACE PROCEDURE sp_InsertOrderDetail(
    p_OrderID INT,
    p_ProductID INT,
    p_Quantity INT,
    p_Price DECIMAL(10,2),
    OUT p_OrderDetailID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Order_Details (OrderID, ProductID, Quantity, Price)
    VALUES (p_OrderID, p_ProductID, p_Quantity, p_Price)
    RETURNING OrderDetailID INTO p_OrderDetailID;
    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_InsertOrderDetail(
    p_OrderID INT,
    p_ProductID INT,
    p_Quantity INT,
    p_Price DECIMAL(10,2),
    p_ProductColor VARCHAR(50),
    p_ProductSize VARCHAR(50),
    OUT p_OrderDetailID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Order_Details (OrderID, ProductID, Quantity, Price, ProductColor, ProductSize)
    VALUES (p_OrderID, p_ProductID, p_Quantity, p_Price, p_ProductColor, p_ProductSize)
    RETURNING OrderDetailID INTO p_OrderDetailID;
    COMMIT;
END;
$$;


-- Create stored procedure to update Order_Details
CREATE OR REPLACE PROCEDURE sp_UpdateOrderDetail(
    p_OrderDetailID INT,
    p_Quantity INT,
    p_Price DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Order_Details
    SET Quantity = p_Quantity,
        Price = p_Price
    WHERE OrderDetailID = p_OrderDetailID;
    
    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_UpdateOrderDetail(
    p_OrderDetailID INT,
    p_Quantity INT,
    p_Price DECIMAL(10,2),
    p_ProductColor VARCHAR(50),
    p_ProductSize VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Order_Details
    SET Quantity = p_Quantity,
        Price = p_Price,
        ProductColor = p_ProductColor,
        ProductSize = p_ProductSize
    WHERE OrderDetailID = p_OrderDetailID;
    
    COMMIT;
END;
$$;

-- End of Create stored procedures

-- Create functions for data retrieval
CREATE OR REPLACE FUNCTION fn_GetUserByID(p_UserID INT)
RETURNS TABLE (
    UserID INT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Address TEXT,
    Email VARCHAR(100),
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.UserID, u.FirstName, u.LastName, u.Address, u.Email, u.CreatedAt, u.UpdatedAt
    FROM User_Info u
    WHERE u.UserID = p_UserID;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetAllUsers()
RETURNS TABLE (
    UserID INT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Address TEXT,
    Email VARCHAR(100),
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.UserID, u.FirstName, u.LastName, u.Address, u.Email, u.CreatedAt, u.UpdatedAt
    FROM User_Info u
    ORDER BY u.UserID;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetRouteByID(p_RouteID INT)
RETURNS TABLE (
    RouteID INT,
    OrderID INT,
    Source VARCHAR(100),
    Destination VARCHAR(100),
    CarbonEmission INT,
    Duration INT,
    TotalCost INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP 
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Route_Info u
    WHERE u.RouteID = p_RouteID;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetRouteDetailsByID(p_RouteDetailID INT)
RETURNS TABLE (
    RouteDetailID INT,
    RouteID INT,
    SeqNo INT,
    Source VARCHAR(100),
    Destination VARCHAR(100),
    TransportMode VARCHAR(50),
    CarbonEmission INT,
    Duration INT,
    Cost INT,
    Distance INT,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Route_Details u
    WHERE u.RouteDetailID = p_RouteDetailID;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetRouteStatusByID(p_RouteStatusID INT)
RETURNS TABLE (
    RouteStatusID INT,
    RouteID INT,
    RouteDetailID INT,
    SeqNo INT,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Route_Status u
    WHERE u.RouteStatusID = p_RouteStatusID;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetRouteByOrderID(p_OrderID INT)
RETURNS TABLE (
    RouteID INT,
    OrderID INT,
    Source VARCHAR(100),
    Destination VARCHAR(100),
    CarbonEmission INT,
    Duration INT,
    TotalCost INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP 
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Route_Info u
    WHERE u.OrderID = p_OrderID;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetRouteDetailsByRouteID(p_RouteID INT)
RETURNS TABLE (
    RouteDetailID INT,
    RouteID INT,
    SeqNo INT,
    Source VARCHAR(100),
    Destination VARCHAR(100),
    TransportMode VARCHAR(50),
    CarbonEmission INT,
    Duration INT,
    Cost INT,
    Distance INT,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Route_Details u
    WHERE u.RouteID = p_RouteID;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetRouteStatusByRouteID(p_RouteID INT)
RETURNS TABLE (
    RouteStatusID INT,
    RouteID INT,
    RouteDetailID INT,
    SeqNo INT,
    StatusID INT,
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Route_Status u
    WHERE u.RouteID = p_RouteID;
END;
$$ LANGUAGE plpgsql;


-- Create function to retrieve Order by ID
CREATE OR REPLACE FUNCTION fn_GetOrderByID(p_OrderID INT)
RETURNS TABLE (
    OrderID INT,
    UserID INT,
    ShippingAddress TEXT,
    TotalAmount DECIMAL(10,2),
    DeliveryCharge DECIMAL(10,2),
    OrderStatus VARCHAR(50),
    IsSustainableOption BOOLEAN,
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT o.OrderID, o.UserID, o.ShippingAddress, o.TotalAmount, o.DeliveryCharge, o.OrderStatus, o.IsSustainableOption,
         o.CreatedAt::timestamp, o.UpdatedAt::timestamp
    FROM Order_Info o
    WHERE o.OrderID = p_OrderID;
END;
$$ LANGUAGE plpgsql;

-- Create function to retrieve all Orders
CREATE OR REPLACE FUNCTION fn_GetAllOrders()
RETURNS TABLE (
    OrderID INT,
    UserID INT,
    ShippingAddress TEXT,
    TotalAmount DECIMAL(10,2),
    DeliveryCharge DECIMAL(10,2),
    OrderStatus VARCHAR(50),
    IsSustainableOption BOOLEAN,
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT o.OrderID, o.UserID, o.ShippingAddress, o.TotalAmount, o.DeliveryCharge, o.OrderStatus,
           o.IsSustainableOption, o.CreatedAt::timestamp, o.UpdatedAt::timestamp
    FROM Order_Info o
    ORDER BY o.OrderID;
END;
$$ LANGUAGE plpgsql;

-- Function to Get Orders by UserID
CREATE OR REPLACE FUNCTION fn_GetOrdersByUserID(p_UserID INT)
RETURNS TABLE (
    OrderID INT,
    UserID INT,
    ShippingAddress TEXT,
    TotalAmount DECIMAL(10,2),
    DeliveryCharge DECIMAL(10,2),
    OrderStatus VARCHAR(50),
    IsSustainableOption BOOLEAN,
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT o.OrderID, o.UserID, o.ShippingAddress, o.TotalAmount, o.DeliveryCharge, o.OrderStatus, o.IsSustainableOption, o.CreatedAt::timestamp, o.UpdatedAt::timestamp
    FROM Order_Info o
    WHERE o.UserID = p_UserID
    ORDER BY o.CreatedAt DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to Get Active Orders by UserID
CREATE OR REPLACE FUNCTION fn_GetActiveOrdersByUserID(p_UserID INT)
RETURNS TABLE (
    OrderID INT,
    UserID INT,
    ShippingAddress TEXT,
    TotalAmount DECIMAL(10,2),
    DeliveryCharge DECIMAL(10,2),
    OrderStatus VARCHAR(50),
    IsSustainableOption BOOLEAN,
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT o.OrderID, o.UserID, o.ShippingAddress, o.TotalAmount, o.DeliveryCharge, o.OrderStatus, o.IsSustainableOption, o.CreatedAt::timestamp, o.UpdatedAt::timestamp
    FROM Order_Info o
    WHERE o.UserID = p_UserID AND o.OrderStatus NOT IN ('Canceled', 'Delivered')
    ORDER BY o.CreatedAt DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_GetOrderDetailsByOrderID(p_OrderID INT)
RETURNS TABLE (
    OrderDetailID INT,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    Price DECIMAL(10, 2),
    ProductColor VARCHAR(50),
    ProductSize VARCHAR(50),
    CreatedAt TIMESTAMP,
    UpdatedAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        od.OrderDetailID, 
        od.OrderID, 
        od.ProductID, 
        od.Quantity, 
        od.Price,
        od.ProductColor,
        od.ProductSize,
        od.CreatedAt::timestamp, 
        od.UpdatedAt::timestamp
    FROM Order_Details od
    WHERE od.OrderID = p_OrderID;
END;
$$ LANGUAGE plpgsql;

-- End of Create functions for data retrieval

--TEMP SECTION
INSERT INTO User_Info (FirstName, LastName, Address, Email, Password)
VALUES ('John', 'Doe', '1234 Elm Street', 'john.doe@example.com', '$2a$12$XDSm/0G.HZ.hHPoFKHwtG.EdB.8AA0u4Ivj1X2hyjDnoFkZ7dJ7sm');
--password: password123
--TEMP SECTION
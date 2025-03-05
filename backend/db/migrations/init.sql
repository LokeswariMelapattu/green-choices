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
    p_TotalCost INT,
    p_LastUpdatedUserID INT,
    OUT p_RouteID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Route_Info (OrderID, Source, Destination, CarbonEmission, TotalCost, LastUpdatedUserID)
    VALUES (p_OrderID, p_Source, p_Destination, p_CarbonEmission, p_TotalCost, p_LastUpdatedUserID)
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
                                CarbonEmission, Cost, Distance, StatusID, LastUpdatedUserID)
    VALUES (p_RouteID, p_SeqNo, p_Source, p_Destination, p_TransportMode, 
                                p_CarbonEmission, p_Cost, p_Distance, p_StatusID, p_LastUpdatedUserID)
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

CREATE OR REPLACE PROCEDURE sp_UpdateRoute(
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
    UPDATE Route_Info
    SET SeqNo = p_SeqNo,
        StatusID = p_StatusID,
        LastUpdatedUserID = p_LastUpdatedUserID,
        LastUpdatedDate = CURRENT_TIMESTAMP
    WHERE RouteStatusID = p_RouteStatusID AND RouteID = p_RouteID AND RouteDetailID = p_RouteDetailID;
    
    COMMIT;
END;
$$;

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
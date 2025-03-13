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

CREATE TABLE IF NOT EXISTS Order_Info (
    OrderID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    ShippingAddress TEXT NOT NULL,
    TotalPrice NUMERIC(11,2) NOT NULL,
    DeliveryCharge NUMERIC(11,2) NOT NULL,
    LastUpdatedUserID INT NOT NULL,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User_Info
);

CREATE TABLE IF NOT EXISTS Order_Info_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    OrderID INT,
    UserID INT,
    ShippingAddress TEXT,
    TotalPrice NUMERIC(11,2),
    DeliveryCharge NUMERIC(11,2),
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Order_Details (
    OrderDetailID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    ProductQuantity INT NOT NULL,
    TotalPrice NUMERIC(11,2) NOT NULL,
    LastUpdatedUserID INT NOT NULL,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES Order_Info
);

CREATE TABLE IF NOT EXISTS Order_Details_A (
    LogID SERIAL PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Operation CHAR(1) NOT NULL, -- 'I' for Insert, 'U' for Update, 'D' for Delete
    OrderDetailID INT,
    OrderID INT,
    ProductID INT,
    ProductQuantity INT,
    TotalPrice NUMERIC(11,2),
    LastUpdatedUserID INT,
    LastUpdatedDate TIMESTAMP
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

CREATE OR REPLACE FUNCTION fn_Order_Info_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Order_Info_A (
            Operation, OrderID, UserID, ShippingAddress, TotalPrice, DeliveryCharge,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'I', NEW.OrderID, NEW.UserID, NEW.ShippingAddress, NEW.TotalPrice, NEW.DeliveryCharge,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Order_Info_A (
            Operation, OrderID, UserID, ShippingAddress, TotalPrice, DeliveryCharge,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'U', NEW.OrderID, NEW.UserID, NEW.ShippingAddress, NEW.TotalPrice, NEW.DeliveryCharge,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Order_Info_A (
            Operation, OrderID, UserID, ShippingAddress, TotalPrice, DeliveryCharge,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'D', OLD.OrderID, OLD.UserID, OLD.ShippingAddress, OLD.TotalPrice, OLD.DeliveryCharge,
            OLD.LastUpdatedUserID, OLD.LastUpdatedDate
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_Order_Details_Audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Order_Details_A (
            Operation, OrderDetailID, OrderID, ProductID, ProductQuantity, TotalPrice,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'I', NEW.OrderDetailID, NEW.OrderID, NEW.ProductID, NEW.ProductQuantity, NEW.TotalPrice,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Order_Details_A (
            Operation, OrderDetailID, OrderID, ProductID, ProductQuantity, TotalPrice,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'U', NEW.OrderDetailID, NEW.OrderID, NEW.ProductID, NEW.ProductQuantity, NEW.TotalPrice,
            NEW.LastUpdatedUserID, NEW.LastUpdatedDate
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Order_Details_A (
            Operation, OrderDetailID, OrderID, ProductID, ProductQuantity, TotalPrice,
            LastUpdatedUserID, LastUpdatedDate
        ) VALUES (
            'D', OLD.OrderDetailID, OLD.OrderID, OLD.ProductID, OLD.ProductQuantity, OLD.TotalPrice,
            OLD.LastUpdatedUserID, OLD.LastUpdatedDate
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER tr_User_Info_Insert
AFTER INSERT ON User_Info
FOR EACH ROW
EXECUTE FUNCTION fn_User_Info_Audit();

CREATE TRIGGER tr_User_Info_Update
AFTER UPDATE ON User_Info
FOR EACH ROW
EXECUTE FUNCTION fn_User_Info_Audit();

CREATE TRIGGER tr_User_Info_Delete
AFTER DELETE ON User_Info
FOR EACH ROW
EXECUTE FUNCTION fn_User_Info_Audit();


CREATE TRIGGER tr_Order_Info_Insert
AFTER INSERT ON Order_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Info_Audit();

CREATE TRIGGER tr_Order_Info_Update
AFTER UPDATE ON Order_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Info_Audit();

CREATE TRIGGER tr_Order_Info_Delete
AFTER DELETE ON Order_Info
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Info_Audit();


CREATE TRIGGER tr_Order_Details_Insert
AFTER INSERT ON Order_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Details_Audit();

CREATE TRIGGER tr_Order_Details_Update
AFTER UPDATE ON Order_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Details_Audit();

CREATE TRIGGER tr_Order_Details_Delete
AFTER DELETE ON Order_Details
FOR EACH ROW
EXECUTE FUNCTION fn_Order_Details_Audit();

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

CREATE OR REPLACE PROCEDURE sp_InsertOrder(
    p_UserID INT,
    p_ShippingAddress TEXT,
    p_TotalPrice NUMERIC(11,2),
    p_DeliveryCharge NUMERIC(11,2),
    p_LastUpdatedUserID INT,
    OUT p_OrderID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Order_Info (UserID, ShippingAddress, TotalPrice, DeliveryCharge, LastUpdatedUserID)
    VALUES (p_UserID, p_ShippingAddress, p_TotalPrice, p_DeliveryCharge, p_LastUpdatedUserID)
    RETURNING OrderID INTO p_OrderID;
    
    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_UpdateOrder(
    p_OrderID INT,
    p_UserID INT,
    p_ShippingAddress TEXT,
    p_TotalPrice NUMERIC(11,2),
    p_DeliveryCharge NUMERIC(11,2),
    p_LastUpdatedUserID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Order_Info
    SET UserID = p_UserID,
        ShippingAddress = p_ShippingAddress,
        TotalPrice = p_TotalPrice,
        DeliveryCharge = p_DeliveryCharge,
        LastUpdatedUserID = p_LastUpdatedUserID,
        LastUpdatedDate = CURRENT_TIMESTAMP
    WHERE OrderID = p_OrderID;
    
    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_InsertOrder_Detail(
    p_OrderID INT,
    p_ProductID INT,
    p_ProductQuantity INT,
    p_TotalPrice NUMERIC(11,2),
    p_LastUpdatedUserID INT,
    OUT p_OrderDetailID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Order_Info (OrderID, ProductID, ProductQuantity, TotalPrice, LastUpdatedUserID)
    VALUES (p_OrderID, p_ProductID, p_ProductQuantity, p_TotalPrice, p_LastUpdatedUserID)
    RETURNING OrderDetailID INTO p_OrderDetailID;
    
    COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_UpdateOrder_Detail(
    p_OrderDetailID INT,
    p_OrderID INT,
    p_ProductID INT,
    p_ProductQuantity INT,
    p_TotalPrice NUMERIC(11,2),
    p_LastUpdatedUserID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Order_Details
    SET OrderID = p_OrderID,
        ProductID = p_ProductID,
        ProductQuantity = p_ProductQuantity,
        TotalPrice = p_TotalPrice,
        LastUpdatedUserID = p_LastUpdatedUserID,
        LastUpdatedDate = CURRENT_TIMESTAMP
    WHERE OrderDetailID = p_OrderDetailID;
    
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

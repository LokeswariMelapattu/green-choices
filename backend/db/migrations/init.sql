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
CREATE TABLE Users (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Email NVARCHAR(255) NOT NULL UNIQUE,
  PasswordHash NVARCHAR(255) NOT NULL,
  CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE Customers (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  FullName NVARCHAR(150) NOT NULL,
  Email NVARCHAR(255) NOT NULL,
  Phone NVARCHAR(50),
  CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE Tickets (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CustomerId INT NOT NULL,
  FlightNo NVARCHAR(20) NOT NULL,
  Departure NVARCHAR(20) NOT NULL,
  Arrival NVARCHAR(20) NOT NULL,
  DepartureTime DATETIME2 NOT NULL,
  Status NVARCHAR(30) NOT NULL,
  CONSTRAINT FK_Tickets_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);

-- password: admin123
INSERT INTO Users (Name, Email, PasswordHash)
VALUES ('Admin Agent', 'admin@aircrm.com', '$2a$10$K8xPyw9gyrmrh6e8Y6aY1epv4FdL0h44z2LJ8frr3IYK8Nw6vXYv2');

INSERT INTO Customers (FullName, Email, Phone)
VALUES ('Aisha Khan', 'aisha@example.com', '+971500000000'),
       ('Omar Ali', 'omar@example.com', '+971511111111');

INSERT INTO Tickets (CustomerId, FlightNo, Departure, Arrival, DepartureTime, Status)
VALUES (1, 'EK202', 'DXB', 'JFK', DATEADD(HOUR, 2, GETUTCDATE()), 'CONFIRMED'),
       (2, 'QR100', 'DOH', 'LHR', DATEADD(HOUR, 3, GETUTCDATE()), 'DELAYED');

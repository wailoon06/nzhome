CREATE DATABASE nzhome;

CREATE TYPE level AS ENUM ('A','B');

CREATE TABLE Users(
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(20) NOT NULL,
    Email VARCHAR(20) NOT NULL,
    Password VARCHAR(20) NOT NULL,
    AccessLevel level NOT NULL,
);

CREATE TABLE Image(
    ImageID SERIAL PRIMARY KEY,
    Image BYTEA NOT NULL
);

CREATE TYPE dtype AS ENUM ('S','E');

CREATE TABLE Device(
    DeviceID SERIAL PRIMARY KEY,
    SerialNumber INT NOT NULL,
    ImageID INT NOT NULL,
    DeviceType dtype NOT NULL,
    Brand VARCHAR(20) NOT NULL,
    WarrantyExpiration TIMESTAMP NOT NULL,
    InstallationDate TIMESTAMP NOT NULL,
    InstalledBy VARCHAR (20) NOT NULL,
    CONSTRAINT fk_image FOREIGN KEY (ImageID)
    REFERENCES image(ImageID)
);

CREATE TABLE Room(
    RoomID SERIAL PRIMARY KEY,
    ImageID INT NOT NULL,
    DeviceID INT NOT NULL,
    RoomType VARCHAR(20) NOT NULL,
    CreatedBy VARCHAR(20) NOT NULL,
    CreatedTime VARCHAR(20) NOT NULL,
    CONSTRAINT fk_image FOREIGN KEY (ImageID)
    REFERENCES image(ImageID),
    CONSTRAINT fk_device FOREIGN KEY (DeviceID)
    REFERENCES device(DeviceID)
);

CREATE TABLE Message(
    MessageID SERIAL PRIMARY KEY,
    Header VARCHAR(20) NOT NULL,
    Message VARCHAR(100) NOT NULL
);

CREATE TABLE Notification(
    NotificationID SERIAL PRIMARY KEY,
    Time TIMESTAMP NOT NULL,
    ReadStatus BOOLEAN NOT NULL,
    MessageID INT,
    CONSTRAINT fk_message FOREIGN KEY (MessageID)
    REFERENCES message(MessageID)
);

CREATE TABLE Schedule(
    ScheduleID SERIAL PRIMARY KEY,
    DeviceID INT NOT NULL,
    Title VARCHAR(20) NOT NULL,
    StartTime TIMESTAMP NOT NULL,
    EndTime TIMESTAMP NOT NULL,
    RepeatType BOOLEAN NOT NULL,
    CreatedBy VARCHAR(20) NOT NULL,
    CONSTRAINT fk_device FOREIGN KEY (DeviceID)
    REFERENCES device(DeviceID)
);

CREATE TYPE stype AS ENUM ('ON','OFF');

CREATE TABLE Action(
    ActionID SERIAL PRIMARY KEY,
    DeviceID INT NOT NULL,
    ActionType VARCHAR(20) NOT NULL,
    Status stype,
    CONSTRAINT fk_device FOREIGN KEY (DeviceID)
    REFERENCES device(DeviceID)
);

CREATE TABLE InternetUsage(
    IntUsageID SERIAL PRIMARY KEY,
    DeviceID INT NOT NULL,
    DailyDataUsage INT NOT NULL,
    NextPaymentDate DATE NOT NULL,
    CONSTRAINT fk_device FOREIGN KEY (DeviceID)
    REFERENCES device(DeviceID)
);

CREATE TABLE SingleDeviceEnergyUsage(
    SingleDevUsageID SERIAL PRIMARY KEY,
    DeviceID INT NOT NULL,
    DailyEnergyConsumption INT NOT NULL,
    DailyEnergyGeneration INT NOT NULL,
    CONSTRAINT fk_device FOREIGN KEY (DeviceID)
    REFERENCES device(DeviceID)
);
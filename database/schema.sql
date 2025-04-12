-- Customer bookings table for general purpose
CREATE TABLE customer_bookings (
    booking_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Trains table to store train information
CREATE TABLE trains (
    train_id SERIAL PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    train_number VARCHAR(20) UNIQUE NOT NULL,
    source_station VARCHAR(100) NOT NULL,
    destination_station VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration INTERVAL NOT NULL,
    total_seats INTEGER NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5)
);

-- Train classes table to store different classes and their prices
CREATE TABLE train_classes (
    class_id SERIAL PRIMARY KEY,
    train_id INTEGER REFERENCES trains(train_id),
    class_name VARCHAR(20) NOT NULL CHECK (class_name IN ('1AC', '2AC', '3AC', 'SL')),
    price DECIMAL(10,2) NOT NULL,
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
    UNIQUE(train_id, class_name)
);

-- Train bookings table to store booking details
CREATE TABLE train_bookings (
    booking_id SERIAL PRIMARY KEY,
    train_id INTEGER REFERENCES trains(train_id),
    class_id INTEGER REFERENCES train_classes(class_id),
    customer_id INTEGER REFERENCES customer_bookings(booking_id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    journey_date DATE NOT NULL,
    num_seats INTEGER NOT NULL CHECK (num_seats > 0),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('gpay', 'phonepe', 'netbanking')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled')),
    pnr_number VARCHAR(10) UNIQUE NOT NULL
);

-- Create index for faster searches
CREATE INDEX idx_train_source_dest ON trains(source_station, destination_station);
CREATE INDEX idx_train_departure ON trains(departure_time);
CREATE INDEX idx_booking_date ON train_bookings(journey_date);
CREATE INDEX idx_pnr ON train_bookings(pnr_number);

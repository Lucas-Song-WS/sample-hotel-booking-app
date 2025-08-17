CREATE TABLE t_staff (
  staff_seq BIGSERIAL PRIMARY KEY,
  staff_username VARCHAR(20) NOT NULL,
  staff_password VARCHAR(255) NOT NULL,
  staff_id_no VARCHAR(20) NOT NULL,
  staff_name VARCHAR(100) NOT NULL,
  staff_email VARCHAR(30) NOT NULL,
  staff_phone VARCHAR(30),
  staff_dob DATE,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_guest (
  guest_seq BIGSERIAL PRIMARY KEY,
  guest_username VARCHAR(20) NOT NULL,
  guest_password VARCHAR(255) NOT NULL,
  guest_id_no VARCHAR(20) NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(30) NOT NULL,
  guest_phone VARCHAR(30),
  guest_dob DATE,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_room_type (
  room_type_seq BIGSERIAL PRIMARY KEY,
  room_type_name VARCHAR(30) NOT NULL,
  room_type_desc VARCHAR(200),
  room_type_max_occupancy INTEGER,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_room_type_price (
  room_type_price_seq BIGSERIAL PRIMARY KEY,
  room_type_seq BIGINT NOT NULL REFERENCES t_room_type(room_type_seq),
  room_type_price NUMERIC,
  price_period_start DATE,
  price_period_end DATE,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_room_type_price_room_type_seq ON t_room_type_price(room_type_seq);
CREATE INDEX idx_t_room_type_price_type_price_period ON t_room_type_price(room_type_seq, price_period_start, price_period_end);

CREATE TABLE t_room_amenity (
  room_amenity_seq BIGSERIAL PRIMARY KEY,
  room_amenity_name VARCHAR(50) NOT NULL,
  room_amenity_desc VARCHAR(200),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_room_type_amenity_map (
  room_type_amenity_map_seq BIGSERIAL PRIMARY KEY,
  room_type_seq BIGINT NOT NULL REFERENCES t_room_type(room_type_seq),
  room_amenity_seq BIGINT NOT NULL REFERENCES t_room_amenity(room_amenity_seq),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_room_type_amenity_map_room_type_seq ON t_room_type_amenity_map(room_type_seq);
CREATE INDEX idx_t_room_type_amenity_map_room_amenity_seq ON t_room_type_amenity_map(room_amenity_seq);

CREATE TABLE t_room_bed (
  room_bed_seq BIGSERIAL PRIMARY KEY,
  room_bed_name VARCHAR(50) NOT NULL,
  room_bed_desc VARCHAR(200),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_room_type_bed_map (
  room_type_bed_map_seq BIGSERIAL PRIMARY KEY,
  room_type_seq BIGINT NOT NULL REFERENCES t_room_type(room_type_seq),
  room_bed_seq BIGINT NOT NULL REFERENCES t_room_bed(room_bed_seq),
  room_type_bed_qty INTEGER NOT NULL,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_room_type_bed_map_room_type_seq ON t_room_type_bed_map(room_type_seq);
CREATE INDEX idx_t_room_type_bed_map_room_bed_seq ON t_room_type_bed_map(room_bed_seq);

CREATE TABLE t_room_view (
  room_view_seq BIGSERIAL PRIMARY KEY,
  room_view_name VARCHAR(50) NOT NULL,
  room_view_desc VARCHAR(200),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_room_view_price (
  room_view_price_seq BIGSERIAL PRIMARY KEY,
  room_view_seq BIGINT NOT NULL REFERENCES t_room_view(room_view_seq),
  room_view_price NUMERIC,
  price_period_start DATE,
  price_period_end DATE,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_room_view_price_room_view_seq ON t_room_view_price(room_view_seq);
CREATE INDEX idx_t_room_view_price_view_price_period ON t_room_view_price(room_view_seq, price_period_start, price_period_end);

CREATE TABLE t_room (
  room_seq BIGSERIAL PRIMARY KEY,
  room_type_seq BIGINT NOT NULL REFERENCES t_room_type(room_type_seq),
  room_number VARCHAR(10) NOT NULL,
  room_floor VARCHAR(5) NOT NULL,
  room_size_sqft NUMERIC,
  room_view_seq BIGINT REFERENCES t_room_view(room_view_seq),
  room_smoking_yn BOOLEAN DEFAULT False,
  room_remarks VARCHAR(1000),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_room_room_type_seq ON t_room(room_type_seq);
CREATE INDEX idx_t_room_room_view_seq ON t_room(room_view_seq);

CREATE TABLE t_room_price_adjustment (
  room_price_adj_seq BIGSERIAL PRIMARY KEY,
  room_seq BIGINT NOT NULL REFERENCES t_room(room_seq),
  room_price_adjustment NUMERIC,
  price_adjustment_period_start DATE,
  price_adjustment_period_end DATE,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_room_price_adjustment_room_seq ON t_room_price_adjustment(room_seq);
CREATE INDEX idx_t_room_price_adjustment_room_price_period ON t_room_price_adjustment(room_seq, price_adjustment_period_start, price_adjustment_period_end);

CREATE TABLE t_season_price_adjustment (
  season_price_adj_seq BIGSERIAL PRIMARY KEY,
  max_occupancy_percent NUMERIC NOT NULL,
  season_price_adjustment NUMERIC,
  price_adjustment_period_start DATE,
  price_adjustment_period_end DATE,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_season_price_adjustment_season_price_period ON t_season_price_adjustment(max_occupancy_percent, price_adjustment_period_start, price_adjustment_period_end);

CREATE TABLE t_booking (
  booking_seq BIGSERIAL PRIMARY KEY,
  booking_id VARCHAR(16) NOT NULL,
  guest_seq BIGINT NOT NULL REFERENCES t_guest(guest_seq),
  booking_period_start DATE,
  booking_period_end DATE,
  booking_remarks VARCHAR(1000),
  booking_status VARCHAR(20),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_booking_guest_seq ON t_booking(guest_seq);

CREATE TABLE t_booking_room_map (
  booking_room_map_seq BIGSERIAL PRIMARY KEY,
  booking_seq BIGINT NOT NULL REFERENCES t_booking(booking_seq),
  room_seq BIGINT NOT NULL REFERENCES t_room(room_seq),
  room_type_seq BIGINT NOT NULL REFERENCES t_room_type(room_type_seq),
  num_guests_adults INTEGER NOT NULL,
  num_guests_children INTEGER NOT NULL,
  room_view_seq BIGINT REFERENCES t_room_view(room_view_seq),
  room_smoking_yn BOOLEAN DEFAULT False,
  room_booking_period_start DATE,
  room_booking_period_end DATE,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_booking_room_map_booking_seq ON t_booking_room_map(booking_seq);
CREATE INDEX idx_t_booking_room_map_room_seq ON t_booking_room_map(room_seq);
CREATE INDEX idx_t_booking_room_map_room_type_seq ON t_booking_room_map(room_type_seq);
CREATE INDEX idx_t_booking_room_map_room_view_seq ON t_booking_room_map(room_view_seq);
CREATE INDEX idx_t_booking_room_map_room_booking_period ON t_booking_room_map(room_seq, room_booking_period_start, room_booking_period_end);

CREATE TABLE t_booking_room_charge_map (
  booking_room_charge_map_seq BIGSERIAL PRIMARY KEY,
  booking_room_map_seq BIGINT NOT NULL REFERENCES t_booking_room_map(booking_room_map_seq),
  charge_desc VARCHAR(200) NOT NULL,
  charge_amount NUMERIC NOT NULL,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_booking_room_charge_map_booking_room_map_seq ON t_booking_room_charge_map(booking_room_map_seq);

CREATE TABLE t_charge (
  charge_seq BIGSERIAL PRIMARY KEY,
  charge_desc VARCHAR(200) NOT NULL,
  charge_amount NUMERIC NOT NULL,
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_charge_room_type_map (
  charge_map_seq BIGSERIAL PRIMARY KEY,
  charge_seq BIGINT REFERENCES t_charge(charge_seq),
  room_type_seq BIGINT REFERENCES t_room_type(room_type_seq),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_charge_room_type_map_charge_seq ON t_charge_room_type_map(charge_seq);
CREATE INDEX idx_t_charge_room_type_map_room_type_seq ON t_charge_room_type_map(room_type_seq);

CREATE TABLE t_tag (
  tag_seq BIGSERIAL PRIMARY KEY,
  tag_name VARCHAR(20) NOT NULL,
  tag_desc VARCHAR(200),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_tag_map (
  tag_map_seq BIGSERIAL PRIMARY KEY,
  tag_seq BIGINT NOT NULL REFERENCES t_tag(tag_seq),
  room_type_seq BIGINT REFERENCES t_room_type(room_type_seq),
  charge_seq BIGINT REFERENCES t_charge(charge_seq),
  
  active_flag BOOLEAN NOT NULL DEFAULT True,
  created_by BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by BIGINT NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_t_tag_map_tag_seq ON t_tag_map(tag_seq);
CREATE INDEX idx_t_tag_map_room_type_seq ON t_tag_map(room_type_seq);
CREATE INDEX idx_t_tag_map_charge_seq ON t_tag_map(charge_seq);

CREATE OR REPLACE FUNCTION Get_Occupied_Rooms(p_start_date DATE, p_end_date DATE)
RETURNS TABLE(room_seq BIGINT) AS $$
    SELECT DISTINCT room_seq
    FROM t_booking_room_map
    WHERE active_flag = TRUE
      AND room_booking_period_start <= p_end_date
      AND room_booking_period_end >= p_start_date;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION Calc_Day_Occupancy(p_date DATE)
RETURNS NUMERIC AS $$
    SELECT COALESCE(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM t_room WHERE active_flag = TRUE), 2), 0)
    FROM Get_Occupied_Rooms(p_date, p_date) r;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION Calc_Room_Day_Charge(
    p_room_type_seq BIGINT,
    p_room_view_seq BIGINT,
    p_room_seq BIGINT,
    p_date DATE
)
RETURNS NUMERIC AS $$
DECLARE
    v_occupancy_percent NUMERIC := 0;
    v_type_charge NUMERIC := 0;
    v_view_charge NUMERIC := 0;
    v_adj_charge NUMERIC := 0;
    v_season_charge NUMERIC := 0;
BEGIN
    v_occupancy_percent := Calc_Day_Occupancy(p_date);

    SELECT room_type_price INTO v_type_charge
    FROM t_room_type_price
    WHERE room_type_seq = p_room_type_seq AND price_period_start <= p_date AND price_period_end >= p_date
    ORDER BY price_period_start DESC LIMIT 1;

    IF p_room_view_seq IS NOT NULL AND p_room_view_seq > 0 THEN
    SELECT room_view_price INTO v_view_charge
    FROM t_room_view_price
    WHERE room_view_seq = p_room_view_seq AND price_period_start <= p_date AND price_period_end >= p_date
    ORDER BY price_period_start DESC LIMIT 1;
    END IF;

    IF p_room_seq IS NOT NULL AND p_room_seq > 0 THEN
    SELECT room_price_adjustment INTO v_adj_charge
    FROM t_room_price_adjustment
    WHERE room_seq = p_room_seq AND price_adjustment_period_start <= p_date AND price_adjustment_period_end >= p_date
    ORDER BY price_adjustment_period_start DESC LIMIT 1;
    END IF;

    SELECT season_price_adjustment INTO v_season_charge
    FROM t_season_price_adjustment
    WHERE max_occupancy_percent >= v_occupancy_percent AND price_adjustment_period_start <= p_date AND price_adjustment_period_end >= p_date
    ORDER BY price_adjustment_period_start DESC, max_occupancy_percent ASC LIMIT 1;

    RETURN COALESCE(v_type_charge, 0) + COALESCE(v_view_charge, 0) + COALESCE(v_adj_charge, 0) + COALESCE(v_season_charge, 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Calc_Room_Total_Charge(
    p_room_type_seq BIGINT,
    p_room_view_seq BIGINT,
    p_room_seq BIGINT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS NUMERIC AS $$
DECLARE
    v_total_charge NUMERIC := 0;
    v_current_day DATE;
BEGIN
    v_current_day := p_start_date;
    WHILE v_current_day <= p_end_date LOOP
        v_total_charge := v_total_charge + Calc_Room_Day_Charge(p_room_type_seq, p_room_view_seq, p_room_seq, v_current_day);
        v_current_day := v_current_day + INTERVAL '1 day';
    END LOOP;

    RETURN v_total_charge;
END;
$$ LANGUAGE plpgsql;

INSERT INTO t_staff (staff_username, staff_password, staff_id_no, staff_name, staff_email, staff_phone, staff_dob, created_by, updated_by)
VALUES
('hotelmann', MD5('hotelmann'), '990919099999', 'Ho Tel Mann', 'hotelmann@myhotel.com', '+60198765432', '1999-09-19', 1, 1);

INSERT INTO t_guest (guest_username, guest_password, guest_id_no, guest_name, guest_email, guest_phone, guest_dob, created_by, updated_by)
VALUES
('hollyday', MD5('hollyday'), '000101111111', 'Holly Day', 'hollyday@email.com', '+60123456789', '2000-01-01', 1, 1),
('sambuddy', MD5('sambuddy'), '950607055555', 'Sam Buddy', 'sambuddy@email.com', '+60155555555', '1995-06-07', 1, 1);

INSERT INTO t_room_type (room_type_name, room_type_desc, room_type_max_occupancy, created_by, updated_by)
VALUES
('Standard', 'Standard room', 2, 1, 1),
('Deluxe', 'Deluxe room with extra amenities', 2, 1, 1),
('Family', 'Large room for families', 4, 1, 1),
('Suite', 'Luxury suite', 2, 1, 1),
('Penthouse', 'Penthouse', 4, 1, 1);

INSERT INTO t_room_type_price (room_type_seq, room_type_price, price_period_start, price_period_end, created_by, updated_by)
VALUES
(1, 100, '2025-08-01', '2025-08-31', 1, 1),
(2, 150, '2025-08-01', '2025-08-31', 1, 1),
(3, 200, '2025-08-01', '2025-08-31', 1, 1),
(4, 300, '2025-08-01', '2025-08-31', 1, 1),
(5, 750, '2025-08-01', '2025-08-31', 1, 1);

INSERT INTO t_room_view (room_view_name, room_view_desc, created_by, updated_by)
VALUES
('N/A', 'Room with no view', 1, 1),
('Sea View', 'Room with sea view', 1, 1),
('City View', 'Room with city view', 1, 1);

INSERT INTO t_room_view_price (room_view_seq, room_view_price, price_period_start, price_period_end, created_by, updated_by)
VALUES
(1, 0, '2025-01-01', '2099-12-31', 1, 1),
(2, 40, '2025-01-01', '2099-12-31', 1, 1),
(3, 20, '2025-01-01', '2099-12-31', 1, 1);
--add more periods here for test

INSERT INTO t_room_amenity (room_amenity_name, room_amenity_desc, created_by, updated_by)
VALUES
('WiFi', 'Free high-speed internet', 1, 1),
('Mini Bar', 'Mini bar included', 1, 1),
('Writing Desk', 'Writing desk included', 1, 1);

INSERT INTO t_room_type_amenity_map (room_type_seq, room_amenity_seq, created_by, updated_by)
VALUES
(1, 1, 1, 1),
(2, 1, 1, 1),
(2, 2, 1, 1),
(2, 3, 1, 1),
(3, 1, 1, 1),
(4, 1, 1, 1),
(4, 2, 1, 1),
(4, 3, 1, 1),
(5, 1, 1, 1),
(5, 2, 1, 1),
(5, 3, 1, 1);

INSERT INTO t_room_bed (room_bed_name, room_bed_desc, created_by, updated_by)
VALUES
('Twin', 'Twin bed', 1, 1),
('Queen', 'Queen size bed', 1, 1),
('King', 'King size bed', 1, 1);

INSERT INTO t_room_type_bed_map (room_type_seq, room_bed_seq, room_type_bed_qty, created_by, updated_by)
VALUES
(1, 1, 1, 1, 1),
(2, 2, 1, 1, 1),
(3, 1, 2, 1, 1),
(4, 3, 1, 1, 1),
(5, 2, 1, 1, 1),
(5, 3, 1, 1, 1);

INSERT INTO t_room (room_type_seq, room_number, room_floor, room_size_sqft, room_view_seq, room_smoking_yn, room_remarks, created_by, updated_by)
VALUES
(1, '101', '1', 250, 1, FALSE, NULL, 1, 1),
(1, '102', '1', 250, 1, FALSE, NULL, 1, 1),
(1, '103', '1', 250, 2, FALSE, NULL, 1, 1),
(1, '104', '1', 250, 2, FALSE, NULL, 1, 1),
(1, '105', '1', 250, 2, FALSE, NULL, 1, 1),
(1, '106', '1', 250, 2, TRUE, 'Brown spot on ceiling', 1, 1),
(1, '107', '1', 250, 3, TRUE, NULL, 1, 1),
(1, '108', '1', 250, 3, TRUE, NULL, 1, 1),
(1, '109', '1', 250, 3, TRUE, NULL, 1, 1),
(1, '110', '1', 250, 3, TRUE, NULL, 1, 1),
(2, '201', '2', 350, 2, FALSE, 'Recently renovated', 1, 1),
(2, '202', '2', 350, 2, FALSE, NULL, 1, 1),
(2, '203', '2', 350, 2, FALSE, NULL, 1, 1),
(2, '204', '2', 350, 3, TRUE, NULL, 1, 1),
(2, '205', '2', 350, 3, TRUE, NULL, 1, 1),
(2, '206', '2', 350, 3, TRUE, NULL, 1, 1),
(3, '301', '3', 500, 2, FALSE, NULL, 1, 1),
(3, '302', '3', 500, 2, FALSE, NULL, 1, 1),
(3, '303', '3', 500, 3, FALSE, NULL, 1, 1),
(3, '304', '3', 500, 3, FALSE, NULL, 1, 1),
(4, '401', '4', 500, 2, FALSE, NULL, 1, 1),
(4, '402', '4', 500, 2, FALSE, NULL, 1, 1),
(4, '403', '4', 500, 3, TRUE, NULL, 1, 1),
(4, '404', '4', 500, 3, TRUE, NULL, 1, 1),
(5, '501', '5', 1000, 3, FALSE, NULL, 1, 1);

INSERT INTO t_room_price_adjustment (room_seq, room_price_adjustment, price_adjustment_period_start, price_adjustment_period_end, created_by, updated_by)
VALUES
(6, -10, '2025-08-01', '2025-08-31', 1, 1),
(11, 20, '2025-08-01', '2025-08-31', 1, 1);
--add more periods here for test

INSERT INTO t_season_price_adjustment (max_occupancy_percent, season_price_adjustment, price_adjustment_period_start, price_adjustment_period_end, created_by, updated_by)
VALUES
(0, -10, '2025-08-01', '2025-08-31', 1, 1),
(20, -10, '2025-08-01', '2025-08-31', 1, 1),
(50, 0, '2025-08-01', '2025-08-31', 1, 1),
(80, 20, '2025-08-01', '2025-08-31', 1, 1),
(100, 50, '2025-08-01', '2025-08-31', 1, 1);
--add more periods here for test

INSERT INTO t_charge (charge_desc, charge_amount, created_by, updated_by)
VALUES
('Breakfast', 30, 1, 1),
('Dinner', 70, 1, 1),
('Spa', 50, 1, 1),
('Late checkout', 50, 1, 1),
('Romantic package (Full)', 200, 1, 1),
('Romantic package (Dinner only)', 100, 1, 1),
('Family fun package', 250, 1, 1),
('Business package', 40, 1, 1),
('Child discount', -20, 1, 1);

INSERT INTO t_charge_room_type_map (charge_seq, room_type_seq, created_by, updated_by)
VALUES
(1, 1, 1, 1),
(1, 2, 1, 1),
(1, 3, 1, 1),
(1, 4, 1, 1),
(1, 5, 1, 1),
(2, 1, 1, 1),
(2, 2, 1, 1),
(2, 3, 1, 1),
(2, 4, 1, 1),
(2, 5, 1, 1),
(3, 1, 1, 1),
(3, 2, 1, 1),
(3, 3, 1, 1),
(3, 4, 1, 1),
(3, 5, 1, 1),
(4, 2, 1, 1),
(4, 3, 1, 1),
(4, 4, 1, 1),
(4, 5, 1, 1),
(5, 2, 1, 1),
(5, 4, 1, 1),
(6, 2, 1, 1),
(6, 4, 1, 1),
(7, 3, 1, 1),
(7, 5, 1, 1),
(8, 2, 1, 1),
(8, 4, 1, 1);

INSERT INTO t_tag (tag_name, tag_desc, created_by, updated_by)
VALUES
('Traveller', 'Big savings', 1, 1),
('Romantic', 'Perfect for couples', 1, 1),
('Family', 'Great for families', 1, 1),
('Business', 'Work and rewards', 1, 1),
('Style', 'Relax in style', 1, 1);

INSERT INTO t_tag_map (tag_seq, room_type_seq, charge_seq, created_by, updated_by)
VALUES
(1, 1, NULL, 1, 1),
(1, NULL, 1, 1, 1),
(2, 2, NULL, 1, 1),
(2, 4, NULL, 1, 1),
(2, NULL, 1, 1, 1),
(2, NULL, 2, 1, 1),
(2, NULL, 3, 1, 1),
(2, NULL, 4, 1, 1),
(2, NULL, 5, 1, 1),
(2, NULL, 6, 1, 1),
(3, 3, NULL, 1, 1),
(3, 5, NULL, 1, 1),
(3, NULL, 1, 1, 1),
(3, NULL, 4, 1, 1),
(3, NULL, 7, 1, 1),
(4, 2, NULL, 1, 1),
(4, 4, NULL, 1, 1),
(4, NULL, 1, 1, 1),
(4, NULL, 2, 1, 1),
(4, NULL, 8, 1, 1),
(5, 2, NULL, 1, 1),
(5, 4, NULL, 1, 1),
(5, 5, NULL, 1, 1),
(5, NULL, 1, 1, 1),
(5, NULL, 2, 1, 1),
(5, NULL, 3, 1, 1),
(5, NULL, 4, 1, 1);
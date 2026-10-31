-- DATABASE: Sistem Informasi Pengelolaan Data Kader Posyandu
-- Jalankan pada database PostgreSQL bernama posyandu_db.

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'kader'
        CHECK (role IN ('admin', 'kader')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relasi one-to-one: satu user memiliki maksimal satu profil kader.
CREATE TABLE kader_profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    assigned_since DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE participants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    participant_type VARCHAR(20) NOT NULL
        CHECK (participant_type IN ('ibu_hamil', 'balita')),
    nik VARCHAR(16) UNIQUE,
    birth_date DATE,
    gender CHAR(1) CHECK (gender IN ('L', 'P')),
    address TEXT,
    phone VARCHAR(20),
    guardian_name VARCHAR(120),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posyandu_schedules (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    activity_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(200) NOT NULL,
    description TEXT,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time IS NULL OR start_time IS NULL OR end_time > start_time)
);

-- Tabel penghubung relasi many-to-many peserta dan jadwal.
CREATE TABLE schedule_participants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    schedule_id BIGINT NOT NULL REFERENCES posyandu_schedules(id) ON DELETE CASCADE,
    participant_id BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    attendance_status VARCHAR(20) NOT NULL DEFAULT 'terdaftar'
        CHECK (attendance_status IN ('terdaftar', 'hadir', 'tidak_hadir')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (schedule_id, participant_id)
);

-- Relasi one-to-many: satu peserta dapat memiliki banyak pemeriksaan.
CREATE TABLE examinations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    participant_id BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    kader_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    schedule_id BIGINT REFERENCES posyandu_schedules(id) ON DELETE SET NULL,
    examination_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2) CHECK (weight_kg IS NULL OR weight_kg > 0),
    height_cm NUMERIC(5,2) CHECK (height_cm IS NULL OR height_cm > 0),
    blood_pressure VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE examination_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    unit VARCHAR(30),
    description TEXT
);

-- Tabel penghubung many-to-many pemeriksaan dan jenis indikator.
CREATE TABLE examination_results (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    examination_id BIGINT NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
    examination_type_id BIGINT NOT NULL REFERENCES examination_types(id) ON DELETE RESTRICT,
    result_value VARCHAR(100) NOT NULL,
    notes TEXT,
    UNIQUE (examination_id, examination_type_id)
);

CREATE INDEX idx_participants_name ON participants(full_name);
CREATE INDEX idx_participants_type ON participants(participant_type);
CREATE INDEX idx_examinations_participant_date
    ON examinations(participant_id, examination_date DESC);
CREATE INDEX idx_schedules_date ON posyandu_schedules(activity_date);

-- Contoh jenis indikator pemeriksaan.
INSERT INTO examination_types (type_name, unit, description) VALUES
('Lingkar Lengan Atas', 'cm', 'Pengukuran LiLA untuk pemantauan ibu hamil'),
('Lingkar Kepala', 'cm', 'Pengukuran lingkar kepala balita'),
('Suhu Tubuh', '°C', 'Pengukuran suhu tubuh peserta'),
('Tekanan Darah', 'mmHg', 'Pengukuran tekanan darah ibu hamil');

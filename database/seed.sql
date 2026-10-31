-- DATA CONTOH (opsional). Password hash di bawah hanya placeholder,
-- bukan password login yang dapat digunakan.
INSERT INTO users (username, email, password_hash, role)
VALUES ('kader01', 'kader01@example.com', 'GANTI_DENGAN_PASSWORD_HASH', 'kader')
ON CONFLICT (username) DO NOTHING;

INSERT INTO kader_profiles (user_id, full_name, phone, address, assigned_since)
SELECT id, 'Siti Aminah', '081234567890', 'Desa Sukamaju', '2022-01-01'
FROM users WHERE username = 'kader01'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO participants
(full_name, participant_type, nik, birth_date, gender, address, phone, guardian_name, notes)
VALUES
('Aisyah Putri', 'balita', '3501010101200001', '2023-05-12', 'P', 'Desa Sukamaju', '081234567891', 'Rina', 'Contoh data peserta'),
('Dewi Lestari', 'ibu_hamil', '3501010101200002', '1998-08-20', 'P', 'Desa Sukamaju', '081234567892', NULL, 'Contoh data ibu hamil')
ON CONFLICT (nik) DO NOTHING;

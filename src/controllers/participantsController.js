import pool from "../config/db.js";

const fields = [
  "full_name", "participant_type", "nik", "birth_date", "gender",
  "address", "phone", "guardian_name", "notes"
];

function normalizePayload(body) {
  const data = {};
  for (const field of fields) {
    if (Object.hasOwn(body, field)) data[field] = body[field] === "" ? null : body[field];
  }
  return data;
}

function validatePayload(data, isUpdate = false) {
  if (!isUpdate && (!data.full_name || !data.participant_type)) {
    return "full_name dan participant_type wajib diisi.";
  }
  if (data.participant_type && !["ibu_hamil", "balita"].includes(data.participant_type)) {
    return "participant_type harus bernilai ibu_hamil atau balita.";
  }
  if (data.gender && !["L", "P"].includes(data.gender)) {
    return "gender harus bernilai L atau P.";
  }
  return null;
}

export async function getAllParticipants(req, res, next) {
  try {
    const { search, type } = req.query;
    const conditions = [];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(full_name ILIKE $${values.length} OR nik ILIKE $${values.length})`);
    }
    if (type) {
      values.push(type);
      conditions.push(`participant_type = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await pool.query(
      `SELECT * FROM participants ${where} ORDER BY created_at DESC, id DESC`,
      values
    );

    res.json({ success: true, message: "Data peserta berhasil diambil.", total: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getParticipantById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "ID harus berupa bilangan bulat positif." });
    }

    const result = await pool.query("SELECT * FROM participants WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Peserta tidak ditemukan." });
    }

    res.json({ success: true, message: "Data peserta berhasil ditemukan.", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function createParticipant(req, res, next) {
  try {
    const data = normalizePayload(req.body);
    const validationError = validatePayload(data);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`);
    const result = await pool.query(
      `INSERT INTO participants (${columns.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`,
      values
    );

    res.status(201).json({ success: true, message: "Data peserta berhasil ditambahkan.", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateParticipant(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "ID harus berupa bilangan bulat positif." });
    }

    const data = normalizePayload(req.body);
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "Minimal satu field harus dikirim untuk diperbarui." });
    }
    const validationError = validatePayload(data, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const columns = Object.keys(data);
    const values = Object.values(data);
    const assignments = columns.map((column, index) => `${column} = $${index + 1}`);
    values.push(id);

    const result = await pool.query(
      `UPDATE participants SET ${assignments.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Peserta tidak ditemukan." });
    }
    res.json({ success: true, message: "Data peserta berhasil diperbarui.", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function deleteParticipant(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "ID harus berupa bilangan bulat positif." });
    }

    const result = await pool.query("DELETE FROM participants WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Peserta tidak ditemukan." });
    }
    res.json({ success: true, message: "Data peserta berhasil dihapus.", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

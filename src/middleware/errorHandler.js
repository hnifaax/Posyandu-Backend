export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === "23505") {
    return res.status(409).json({ success: false, message: "Data dengan nilai unik tersebut sudah terdaftar." });
  }
  if (error.code === "23503") {
    return res.status(400).json({ success: false, message: "Relasi data tidak valid atau data yang dirujuk tidak ditemukan." });
  }
  if (error.code === "23514" || error.code === "22P02") {
    return res.status(400).json({ success: false, message: "Nilai data tidak sesuai dengan ketentuan database." });
  }

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server.",
    ...(process.env.NODE_ENV !== "production" ? { detail: error.message } : {})
  });
}

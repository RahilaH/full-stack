const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

/* =========================
   FILE UPLOAD CONFIG
========================= */
const upload = multer({ dest: "uploads/" });

/* =========================
   GET ALL ENQUIRIES
========================= */
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM enquiries ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json(results);
    }
  );
});

/* =========================
   ADD SINGLE ENQUIRY
========================= */
router.post("/add", (req, res) => {
  const { name, email, course, status, reason } = req.body;

  db.query(
    "INSERT INTO enquiries (name,email,course,status,reason) VALUES (?,?,?,?,?)",
    [name, email, course, status, reason],
    (err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
});

/* =========================
   UPLOAD CSV / EXCEL  ✅ FIXED
========================= */
router.post("/upload-csv", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows = [];

    /* ===== CSV ===== */
    if (ext === ".csv") {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", row => {
            rows.push({
              name: row.name || row.Name,
              email: row.email || row.Email,
              course: row.course || row.Course || row.Program,
              status: row.status || row.Status || "New",
              reason: row.reason || row.Reason || "-"
            });
          })
          .on("end", resolve)
          .on("error", reject);
      });
    }

    /* ===== EXCEL ===== */
    else {
      const wb = XLSX.readFile(filePath);
      const data = XLSX.utils.sheet_to_json(
        wb.Sheets[wb.SheetNames[0]]
      );

      data.forEach(row => {
        rows.push({
          name: row.name || row.Name,
          email: row.email || row.Email,
          course: row.course || row.Course || row.Program,
          status: row.status || row.Status || "New",
          reason: row.reason || row.Reason || "-"
        });
      });
    }

    let inserted = 0;

    for (const r of rows) {
      if (!r.name || !r.email) continue;

      await new Promise(resolve => {
        db.query(
          "INSERT INTO enquiries (name,email,course,status,reason) VALUES (?,?,?,?,?)",
          [r.name, r.email, r.course, r.status, r.reason],
          () => {
            inserted++;
            resolve();
          }
        );
      });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, inserted });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;

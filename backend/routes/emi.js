const express = require("express");
const router = express.Router();
const db = require("../db");

/* ======================
   ADD EMI
====================== */
router.post("/add", (req, res) => {
  // Support clients that send either `student_name` or `name`.
  const { emi_no, amount, due_date, status } = req.body;
  let student_name = req.body.student_name || req.body.name || null;

  // Log the incoming body to help debug incorrect or hardcoded values from clients.
  console.log("Add EMI request body:", req.body);

  const sql = `
    INSERT INTO emi (student_name, emi_no, amount, due_date, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [student_name, emi_no, amount, due_date, status || "Pending"],
    (err, result) => {
      if (err) {
        console.error("Add EMI error:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "EMI added successfully" });
    }
  );
});

/* ======================
   GET EMI BY STUDENT
====================== */
router.get("/student/:name", (req, res) => {
  const name = req.params.name;

  const sql = `
    SELECT * FROM emi
    WHERE LOWER(student_name) = LOWER(?)
    ORDER BY emi_no
  `;

  db.query(sql, [name], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ======================
   GET ALL EMI
====================== */
router.get("/", (req, res) => {
  db.query("SELECT * FROM emi", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;

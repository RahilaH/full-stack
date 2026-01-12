const express = require("express");
const router = express.Router();
const db = require("../db");

/* ===============================
   ADD STUDENT
================================ */
router.post("/add", (req, res) => {
  const { name, email, course, joining_date, plan, amount } = req.body;

  const sql = `
    INSERT INTO students 
    (name, email, course, joining_date, plan, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, course, joining_date, plan, amount],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ error: err });
      }

      res.json({
        message: "Student added successfully",
        id: result.insertId
      });
    }
  );
});

/* ===============================
   GET ALL STUDENTS
================================ */
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      id,
      name,
      email,
      course,
      joining_date,
      plan,
      amount
    FROM students
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).json({ error: err });
    }

    res.json(results);
  });
});

module.exports = router;

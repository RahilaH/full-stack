const express = require("express");
const router = express.Router();
const db = require("../db");

// GET DASHBOARD COUNTS
router.get("/counts", (req, res) => {

  const queries = {
    enquiries: "SELECT COUNT(*) AS count FROM enquiries",
    enrollments: "SELECT COUNT(*) AS count FROM students",
    pendingEmis: "SELECT COUNT(*) AS count FROM emi WHERE status='Pending'",
    overdueEmis: "SELECT COUNT(*) AS count FROM emi WHERE due_date < CURDATE() AND status='Pending'"
  };

  let result = {};

  db.query(queries.enquiries, (err, r1) => {
    if (err) return res.status(500).json(err);
    result.enquiries = r1[0].count;

    db.query(queries.enrollments, (err, r2) => {
      if (err) return res.status(500).json(err);
      result.enrollments = r2[0].count;

      db.query(queries.pendingEmis, (err, r3) => {
        if (err) return res.status(500).json(err);
        result.pendingEmis = r3[0].count;

        db.query(queries.overdueEmis, (err, r4) => {
          if (err) return res.status(500).json(err);
          result.overdues = r4[0].count;

          res.json(result);
        });
      });
    });
  });
});

module.exports = router;

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/students", require("./routes/students"));
app.use("/enquiries", require("./routes/enquiries"));
app.use("/emis", require("./routes/emi"));
app.use("/dashboard", require("./routes/dashboard"));


app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

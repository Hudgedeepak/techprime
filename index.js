import express from "express";
import cors from "cors";
import { createConnection } from "mysql";

const app = express();

app.use(express.json());
app.use(cors());

const con = createConnection({
  host: "localhost",
  user: "root",
  password: "pass@123",
  database: "techprimeweb",
});

con.connect((err) => {
  if (err) {
    console.log("Error connecting to the database:", err);
  } else {
    console.log("Connected successfully to the database");
  }
});

// Registration Endpoint
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const dataQuery = "INSERT INTO registration SET ?";

  con.query(dataQuery, { name, email, password }, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res
        .status(500)
        .json({ status: "fail", message: "Database error" });
    }
    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  });
});

app.post("/", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM registration WHERE email = ? AND password = ?";

  con.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "fail", message: "Database error" });
    }
    if (results.length === 0) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }
    res.json({ status: "success", message: "Login successful" });
  });
});

app.post("/ProjectForm", (req, res) => {
  const {
    reason,
    type,
    division,
    category,
    priority,
    department,
    startDate,
    endDate,
    location,
    projectName,
    status,
  } = req.body;

  const dataQuery = "INSERT INTO projectdata SET ?";

  con.query(
    dataQuery,
    {
      reason,
      type,
      division,
      category,
      priority,
      department,
      startDate,
      endDate,
      location,
      projectName,
      status,
    },
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res
          .status(500)
          .json({ status: "fail", message: "Database error" });
      }
      res
        .status(201)
        .json({ status: "success", message: "Project saved successfully" });
    }
  );
});

app.get("/projectlisting", (_req, res) => {
  const dataQuery = "select * from projectdata";
  console.log("show in table");
  con.query(dataQuery, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ status: "fail", message: "Database error" });
    }
    res.json({ status: "success", data: result });
  });
});

// Project Status Update Endpoint
app.post("/updatestatus", (req, res) => {
  const { status, id } = req.body;
  const sql = "UPDATE projectdata SET status = ? WHERE id = ?";

  con.query(sql, [status, id], (error, results) => {
    if (error) {
      console.error("Error updating column:", error);
      return res
        .status(500)
        .json({ status: "fail", message: "Failed to update status" });
    }
    res.json({ status: "success", message: "Status updated successfully" });
  });
});

app.listen(4500, () => {
  console.log("Server is running on port 4500");
});

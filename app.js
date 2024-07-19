const express = require("express");
const cors = require("cors");
const { connectToDb } = require("./config/db");
const { config } = require("dotenv");
const router = require("./routes/routes")
const app = express();
config(); 

const port = process.env.PORT || 3000; 
const dbUrl = process.env.DB_URL; 

// Connect to the database
connectToDb(dbUrl);
app.use(express.json({ limit: "50mb" }));
app.use(cors({
    origin:"*"
}));
app.use("/api",router)

app.get("/", (req, res) => {
  res.status(200).send("API is working");
});

app.listen(port, () => {
  console.log(`Backend app server is running on port ${port}`);
});

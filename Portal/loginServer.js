const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect("mongodb+srv://amrita:amma123@amrita.gavaw.mongodb.net/login_portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);
app.get("/", (req, res) => {
  res.render("login", { errorMessage: null }); // Pass errorMessage as null initially
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { errorMessage: "Username does not exist. Please try again." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.render("homepage", { name: user.name });
    } else {
      res.render("login", { errorMessage: "Incorrect password. Please try again." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("login", { errorMessage: "Internal Server Error. Please try again later." });
  }
});
app.get("/homepage", (req, res) => {
  res.send("Welcome to the homepage!");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

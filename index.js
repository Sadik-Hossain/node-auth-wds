const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// * local db
const users = [];

app.get("/", (req, res) => {
  res.send("hello");
});
app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    // const hashedPass = await bcrypt.hash(password, salt);
    // * by default, salt is 10
    const hashedPass = await bcrypt.hash(password, 10);
    // console.log(req.body, hashedPass);
    users.push({ email, hashedPass });
    // console.log(users);
    res.status(200).json({ email, hashedPass });
  } catch (err) {
    res.status(500).send();
  }
});

//* login
app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.email === req.body.email);

  if (user == null) {
    return res.status(400).send(`Cannot find user`);
  }

  //* password comparison
  try {
    const match = await bcrypt.compare(req.body.password, user.hashedPass);
    if (match) {
      res.send("success login");
    } else {
      res.send("password dont match");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, console.log(`listenong to port ${PORT}`));

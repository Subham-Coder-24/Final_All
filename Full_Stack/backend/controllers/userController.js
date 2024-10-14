const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const {
    name: Name,
    email: Email,
    password,
    department: Department,
    team:Team,
  } = req.body;

  try {
    const existingUser = await prisma.employee.findUnique({ where: { Email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const Role = "User";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.employee.create({
      data: {
        Name,
        Email,
        Department,
        Role,
        Team,
        Password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { EmployeeID: user.EmployeeID },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
let options = {
  // maxAge: 20 * 60 * 1000, // would expire in 20minutes
  httpOnly: true, // The cookie is only accessible by the web server
  secure: true,
  sameSite: "None",
};
const loginUser = async (req, res) => {
  const { email: Email, password: Password } = req.body;
  console.log(req.body);
  
  try {
    const user = await prisma.employee.findUnique({ where: { Email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { EmployeeID: user.EmployeeID },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const user = await prisma.employee.findUnique({
    where: { EmployeeID: req.user.EmployeeID },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(204).json({ message: "User not found" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};

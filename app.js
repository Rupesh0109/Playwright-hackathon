require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const colors = require("colors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const { body, validationResult, sanitizeBody } = require('express-validator');
const xss = require('xss-clean');
const cors = require('cors');

const UserModel = require("./models/User");

const MONGOURI = process.env.MONGOURI || "mongodb+srv://rupesh:rupesh123@laundry.xk6qtjt.mongodb.net/?retryWrites=true&w=majority";
const SESSION_SECRET = process.env.SESSION_SECRET || "key that signs the cookie";

app.use(helmet());
app.use(cors({
  origin: 'http://yourfrontenddomain.com', // Change to your frontend domain
  methods: ['GET', 'POST'],
  credentials: true
}));

// Rate limiter to limit repeated requests to public APIs and/or endpoints such as login
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(xss()); // Data sanitization against XSS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/assets', express.static(__dirname + '/public'));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Connected To Mongodb Database ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in Mongodb ${error}`.bgRed.white);
  }
};
connectDB();

const store = new MongoDBSession({
  uri: MONGOURI,
  databaseName: "Laundry-website",
  collection: "sessions"
});

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // set secure flag in production
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// CSRF protection middleware
app.use(csurf());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Middleware
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login?error=notlogin");
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect("/?error=notadmin");
  }
};

const generateQR = async text => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err + "qrcode");
  }
};

// Routes
app.get('/', function (req, res) {
  var logout = false;
  var admincheck = false;
  if (req.query.logout === "sucessfull") {
    logout = true;
  }
  if (req.query.error === "notadmin") {
    admincheck = true;
  }
  res.render('pages/home', { auth: req.session.isAuth, logout: logout, data: req.session.data, admin: req.session.isAdmin, admincheck: admincheck, csrfToken: req.csrfToken() });
});

app.get('/login', (req, res) => {
  if (req.session.isAuth) {
    return res.redirect("/dashboard?error=logged");
  }
  var password = false;
  var register = false;
  var modal = false;
  var login = false;
  if (req.query.error === "userexists") {
    modal = true;
  }
  if (req.query.error === "notlogin") {
    login = true;
  }
  if (req.query.error === "passworddoesnotmatch") {
    password = true;
  }
  if (req.query.register === "success") {
    register = true;
  }
  res.render('pages/login', { condition: modal, success: register, password1: password, login: login, auth: req.session.isAuth, data: req.session.data, admin: req.session.isAdmin, csrfToken: req.csrfToken() });
});

app.get('/register', function (req, res) {
  if (req.session.isAuth) {
    return res.redirect("/dashboard?error=logged");
  }
  var exists = false;
  if (req.query.error === "usernotexists") {
    exists = true;
  }
  res.render('pages/register', { modal: exists, auth: req.session.isAuth, data: req.session.data, admin: req.session.isAdmin, csrfToken: req.csrfToken() });
});

app.get('/dashboard', isAuth, (req, res) => {
  var logged = false;
  if (req.query.error === "logged") {
    logged = true;
  }
  res.render("pages/dashboard", { auth: req.session.isAuth, data: req.session.data, admin: req.session.isAdmin, logged: logged, csrfToken: req.csrfToken() });
});

app.get('/admin/dashboard', isAuth, isAdmin, function (req, res) {
  res.render("pages/admindashboard", { auth: req.session.isAuth, data: req.session.data, admin: req.session.isAdmin, csrfToken: req.csrfToken() });
});

app.get('/admin/orderintake', isAuth, isAdmin, function (req, res) {
  res.render("pages/orderintake", { auth: req.session.isAuth, data: req.session.data, admin: req.session.isAdmin, csrfToken: req.csrfToken() });
});

app.get('/admin/orderdelivery', isAuth, isAdmin, function (req, res) {
  res.render("pages/orderdelivery", { auth: req.session.isAuth, data: req.session.data, admin: req.session.isAdmin, csrfToken: req.csrfToken() });
});

app.get('/admin/checkuser', isAuth, isAdmin, function (req, res) {
  res.render("pages/checkuser", { auth: req.session.isAuth, data: req.session.data, admin: req.session.isAdmin, csrfToken: req.csrfToken() });
});

// Form handling
app.post("/register",
  [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required').escape(),
    body('roll').trim().isLength({ min: 1 }).withMessage('Roll number is required').escape(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.redirect("/register?error=invalidinput");
      }

      const { name, roll, password } = req.body;

      let user = await UserModel.findOne({ "rollno": roll });
      if (user) {
        return res.redirect("/login?error=userexists");
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const qrsrc = await generateQR(roll);

      user = new UserModel({
        name: name.toUpperCase(),
        rollno: roll,
        password: hashedPassword,
        qrsrc: qrsrc
      });

      await user.save();
      res.redirect("/login?register=success");
    } catch (error) {
      console.error("Register error:", error);
      res.redirect("/register?error=servererror");
    }
  });

app.post('/login',
  [
    body('roll').trim().isLength({ min: 1 }).withMessage('Roll number is required').escape(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.redirect("/login?error=invalidinput");
      }

      const { roll, password } = req.body;

      const user = await UserModel.findOne({ "rollno": roll });
      if (!user) {
        return res.redirect("/register?error=usernotexists");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.redirect("/login?error=passworddoesnotmatch");
      }

      req.session.data = user;
      if (user.role === "admin") {
        req.session.isAuth = true;
        req.session.isAdmin = true;
        return res.redirect("/admin/dashboard");
      }

      req.session.isAuth = true;
      req.session.isAdmin = false;
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      res.redirect("/login?error=servererror");
    }
  });

app.post("/orderintake", isAdmin, async (req, res) => {
  try {
    const { rollno } = req.body;
    if (typeof rollno !== 'string' || rollno.trim().length === 0) {
      return res.status(400).send("Invalid roll number");
    }

    const user = await UserModel.findOne({ "rollno": rollno.trim() });
    if (!user) {
      return res.status(404).send("USER NOT FOUND");
    }

    const d = new Date();
    const day = d.getDay();
    let k = new Date();
    k.setHours(0, 0, 0, 0);
    const currentTime = k.getTime();

    if (user.orders.length === 0) {
      user.orders.push({
        day: day,
        time: currentTime,
        state: "Processing"
      });
      await user.save();
      return res.send(`Order intake success for ${rollno}`);
    } else if (user.orders[user.orders.length - 1].state === "Delivered") {
      const lastOrder = user.orders[user.orders.length - 1];
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      // Check if last order was created within the last 7 days
      if (lastOrder.day === day) {
        if (currentTime - lastOrder.time < (7 * 24 * 60 * 60 * 1000)) {
          return res.send(`Order cannot be created. Previous order created on ${days[lastOrder.day]}`);
        }
      }

      user.orders.push({
        day: day,
        time: currentTime,
        state: "Processing"
      });
      await user.save();
      return res.send(`Order intake success for ${rollno}`);
    } else {
      return res.send("Already previous order is in processing");
    }
  } catch (error) {
    console.error("Order intake error:", error);
    res.status(500).send("Server error");
  }
});

app.post("/orderdelivery", isAdmin, async (req, res) => {
  try {
    const { rollno } = req.body;
    if (typeof rollno !== 'string' || rollno.trim().length === 0) {
      return res.status(400).send("Invalid roll number");
    }

    const user = await UserModel.findOne({ "rollno": rollno.trim() });
    if (!user) {
      return res.status(404).send("USER NOT FOUND");
    }

    if (user.orders.length === 0) {
      return res.send("There are no orders in this account");
    }

    if (user.orders[user.orders.length - 1].state === "Delivered") {
      return res.send("There are no active orders, all previous orders are delivered");
    }

    user.orders[user.orders.length - 1].state = "Delivered";
    await user.save();

    return res.send(`STATUS UPDATED AS DELIVERED FOR ${rollno}`);
  } catch (error) {
    console.error("Order delivery error:", error);
    res.status(500).send("Server error");
  }
});

app.post("/checkuser", isAdmin, async (req, res) => {
  try {
    const { rollno } = req.body;
    if (typeof rollno !== 'string' || rollno.trim().length === 0) {
      return res.status(400).send("EMPTY!!!!");
    }

    const data = await UserModel.findOne({ "rollno": rollno.trim() });
    if (!data) {
      return res.status(404).send("USER NOT EXIST");
    }

    return res.send(`<table class="table" id="data">
      <tbody>
        <tr>
          <th scope="row">Name</th>
          <td>${data.name} </td>
        </tr>
        <tr>
          <th scope="row">Roll no</th>
          <td>${data.rollno}</td>
        </tr>
        <tr>
          <th scope="row">Unique Qr Code</th>
          <td><img class="img-fluid" src="${data.qrsrc}" alt="QRCODE"><br></td>
        </tr>
        <tr>
          <th scope="row">PHOTO</th>
          <td style="height:150px;width:150px"> <img class="img-fluid" src="https://www.rajalakshmi.org/QRCode/img/${data.rollno}.jpg" alt="IDCARDPhoto"><br></td>
        </tr>
      </tbody>
    </table>`);
  } catch (error) {
    console.error("Check user error:", error);
    res.status(500).send("Server error");
  }
});

// Logout
app.get("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Server error");
    }
    res.redirect("/?logout=sucessfull");
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // CSRF token errors
    res.status(403);
    res.send('Form tampered with');
  } else {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  }
});

app.listen(3000);
console.log('Server is listening on port 3000');

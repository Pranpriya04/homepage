const express = require("express");
const HandyStorage = require("handy-storage"); //เก็บข้อมูลลงjson
const axios = require("axios");
const path = require("path");
const app = express();
var bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 5500;

const storage = new HandyStorage({
  beautify: true,
});

storage.connect("./information.json");

storage.setState({
  UserID: "",
  UserPassword: "",
  UserName: "",
  Gender: "",
  Email: "",
  Tel: "",
  Credit: "",
  Address: "",
  role: "",
});

const base_url = "http://10.104.15.122:3000";

app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  try {
    res.redirect("home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/member", (req, res) => {
  res.render("member");
});

app.get("/forgetpassword", (req, res) => {
  res.render("forgetpassword");
});

app.get("/home_admin", async (req, res) => {
  const response = await axios.get(base_url + "/stadiums");
  res.render("home_admin", {
    stadium: response.data,
    role: 0,
  });
});

app.get("/editstadium_admin/:StadiumID", async (req, res) => {
  const response = await axios.get(
    base_url + "/stadiums/" + req.params.StadiumID,
  );
  console.log(response);
  res.render("editstadium_admin", {
    stadium: response.data,
  });
});

app.post("/editstadium_admin/:StadiumID", async (req, res) => {
  const response = await axios.put(
    base_url + "/stadiums/" + req.params.StadiumID,
    req.body,
  );
  console.log(response);
  res.redirect("/home_admin");
});

app.get("/instadium_admin", (req, res) => {
  res.render("instadium_admin");
});

app.get("/sale-admin", async (req, res) => {
  const response = await axios.get(base_url + "/sales_data");
  console.log(response);
  res.render("sale-admin", {
    sales_data: response.data,
    role: 0,
  });
});

app.get("/datamem_admin", async (req, res) => {
  const response = await axios.get(base_url + "/users");
  console.log(response);
  res.render("datamem_admin", {
    users: response.data,
    role: 0,
  });
});

app.get("/datamem_admin", (req, res) => {
  res.render("datamem_admin");
});

app.get("/logout", async (req, res) => {
  await storage.setState({
    UserID: "",
    UserPassword: "",
    UserName: "",
    Gender: "",
    Email: "",
    Tel: "",
    Credit: "",
    Address: "",
    role: "",
  });

  res.redirect("/home");
});

app.get("/history", async (req, res) => {
  const response = await axios.get(
    base_url + "/history/" + storage.state.UserID,
  );
  console.log(response.data);
  res.render("history", {
    history: response.data,
    user: storage.state,
  });
});

app.get("/home", async (req, res) => {
  const response = await axios.get(base_url + "/stadiums");
  res.render("home", {
    stadium: response.data,
  });
});

app.get("/sale/:saleID", async (req, res) => {
  const response = await axios.get(base_url + "/stadiums/" + req.params.saleID);
  res.render("sale", {
    stadium: response.data,
    user: storage.state,
  });
});

app.get("/profile", (req, res) => {
  res.render("profile", {
    user: storage.state,
  });
});

app.get("/editprofile", (req, res) => {
  res.render("editprofile", {
    user: storage.state,
  });
});
app.get("/basketball", async (req, res) => {
  let page = "home";
  const response = await axios.get(base_url + "/basketball");
  if (storage.state.UserID) {
    if (storage.state.role == 1) {
      page = "home_admin";
    } else {
      page = "home_user";
    }
  }
  res.render(page, {
    stadium: response.data,
  });
});

app.get("/football", async (req, res) => {
  let page = "home";
  const response = await axios.get(base_url + "/football");
  if (storage.state.UserID) {
    if (storage.state.role == 1) {
      page = "home_admin";
    } else {
      page = "home_user";
    }
  }
  res.render(page, {
    stadium: response.data,
  });
});

app.get("/futsal", async (req, res) => {
  let page = "home";
  const response = await axios.get(base_url + "/futsal");
  if (storage.state.UserID) {
    if (storage.state.role == 1) {
      page = "home_admin";
    } else {
      page = "home_user";
    }
  }
  res.render(page, {
    stadium: response.data,
  });
});

app.get("/Bat", async (req, res) => {
  let page = "home";
  const response = await axios.get(base_url + "/Bat");
  if (storage.state.UserID) {
    if (storage.state.role == 1) {
      page = "home_admin";
    } else {
      page = "home_user";
    }
  }
  res.render(page, {
    stadium: response.data,
  });
});

app.get("/home_user", async (req, res) => {
  const response = await axios.get(base_url + "/stadiums");
  res.render("home_user", {
    stadium: response.data,
    role: 0,
  });
});

app.get("/forgetpassword", (req, res) => {
  res.render("forgetassword");
});

app.get("/changPassword/:UserID", (req, res) => {
  res.render("changPassword", {
    UserID: req.params.UserID,
  });
});

app.post("/forget", async (req, res) => {
  const response = await axios.post(base_url + "/forget", req.body);
  let { status, UserID } = response.data;
  if (status) {
    res.redirect("changPassword/" + UserID);
  } else {
    res.render("alert", {
      message: "ชื่อผู้ใช้งาน หรือ Email ไม่ถูกต้อง",
    });
  }
});

app.post("/changPassword/:UserID", async (req, res) => {
  console.log(req.params.UserID);
  if (req.body.newpassword == req.body.replypassword) {
    const response = await axios.post(
      base_url + "/changPassword/" + req.params.UserID,
      req.body,
    ); /** เดี๋ยวกลับมาแก้*/
    if (response.data) {
      res.redirect("/login");
    } else {
      res.render("alert", {
        message: "ชื่อผู้ใช้งาน หรือ Email ไม่ถูกต้อง",
      });
    }
  } else {
    res.render("alert", {
      message: "กรอกรหัสผ่านให้ถูกต้อง",
    });
  }
});

app.post("/login", async (req, res) => {
  const response = await axios.post(base_url + "/login", req.body);

  let { status, user, role } = response.data;

  if (status) {
    if (role == 1) {
      res.redirect("/home_admin");
    } else {
      res.redirect("/home_user");
    }
    storage.setState({
      ...user,
      role,
    });
  } else {
    res.render("alert", {
      status: false,
      message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง!",
    });
  }
});

app.post("/forget", async (req, res) => {
  const response = await axios.post(base_url + "/forget", req.body);
  if (response.data) {
    res.redirect("/changPassword");
  } else {
    res.render("alert", {
      status: false,
      message: "ชื่อผู้ใช้งานหรือEmailไม่ถูกต้อง!",
    });
  }
});

app.post("/editprofile", async (req, res) => {
  const response = await axios.put(base_url + `/users`, req.body);
  storage.setState({
    ...response.data,
  });
  res.redirect("/profile");
});

app.post("/booking", async (req, res) => {
  console.log(req.body);
  const response = await axios.post(base_url + `/sales_data`, req.body);
  res.redirect("/home_user");
});

app.post("/member", async (req, res) => {
  if (req.body.UserPassword == req.body.nPassword) {
    const response = await axios.post(base_url + `/users`, req.body);
    res.redirect("/home");
  } else {
    res.render("alert", {
      status: false,
      message: "รหัสไม่ตรง",
    });
  }
});

app.post("/instadium_admin", async (req, res) => {
  const response = await axios.post(base_url + `/stadiums`, req.body);
  res.redirect("/home_admin");
});

app.get("/delstadium/:saleID", async (req, res) => {
  const response = await axios.delete(
    base_url + "/stadiums/" + req.params.saleID,
  );
  res.redirect("/home_admin");
});

//-------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log("Sever started on post 5500");
});

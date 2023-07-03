const config = require("../../config.json");
const dbConfig = require("../../my-sql-connection");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '663b135fe7eaa8',
    pass: 'c88976c7361953'
  }
});

exports.login = function (req, res, next) {
  let email = req.body.username;
  let password = req.body.password;
  let query_ = "SELECT * from users where email=?";
  let confirmed = "";
  dbConfig.query(query_, [email], (err, rows) => {
    if (err) {
      console.log("Error Connecting to Server !");
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server!" });
    } else {
      try {
        if (rows != null) {
          if (password == rows[0]["password"]) {
            const token = jwt.sign(
              {
                email: rows[0]["email"],
                firstname: rows[0]["first_name"],
                lastname: rows[0]["last_name"],
              },
              config.env.jwt_key,
              {
                expiresIn: config.env.jwt_expiry_seconds * 1000,
              }
            );
            return res.status(200).send({
              success: true,
              message: "Login Successful!",
              token: token,
              username: email,
              accountId: rows[0]["account_id"],
              accontType: rows[0]["account_id"],
              role: rows[0]["role"],
            });
          } else {
            console.log("Invalid Credentials!");
            return res
              .status(401)
              .send({ success: false, message: "Invalid Credentials!" });
          }
        } else {
          console.log("Invalid Credentials!");
          return res
            .status(401)
            .send({ success: false, message: "Invalid Credentials!" });
        }
      } catch (e) {
        console.log(e);
        return res
          .status(401)
          .send({ success: false, message: "Invalid Credentials!" });
      }
    }
  });
};

exports.register = function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let firstname = req.body.firstName;
  let lastname = req.body.lastName;
  let address = req.body.address;
  let role = req.body.role;
  if (role == null || role == "") {
    role = "CASH";
  }
  let query_0 = "SELECT * FROM USERS WHERE email=?";
  let query_1 =
    `INSERT INTO USERS (email, password, first_name, last_name, role) VALUES(?,?,?,?,'${role}')`;

  dbConfig.query(query_0, [email, password, firstname, lastname], (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else {
      try {
        if (rows != null) {
          if (rows > 0) {
            return res.status(401).send({
              success: false,
              message: "Email already taken by another user !",
            });
          } else {
            dbConfig.query(
              query_1,
              [email, password, firstname, lastname, address],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  return res.status(401).send({
                    success: false,
                    message: "Error Connecting to Server !",
                  });
                } else {
                  return res.status(201).send({
                    success: true,
                    message: "user registered successfully",
                  });
                }
              }
            );
          }
        }
      } catch (e) {
        console.log(e);
        return res
          .status(401)
          .send({ success: false, message: "Error Connecting to Server!" });
      }
    }
  });
};

exports.forgetPassword = function (req, res, next) {
  let email = req.body.email;
  let query_0 = "SELECT * FROM USERS WHERE email=?";
  let query_1 =
    "UPDATE USERS SET forget_password_code=?,validate_forget_password_code=false WHERE email=?";
  let forget_password_code = Math.floor(100000 + Math.random() * 900000);
  dbConfig.query(query_0, [email], (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else if (rows != null) {
      if (rows == 0) {
        return res.status(404).send({
          success: false,
          message: "Email Not Found !",
        });
      } else {
        dbConfig.query(query_1, [forget_password_code, email], (err, rows) => {
          if (err) {
            console.log(err);
            return res.status(401).send({
              success: false,
              message: "Error Connecting to Server !",
            });
          } else {
            const mailOptions = {
              from: 'donotreply@minicart.lk',
              to: email,
              subject: 'Test Email',
              text: 'Verification Code: ' + forget_password_code
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return res.status(500).send({
                  success: false,
                  message: "Error while sending email",
                });
              } else {
                return res.status(201).send({
                  success: true,
                  code: forget_password_code,
                  message: "forget password successfully generated",
                });
              }
            });

          }
        });
      }
    }
  });
};

exports.verifyCode = function (req, res, next) {
  let email = req.body.email;
  let code = req.body.code;
  let query_0 = "SELECT * FROM USERS WHERE email=?";
  let query_1 =
    "UPDATE USERS SET validate_forget_password_code=? WHERE email=?";
  dbConfig.query(query_0, [email], (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else if (rows != null) {
      if (rows == 0) {
        return res.status(404).send({
          success: false,
          message: "Email Not Found !",
        });
      } else if (rows[0].forget_password_code == code) {
        dbConfig.query(query_1, [true, email], (err, rows) => {
          if (err) {
            console.log(err);
            return res.status(401).send({
              success: false,
              message: "Error Connecting to Server !",
            });
          } else {
            return res.status(201).send({
              success: true,
              validate: true,
              message: "Validated Successfully",
            });
          }
        });
      } else {
        return res.status(403).send({
          success: false,
          validate: false,
          message: "Invalid code.",
        });
      }
    }
  });
};

exports.updatePassword = function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let query_0 = "UPDATE USERS SET password=? WHERE email=?";

  dbConfig.query(query_0, [password, email], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else {
      if (rows != null) {
        return res.status(200).send({
          success: true
        });
      } else {
        return res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    }
  });
};

exports.getProfileDetails = function (req, res, next) {
  let account_id = req.body.account_id;
  let query_ =
    "SELECT first_name,last_name,email,created_date,updated_date,role from users where account_id=?";

  dbConfig.query(query_, [account_id], (err, rows) => {
    if (err) {
      console.log("Error Connecting to Server !");
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server!" });
    } else {
      try {
        if (rows != null) {
          return res.status(200).send({
            success: true, body: {
              firstName: rows[0]["first_name"],
              lastName: rows[0]["last_name"],
              email: rows[0]["email"],
              createdDate: rows[0]["created_date"],
              updatedDate: rows[0]["updated_date"],
              role: rows[0]["role"],
            }
          });
        } else {
          console.log("Error fetching user details");
          return res
            .status(401)
            .send({ success: false, message: "Error fetching user details" });
        }
      } catch (e) {
        console.log(e);
        return res
          .status(401)
          .send({ success: false, message: "Error fetching user details" });
      }
    }
  });
};

exports.getAllUsers = function (req, res, next) {
  let page = req.query.page;
  page = Number(page);
  let size = req.query.size;
  size = Number(size);
  let sort = req.query.sort;
  let direction = req.query.direction;

  var lowerLimit = (page) * size;
  var upperLimit = (page + 1) * size;

  let query_0 = "SELECT * FROM USERS ORDER BY id " + direction + " limit " + lowerLimit + "," + upperLimit + ";";
  dbConfig.query(query_0, [], (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else {
      if (rows != null) {
        return res.status(200).send({ rows });
      }
    }
  });
};

exports.getUserById = function (req, res, next) {
  let id = req.params.id;
  let query_0 = "SELECT * FROM USERS WHERE id=?";

  dbConfig.query(query_0, [id], (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else {
      if (rows != null) {
        return res.status(200).send({
          id: rows[0].id,
          firstname: rows[0].first_name,
          lastname: rows[0].last_name,
          email: rows[0].email,
          role: rows[0].role,
          createdDate: rows[0].created_date,
          updatedDate: rows[0].updated_date
        });
      }
    }
  });
};

exports.updateUser = function (req, res, next) {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let role = req.body.role;
  let id = req.body.id;
  id = id.toString();
  let query_0 = "UPDATE USERS SET first_name=?,last_name=?,role=? WHERE id=?";
  dbConfig.query(query_0, [firstname, lastname, role, id], (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else {
      if (rows > 0) {
        return res.status(200).send({
          id: rows[0].id,
          firstname: rows[0].first_name,
          lastname: rows[0].last_name,
          email: rows[0].email,
          role: rows[0].role,
          createdDate: rows[0].created_date,
          updatedDate: rows[0].updated_date
        });
      }
    }
  });
};

exports.deleteUser = function (req, res, next) {
  let id = req.params.id;
  let query_0 = "DELETE FROM USERS  WHERE id = ?";

  dbConfig.query(query_0, [id], (err, rows) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ success: false, message: "Error Connecting to Server !" });
    } else {
      return res.status(200).send({
        success: true,
        message: "User Deleted Successfully."
      });
    }
  });
}
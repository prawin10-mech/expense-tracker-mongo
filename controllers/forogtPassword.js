const uuid = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../models/users");
const Forgotpassword = require("../models/forgot_password");

exports.forgotpassword = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const id = uuid.v4();
      Forgotpassword.create({
        active: true,
        id: id,
        userId: user.id,
      }).catch((err) => {
        throw new Error(err);
      });

      res.json({
        resetlink: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      });
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    return res.json({ message: err + "j", sucess: false });
  }
};

exports.resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpassword) => {
    if (forgotpassword) {
      forgotpassword.update({ active: false });
      res.status(200).send(`<html>
                                
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            window.location.href= "D:\sharpner\backend\expenseTracker\views\signup\login.html";
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

exports.updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        User.findOne({ where: { id: resetpasswordrequest.userId } }).then(
          (user) => {
            if (user) {
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

const uuid = require("uuid");
const bcrypt = require("bcrypt");
const mongodb = require("mongodb");

const User = require("../models/users");
const Forgotpassword = require("../models/forgot_password");

exports.forgotpassword = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });

    console.log(user);
    if (user) {
      const id = uuid.v4();
      console.log(id);
      const forgot = new Forgotpassword({
        active: true,
        id: id,
        userId: user._id,
      });
      forgot.save().then(() => {
        res.json({
          resetlink: `<a href="http://localhost:3000/password/resetpassword/${user._id}">Reset password</a>`,
        });
      });
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    return res.json({ message: err + "j", sucess: false });
  }
};

exports.resetpassword = (req, res) => {
  const id = new mongodb.ObjectId(req.params.id);
  console.log(id);
  Forgotpassword.findOne({ userId: id }).then((forgotpassword) => {
    console.log(forgotpassword);
    if (forgotpassword) {
      Forgotpassword.findOneAndUpdate(
        { userId: id },
        { active: false },
        null,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      res.status(200).send(`<html>

                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
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
    Forgotpassword.findOne({
      userId: resetpasswordid,
    }).then((resetpasswordrequest) => {
      User.findOne({
        id: new mongodb.ObjectId(resetpasswordrequest.userId),
      }).then((user) => {
        console.log(user);
        if (user) {
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
              console.log(err);
              throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, function (err, hash) {
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
      });
    });
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
// sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const {errorHandler} = require("../helpers/dbErrorHandler");


exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
      if (user) {
          return res.status(400).json({
              error: 'Email is taken'
          });
      }

      const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

      const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Account activation link`,
          html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

          <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Email Confirmation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
           .myButton {
	box-shadow:inset 0px 1px 0px 0px #97c4fe;
	background:linear-gradient(to bottom, #3d94f6 5%, #1e62d0 100%);
	background-color:#3d94f6;
	border-radius:6px;
	border:1px solid #337fed;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:15px;
	font-weight:bold;
	padding:6px 24px;
	text-decoration:none;
	text-shadow:0px 1px 0px #1570cd;
}
.myButton:hover {
	background:linear-gradient(to bottom, #1e62d0 5%, #3d94f6 100%);
	background-color:#1e62d0;
}
.myButton:active {
	position:relative;
	top:1px;
} 
.myButton:visited { 
    color:#ffffff;
 }
           </style>
          </head>
          <body style="margin: 0; padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">	
                  <tr>
                      <td style="padding: 10px 0 30px 0;">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                              <tr>
                                  <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                                      <img src="https://res.cloudinary.com/drzyjnnsq/image/upload/v1578741282/web/logo_xde_back_fsuei0.png" alt="jombeli.org" width="300" height="100" style="display: block;" />
                                  </td>
                              </tr>
                              <tr>
                                  <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                          <tr>
                                              <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                  <b>Click the button to activate your account</b>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                                  <a href=${process.env.CLIENT_URL}/auth/activate/${token} class="myButton">activate account</a>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td width="260" valign="top">
                                                             
                                                          </td>
                                                          
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                          <tr>
                                              <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                                  <a href="mailto:alifzulkifeli@gmail.com" style="color: #ffffff;"><font color="#ffffff">contact us</font></a><br/><br/>
                                                  &reg; Jombeli.org
                                              </td> 
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
          `
      };

      sgMail
          .send(emailData)
          .then(sent => {
              // console.log('SIGNUP EMAIL SENT', sent)
              return res.json({
                  message: `Email has been sent to ${email}. Follow the instruction to activate your account`
              });
          })
          .catch(err => {
              // console.log('SIGNUP EMAIL SENT ERROR', err)
              return res.json({
                  message: err.message
              });
          });
  });
};


exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
          if (err) {
              console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
              return res.status(401).json({
                  error: 'Expired link. Signup again'
              });
          }

          const { name, email, password } = jwt.decode(token);

          const user = new User({ name, email, password });

          user.save((err, user) => {
              if (err) {
                  console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                  return res.status(401).json({
                      error: 'Error saving user in database. Try signup again'
                  });
              }
              return res.json({
                  message: 'Signup success. Please signin.'
              });
          });
      });
  } else {
      return res.json({
          message: 'Something went wrong. Try again.'
      });
  }
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: "User with that email does not exist. Please signup"
          });
      }
      // if user is found make sure the email and password match
      // create authenticate method in user model
      if (!user.authenticate(password)) {
          return res.status(401).json({
              error: "Email and password dont match"
          });
      }
      // generate a signed token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      // persist the token as 'k' in cookie with expiry date
      res.cookie("k", token, { expire: new Date() + 9999 });
      // return response with user and token to frontend client
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("k");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
  
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user){
    return res.status(403).json({
      error: "access denied"
    });
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role ===0){
    return res.status(403).json({
      error: "not admin, access denied"
    });
  }
  next();
}



exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            });
        }

        const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_RESET_PASSWORD, {
            expiresIn: '10m'
        });

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password Reset`,
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Reset Password</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <style>
             .myButton {
      box-shadow:inset 0px 1px 0px 0px #97c4fe;
      background:linear-gradient(to bottom, #3d94f6 5%, #1e62d0 100%);
      background-color:#3d94f6;
      border-radius:6px;
      border:1px solid #337fed;
      display:inline-block;
      cursor:pointer;
      color:#ffffff;
      font-family:Arial;
      font-size:15px;
      font-weight:bold;
      padding:6px 24px;
      text-decoration:none;
      text-shadow:0px 1px 0px #1570cd;
  }
  .myButton:hover {
      background:linear-gradient(to bottom, #1e62d0 5%, #3d94f6 100%);
      background-color:#1e62d0;
  }
  .myButton:active {
      position:relative;
      top:1px;
  } 
             </style>
            </head>
            <body style="margin: 0; padding: 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">	
                    <tr>
                        <td style="padding: 10px 0 30px 0;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                                <tr>
                                    <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                                        <img src="https://res.cloudinary.com/drzyjnnsq/image/upload/v1578741282/web/logo_xde_back_fsuei0.png" alt="jombeli.org" width="300" height="100" style="display: block;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                    <b>Click the button to change password</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                                    <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}" class="myButton">reset password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td width="260" valign="top">
                                                               
                                                            </td>
                                                            
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                                    <a href="mailto:alifzulkifeli@gmail.com" style="color: #ffffff;"><font color="#ffffff">contact us</font></a><br/><br/>
                                                    &reg; Jombeli.org
                                                </td> 
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                console.log('RESET PASSWORD LINK ERROR', err);
                return res.status(400).json({
                    error: 'Database connection error on user password forgot request'
                });
            } else {
                sgMail
                    .send(emailData)
                    .then(sent => {
                        // console.log('SIGNUP EMAIL SENT', sent)
                        return res.json({
                            message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                        });
                    })
                    .catch(err => {
                        // console.log('SIGNUP EMAIL SENT ERROR', err)
                        return res.json({
                            message: err.message
                        });
                    });
            }
        });
    });
};



exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(400).json({
                    error: 'Expired link. Try again'
                });
            }

            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'Something went wrong. Try later'
                    });
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Error resetting user password'
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
    const { idToken } = req.body;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
        // console.log('GOOGLE LOGIN RESPONSE',response)
        const { email_verified, name, email } = response.payload;
        if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    const { _id, email, name, role } = user;
                    return res.json({
                        token,
                        user: { _id, email, name, role }
                    });
                } else {
                    let password = email + process.env.JWT_SECRET;
                    user = new User({ name, email, password });
                    user.save((err, data) => {
                        if (err) {
                            console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                            return res.status(400).json({
                                error: 'User signup failed with google'
                            });
                        }
                        const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        const { _id, email, name, role } = data;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    });
                }
            });
        } else {
            return res.status(400).json({
                error: 'Google login failed. Try again'
            });
        }
    });
};

exports.facebookLogin = (req, res) => {
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;

    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                const { email, name } = response;
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );
};

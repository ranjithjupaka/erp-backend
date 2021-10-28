const { User } = require('../models/users')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const dotenv = require('dotenv');

exports.userRegister = async (userDets, res) => {
    //console.log(userDets);
    const {employeeId} =  userDets;
    const user = await User.findOne({ employeeId });
    // console.log(userCreds);
    if (user) {
      return res.status(404).json({
        message: "Employee Id already Used. Please try another.",
        success: false
      });
    }
    try {
      const password = await bcrypt.hash(userDets.password, 12);
      const newUser = new User({
        ...userDets,
        password,
      });
      //console.log(newUser)
      await newUser.save();
      return res.status(201).json({
        message: "Hurry! now you are successfully registred",
        success: true
      });
    } catch (err) {
      return res.status(500).json({
        message: `Unable to create your account ${err.message}`,
        success: false
      });
    }
  };

exports.userLogin = async (userCreds, res) => {
    let { employeeId, password } = userCreds;
    const user = await User.findOne({ employeeId });
    // console.log(userCreds);
    if (!user) {
      return res.status(404).json({
        message: "Username is not found. Invalid login credentials.",
        success: false
      });
    }
    
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Sign in the token and issue it to the user
      let token = jwt.sign(
        {
          user_id: user._id,
          name: user.name,
          role: user.role,
          employeeId: user.employeeId,
        },
        process.env.SECRET,
        { expiresIn: "7 days" }
      );
  
      let result = {
        name: user.name,
        role: user.role,
        employeeId: user.employeeId,
        token: `Bearer ${token}`,
        expiresIn: 168,
      };
  
      return res.status(200).json({
        ...result,
        message: "Hurray! You are now logged in.",
        success: true
      });
    } else {
      return res.status(403).json({
        message: "Incorrect password.",
        success: false
      });
    }
  };
exports.userLoginWithToken = async (userCreds, res) => {
  //console.log(userCreds)
    let { employeeId } = userCreds;
    const user = await User.findOne({ employeeId });
    // console.log(userCreds);
    if (!user) {
      return res.status(404).json({
        message: "Username is not found. Invalid login credentials.",
        success: false
      });
    }
    
      let result = {
        name: user.name,
        role: user.role,
        employeeId: user.employeeId,
        token: userCreds.token,
        expiresIn: 168,
      };
  
      return res.status(200).json({
        ...result,
        message: "Hurray! You are now logged in.",
        success: true
      });
  };

exports.userAuth = passport.authenticate("jwt", { session: false });

exports.checkRole = roles => (req,res,next) => {
    if(roles.includes(req.user.role)){
        next();
    }
    else{
        res.status(401).json({
            message : "You Dont have Access to this Page",
            success : false
        })
    }
}

exports.serializeUser = user => {
    return {
      name: user.name,
      employeeId: user.employeeId,
      _id: user._id,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      success: true
    };
  };

exports.listUsers = (req, res) => {
    User.find({},{password : 0,resetToken:0})
      .sort({ role: 1 })
      .exec((err, users) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: err,
          });
        }
  
        res.json(users);
      });
  };
  

exports.forgotPassword = (req,res) => {
  const {email} = req.body;

  User.findOne({email}, (err,user) => {
    if(err || !user){
      return res.status(400).json({error: "User with this email does not exists"});
    }
    console.log(user);
    const token = jwt.sign({_id : user._id}, process.env.RESET_PASSWORD_SECRET, {expiresIn: '20m'});
    const data = {
      from : 'marketincdev@gmail.com',
      to : email,
      subject : 'Forgot Password Link',
      html : `<h2>Please click the link given below to reset the password within 20 minutes</h2>
              <a>${process.env.CLIENT_URI}/admin/reset-password/${token}</a>`
    };

    return user.updateOne({resetToken : token}, function (err,success) {
      if(err || !user){
        return res.status(400).json({error: "Reset password Error"});
      }
      else{
        res.status(200).json({message :"Mail will be sent",token});
      }
    })
  })
}


exports.resetPassword =  (req,res) => {
  const {resetToken, newPass } = req.body;
  if(resetToken){
    jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET, (err, decodeData) => {
      if(err){
        return res.status(401).json({
          error : "Incorrect Token or Link is Expired"
        });
      }
      else{
        User.findOne({resetToken}, async (err, user) => {
          if(err || !user){
            return res.status(400).json({message: "Reset token not found"});
          }
          else{
            const password = await bcrypt.hash(newPass, 12);
            return user.updateOne({password, resetToken : ''},  (err,success) => {
              if(err){
                return res.status(400).json({error: "Reset password Error"});
              }
              else{
                res.status(200).json({message :"Password reset Successful"});
              }
            })
          }

        })
      }
    })
  }
  else{
    return res.status(400).json({message: "Bad Link"});    
  }
}



exports.updateUser = (req, res) => {
 
  const user = req.body ;
  console.log(user);

  User.updateOne({ _id: user._id }, { $set: req.body }, (error, data) => {
   if (error) {
     return res.status(400).json({
       error: 'sorry updating users for this query not sucessful',
     })
   }
   
   res.status(200).json({ msg: 'success',data:data })
 })
}



exports.userById = (req, res, next, id) => {
  console.log(id);
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'item not found',
      })
    }
    req.user = user
    console.log(user);
    next()
  })
}

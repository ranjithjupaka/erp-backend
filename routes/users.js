var express = require('express');
const { serializeUser, checkRole, updateUser, userById, userLoginWithToken, updateTime } = require('../controllers/user');
const { listUsers,userLogin, userRegister, userAuth , forgotPassword, resetPassword} = require('../controllers/user');
var router = express.Router();

// /* GET users listing. */

router.post("/register",userAuth,checkRole(['admin','superadmin']),async (req, res) => {
  await userRegister(req.body, res);
});
router.post("/login", async (req, res) => {
  await userLogin(req.body, res);
});



router.post("/profile", async (req,res) => {
  return userLoginWithToken(req.body, res);
})

router.put('/:userById/updateUser',userAuth,checkRole(['admin','superadmin']), updateUser);

router.post('/:userById/updateTime', updateTime);

router.put("/forgot-password",forgotPassword);

router.put("/reset-password",resetPassword);

router.get("/users/list",userAuth,checkRole(['admin','superadmin']),listUsers);


router.param("userById", userById);

module.exports = router;

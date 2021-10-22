var express = require("express");
const { listpurchase, updatepurchasing } = require("../controllers/purchase");
const {
  queryById,
  itemById,
} = require("../controllers/enquiry");
const { userAuth, checkRole } = require("../controllers/user");

var router = express.Router()

router.get("/listpurchase",userAuth,checkRole(['admin','superadmin','sales','purchase']), listpurchase);
router.put("/:PurchaseId/updatePurchasingitem",userAuth,checkRole(['admin','superadmin','sales','purchase']), updatepurchasing);



module.exports = router;

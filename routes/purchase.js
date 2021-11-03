var express = require("express");
const { listpurchase, updatepurchasing ,updatepurchasePerson} = require("../controllers/purchase");
const {
  queryById,
  itemById,
} = require("../controllers/enquiry");
const { userAuth, checkRole } = require("../controllers/user");

var router = express.Router()

router.get("/listpurchase",userAuth,checkRole(['admin','superadmin','sales','purchase']), listpurchase);
router.put("/:PurchaseId/updatePurchasingitem",userAuth,checkRole(['admin','superadmin','sales','purchase']), updatepurchasing);
router.put("/:queryId/purchasePerson",userAuth,checkRole(['admin','superadmin','sales','purchase']), updatepurchasePerson);



module.exports = router;

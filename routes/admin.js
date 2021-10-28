var express = require("express");
var router = express.Router();

const { listpurchaseandSales, updateSells,listSearch } = require("../controllers/admin");
const { userAuth, checkRole } = require("../controllers/user");



router.get('/term', listSearch);

router.get("/listpurchaseandSales",userAuth,checkRole(['admin','superadmin','sales','purchase']), listpurchaseandSales);
router.put("/:SellId/updateSellingitem",userAuth,checkRole(['admin','superadmin','sales','purchase']), updateSells);
router.put("/:SellId/rejectProposal",userAuth,checkRole(['admin','superadmin','sales','purchase']), updateSells);



module.exports = router;

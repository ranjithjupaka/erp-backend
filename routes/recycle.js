var express = require("express");
const {moveToRecycle,listRecycleQuery,restoreQuery,removeEnquiryPermanently} = require("../controllers/recycle");
const { userAuth, checkRole } = require("../controllers/user");

var router = express.Router()

router.post("/movetorecycle/:queryId",userAuth,checkRole(['admin','superadmin','sales','purchase']), moveToRecycle);
router.post("/restoreQuery/:queryId",userAuth,checkRole(['admin','superadmin','sales','purchase']), restoreQuery);
router.get("/listRecycledQuery",userAuth,checkRole(['admin','superadmin','sales','purchase']), listRecycleQuery);
router.delete("/delete/:recycleId/:queryId",userAuth,checkRole(["admin", "superadmin", "sales", "purchase"]),removeEnquiryPermanently);
module.exports = router;
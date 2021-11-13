var express = require("express");

const {
  createEnquiry,
  listEnquiries,
  addItem,
  EnquiryById,
  removeItem,
  itemById,
  readEnquiry,
  updateItem,
  updateAlternativeItem,
  removeEnquiry,
  listBySearch,
  listSearch,
  getEnquiries,
  createItem,
  createPurchase,
  createSell,
  priorityEnquiries,
  bulkCreateItem,
  removeAlternateItem,
  removeAlternateRef,
  altItemById,
  createBulkItemEnquiry,
  bulkAddItem,
  createBulkSell,
  createBulkPurchase,
} = require('../controllers/enquiry')
const { userAuth, checkRole, userById } = require("../controllers/user");
const { validation, validationRules } = require("../helpers/enquiryValidation");
const { enquires_filled, pending_enquiry } = require("../middlewares/enquiry");
const {assign_enquiry} = require("../controllers/user")
var router = express.Router();

router.post(
  '/enquiry/:userById/create',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  // validationRules(),
  // validation(),
  createSell,
  createPurchase,
  createItem,
  createEnquiry,
  enquires_filled,
  pending_enquiry,
  assign_enquiry
)

router.post(
  "/enquiry/:enquiryById/additem",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  createSell,
  createPurchase,
  createItem,
  addItem
);
router.put(
  "/enquiry/:enquiryById/:itemById/updateitem",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  updateItem
);
router.put(
  "/enquiry/:itemById/updateAlternativeItem",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  updateAlternativeItem
);

router.get(
  "/enquiry/list",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  listEnquiries
);
router.get(
  "/enquiry/:enquiryById",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  readEnquiry
);

router.delete(
  "/enquiry/:enquiryById",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  removeEnquiry
);
router.delete(
  "/enquiry/:enquiryById/:itemById/removeitem",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  removeItem
);
router.delete(
  "/:altItemById/removealternateitem",
  removeAlternateItem
);
router.post(
  "/enquiry/search",
  userAuth,
  checkRole(["admin", "superadmin", "sales", "purchase"]),
  listSearch
);

// router.get(
//   '/enquiry/list/priority',
//   userAuth,
//   checkRole(['admin', 'superadmin', 'sales', 'purchase']),
//   priorityEnquiries
// )
// router.post('/Enquiry/by/search', listBySearch)
router.post(
  '/bulkEnquiry/:userId/create',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  createBulkSell,
  createBulkPurchase,
  bulkCreateItem,
  createBulkItemEnquiry,
  enquires_filled,
  pending_enquiry,
  assign_enquiry
)

router.post('/enquiry/:enquiryById/bulkAdditem',createBulkSell,createBulkPurchase, bulkCreateItem, bulkAddItem)

router.param("enquiryById", EnquiryById);
router.param("itemById", itemById);
router.param("altItemById", altItemById);
router.param("userId", userById)

module.exports = router;

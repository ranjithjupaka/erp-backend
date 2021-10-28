var express = require('express');
const { createConnection } = require('mongoose');
const {
  createEnquiry,
  listEnquiries,
  addItem,
  EnquiryById,
  removeItem,
  itemById,
  readEnquiry,
  updateItem,
  removeEnquiry,
  listBySearch,
  listSearch,
  getEnquiries,
  createItem,
  createPurchase,createSell
} = require('../controllers/enquiry')
const {userAuth, checkRole} = require('../controllers/user');
const { validation} = require('../helpers/enquiryValidation');
var router = express.Router();


router.post('/enquiry/create',userAuth,checkRole(['admin','superadmin','sales','purchase']),validation,createSell,createItem, createEnquiry)
router.post(
  '/enquiry/:enquiryById/additem',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  createSell,
  createPurchase,
  createItem,
  addItem
)
router.put('/enquiry/:enquiryById/:itemById/updateitem',userAuth,checkRole(['admin','superadmin','sales','purchase']), updateItem);

router.get('/enquiry/list',userAuth,checkRole(['admin','superadmin','sales','purchase']), listEnquiries)
router.get('/enquiry/:enquiryById',userAuth,checkRole(['admin','superadmin','sales','purchase']), readEnquiry)


router.delete('/enquiry/:enquiryById',userAuth,checkRole(['admin','superadmin','sales','purchase']), removeEnquiry);
router.delete('/enquiry/:enquiryById/:itemById/removeitem',userAuth,checkRole(['admin','superadmin','sales','purchase']), removeItem);
router.post('/enquiry/search',userAuth,checkRole(['admin','superadmin','sales','purchase']), listSearch)
// router.post('/Enquiry/by/search', listBySearch)


router.param('enquiryById', EnquiryById)
router.param('itemById', itemById)

module.exports = router;



var express = require('express')

const {
 listVendors, upload, addBulkVendors, updateVendor, vendorById, deleteVendor, createVendor, generateSno, emailSearch, phoneSearch
} = require('../controllers/vendor')
const { userAuth, checkRole} = require('../controllers/user')


var router = express.Router()

router.get(
  '/vendor/search/email', 
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  emailSearch
);
router.get(
  '/vendor/search/phone', 
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  phoneSearch
);

router.get(
  '/vendors/list',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  listVendors
)
router.post(
  '/vendorList/uploadfile',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  upload.single('uploadfile'),
  addBulkVendors
)

router.post(
  '/vendor/create',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  createVendor
)

router.put(
  '/vendor/:vendorId/update',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  updateVendor
)

router.delete(
  '/vendor/:vendorId/delete',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  deleteVendor
)

router.param('vendorId', vendorById)
module.exports = router

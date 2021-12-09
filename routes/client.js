var express = require('express')

const {
 listClients, upload, addBulkClients, updateClient, clientById, deleteClient, createClient, generateSno, clientEmailSearch
} = require('../controllers/client')
const { userAuth, checkRole} = require('../controllers/user')


var router = express.Router()


router.get(
  '/client/search/email', 
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  clientEmailSearch
);

router.get(
  '/clients/list',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  listClients
)
router.post(
  '/clientList/uploadfile',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  upload.single('uploadfile'),
  addBulkClients
)

router.post(
  '/client/create',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  generateSno,
  createClient
)

router.put(
  '/client/:clientId/update',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  updateClient
)

router.delete(
  '/client/:clientId/delete',
  userAuth,
  checkRole(['admin', 'superadmin', 'sales', 'purchase']),
  deleteClient
)

router.param('clientId', clientById)
module.exports = router

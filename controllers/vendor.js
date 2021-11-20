const { Vendor } = require("../models/Vendor")
const fs = require('fs')
const multer = require('multer')
const excelToJson = require('convert-excel-to-json');

global.__basedir = __dirname

// -> Multer Upload Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  },
})



exports.upload = multer({ storage: storage });


exports.emailSearch = (req, res) => {

  const searchField=req.query.id;
  Vendor.find({
    vendorEmail:{$regex:searchField,$options:'$i'}
  }).then(data=>{
    res.json(data)
  })
  }

exports.phoneSearch = (req, res) => {
  const searchField=req.query.id;
  
  Vendor.find({
    vendorPhone:{$regex:searchField,$options:'$i'}
  }).then(data=>{
    console.log(data)

    res.json(data)
  })
  }
  


exports.vendorById = (req, res, next, id) => {
  console.log(id)
  Vendor.findById(id).exec((err, vendor) => {
    if (err || !vendor) {
      return res.status(400).json({
        error: 'vendor not found',
      })
    }
    req.vendor = vendor
    console.log(vendor)
    next()
  })
}


exports.listVendors = (req,res) => {

     Vendor.find()
       .exec((err, vendors) => {
         if (err) {
           console.log(err)
           return res.status(400).json({
             error: err,
           })
         }

         res.json(vendors)
       })
}

exports.addBulkVendors = (req,res) => {
  importExcelData2MongoDB(__basedir + '/uploads/' + req.file.filename)
   res.json({
     msg: 'File uploaded/import successfully!',
     file: req.file,
   })
}

// -> Import Excel File to MongoDB database
const  importExcelData2MongoDB = (filePath) => {
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name
        name: 'VendorList',

        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1,
        },

        // Mapping columns to keys
        columnToKey: {
          A: 'vendorName',
          B: 'vendorEmail',
          C: 'vendorPhone',
        },
      },
    ],
  })

  // -> Log Excel Data to Console
  console.log(excelData)

  // Insert Json-Object to MongoDB

    try {
      Vendor.insertMany(excelData.VendorList).then((data) => {
        console.log({msg:'success',data:data});
      })
    } catch (error) {
      throw error
    }

  fs.unlinkSync(filePath)
}

exports.createVendor = async (req,res) => {
  const {vendorEmail,vendorPhone} =  req.body;
  if(!!vendorEmail){
    const vendor = await Vendor.findOne({ vendorEmail });
    // console.log(userCreds);
    if (vendor) {
      return res.status(404).json({
        message: `Vendor Email already used for ${vendor.vendorName}`,
        success: false
      });
    }
  }
  if(!!vendorPhone){
    const vendor = await Vendor.findOne({ vendorPhone });
    // console.log(userCreds);
    if (vendor) {
      return res.status(404).json({
        message: `Vendor Phone No. already used for ${vendor.vendorName}`,
        success: false
      });
    }
  }
    try {
      const newVendor = new Vendor(req.body);
      //console.log(newUser)
      await newVendor.save();
      return res.status(201).json({
        message: "Vendor Added Successfull",
        success: true
      });
    } catch (err) {
      return res.status(500).json({
        message: `Unable to create Vendor ${err.message}`,
        success: false
      });
    }
}


exports.updateVendor = (req, res) => {
  const vendor = req.vendor

 Vendor.updateOne({ _id: vendor._id }, { $set: req.body }, (error, data) => {
    if (error) {
      return res.status(400).json({
        error: 'sorry updating vendor is not sucessful',
      })
    }
    console.log(data)
    res.status(200).json({ msg: 'success vendor details updated' })
  })
}

exports.deleteVendor = (req, res) => {
  const vendor = req.vendor

  Vendor.deleteOne({ _id: vendor._id }, (error, data) => {
    if (error) {
      return res.status(400).json({
        error: 'sorry deleting vendor is not sucessful',
      })
    }
    console.log(data)
    res.status(200).json({ msg: 'Success vendor details deleted' })
  })
}
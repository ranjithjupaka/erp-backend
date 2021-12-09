const { Client } = require("../models/Client")
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

exports.clientById = (req, res, next, id) => {
  console.log(id)
  Client.findById(id).exec((err, client) => {
    if (err || !client) {
      return res.status(400).json({
        error: 'client not found',
      })
    }
    req.client = client
    console.log(client)
    next()
  })
}

exports.clientEmailSearch = (req, res) => {
  const searchField=req.query.id;
  Client.find({
    quotation_email :{$regex:searchField,$options:'$i'}
  }).then(data=>{
    res.json(data)
  })
  }

exports.generateSno = (req,res,next) => {

  Client.find().sort({"sno": -1 }).limit(1).exec((err,data) => {
    if(err){
      res.status(400).json({err:err});
    }
    // res.status(200).json({data:data})
    req.sno = data[0].sno+1
    console.log(req.sno);
    next()
  }); 
}


exports.listClients = (req,res) => {

     Client.find()
       .exec((err, clients) => {
         if (err) {
           console.log(err)
           return res.status(400).json({
             error: err,
           })
         }

         res.json(clients)
       })
}

exports.addBulkClients = (req,res) => {
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
        name: 'ClientList',

        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1,
        },

        // Mapping columns to keys
        columnToKey: {
          A: 'sno',
          B: 'client_id',
          C: 'quotation_email',
          D: 'friendly_companyName',
          E: 'client_fullName',
          F: 'client_Num',
          G: 'company_printName',
          H: 'unitName',
          I: 'city',
          J: 'full_address',
        },
      },
    ],
  })

  // -> Log Excel Data to Console
  console.log(excelData)

  // Insert Json-Object to MongoDB

    try {
      Client.insertMany(excelData.ClientList).then((data) => {
        console.log({msg:'success',data:data});
      })
    } catch (error) {
      throw error
    }

  fs.unlinkSync(filePath)
}

exports.createClient = (req,res) => {
  
  const client = new Client(req.body);
  client.sno = req.sno

  client.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
      })
    }
     res.status(200).json({ msg: 'Success client added',data:data })
  })

}


exports.updateClient = (req, res) => {
  const client = req.client

 Client.updateOne({ _id: client._id }, { $set: req.body }, (error, data) => {
    if (error) {
      return res.status(400).json({
        error: 'sorry updating client is not sucessful',
      })
    }
    console.log(data)
    res.status(200).json({ msg: 'success client details updated' })
  })
}

exports.deleteClient = (req, res) => {
  const client = req.client

  Client.deleteOne({ _id: client._id }, (error, data) => {
    if (error) {
      return res.status(400).json({
        error: 'sorry deleting client is not sucessful',
      })
    }
    console.log(data)
    res.status(200).json({ msg: 'Success client details deleted' })
  })
}







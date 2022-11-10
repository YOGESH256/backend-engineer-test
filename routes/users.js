const router = require("express").Router();
const Contact = require("../models/Contact");
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");

const {v4: uuidv4  } = require("uuid");
const { promisify } = require("util");

const {stringify}= require('csv-stringify');


const pipeline = promisify(require("stream").pipeline);




// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/profile/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '.jpg') //Appending .jpg
//   }
// })
//
// var upload = multer({ storage: storage });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, 'public/profile/')
    },
    filename: function (req, file, cb) {
        let ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
var upload = multer({ storage: storage });






router.post('/contact' , async(req , res) => {

  try {
      const { username , contactNo} = req.body;


       const contact = new Contact({
         username,
         contactNo
       })

       console.log(contact);

       const savedContact = await contact.save()




       res.status(200).json({
         id : savedContact._id,
         username: savedContact.username,
         contactNo: savedContact.contactNo,

       });





  } catch (e) {

    console.log(e);
res.status(401).json(e);

  }



})



router.get("/contact" ,  async(req , res) => {

  try {
    const contacts = await Contact.find()


    const i = contacts.map((co) => {
      return  {
        username: co.username,
        contactNo : co.contactNo
      }
    })

    console.log(i);





stringify(i, {
    header: true
}, function (err, output) {
    fs.writeFile(__dirname+'/someData.csv', output , () => {});
})






       res.status(200).json({
         i

       })









  } catch (e) {
    console.log(e);
     res.status(500).json(e);

  }

})




router.delete("/contact/:id" ,  async(req , res) => {

  try {

    if(mongoose.Types.ObjectId.isValid(req.params.id))
    {
      const contact = await Contact.findById(req.params.id);
      await contact.deleteOne();
       res.status(200).json("the post has been deleted");

    }
    else {
      res.status(500).json({
        message : "Please pass valid Id"
      });
    }



} catch (err) {
  console.log(err);
  res.status(500).json(err.message);
}

})




router.post("/searchcontact" ,  async(req , res) => {
const {hi} = req.body
  try {

    // const contacts = await Contact.find({ $text : { $search : "72648" } })


  const results =   await Contact.find({$text: {$search: hi}})
  console.log(results);




       res.status(200).json({
      results

       })









  } catch (e) {
    console.log(e);
     res.status(500).json(e);

  }

})





router.post("/searchcontact" ,  async(req , res) => {
const {hi} = req.body
  try {

    // const contacts = await Contact.find({ $text : { $search : "72648" } })


  const results =   await Contact.find({$text: {$search: hi}})
  console.log(results);




       res.status(200).json({
      results

       })

  } catch (e) {
    console.log(e);
     res.status(500).json(e);

  }

})


 router.put('/contact/:id' , async(req, res) => {
const {username , contactNo } = req.body

console.log(contactNo);

const contact = await Contact.findById(req.params.id)

console.log(contact + " " + "k");

if(contact)
{
  contact.username = username,
  contact.contactNo = contactNo

}
else {
  res.status(404)
  throw new Error('Contact not found')
}

  const updatedContact = await contact.save()
  res.status(201)
  res.json(updatedContact);
})


router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;

  res.send({
            message: "Profile image uploaded successfully",
            url: `/public/profile/${file.filename}`,
          });



});








module.exports = router

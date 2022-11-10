const request = require('supertest')
const app = require('../index');
const express = require('express');
const Contact = require("../models/Contact");


const mongoose = require("mongoose");

jest.setTimeout(60000);


require("dotenv").config();








let token = ''


beforeAll(async () => {

  mongoose.connect(process.env.MONGO_URL, (err) => {
if(err) console.log(err)
else console.log("mongdb is connected");
});





})


afterAll(async () => {
  await mongoose.connection.close();
});





describe('ContactsAPI' , () => {

// one unit test
test('username should return Yogesh' , async() => {
  const data = await  Contact.find({})

  console.log(data);

  expect(data[0].username).toEqual("Yogesh")
})



// rest integration test
  it('POST request to create a contact' ,async() => {

    let r = (Math.random() + 1).toString(36).substring(7);


data = {
    username: r,
    contactNo: Math.random().toString().slice(2,12),
  }

    await request(app)
		.post('/api/contact/')
    .send(data)
    .expect(200)
    .then(async (response) => {
      console.log(response.body);
			// Check the response
			expect(response.body.id).toBeTruthy()
			expect(response.body.username).toBe(data.username)
			expect(response.body.contactNo).toBe(data.contactNo)

			// Check the data in the database
			const contact = await Contact.findOne({ _id: response.body.id })
			expect(contact).toBeTruthy()
			expect(contact.username).toBe(data.username)
			expect(contact.contactNo).toBe(data.contactNo)


		})



})


it('POST request but the username and contact is not unique' ,async() => {

  let r = (Math.random() + 1).toString(36).substring(7);


  const data = {
    username: r,
    contactNo: Math.random().toString().slice(2,12)
  }



  await request(app)
      .post('/api/contact/')
      .send(data)
      .expect(200);

    await request(app)
      .post('/api/contact')
      .send({
        username:  data.username,
        contactNo: data.contactNo,
      })

      .expect(401);


})


it('DELETE request in contact' ,async() => {

  let r = (Math.random() + 1).toString(36).substring(7);


  const data = {
    username: r,
    contactNo: Math.random().toString().slice(2,12)
  }



  const{body} =  await request(app)
      .post('/api/contact/')
      .send(data)
      .expect(200);

    await request(app)
     .delete(`/api/contact/${body.id}`)
      .send()
      .expect(200);


})






})

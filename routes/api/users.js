const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

//Item Model
const Users = require('../../models/Users');

//@route 	POST api/users
//@desc 	Create new users
//@access 	Public

router.post('/', (request, response) => {
	const {name, email, password} = request.body;
	
	//input validation
	if(!name || !email || !password){
		return response.status(400).json({msg: 'Please enter all fields'});
	}
	//check existing user
	Users.findOne({email: email})
		.then(user => {
			if(user) return response.status(400).json({msg: 'User already exists'});

			const newUser = new Users({
				name,
				email,
				password
			});
			//create salt and hash
			bcrypt.genSalt(10, (err, salt)=>{
				bcrypt.hash(newUser.password, salt, (err, hash)=>{
					if(err) throw err;
					newUser.password = hash;
					newUser.save()
						.then(user => {
							jwt.sign(
								{id: user.id},
								config.get('jwtSecret'),
								{expiresIn: 3600},
								(err, token) => {
									if(err) throw err;
									response.json({
										token,
										user: {
											id: user.id,
											name: user.name,
											email: user.email
										}
									});
								}
							);
						});
				});
			});
		})
});

//@route 	GET api/users
//@desc 	Get All users
//@access 	Public


router.get('/', (request, response) => {
	
});

module.exports = router;
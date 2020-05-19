const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

//Item Model
const Users = require('../../models/Users');

//@route 	POST api/auth
//@desc 	AUthenticate users
//@access 	Public

router.post('/', (request, response) => {
	const {email, password} = request.body;
	
	//input validation
	if(!email || !password){
		return response.status(400).json({msg: 'Please enter all fields'});
	}
	//check existing user
	Users.findOne({email: email})
		.then(user => {
            if(!user) return response.status(400).json({msg: 'User does not exists'});
            
            //validate password
            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    if(!isMatched) return response.status(400).json({msg: 'Incorrect username or password'});
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
		})
});

//@route 	GET api/auth/user
//@desc 	Get user data
//@access 	Private

router.get('/user', auth, (request, response) => {
    Users.findById(request.user.id)
        .select('-password')
        .then(user => response.json(user));
});


module.exports = router;
const config = require('config');
const jwt = require('jsonwebtoken');

function auth(request, response, next){
	const token = request.header('x-auth-token');

	//check for token
	if(!token){
		//unauthorized user
		return response.status(401).json({msg:'No token. Authorization denied'});
	}

	try{
		//if token verify token
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		//add user from payload
		request.user = decoded;
		next();
	}catch(e){
		response.status(400).json({msg: 'Invalid token.'});
	}
}

module.exports = auth;
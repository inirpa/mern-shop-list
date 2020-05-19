const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Item Model
const Items = require('../../models/Items');

//@route 	GET api/items
//@desc 	Get All items
//@access 	Public

router.get('/', (request, response) => {
	Items.find()
		.sort({date: -1})
		.then(items => response.json(items));
});

//@route 	POST api/items
//@desc 	Create an items
//@access 	Private

router.post('/', auth, (request, response) => {
	const newItem = new Items({
		name: request.body.name
	});

	newItem.save()
		.then(item => response.json(item)
	);
});

//@route 	DELETE api/items
//@desc 	Deleete an items
//@access 	Private

router.delete('/:id', auth, (request, response) => {
	Items.findById(request.params.id)
		.then(item => item.remove()
			.then(() => response.json({
				success: true
			})))
		.catch(err => response.status(400).json({success:false}));
});

module.exports = router;
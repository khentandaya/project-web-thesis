var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.get('/',
	function (req, res) {
		var args = {
			'title': 'MSU-IIT Guidance Counseling Appointment | Client'
		};

		res.render('client-page', { args: args, layout: 'layout2', layoutsDir: __dirname + '/views/layouts/' });
	}
);

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('overSightHtml');
});

router.post('/extractData', function (req, res, next){
	res.send('Data Extracted.' + req.body.Na);
});

module.exports = router;

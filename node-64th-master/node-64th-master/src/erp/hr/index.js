const express = require('express'); //express 프레임워크
const router = express.Router();    //react Router랑 거의 같은 개념이다.


//컨트롤러 목록//
const empListController = require('./emp/controller/empListController');



router.get('/emp/:deptName', empListController.empList);


module.exports = router;
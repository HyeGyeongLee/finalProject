const express = require('express'); //express 프레임워크
const router = express.Router();    //react Router랑 거의 같은 개념이다.


const codeController = require('./controller/codeController');
const estimateController = require('./controller/estimateController');
const workOrderController = require('./controller/workOrderController');


router.get('/codeList/:divisionCode', codeController.findDetailCodeList);
router.get('/searchEstimates', estimateController.searchEstimateInfo);
router.get('/workSiteLog/:date', workOrderController.workSiteLogList);


module.exports = router;
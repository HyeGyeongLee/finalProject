const workOrderService = require('../service/workOrderService');
const { delivery } = require('util/');


let data;

exports.workSiteLogList = async (request, response) => {

    // console.log('eeeeeeeeeeeee');
    console.log(request);
    const selDate = request.params.date;
    console.log("@@");
    console.log(selDate);

    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "result": await workOrderService.getWorkSiteLogList(selDate)
        }
    } catch (err) {
        data = {
            errorCode: -1,
            errorMsg: err.message
        }
    } finally {
        delivery(response, data);
    }

}


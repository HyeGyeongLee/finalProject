const estimateService = require('../service/estimateService');
const { delivery } = require('util/');


let data;

exports.searchEstimateInfo = async (request, response) => {

    console.log('eeeeeeeeeeeee');

    const params = {
        startDate : request.query.startDate,
        endDate : request.query.endDate,
        dateSearchCondition : request.query.dateSearchCondition,
    };

    try{
        data={
            errorMsg:"success",
            errorCode:0,
            "gridRowJson":await estimateService.searchEstimateInfo(params)
        }
    }catch(err){
        data = {
            errorCode : -1,
            errorMsg : err.message
        }
    }finally{
        delivery(response,data);
    }
 
}


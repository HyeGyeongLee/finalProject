const baseService = require('../service/baseService');
const { delivery } = require('util/');


let data;

exports.findDetailCodeList = async (request, response) => {
    
    const divisionCode = request.params.divisionCode;

    try{
        data={
            errorMsg:"success",
            errorCode:0,
            "detailCodeList":await baseService.getDetailCodeList(divisionCode)
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


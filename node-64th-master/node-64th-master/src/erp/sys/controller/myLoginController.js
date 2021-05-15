const baseService = require('../service/baseService');
const { delivery } = require('util/');

let data;

exports.login = async (request, response) => {
    
    const loginTo = {
        empCode : request.body.empCode,
        password : request.body.password,
        companyCode : request.body.companyCode,
        workplaceCode : request.body.workplaceCode
    }

    try{
        data={
            errorMsg:"success",
            errorCode:0,
            "empInfo":await baseService.myLogin(loginTo)
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


const empService = require('../service/empService');
const { delivery } = require('util/');
let data;
exports.empList = async (request, response) => {

    const deptName = request.params.deptName;
    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "list": await empService.findEmployeeListByDept(deptName)
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
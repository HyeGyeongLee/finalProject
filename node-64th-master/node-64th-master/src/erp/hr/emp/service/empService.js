const empDAO = require('../DAO/empDAO');

exports.findEmployeeListByDept = async (deptName) => {
    let result;
    if (deptName==="전체부서") {
        result = await empDAO.selectEmpList();
    }
    else if (deptName.substring(0, 3)==="DPT") {
        result = await empDAO.selectEmpListD(deptName);
    }
    else{
        result = await empDAO.selectEmpListN(deptName);
    }
    return result;
}

const codeDetailDAO = require('../DAO/codeDetailDAO');

exports.getDetailCodeList = async (divisionCode) => {
    const result = await codeDetailDAO.selectDetailCodeList(divisionCode);    
    return result;
}


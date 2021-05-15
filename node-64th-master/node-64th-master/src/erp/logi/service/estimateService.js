const estimateDAO = require('src/erp/logi/DAO/estimateDAO');



exports.searchEstimateInfo = async (loginTo) => {
    const result = await estimateDAO.searchEstimate(loginTo);

    return result;   
}


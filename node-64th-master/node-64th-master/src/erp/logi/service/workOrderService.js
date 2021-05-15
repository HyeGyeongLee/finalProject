const workOrderDAO = require('../DAO/workOrderDAO');

exports.getWorkSiteLogList = async (selDate) => {
    const result = await workOrderDAO.selectWorkSiteLogList(selDate);
    return result;
}

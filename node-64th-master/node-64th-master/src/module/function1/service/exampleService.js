const exampleDAO = require('../DAO/exampleDAO');

exports.memberList = async () => {
    const result = await exampleDAO.memberList();
    return result;
}

exports.member = async (memberId) => {
    const result = await exampleDAO.member(memberId);
    return result;
}

exports.destroy = async (memberId) => {
    const result = await exampleDAO.destroy(memberId);
    return result;
}

exports.create = async (memberBean) => {
    const result = await exampleDAO.create(memberBean);
    return result;
}

exports.update = async (memberBean) => {
    const result = await exampleDAO.update(memberBean);
    return result;
}
exports.procedure = async (memberBean) => {
    const result = await exampleDAO.procedure(memberBean);
    return result;
}


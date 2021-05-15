const statementService = require("../service/statementService");
const { delivery } = require("util/");

let data;

exports.handleRequestInternal = async (request, response) => {
  const dateTo = {
    fromDate: request.body.fromDate,
    toDate: request.body.toDate,
  };

  try {
    // data = {
    //   errorMsg: "success",
    //   errorCode: 0,
    //   data: await statementService.getCashJournal(dateTo),
    // };
    data = await statementService.getCashJournal(dateTo);
  } catch (err) {
    data = {
      errorCode: -1,
      errorMsg: err.message,
    };
  } finally {
    delivery(response, data);
  }
};

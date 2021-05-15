const cashJournalDAO = require("../DAO/cashJournalDAO");

exports.getCashJournal = async (dateTo) => {
  const result = await cashJournalDAO.selectCashJournalList(dateTo);
  return result;
};

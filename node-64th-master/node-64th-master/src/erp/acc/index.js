const express = require("express"); //express 프레임워크
const router = express.Router(); //react Router랑 거의 같은 개념이다.

const cashJournalController = require("./account/statement/controller/cashJournalController");
router.post("/cashJournal", cashJournalController.handleRequestInternal);

module.exports = router;

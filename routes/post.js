const express = require("express");
const postController = require("../controller/post");

const router = express.Router();
router.post("/create-table", postController.createUsersTable);
router.post("/insert-record", postController.insertUserRecord);
router.put("/update-record/:id", postController.updateUserRecord);
router.get("/view-records", postController.viewAllRecords);
router.delete("/delete-record/:id", postController.deleteRec);

module.exports = router;

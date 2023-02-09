const express = require("express");
const postController = require("../controller/post");

const router = express.Router();
router.post("/create-table", postController.createUsersTable);
router.post("/insert-record", postController.insertUserRecord);
router.put("/update-record/:id", postController.updateUserRecord);
router.get("/view-records", postController.viewAllRecords);
router.delete("/delete-record/:id", postController.deleteRec);
router.delete("/delete-multi-records", postController.deleteMultiRows);
router.post("/insert-multi-records", postController.insertMultiRec);
router.post("/user-register", postController.userRegister);
router.get("/user-login", postController.userLogin);

module.exports = router;

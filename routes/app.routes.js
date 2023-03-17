const express = require("express");
const postController = require("../controller/app.controller");
const { upload } = require("../services/fileUpload");
const router = express.Router();

router.post("/create-table", postController.createUsersTable);
router.post("/create-product-tables", postController.createProductTable);
router.post("/insert-record", postController.insertUserRecord);
router.post(
  "/insert-product",
  upload.single("image_url"),
  postController.insertNewProduct
);
router.put("/update-record/:id", postController.updateUserRecord);
router.get("/view-records", postController.viewAllRecords);
router.get("/view-product", postController.viewAllProduct);
router.delete("/delete-record/:id", postController.deleteRec);
router.delete("/delete-product/:id", postController.deleteProductByID);
router.delete("/delete-multi-records", postController.deleteMultiRows);
router.post("/insert-multi-records", postController.insertMultiRec);
router.post("/user-register", postController.userRegister);
router.post("/user-login", postController.userLogin);
router.get("/verify/:id/:token", postController.emailVerify);
router.patch("/forgot-password", postController.forgetPassword);
router.patch("/reset-password/:id/:token", postController.updatePassword);
router.patch("/reset-password/:id", postController.updatePass);

module.exports = router;

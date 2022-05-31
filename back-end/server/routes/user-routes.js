const express = require("express");
const router = express.Router();
const check_auth = require("../middleware/check-auth");
const userController = require("../controllers/user-controller");

router.post("/sign-in", userController.login);
router.post("/sign-up", userController.register);
router.post("/forget-password", userController.forgetPassword);
router.put("/update-password", userController.updatePassword);
router.get("/:id", userController.getUserById);
router.put("/",userController.updateUser);
router.get("/",userController.getAllUsers);

router.post("/me", userController.getProfileDetails);
module.exports = router;

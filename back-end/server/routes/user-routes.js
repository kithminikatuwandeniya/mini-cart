const express = require("express");
const router = express.Router();
const check_auth = require("../middleware/check-auth");
const userController = require("../controllers/user-controller");

router.post("/sign-in", userController.login);
router.post("/sign-up", userController.register);
router.post("/forget-password", userController.forgetPassword);
router.post("/code-verify", userController.verifyCode);
router.post("/change-password", userController.updatePassword);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);
router.put("/", userController.updateUser);
router.get("/", userController.getAllUsers);

router.post("/me", userController.getProfileDetails);
module.exports = router;

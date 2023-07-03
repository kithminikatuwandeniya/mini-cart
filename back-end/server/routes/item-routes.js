const express = require("express");
const router = express.Router();
const check_auth = require("../middleware/check-auth");
const itemController = require("../controllers/item-controller");

router.post("/add-item", itemController.addItem);
router.get("/",itemController.getAllItems);
router.get("/all",itemController.getAllItems_);
router.get("/:id", itemController.getItemByItemID);
router.delete("/:id",itemController.deleteItem);
router.put("/",itemController.updateItem);

module.exports = router;
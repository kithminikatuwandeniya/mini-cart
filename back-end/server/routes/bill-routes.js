const express = require('express');
const router = express.Router();
const check_auth = require("../middleware/check-auth");
const billController = require("../controllers/bill-controller");

router.post("/download",billController.downloadImage);

module.exports = router;
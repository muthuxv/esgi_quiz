const { Router } = require("express");
const SecurityController = require("../controllers/security");
const { User } = require("../models");
const router = Router();
const securityController = SecurityController(User);

router.post("/login", securityController.login);

module.exports = router;
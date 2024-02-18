const { Router } = require("express");
const UserService = require("../services/user");

const router = Router();

const SecurityController = require("../controllers/security")(
    new UserService()
  );

router.post("/login", SecurityController.login);

module.exports = router;
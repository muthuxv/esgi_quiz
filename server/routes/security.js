const { Router } = require("express");
const UserService = require("../services/user");
const UserController = require("../controllers/user");

const router = Router();
const userService = UserService();

const SecurityController = require("../controllers/security")(
  userService
);

const userController = UserController(userService);

router.post("/login", SecurityController.login);
router.post("/register", userController.create);

module.exports = router;
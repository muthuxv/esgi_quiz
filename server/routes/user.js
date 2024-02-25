const { Router } = require("express");
const UserController = require("../controllers/user");
const UserService = require("../services/user");

const router = Router();
const userService = UserService();
const userController = UserController(userService);

router.post("/", userController.create);
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.patch("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router;
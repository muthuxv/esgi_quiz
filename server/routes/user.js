const { Router } = require("express");
const UserController = require("../controllers/user");
const { User } = require("../models");
const router = Router();
const userController = UserController(User);

router.post("/", userController.create);
router.get("/", userController.list);
router.get("/:id", userController.retrieve);
router.put("/:id", userController.update);
router.delete("/:id", userController.destroy);

module.exports = router;
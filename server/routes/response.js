const { Router } = require("express");
const ResponseController = require("../controllers/response");
const ResponseService = require("../services/response");

const router = Router();
const responseService = ResponseService();
const responseController = ResponseController(responseService);

router.get("/", responseController.getAll);
router.get("/:id", responseController.getOne);
router.post("/", responseController.create);
router.patch("/:id", responseController.update);
router.delete("/:id", responseController.delete);

module.exports = router;
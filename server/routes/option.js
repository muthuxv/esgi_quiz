const { Router } = require("express");
const OptionController = require("../controllers/option");
const OptionService = require("../services/option");

const router = Router();
const optionService = OptionService();
const optionController = OptionController(optionService);

router.get("/", optionController.getAll);
router.get("/:id", optionController.getOne);
router.post("/", optionController.create);
router.put("/:id", optionController.update);
router.delete("/:id", optionController.delete);

module.exports = router;
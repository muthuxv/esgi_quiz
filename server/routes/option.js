const { Router } = require("express");
const OptionController = require("../controllers/option");
const { Option } = require("../models");
const router = Router();
const optionController = OptionController(Option);

router.post("/", optionController.create);
router.get("/", optionController.list);
router.get("/:optionId", optionController.retrieve);
router.put("/:optionId", optionController.update);
router.delete("/:optionId", optionController.destroy);

module.exports = router;
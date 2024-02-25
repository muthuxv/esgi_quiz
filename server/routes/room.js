const { Router } = require("express");
const RoomController = require("../controllers/room");
const RoomService = require("../services/room");

const router = Router();
const roomService = RoomService();
const roomController = RoomController(roomService);

router.get("/", roomController.getAll);
router.get("/:id", roomController.getOne);
router.post("/", roomController.create);
router.put("/:id", roomController.update);
router.delete("/:id", roomController.delete);

module.exports = router;


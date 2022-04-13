const { Router } = require("express");
const dataController = require("../controllers/DataController")

const router = new Router();

router.post("/",  dataController.store);
router.get("/",  dataController.index);



module.exports = router;

import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.send(`You have visited ${req.session.viewCount} times`);
});

router.get("/data", (req, res) => {
  res.send({ name: "We're connected...", email: "to the backend!!!" });
});

export default router;

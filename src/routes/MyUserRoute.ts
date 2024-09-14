import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

// /api/my/user
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);
router.post("/", jwtCheck, MyUserController.createCurrentUser);
// jwtCheck is middle ware huch check the token send by frontedn in autherisation header
// put req for update the resouce
router.put(
  "/",
  jwtCheck,
  jwtParse,  // parse will give id ur user with the help of header
  validateMyUserRequest, // this will check the validation
  MyUserController.updateCurrentUser
);

export default router;
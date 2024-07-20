import express from "express";
import { sendMessage, getAllMessages,deleteMessage ,replyToMessage } from "../controllers/messageController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", isPatientAuthenticated, sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);
router.delete("/delete/:id", isAdminAuthenticated, deleteMessage);
router.post("/reply/:id", isAdminAuthenticated, replyToMessage); // New route for replying to messages


export default router;

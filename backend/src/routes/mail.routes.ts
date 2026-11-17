// routes/mail.routes.ts
import express from "express";
import { sendBulkDueDateReminders, sendDueDateReminder } from "../controllers/mail.controller";

const router = express.Router();

router.post("/send-reminder", sendDueDateReminder);
router.post("/send-bulk-reminders", sendBulkDueDateReminders);

export default router;

import { Router } from "express";
import {
    createLending,
    getAllLendings,
    getLendingById,
    updateLending,
    deleteLending,
    getOverdueLendings,
    getLendingsByReaderEmail,
    getLendingsByBookTitle
} from "../controllers/lending.controller";

const router = Router();

router.post("/", createLending);
router.get("/by-email", getLendingsByReaderEmail);
router.get("/by-book", getLendingsByBookTitle);
router.get("/", getAllLendings);
router.get("/overdue", getOverdueLendings);
router.get("/:id", getLendingById);
router.put("/:id", updateLending);
router.delete("/:id", deleteLending);

export default router;

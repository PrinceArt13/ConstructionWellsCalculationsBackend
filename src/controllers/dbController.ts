import { Request, Response } from "express";
import { db } from "../db/dbKysely.js";

class dbController {
    async getConstants(req: Request, res: Response): Promise<void> {
        const constants = await db.selectFrom('constants').selectAll().execute();

        res.status(200).json({
            constants
        });
    }
}

export default new dbController();
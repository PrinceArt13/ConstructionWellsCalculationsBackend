import { Request, Response } from "express";
import { db } from "../db/dbKysely";

class dbController {
    async frontendMethod(req: Request, res: Response): Promise<void> {
        const { methodName } = req.params;
        const method = await db.selectFrom('frontend')
            .where('name', '=', methodName)
            .selectAll()
            .executeTakeFirst();

        if (!method) {
            res.status(404).json({ error: 'Метод не найден' });
            return;
        }

        const a = method.latex;
        const b = a.replace(/\\\\\\/g, '\\');

        res.status(200).json({
            name: method!.name,
            information: method!.information,
            latex: b
            //latex: method!.latex
        });
        return;
    }
}

export default new dbController();
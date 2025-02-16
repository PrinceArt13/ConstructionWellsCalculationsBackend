import { Request, Response, NextFunction } from 'express';

export class MiddleWare {
    // Middleware для преобразования query-параметров в числа
    static parseQueryToNumber(req: Request, res: Response, next: NextFunction) {
        for (const key in req.query) {
            if (req.query.hasOwnProperty(key)) {
                const value = req.query[key];
                if (typeof value === 'string' && !isNaN(parseFloat(value))) {
                    (req.query as Record<string, string | number>)[key] = parseFloat(value);
                }
            }
        }
        next();
    }
};
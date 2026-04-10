import { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorMessages } from "../errors";
import { ZodObject } from "zod";

export const validate = (schema: ZodObject): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = schema.safeParse(req.body);
      if (!parseResult.success) {
        // Trả về lỗi chi tiết của Zod cho client
        return res.status(400).json({
          status: false,
          message: ErrorMessages.FAILED_TO_PARSE_DATA,
          errors: parseResult.error.issues.map((error) => error.message),
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

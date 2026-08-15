import { NextFunction, Request, Response } from "express";
import UserService from "./user.service";
import { CreateUserInput } from "./user.type";
import userService from "./user.service";
import { CustomExpress } from "../../pkg/app/response";
import { ErrorStatusCode } from "../../shared/errors/errorCode";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  try {
    const data = req.body as CreateUserInput;
    const result = await UserService.createUser(data);
    customExpress.response201(result);
  } catch (error) {
    customExpress.response400(ErrorStatusCode.BAD_GATEWAY, error as Error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  try {
    const result = await UserService.getUser(req.params.id as string);
    if (!result) {
      customExpress.response404(ErrorStatusCode.NOT_FOUND, {
        reason: "User not found",
      });
    }
    return res.json({ data: result });
  } catch (error) {
    customExpress.response400(ErrorStatusCode.BAD_REQUEST, error as Error);
  }
};

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  const options = JSON.parse(req.query.options as string);
  const users = await userService.findAll(options);
  return customExpress.response200(users);
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  try {
    const result = await UserService.updateUser(
      req.params.id as string,
      req.body,
    );
    customExpress.response200(result);
  } catch (error) {
    customExpress.response400(ErrorStatusCode.BAD_REQUEST, error as Error);
  }
};

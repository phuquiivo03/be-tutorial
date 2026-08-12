import { Request, Response } from "express";
import UserService from "./user.service";
import { CreateUserInput } from "./user.type";
import userService from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateUserInput;
    const result = await UserService.createUser(data);
    res.status(201).json({ message: "User created", data: result });
  } catch (error) {
    res.status(400).json({ message: "Failed to create user", error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUser(req.params.id as string);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ data: result });
  } catch (error) {
    return res.status(400).json({ message: "Failed to get user", error });
  }
};

export const findAll = async (req: Request, res: Response) => {
  const options = JSON.parse(req.query.options as string);
  console.log(options);
  const users = await userService.findAll(options);
  return res.status(200).json({
    status: "successful",
    data: {
      users,
    },
  });
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.updateUser(
      req.params.id as string,
      req.body,
    );
    res.json({ message: "User updated", data: result });
  } catch (error) {
    res.status(400).json({ message: "Failed to update user", error });
  }
};

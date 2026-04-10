import { Request, Response } from "express";
import UserService from "./user.service";
import { CreateUserInput } from "./user.type";

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

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { createTodo } from "../types";
const prisma = new PrismaClient();

const router = Router();

router.post("/create", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = createTodo.safeParse(createPayload);
  if (!parsedPayload.success) {
    res.status(411).json({ msg: "Wrong Input" });
    return;
  }
  const { title, description, userId } = parsedPayload.data;
  const todo = await prisma.todo.create({
    data: { title, description, userId },
  });
  res.send({ msg: "Todo Created", todo });
});

router.put("/update", async (req, res) => {
  const userId = req.body.userId;
  const todos = await prisma.todo.updateMany({
    where: { userId },
    data: { done: true },
  });
  res.json({ todos });
});

export default router;

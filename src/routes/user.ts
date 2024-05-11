import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { createUser } from "../types";
const prisma = new PrismaClient();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.send({ users });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Error retrieving users" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username },
      include: { todos: true },
    });
    res.send({ user });
  } catch (e) {
    console.log(e);
    res.status(500).send({ msg: "Error retrieving user" });
  }
});

router.post("/create", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = createUser.safeParse(createPayload);
  if (!parsedPayload.success) {
    res.status(411).json({ msg: "Wrong Input" });
    return;
  }
  const { username, firstname, lastname, password } = parsedPayload.data;
  await prisma.user.create({
    data: { username, firstname, lastname, password },
  });
  res.send({ msg: "User Created" });
});

router.delete("/delete", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = createUser.safeParse(createPayload);
  if (!parsedPayload.success) {
    res.status(411).json({ msg: "Wrong Input" });
    return;
  }
  await prisma.user.delete({
    where: { username: parsedPayload.data.username },
  });
  res.json({ msg: "User Deleted" });
});

export default router;

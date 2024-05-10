import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createTodo, createUser } from "./types";
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.send({ users });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Error retrieving users" });
  }
});

app.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const users = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        todos: true,
      },
    });
    res.send({ users });
  } catch (e) {
    console.log(e);
  }
});

app.post("/user/post", async (req, res) => {
  try {
    const createPayload = req.body;
    const parsedPayload = createUser.safeParse(createPayload);
    if (!parsedPayload.success) {
      res.status(411).json({
        msg: "Wrong Input",
      });
      return;
    }
    const { username, firstname, lastname, password } = parsedPayload.data;
    await prisma.user.create({
      data: {
        username,
        firstname,
        lastname,
        password,
      },
    });
    res.send({
      msg: "User Created",
    });
  } catch (e) {
    console.log(e);
  }
});

app.delete("/user/delete", async (req, res) => {
  try {
    const createPayload = req.body;
    const parsedPayload = createUser.safeParse(createPayload);
    if (!parsedPayload.success) {
      res.status(411).json({
        msg: "Wrong Input",
      });
      return;
    }
    await prisma.user.delete({
      where: {
        username: parsedPayload.data.username,
      },
    });
    res.json({
      msg: "User Deleted",
    });
  } catch (e) {
    console.log(e);
  }
});

app.post("/todo/create", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = createTodo.safeParse(createPayload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "Wrong Input",
    });
    return;
  }

  const { title, description, userId } = parsedPayload.data;
  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      userId,
    },
  });
  res.send({
    msg: "Todo Created",
    todo,
  });
});

app.put("/todo/update", async (req, res) => {
  try {
    const userId = req.body.userId;
    const todos = await prisma.todo.updateMany({
      where: {
        userId: userId,
      },
      data: {
        done: true,
      },
    });
    res.json({ todos });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

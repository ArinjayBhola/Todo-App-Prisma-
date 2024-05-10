import zod from "zod";

export const createUser = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

export const createTodo = zod.object({
  title: zod.string(),
  description: zod.string(),
  userId: zod.number(),
});

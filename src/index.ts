import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import todoRouter from "./routes/todo";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/todos", todoRouter);

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

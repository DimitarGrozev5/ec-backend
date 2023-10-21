import express from "express";
import usersRouter from "./routes/users";
import photosRouter from "./routes/photos";
import commentsRouter from "./routes/comments";
import contactRouter from "./routes/contact";
import { errorHandler } from "./controllers/errorHandler";
import { ServerError } from "./model/server-error";

const app = express();
const PORT = 3000;

// Set up cors headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Set up form data parsing
app.use(express.json());

// Setup routes
app.use("/api/users", usersRouter);
app.use("/api/photos", photosRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/contact", contactRouter);

// 404 route
app.use((req, res, next) => {
  return next(new ServerError(404, "Could not find this route!"));
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

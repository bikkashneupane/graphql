import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Server Alive" });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next({ status: 404, message: "404 Not Found" });
});

class HttpError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log("Global error: ", error.message);
  res.status(error.status || 500).json({ message: error.message });
});

const PORT = parseInt(process.env.PORT as string) | 8000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
}

export default app;

import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import cors from "cors";
import morgan from "morgan";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { gql } from "graphql-tag";

type Book = {
  title: string;
  author: string;
};

// Dummy Data
const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  # For Get request, type is Query
  type Query {
    getBooks: [Book]
  }

  # For Insert, Update, Delete, type is Mutation
  type Mutation {
    insertBook(title: String!, author: String!): Book
  }
`;

const resolvers = {
  Query: {
    getBooks: () => books,
  },
  Mutation: {
    insertBook: (_parent: any, args: Book) => {
      const { title, author } = args;
      const newBook = { title, author };
      books.push(newBook);
      return newBook;
    },
  },
};

async function startServer() {
  const app = express();

  // Create Apollo Server Instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server
  await server.start();

  // middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Attach Apollo middleware to `/graphql`
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    }) as unknown as RequestHandler
  );
  // Start Express server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Error starting the server:", error);
});

// Express Restful API Setup
// const app = express();

// // middlewares
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// // Routes
// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   res.status(200).json({ message: "Server Alive" });
// });

// app.use((req: Request, res: Response, next: NextFunction) => {
//   next({ status: 404, message: "404 Not Found" });
// });

// class HttpError extends Error {
//   constructor(public status: number, public message: string) {
//     super(message);
//   }
// }
// app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
//   console.log("Global error: ", error.message);
//   res.status(error.status || 500).json({ message: error.message });
// });

// const PORT = parseInt(process.env.PORT as string) | 8000;

// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`Server running at port ${PORT}`);
//   });
// }

// export default app;

import { Server } from "socket.io";

declare global {
  namespace NodeJS {
    interface Global {
      io: Server;
    }
  }

  var io: Server;
}

declare module "express-serve-static-core" {
  interface User {
    id: string;
    role: string;
    branchId: string;
  }

  interface Request {
    user?: User;
  }
}

export {};

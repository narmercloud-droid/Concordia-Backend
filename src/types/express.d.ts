declare global {
  namespace Express {
    interface Request {
      user?: any;
      customer?: any;
      terminal?: any;
      io?: any;
    }
    interface Response {
      tson?: (body: any) => void;
    }
  }
}

export {};


declare global {
  namespace Express {
    interface Request {
      user?: any;
      customer?: any;
      terminal?: any;
      io?: any;
    }
  }
}

export {};

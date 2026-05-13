declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: string;
      branchId: string;
    };
    app?: any;
  }
}

export {};

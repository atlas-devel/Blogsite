declare global {
  namespace Express {
    export interface Request {
      userInfo: {
        id: string;
        role: "admin" | "user";
      };
    }
  }
}

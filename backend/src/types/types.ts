declare global {
  namespace Express {
    export interface Request {
      userInfo: {
        id: string;
        role: "ADMIN" | "USER";
      };
    }
  }
}

export interface Data {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
}

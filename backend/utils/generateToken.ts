import jwt from "jsonwebtoken";

export const generateToken = (payload: { id: string ,role:string}) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "24h",
  });
};

import type { Response } from "express";

interface ResponseParams {
  res: Response;
  statusCode?: number;
  message?: string;
  error?: Error;
  data?: Record<string, any>;
}

export const successResponseMessage = ({
  res,
  statusCode = 200,
  message = "Success",
  data = {},
}: ResponseParams) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

export const errorResponseMessage = ({
  res,
  statusCode = 500,
  message = "Internal server error",
  error,
}: ResponseParams) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

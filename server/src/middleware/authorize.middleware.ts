// authorize.middleware.ts
import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

export const authorize = async (
  c: Context & {
    payload?: {
      id: string;
      email: string;
    };
  },
  next: Next
) => {
  let token: string | undefined;

  if (c.req.header("Authorization") && c.req.header("Authorization").startsWith("Bearer") && c.req.header("Authorization").split(" ")[1]) {
    token = c.req.header("Authorization").split(" ")[1];
  }

  if (token) {
    try {
      const payload = (await verify(token, process.env.TOKEN_SECRET, "HS256")) as unknown as {
        id: string;
        email: string;
      };

      c.payload = {
        id: payload.id,
        email: payload.email,
      };
    } catch (error) {
      return c.json(
        {
          status: 401,
          message: error.message,
        },
        401
      );
    }
  } else {
    return c.json(
      {
        status: 401,
        message: "Anda perlu login terlebih dahulu",
      },
      401
    );
  }

  await next();
};

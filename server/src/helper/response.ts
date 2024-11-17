import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export const response = (c: Context, status: number, data: any, fitur: string) => {
  let message: string;

  if (c.req.method === "GET") message = "didapatkan";
  else if (c.req.method === "POST" && status == 201) message = "ditambahkan";
  else if (c.req.method === "POST") message = "diproses";
  else if (c.req.method === "PUT") message = "diperbarui";
  else if (c.req.method === "DELETE") message = "dihapus";

  const statusCode: any = status;

  switch (true) {
    case status < 300:
      return c.json(
        {
          status: status,
          message: `Yeay, Data ${fitur} berhasil ${message}`,
          data,
        },
        statusCode
      );
    case status < 499:
      return c.json(
        {
          status: status,
          message: `Yahhh, Data ${fitur} gagal ${message}`,
          error: data,
        },
        statusCode
      );
    case status > 500:
      return c.json(
        {
          status: status,
          message: `Yahhh, Data ${fitur} gagal ${message}`,
          error: data,
        },
        statusCode
      );
    default:
      return c.json("Ngokeh");
  }
};

export const throwError = (status: number, data: any) => {
  throw {
    status,
    data,
  };
};

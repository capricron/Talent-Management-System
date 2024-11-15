import { Context } from "hono";

export const response = (c: Context, status: number, data: any, fitur: string) => {

    switch(status){
        case 201:
            return c.json({
                status: status,
                message: `Yeay, Data ${fitur} berhasil ditambahkan`,
                data
            })

        default:
            return c.json("Ngokeh")
    }

}
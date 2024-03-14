

import { TypedNextResponse, route, routeOperation } from 'next-rest-framework';
import { z } from 'zod';

export const { POST } = route({
    process: routeOperation({
        method: 'POST',
    })
        .input({
            contentType: 'application/json',
            body: z.object({
                title: z.string(),
            })
        })
        .outputs([
            {
                status: 201,
                contentType: 'application/json',
                schema: z.string()
            },
            {
                status: 401,
                contentType: 'application/json',
                schema: z.string()
            }
        ])
        .handler(async (req) => {
            const { title } = await req.json()

            console.log(title)

            return TypedNextResponse.json("blob", {
                status: 201
            });
        })
});
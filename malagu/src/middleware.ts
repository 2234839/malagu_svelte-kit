
import { Component } from '@malagu/core';
import { Context, HTTP_MIDDLEWARE_PRIORITY, Middleware } from '@malagu/web/lib/node';
// @ts-ignore
import fetch, { Headers, Request, Response } from 'node-fetch';

global.fetch = fetch;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;

export const app = require("../.malagu/frontend/index.js")

@Component(Middleware)
export class SvelteKitMiddleware implements Middleware {

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {

		const rawBody = await getRawBody(ctx.request)
        let method = ctx.request.method
        if( ctx.request.query["_method"] ){
			method=String(ctx.request.query["_method"]).toUpperCase()
        }
		const path = decodeURIComponent(ctx.request.originalUrl.split("?")[0])

		const res = await app.render({
            host: "192.0.0.1",
            method,
            headers: ctx.request.headers,
            path: path==="/index.html" ? "/" : path,
            query: new URLSearchParams(""|| ''),
            rawBody: rawBody
        })

        if(res.status === 404) {
            await next()
			const response = ctx.response;
			if (!Context.isSkipAutoEnd() && !response.writableEnded) {
				response.end(response.body);
			}
        }else{
			const response = ctx.response;

			response.body = res.body
            response.status(res.status)
			Object.entries(res.headers).forEach(([key,value])=>response.setHeader(key, String(value)))

			if (!Context.isSkipAutoEnd() && !response.writableEnded) {
				response.end(response.body);
			}
        }
    }

    readonly priority = HTTP_MIDDLEWARE_PRIORITY;

}


/**
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<import('types/hooks').StrictBody>}
 */
 function getRawBody(req:import('http').IncomingMessage) {
	return new Promise((fulfil, reject) => {
		const h = req.headers;

		if (!h['content-type']) {
			return fulfil(null);
		}

		req.on('error', reject);

		const length = Number(h['content-length']);

		// https://github.com/jshttp/type-is/blob/c1f4388c71c8a01f79934e68f630ca4a15fffcd6/index.js#L81-L95
		if (isNaN(length) && h['transfer-encoding'] == null) {
			return fulfil(null);
		}

		let data = new Uint8Array(length || 0);

		if (length > 0) {
			let offset = 0;
			req.on('data', (chunk) => {
				const new_len = offset + Buffer.byteLength(chunk);

				if (new_len > length) {
					return reject({
						status: 413,
						reason: 'Exceeded "Content-Length" limit'
					});
				}

				data.set(chunk, offset);
				offset = new_len;
			});
		} else {
			req.on('data', (chunk) => {
				const new_data = new Uint8Array(data.length + chunk.length);
				new_data.set(data, 0);
				new_data.set(chunk, data.length);
				data = new_data;
			});
		}

		req.on('end', () => {
			const [type] = h['content-type']?.split(/;\s*/) || [];
			if (type === 'application/octet-stream') {
				return fulfil(data);
			}

			const encoding = h['content-encoding'] || 'utf-8';
			fulfil(new TextDecoder(encoding).decode(data));
		});
	});
}
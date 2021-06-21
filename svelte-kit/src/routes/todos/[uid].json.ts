import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { DeleteTodo, PatchTodo } from './stroe';

// PATCH /todos/:uid.json
export const patch: RequestHandler<Locals, FormData> = async (request) => {
	const uid = request.params.uid
	const text = request.body.get('text')
	const done = request.body.has('done') ? !!request.body.get('done') : undefined
	return  { body: PatchTodo(uid, {
		text,
		done
	}) };
};

// DELETE /todos/:uid.json
export const del: RequestHandler<Locals> = async (request) => {
	const uid = request.params.uid
	return {body:DeleteTodo(uid)}
};

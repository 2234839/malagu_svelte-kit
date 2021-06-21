import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { AddTodo, TodoList } from './stroe';

// GET /todos.json
export const get: RequestHandler<Locals> = async (request) => {
	return { body: TodoList };
};

// POST /todos.json
export const post: RequestHandler<Locals, FormData> = async (request) => {
	const text = request.body.get('text')
	return { body: AddTodo(text) };
};

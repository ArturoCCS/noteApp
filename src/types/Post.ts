export type PostType = "study" | "task" | "blog";

export interface Post {
	id: string;
	slug: string;
	title: string;
	description?: string;
	content?: string;
	image?: string;
	tags: string[];
	category?: string | null;

	type: PostType;
	status?: "pending" | "done";

	workspaceId?: string;

	published: string;
	updated?: string;
	words: number;
	minutes: number;
}

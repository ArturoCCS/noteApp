<script context="module" lang="ts">
export interface Post {
	id: string;
	slug: string;
	title: string;
	description?: string;
	content?: string;
	image?: string;
	tags: string[];
	category?: string | null;
	published: string;
	updated?: string;
	words: number;
	minutes: number;
}
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import I18nKey from "../i18n/i18nKey";
	import { i18n } from "../i18n/translation";

	interface Group {
		year: number;
		posts: (Post & { publishedDate: Date })[];
	}

	export let sortedPosts: Post[] = [];
	export let workspaceSlug: string = "";
	
	let groups: Group[] = [];

	function formatDate(date: Date) {
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		return `${month}-${day}`;
	}

	function formatTag(tagList: string[]) {
		if (!tagList || tagList.length === 0) return "";
		return tagList.map((t) => `#${t}`).join(" ");
	}

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		const filterTags = params.has("tag") ? params.getAll("tag") : [];
		const filterCategories = params.has("category") ? params.getAll("category") : [];
		const uncategorized = params.get("uncategorized");

		let processedPosts = sortedPosts.map(post => ({
			...post,
			publishedDate: new Date(post.published) 
		}));

		if (filterTags.length > 0) {
			processedPosts = processedPosts.filter(
				(post) => post.tags && post.tags.some((tag) => filterTags.includes(tag))
			);
		}

		if (filterCategories.length > 0) {
			processedPosts = processedPosts.filter(
				(post) => post.category && filterCategories.includes(post.category)
			);
		}

		if (uncategorized) {
			processedPosts = processedPosts.filter((post) => !post.category);
		}

		const grouped = processedPosts.reduce((acc, post) => {
			const year = post.publishedDate.getFullYear();
			if (!acc[year]) acc[year] = [];
			acc[year].push(post);
			return acc;
		}, {} as Record<number, any[]>);

		groups = Object.keys(grouped).map((yearStr) => ({
			year: Number.parseInt(yearStr, 10),
			posts: grouped[Number.parseInt(yearStr, 10)],
		})).sort((a, b) => b.year - a.year);
	});
</script>

<div class="card-base px-8 py-6">
	{#each groups as group}
		<div class="mb-4 last:mb-0">
			<div class="flex flex-row w-full items-center h-[3.75rem]">
				<div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
					{group.year}
				</div>
				<div class="w-[15%] md:w-[10%]">
					<div class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto -outline-offset-[2px] z-50 outline-3"></div>
				</div>
				<div class="w-[70%] md:w-[80%] transition text-left text-50">
					{group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
				</div>
			</div>

			{#each group.posts as post}
				<a href={workspaceSlug ? `/w/${workspaceSlug}/posts/${post.slug}/` : `/posts/${post.slug}/`} 
				   aria-label={post.title}
				   class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]">
					<div class="flex flex-row justify-start items-center h-full">
						
						<div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
							{formatDate(post.publishedDate)}
						</div>

						<div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
							<div class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
								bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
								outline outline-4 z-50 outline-[var(--card-bg)]
								group-hover:outline-[var(--btn-plain-bg-hover)]
								group-active:outline-[var(--btn-plain-bg-active)]">
							</div>
						</div>

						<div class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
							group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
							text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden">
							{post.title}
						</div>

						<div class="hidden md:block md:w-[15%] text-left text-sm transition
							whitespace-nowrap overflow-ellipsis overflow-hidden text-30">
							{formatTag(post.tags)}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/each}
</div>
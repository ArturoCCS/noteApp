import { siteConfig } from "@/config";
import { getSortedPosts } from "@/server/firebase/get-posts";
import rss from "@astrojs/rss";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
  return str.replace(
    // biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
    "",
  );
}

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle || "No description",
    site: context.site ?? "https://fuwari.vercel.app",
    items: posts.map((post) => {
      const rawContent =
        typeof post.content === "string" ? post.content : "";

      const cleanedContent = stripInvalidXmlChars(rawContent);

      return {
        title: post.title ?? "Sin título",
        description: post.description ?? "",
        pubDate: new Date(post.published),
        link: url(`/posts/${post.slug}/`),
        content: sanitizeHtml(parser.render(cleanedContent), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
      };
    }),
    customData: `<language>${siteConfig.lang}</language>`,
  });
}

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    try {
        const blogEntries = await getCollection('blog');
        const blogs = blogEntries.map(entry => ({
            title: entry.data.title,
            url: `/blog/${entry.filePath?.match(/([^/]+?)(?:\.[^/.]+)?$/)[1]}`,  // 使用 entry.slug 而不是 title
            lowercaseTitle: entry.data.title.toLowerCase(), // 添加这个字段用于搜索
            pubDate: entry.data.pubDate?.toISOString(), // 添加可选链操作符
            description: entry.data.description,
            tags: entry.data.tags,
        }));

        return new Response(
            JSON.stringify(blogs),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch blog posts' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
import { NextResponse } from "next/server";

// Fetch recent posts from Instagram via unofficial embed approach
// For production: use Instagram Graph API with a long-lived token
// For hackathon: fetch public profile data via web scraping fallback

type InstaPost = {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
};

let cache: { posts: InstaPost[]; ts: number } | null = null;
const CACHE_TTL = 1000 * 60 * 30; // 30 min

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.posts);
  }

  try {
    // Try fetching from Instagram's public JSON endpoint
    const res = await fetch(
      "https://www.instagram.com/dniproanimals/?__a=1&__d=dis",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 1800 },
      },
    );

    if (res.ok) {
      const data = await res.json();
      const edges =
        data?.graphql?.user?.edge_owner_to_timeline_media?.edges || [];
      const posts: InstaPost[] = edges.slice(0, 9).map(
        (edge: {
          node: {
            shortcode: string;
            display_url: string;
            thumbnail_src: string;
            edge_media_to_caption: { edges: { node: { text: string } }[] };
          };
        }) => ({
          id: edge.node.shortcode,
          url: `https://www.instagram.com/p/${edge.node.shortcode}/`,
          thumbnail: edge.node.thumbnail_src || edge.node.display_url,
          caption:
            edge.node.edge_media_to_caption?.edges?.[0]?.node?.text?.slice(
              0,
              100,
            ) || "",
        }),
      );

      cache = { posts, ts: Date.now() };
      return NextResponse.json(posts);
    }
  } catch {
    // Fallback silently
  }

  // Fallback: return curated list of known posts with local images
  const fallbackPosts: InstaPost[] = [
    {
      id: "1",
      url: "https://www.instagram.com/dniproanimals/",
      thumbnail: "/uploads/cat1_1.jpg",
      caption: "Наші котики чекають на вас! 🐱",
    },
    {
      id: "2",
      url: "https://www.instagram.com/dniproanimals/",
      thumbnail: "/uploads/dog1_1.jpg",
      caption: "Барон — найвірніший друг 🐕",
    },
    {
      id: "3",
      url: "https://www.instagram.com/dniproanimals/",
      thumbnail: "/uploads/cat2_1.jpg",
      caption: "Рижик шукає дім ❤️",
    },
    {
      id: "4",
      url: "https://www.instagram.com/dniproanimals/",
      thumbnail: "/uploads/dog2_1.jpg",
      caption: "Рекс на прогулянці 🦮",
    },
    {
      id: "5",
      url: "https://www.instagram.com/dniproanimals/",
      thumbnail: "/uploads/cat3_1.jpg",
      caption: "Сніжинка — тиха красуня",
    },
    {
      id: "6",
      url: "https://www.instagram.com/dniproanimals/",
      thumbnail: "/uploads/dog3_1.jpg",
      caption: "Бім пройшов реабілітацію 💪",
    },
  ];

  cache = { posts: fallbackPosts, ts: Date.now() };
  return NextResponse.json(fallbackPosts);
}

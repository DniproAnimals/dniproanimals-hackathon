"use client";
import ImageFallback from "@/components/ImageFallback";
import { IconBrandInstagram } from "@dniproanimals/icons";
import { EmptyState, Skeleton } from "@dniproanimals/ui";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        description="Не вдалося завантажити публікації"
        action={
          <a
            href="https://instagram.com/dniproanimals"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:underline"
          >
            Переглянути в Instagram →
          </a>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square rounded-2xl overflow-hidden bg-white"
        >
          <ImageFallback
            src={post.thumbnail}
            alt={post.caption}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
            <p className="text-white text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {post.caption}
            </p>
          </div>
          <div className="absolute top-2.5 right-2.5 size-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <IconBrandInstagram className="size-3.5" />
          </div>
        </a>
      ))}
    </div>
  );
}

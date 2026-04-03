"use client";

import { useEffect, useState } from "react";
import ImageFallback from "@/components/ImageFallback";

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
          <div key={i} className="aspect-square rounded-2xl bg-white animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-medium">Не вдалося завантажити публікації</p>
        <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:underline mt-2 inline-block">
          Переглянути в Instagram →
        </a>
      </div>
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
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
            <p className="text-white text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {post.caption}
            </p>
          </div>
          {/* Instagram icon */}
          <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </div>
        </a>
      ))}
    </div>
  );
}

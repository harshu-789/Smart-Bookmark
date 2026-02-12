"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddBookmarkForm({ user }: { user: any }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({ title: title || url, url, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      // Notify other components/tabs immediately
      try {
        window.dispatchEvent(
          new CustomEvent("bookmark-added", { detail: data }),
        );
      } catch (err) {
        // ignore
      }
    }

    setTitle("");
    setUrl("");
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 flex gap-2">
      <input
        className="flex-1 rounded border px-3 py-2"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="flex-2 rounded border px-3 py-2"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        Add
      </button>
    </form>
  );
}

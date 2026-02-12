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
    <form
      onSubmit={onSubmit}
      className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:gap-2"
    >
      <input
        className="w-full sm:flex-1 rounded border border-gray-300 px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full sm:flex-1 rounded border border-gray-300 px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="w-full sm:w-auto px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}

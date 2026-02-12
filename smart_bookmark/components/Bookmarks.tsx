"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Bookmarks({ user }: { user: any }) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const newBookmark = e?.detail;
      if (!newBookmark) return;
      setBookmarks((s) => (s.find((b) => b.id === newBookmark.id) ? s : [newBookmark, ...s]));
    };

    window.addEventListener("bookmark-added", handler as EventListener);
    return () => window.removeEventListener("bookmark-added", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const load = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (isMounted && data) setBookmarks(data as any[]);
    };

    load();

    const channel = supabase
      .channel("public:bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const ev = payload.eventType;
          if (ev === "INSERT") {
            setBookmarks((s) => [payload.new, ...s]);
          } else if (ev === "DELETE") {
            setBookmarks((s) => s.filter((b) => b.id !== payload.old.id));
          } else if (ev === "UPDATE") {
            setBookmarks((s) =>
              s.map((b) => (b.id === payload.new.id ? payload.new : b)),
            );
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, [user]);

  const del = async (id: string) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  };

  return (
    <div>
      {bookmarks.length === 0 && (
        <div className="text-gray-500">No bookmarks yet.</div>
      )}
      <ul className="space-y-3">
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex justify-between items-start bg-white p-3 rounded shadow-sm"
          >
            <div>
              <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600"
              >
                {b.title}
              </a>
              <div className="text-sm text-gray-500">{b.url}</div>
            </div>
            <div>
              <button
                onClick={() => del(b.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

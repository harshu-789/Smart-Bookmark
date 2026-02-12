"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Bookmarks({ user }: { user: any }) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const newBookmark = e?.detail;
      if (!newBookmark) return;
      setBookmarks((s) =>
        s.find((b) => b.id === newBookmark.id) ? s : [newBookmark, ...s],
      );
    };

    window.addEventListener("bookmark-added", handler as EventListener);
    return () =>
      window.removeEventListener("bookmark-added", handler as EventListener);
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
      <ul className="space-y-2 sm:space-y-3">
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 bg-white p-4 sm:p-4 rounded-lg sm:rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 break-words text-sm sm:text-base"
              >
                {b.title}
              </a>
              <div className="text-xs sm:text-sm text-gray-500 break-all mt-1">
                {b.url}
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <button
                onClick={() => del(b.id)}
                className="w-full sm:w-auto text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors"
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

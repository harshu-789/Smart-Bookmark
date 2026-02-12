"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AddBookmarkForm from "../components/AddBookmarkForm";
import Bookmarks from "../components/Bookmarks";

export default function Page() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };
  const signOut = async () => await supabase.auth.signOut();

  return (
    <main>
      <div className="space-y-6">
        <section className="rounded-lg sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-4 sm:p-6 md:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Smart Bookmark
              </h1>
              <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-xl">
                Save and access your personal bookmarks instantly — private and
                synchronized across tabs.
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0">
              <img
                src="/bookmark-illustration.svg"
                alt="bookmark"
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 opacity-90"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
          {!user ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Get started
                </h2>
                <p className="text-sm text-gray-500">
                  Sign in with Google to manage your bookmarks.
                </p>
              </div>
              <div>
                <button
                  onClick={signIn}
                  className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded shadow hover:shadow-md transition-shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                  >
                    <path
                      fill="#fbc02d"
                      d="M43.6 20.5H42V20H24v8h11.3C34.9 32.3 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.7 4.8 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21 21-9.3 21-21c0-1.4-.1-2.7-.4-4z"
                    />
                    <path
                      fill="#e53935"
                      d="M6.3 14.7l6.6 4.8C14.3 16.3 18.8 14 24 14c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.7 4.8 29.6 3 24 3 15.4 3 8.1 7.2 6.3 14.7z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm sm:text-xl font-semibold text-gray-700">
                    {user.user_metadata?.full_name
                      ? user.user_metadata.full_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .slice(0, 2)
                          .join("")
                      : (user.email || user.id).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Signed in as</div>
                    <div className="font-medium">
                      {user.user_metadata?.full_name ?? user.email ?? user.id}
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <button
                    onClick={signOut}
                    className="w-full sm:w-auto px-3 py-2 sm:py-1 border rounded text-sm hover:bg-gray-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>

              <AddBookmarkForm user={user} />
              <Bookmarks user={user} />
            </div>
          )}
        </section>

        <footer className="text-center text-xs sm:text-sm text-gray-500 px-2">
          Built with Next.js, Supabase & Tailwind — your bookmarks stay private.
        </footer>
      </div>
    </main>
  );
}

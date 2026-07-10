import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Home,
  Dumbbell,
  User,
  SquarePen,
} from "lucide-react";

const COLORS = {
  bg: "#0A0A0B",
  panel: "#141315",
  hairline: "#2B2721",
  gold: "#3f81cc",
  goldBright: "#528bcc",
  goldDim: "#327bcf",
  text: "#F3EFE6",
  subtext: "#8C8578",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function PostImage({ photoUrl }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className="w-full h-auto block object-cover"
        style={{ aspectRatio: "1 / 1" }}
      />
    );
  }
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto block" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill={COLORS.panel} />
      <rect width="400" height="400" fill="#1B1912" />
      <circle cx="200" cy="150" r="70" fill={COLORS.goldDim} opacity="0.25" />
      <path d="M0 260 Q100 210 200 250 T400 240 V400 H0 Z" fill={COLORS.gold} opacity="0.15" />
      <path d="M0 300 Q120 260 220 290 T400 280 V400 H0 Z" fill={COLORS.gold} opacity="0.3" />
    </svg>
  );
}

export default function LikedPostPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // tracks in-flight optimistic overrides + removals so the UI feels instant
  const [pendingUnlike, setPendingUnlike] = useState({});

  useEffect(() => {
    let cancelled = false;

    const fetchLikedPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/posts/liked");
        if (!cancelled) setPosts(response.data);
      } catch (err) {
        console.error("Failed to load liked posts:", err);
        if (!cancelled) setError("Couldn't load your liked posts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLikedPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUnlike = async (postId) => {
    // optimistic: hide immediately, since this page only shows liked posts
    setPendingUnlike((prev) => ({ ...prev, [postId]: true }));
    try {
      // same toggle endpoint HomePage uses - every post here is already liked,
      // so calling it always flips to unliked
      await api.post(`/posts/${postId}/likes`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Failed to unlike post:", err);
      // roll back the optimistic hide since the request failed
      setPendingUnlike((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    }
  };

  const sideNavItems = [
    { key: "create-post", icon: SquarePen, label: "Create Post", path: "/create-post" },
    { key: "liked", icon: Heart, label: "Liked Posts", path: "/liked-posts" },
  ];

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/workout-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  const visiblePosts = posts.filter((p) => !pendingUnlike[p.id]);

  return (
    <div className="min-h-screen w-full flex" style={{ backgroundColor: COLORS.bg }}>

     {/* Left Sidebar */}
     <aside
       className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 md:left-0 border-r"
       style={{
         backgroundColor: COLORS.panel,
         borderColor: COLORS.hairline,
       }}
     >
       {/* Logo / Title */}
       <div
         className="px-6 py-8 border-b"
         style={{ borderColor: COLORS.hairline }}
       >
         <h2
           className="text-xl tracking-[0.2em] uppercase"
           style={{
             color: COLORS.gold,
             fontFamily: "'Playfair Display', Georgia, serif",
           }}
         >
           Gainstack
         </h2>

         <p
           className="text-xs mt-2 tracking-wide"
           style={{ color: COLORS.subtext }}
         >
           Community
         </p>
       </div>

       {/* Navigation */}
       <div className="flex flex-col gap-3 p-5">
         {sideNavItems.map(({ key, icon: Icon, label, path }) => {
           const active = location.pathname === path;

           return (
             <button
               key={key}
               onClick={() => navigate(path)}
               className="flex items-center gap-4 rounded-xl px-4 py-4 transition-all"
               style={{
                 backgroundColor: active ? COLORS.gold : "#1B1A1D",
                 color: active ? COLORS.bg : COLORS.text,
                 border: `1px solid ${
                   active ? COLORS.gold : COLORS.hairline
                 }`,
               }}
             >
               <Icon
                 size={20}
                 style={{
                   color: active ? COLORS.bg : COLORS.gold,
                 }}
               />

               <span
                 className="text-sm tracking-wide"
                 style={{
                   fontWeight: active ? 600 : 500,
                 }}
               >
                 {label}
               </span>
             </button>
           );
         })}
       </div>

       {/* Divider */}
       <div
         className="mx-5 mt-3 mb-5"
         style={{
           height: "1px",
           backgroundColor: COLORS.hairline,
         }}
       />

       {/* Extra Section */}
       <div className="px-6">
         <p
           className="text-[11px] uppercase tracking-[0.25em] mb-3"
           style={{ color: COLORS.subtext }}
         >
           Quick Access
         </p>

         <div
           className="rounded-xl p-4"
           style={{
             background:
               "linear-gradient(135deg, rgba(63,129,204,.15), rgba(82,139,204,.05))",
             border: `1px solid ${COLORS.hairline}`,
           }}
         >
           <p
             className="text-sm font-medium mb-1"
             style={{ color: COLORS.text }}
           >
             Keep Training 💪
           </p>

           <p
             className="text-xs leading-5"
             style={{ color: COLORS.subtext }}
           >
             Share your workouts and inspire other athletes in the community.
           </p>
         </div>
       </div>
     </aside>

      {/* main column */}
      <div className="flex-1 md:ml-60 flex flex-col">
        {/* header */}
        <header
          className="sticky top-0 z-10 flex items-center justify-center py-4 border-b"
          style={{ backgroundColor: COLORS.bg, borderColor: COLORS.hairline }}
        >
          <div className="flex items-center justify-center relative w-full">
            <button
              onClick={() => navigate("/homepage")}
              className="absolute left-5 text-sm"
              style={{ color: COLORS.gold }}
            >
              ← Back
            </button>

            <h1
              className="text-lg tracking-[0.2em] uppercase"
              style={{
                color: COLORS.gold,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Liked Posts
            </h1>
          </div>
        </header>

        {/* feed */}
        <main className="flex-1 pb-20">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Heart size={22} style={{ color: COLORS.subtext }} className="animate-pulse" />
              <p className="text-[13px] tracking-[0.1em] uppercase" style={{ color: COLORS.subtext }}>
                Loading liked posts…
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[14px]" style={{ color: COLORS.text }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && visiblePosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-2 text-center px-6">
              <Heart size={22} style={{ color: COLORS.subtext }} />
              <p className="text-[13px]" style={{ color: COLORS.subtext }}>
                You haven't liked any posts yet.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            visiblePosts.map((post) => (
              <article
                key={post.id}
                className="border-b"
                style={{ borderColor: COLORS.hairline }}
              >
                {/* post header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center border shrink-0"
                      style={{ borderColor: COLORS.gold }}
                    >
                      <span
                        className="text-xs"
                        style={{
                          color: COLORS.gold,
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {post.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: COLORS.text }}>
                        {post.username}
                      </p>
                      {post.createdAt && (
                        <p className="text-[11px]" style={{ color: COLORS.subtext }}>
                          {timeAgo(post.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <MoreHorizontal size={18} style={{ color: COLORS.subtext }} />
                </div>

                {/* narrow image */}
                <div className="px-4 flex justify-center">
                  <div className="overflow-hidden rounded-sm w-2/3 max-w-[220px]">
                    <PostImage photoUrl={post.photoUrl} />
                  </div>
                </div>

                {/* workout summary strip */}
                {post.workoutTitle && (
                  <div
                    className="px-4 py-2.5 flex items-center justify-between"
                    style={{ backgroundColor: COLORS.panel }}
                  >
                    <p className="text-sm" style={{ color: COLORS.goldBright }}>
                      {post.workoutTitle}
                    </p>
                  </div>
                )}

                {/* actions */}
                <div className="flex items-center justify-between px-4 pt-3">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleUnlike(post.id)} aria-label="Unlike">
                      <Heart size={22} fill={COLORS.gold} style={{ color: COLORS.gold }} />
                    </button>
                    <MessageCircle size={22} style={{ color: COLORS.text }} />
                    <Send size={20} style={{ color: COLORS.text }} />
                  </div>
                  <Bookmark size={20} style={{ color: COLORS.text }} />
                </div>

                {/* likes + caption */}
                <div className="px-4 py-3">
                  <p className="text-sm mb-1" style={{ color: COLORS.text }}>
                    {post.likes ?? 0} likes
                  </p>
                  {post.caption && (
                    <p className="text-sm" style={{ color: COLORS.subtext }}>
                      <span style={{ color: COLORS.text }}>{post.username}</span>{" "}
                      {post.caption}
                    </p>
                  )}
                </div>
              </article>
            ))}
        </main>
      </div>

      {/* bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
      >
        {navItems.map(({ key, icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-6 py-1"
              aria-label={label}
            >
              <Icon
                size={22}
                style={{ color: active ? COLORS.gold : COLORS.subtext }}
              />
              <span
                className="text-[10px] tracking-wide"
                style={{ color: active ? COLORS.gold : COLORS.subtext }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

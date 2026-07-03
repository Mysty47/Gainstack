import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Home,
  Dumbbell,
  User,
} from "lucide-react";

const COLORS = {
  bg: "#0A0A0B",
  panel: "#141315",
  hairline: "#2B2721",
  gold: "#C9A24B",
  goldBright: "#E9CD82",
  goldDim: "#8A7439",
  text: "#F3EFE6",
  subtext: "#8C8578",
};

const POSTS = [
  {
    id: 1,
    user: "pguimaraes",
    time: "13h ago",
    title: "Full Body 1 — Complete",
    stats: "59min · 3,610.6 kg · 6 PRs",
    likes: 24,
    caption: "A little lazy today, but showed up.",
  },
  {
    id: 2,
    user: "desmond.k",
    time: "1d ago",
    title: "Push Day",
    stats: "47min · 2,980 kg · 2 PRs",
    likes: 41,
    caption: "New bench PR. Felt strong.",
  },
  {
    id: 3,
    user: "elena_lifts",
    time: "2d ago",
    title: "Leg Day",
    stats: "1h 12min · 4,220 kg",
    likes: 63,
    caption: "Squats humbled me today.",
  },
];

function PostImage() {
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

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/exercises-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-center py-4 border-b"
        style={{ backgroundColor: COLORS.bg, borderColor: COLORS.hairline }}
      >
        <h1
          className="text-lg tracking-[0.2em] uppercase"
          style={{
            color: COLORS.gold,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Gainstack
        </h1>
      </header>

      {/* feed */}
      <main className="flex-1 pb-20">
        {POSTS.map((post) => (
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
                    {post.user.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm" style={{ color: COLORS.text }}>
                    {post.user}
                  </p>
                  <p className="text-[11px]" style={{ color: COLORS.subtext }}>
                    {post.time}
                  </p>
                </div>
              </div>
              <MoreHorizontal size={18} style={{ color: COLORS.subtext }} />
            </div>

            {/* narrow image */}
            <div className="px-4 flex justify-center">
              <div className="overflow-hidden rounded-sm w-2/3 max-w-[220px]">
                <PostImage />
              </div>
            </div>

            {/* workout summary strip */}
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ backgroundColor: COLORS.panel }}
            >
              <p className="text-sm" style={{ color: COLORS.goldBright }}>
                {post.title}
              </p>
              <p className="text-[11px]" style={{ color: COLORS.subtext }}>
                {post.stats}
              </p>
            </div>

            {/* actions */}
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleLike(post.id)} aria-label="Like">
                  <Heart
                    size={22}
                    fill={liked[post.id] ? COLORS.gold : "none"}
                    style={{ color: liked[post.id] ? COLORS.gold : COLORS.text }}
                  />
                </button>
                <MessageCircle size={22} style={{ color: COLORS.text }} />
                <Send size={20} style={{ color: COLORS.text }} />
              </div>
              <Bookmark size={20} style={{ color: COLORS.text }} />
            </div>

            {/* likes + caption */}
            <div className="px-4 py-3">
              <p className="text-sm mb-1" style={{ color: COLORS.text }}>
                {post.likes + (liked[post.id] ? 1 : 0)} likes
              </p>
              <p className="text-sm" style={{ color: COLORS.subtext }}>
                <span style={{ color: COLORS.text }}>{post.user}</span>{" "}
                {post.caption}
              </p>
            </div>
          </article>
        ))}
      </main>

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

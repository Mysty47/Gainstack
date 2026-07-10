import {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios"
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

function PostImage() {
    return (
        <svg viewBox="0 0 800 450" className="w-full h-auto block" preserveAspectRatio="xMidYMid slice">
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
    const [posts, setPosts] = useState([]);
    // { [postId]: { liked: boolean, likeCount: number } }
    const [likes, setLikes] = useState({});

    useEffect(() => {
        api.get("/posts")
            .then((res) => {
                setPosts(res.data);

                // fetch like status + count for every post once posts load
                res.data.forEach((post) => {
                    api
                        .get(`/posts/${post.id}/likes`)
                        .then((likeRes) => {
                            setLikes((prev) => ({ ...prev, [post.id]: likeRes.data }));
                        })
                        .catch((err) => console.error("Failed to load like status:", err));
                });
            })
            .catch(console.error);
    }, []);

    const toggleLike = async (postId) => {
        // optimistic update so the UI feels instant
        setLikes((prev) => {
            const current = prev[postId] || { liked: false, likeCount: 0 };
            return {
                ...prev,
                [postId]: {
                    liked: !current.liked,
                    likeCount: current.liked ? current.likeCount - 1 : current.likeCount + 1,
                },
            };
        });

        try {
            const res = await api.post(`/posts/${postId}/likes`);
            // reconcile with the real server response in case of drift
            setLikes((prev) => ({ ...prev, [postId]: res.data }));
        } catch (err) {
            console.error("Failed to toggle like:", err);
            // revert on failure
            setLikes((prev) => {
                const current = prev[postId] || { liked: false, likeCount: 0 };
                return {
                    ...prev,
                    [postId]: {
                        liked: !current.liked,
                        likeCount: current.liked ? current.likeCount - 1 : current.likeCount + 1,
                    },
                };
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
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = "#242227";
                                        e.currentTarget.style.borderColor = COLORS.gold;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = "#1B1A1D";
                                        e.currentTarget.style.borderColor = COLORS.hairline;
                                    }
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
                    <h1
                        className="text-lg tracking-[0.2em] uppercase"
                        style={{ color: COLORS.gold, fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Gainstack
                    </h1>
                </header>

                {/* feed */}
                <main className="flex-1 pb-20">
                    {posts.map((post) => {
                        const likeState = likes[post.id] || { liked: false, likeCount: 0 };

                        return (
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
                                            {post.username || "Unknown User"}
                                        </p>
                                        <p className="text-[11px]" style={{ color: COLORS.subtext }}>
                                            Workout #{post.workoutId}
                                        </p>
                                    </div>
                                </div>
                                <MoreHorizontal size={18} style={{ color: COLORS.subtext }} />
                            </div>

                            {/* Instagram style post image */}
                            <div className="w-full bg-black flex justify-center">
                                {post.photoUrl ? (
                                    <img
                                        src={post.photoUrl}
                                        alt="post"
                                        className="w-full max-h-[600px] object-contain"
                                    />
                                ) : (
                                    <PostImage />
                                )}
                            </div>

                            {/* workout summary strip */}
                            <div
                                className="px-4 py-2.5 flex items-center justify-between"
                                style={{ backgroundColor: COLORS.panel }}
                            >
                                <p className="text-sm" style={{ color: COLORS.goldBright }}>
                                    Post #{post.id}
                                </p>
                            </div>

                            {/* actions */}
                            <div className="flex items-center justify-between px-4 pt-3">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => toggleLike(post.id)} aria-label="Like">
                                        <Heart
                                            size={22}
                                            fill={likeState.liked ? COLORS.gold : "none"}
                                            style={{ color: likeState.liked ? COLORS.gold : COLORS.text }}
                                        />
                                    </button>
                                    <MessageCircle size={22} style={{ color: COLORS.text }} />
                                </div>
                                <Bookmark size={20} style={{ color: COLORS.text }} />
                            </div>

                            {/* likes + caption */}
                            <div className="px-4 py-3">
                                <p className="text-sm mb-1" style={{ color: COLORS.text }}>
                                    {likeState.likeCount} {likeState.likeCount === 1 ? "like" : "likes"}
                                </p>
                                <p className="text-sm" style={{ color: COLORS.subtext }}>
                  <span style={{ color: COLORS.text }}>
                    {post.username || "Unknown User"}
                    </span>{" "}
                                    {post.caption}
                                </p>
                            </div>
                        </article>
                        );
                    })}
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

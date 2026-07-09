import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  Search,
  Calendar,
  Home,
  Dumbbell,
  User,
  ChevronRight,
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

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function groupByMonth(workouts) {
  const groups = {};
  for (const w of workouts) {
    const d = new Date(w.workoutDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!groups[key]) {
      groups[key] = {
        label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        sortKey: d.getFullYear() * 12 + d.getMonth(),
        workouts: [],
      };
    }
    groups[key].workouts.push(w);
  }
  return Object.values(groups).sort((a, b) => b.sortKey - a.sortKey);
}

export default function SavedWorkoutsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchWorkouts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/workouts");
        if (!cancelled) setWorkouts(response.data);
      } catch (err) {
        console.error("Failed to load saved workouts:", err);
        if (!cancelled) setError("Couldn't load your saved workouts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWorkouts();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return workouts;
    const q = query.trim().toLowerCase();
    return workouts.filter((w) => w.title?.toLowerCase().includes(q));
  }, [workouts, query]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/workout-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 py-4 px-4 border-b"
        style={{ backgroundColor: COLORS.bg, borderColor: COLORS.hairline }}
      >
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={20} style={{ color: COLORS.subtext }} />
        </button>
        <h1
          className="flex-1 text-center text-lg tracking-[0.2em] uppercase pr-6"
          style={{ color: COLORS.gold, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Saved Workouts
        </h1>
      </header>

      <main className="flex-1 px-5 pt-6 pb-28">
        {/* search bar */}
        <div
          className="flex items-center gap-2 px-3 border mb-8"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
        >
          <Search size={16} style={{ color: COLORS.subtext }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workouts..."
            className="w-full bg-transparent outline-none py-2.5 text-[14px]"
            style={{ color: COLORS.text }}
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Dumbbell size={22} style={{ color: COLORS.subtext }} className="animate-pulse" />
            <p className="text-[13px] tracking-[0.1em] uppercase" style={{ color: COLORS.subtext }}>
              Loading workouts…
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-[14px]" style={{ color: COLORS.text }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
            <Calendar size={22} style={{ color: COLORS.subtext }} />
            <p className="text-[13px]" style={{ color: COLORS.subtext }}>
              {query
                ? "No workouts match your search."
                : "No saved workouts yet. Create one to see it here."}
            </p>
          </div>
        )}

        {!loading && !error && grouped.length > 0 && (
          <div className="space-y-8">
            {grouped.map((group) => (
              <div key={group.label}>
                <p
                  className="text-[11px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: COLORS.subtext }}
                >
                  {group.label}
                </p>
                <div className="space-y-3">
                  {group.workouts
                    .slice()
                    .sort((a, b) => new Date(b.workoutDate) - new Date(a.workoutDate))
                    .map((w) => (
                      <button
                        key={w.id}
                        onClick={() => navigate(`/workout/${w.id}`, { state: { workout: w } })}
                        className="w-full flex items-center justify-between border px-4 py-3.5 text-left transition-colors"
                        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.gold)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.hairline)}
                      >
                        <div>
                          <p className="text-[14px] mb-1" style={{ color: COLORS.text }}>
                            {w.title}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} style={{ color: COLORS.subtext }} />
                            <span className="text-[11px]" style={{ color: COLORS.subtext }}>
                              {new Date(w.workoutDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: COLORS.subtext }} />
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
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
              <Icon size={22} style={{ color: active ? COLORS.gold : COLORS.subtext }} />
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

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, Pencil, LogOut, Shield, Home, Dumbbell, User } from "lucide-react";
import { clearTokens } from "../auth/tokenService";
import { getCurrentUser } from "../auth/getCurrentUser";

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

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        console.log("getCurrentUser raw response:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("getCurrentUser failed:", err);
        setError("Couldn't load your profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const fields = [
    { label: "Name", value: user?.username ?? "—" },
    { label: "Email", value: user?.email ?? "—" },
  ];

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/workout-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  const handleLogout = () => {
    clearTokens();
    navigate("/login", { replace: true });
  };

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

      <main className="flex-1 px-5 pt-8 pb-24 flex flex-col items-center">
        {loading && (
          <p className="text-[13px] mb-6" style={{ color: COLORS.subtext }}>
            Loading profile...
          </p>
        )}
        {error && (
          <p className="text-[13px] mb-6" style={{ color: "#C97A6A" }}>
            {error}
          </p>
        )}

        {/* avatar */}
        <div className="relative mb-5">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center border-2 overflow-hidden"
            style={{ borderColor: COLORS.gold, backgroundColor: COLORS.panel }}
          >
            <span
              className="text-3xl"
              style={{
                color: COLORS.gold,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {user?.username?.charAt(0) ?? "?"}
            </span>
          </div>
          <button
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border"
            style={{ backgroundColor: COLORS.gold, borderColor: COLORS.bg }}
            aria-label="Change profile picture"
          >
            <Camera size={14} style={{ color: COLORS.bg }} />
          </button>
        </div>

        <h2
          className="text-xl mb-1 text-center"
          style={{
            color: COLORS.text,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          {user?.username ?? "—"}
        </h2>
        <p
          className="text-[11px] tracking-[0.2em] uppercase mb-8"
          style={{ color: COLORS.subtext }}
        >
          Member
        </p>

        {/* info card */}
        <div
          className="w-full max-w-md border"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
        >
          {fields.map((field, i) => (
            <div
              key={field.label}
              className="flex items-center justify-between px-5 py-4"
              style={{
                borderBottom:
                  i < fields.length - 1 ? `1px solid ${COLORS.hairline}` : "none",
              }}
            >
              <div className="min-w-0">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-1"
                  style={{ color: COLORS.subtext }}
                >
                  {field.label}
                </p>
                <p className="text-[15px] truncate" style={{ color: COLORS.text }}>
                  {field.value}
                </p>
              </div>

              <button aria-label={`Edit ${field.label}`}>
                <Pencil size={15} style={{ color: COLORS.goldDim }} />
              </button>
            </div>
          ))}
        </div>

        {/* admin panel (only visible to admins) */}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin-page")}
            className="w-full max-w-md flex items-center justify-center gap-2 py-3.5 mt-8 border text-[13px] tracking-[0.2em] uppercase transition-colors"
            style={{ borderColor: COLORS.gold, color: COLORS.goldBright }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1C1A16")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Shield size={15} />
            Admin Panel
          </button>
        )}

        {/* logout */}
        <button
          className={`w-full max-w-md flex items-center justify-center gap-2 py-3.5 ${
            isAdmin ? "mt-3" : "mt-8"
          } border text-[13px] tracking-[0.2em] uppercase transition-colors`}
          style={{ borderColor: COLORS.hairline, color: COLORS.subtext }}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.gold;
            e.currentTarget.style.color = COLORS.goldBright;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.hairline;
            e.currentTarget.style.color = COLORS.subtext;
          }}
        >
          <LogOut size={15} />
          Log Out
        </button>
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

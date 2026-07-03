import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, Pencil, Eye, EyeOff, LogOut, Home, Dumbbell, User } from "lucide-react";

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

// mock user — replace with real data from your auth/session
const USER = {
  name: "Petar Guimaraes",
  email: "petar.guimaraes@example.com",
  password: "SuperSecret92!",
};

function maskPassword(password) {
  if (password.length <= 4) return "•".repeat(password.length);
  const visibleStart = password.slice(0, 2);
  const visibleEnd = password.slice(-2);
  return `${visibleStart}${"•".repeat(password.length - 4)}${visibleEnd}`;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const fields = [
    { label: "Name", value: USER.name },
    { label: "Email", value: USER.email },
    {
      label: "Password",
      value: showPassword ? USER.password : maskPassword(USER.password),
      isPassword: true,
    },
  ];

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

      <main className="flex-1 px-5 pt-8 pb-24 flex flex-col items-center">
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
              {USER.name.charAt(0)}
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
          {USER.name}
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
                <p
                  className="text-[15px] truncate"
                  style={{ color: COLORS.text, letterSpacing: field.isPassword ? "0.05em" : "normal" }}
                >
                  {field.value}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                {field.isPassword && (
                  <button
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={16} style={{ color: COLORS.subtext }} />
                    ) : (
                      <Eye size={16} style={{ color: COLORS.subtext }} />
                    )}
                  </button>
                )}
                <button aria-label={`Edit ${field.label}`}>
                  <Pencil size={15} style={{ color: COLORS.goldDim }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* logout */}
        <button
          className="w-full max-w-md flex items-center justify-center gap-2 py-3.5 mt-8 border text-[13px] tracking-[0.2em] uppercase transition-colors"
          style={{ borderColor: COLORS.hairline, color: COLORS.subtext }}
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

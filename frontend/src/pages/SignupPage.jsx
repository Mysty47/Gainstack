import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* ambient corner glow */}
      <div
        className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: COLORS.gold }}
      />
      <div
        className="pointer-events-none fixed -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: COLORS.gold }}
      />

      <div className="relative w-full max-w-md">
        {/* monogram */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-14 h-14 flex items-center justify-center mb-5 border"
            style={{ borderColor: COLORS.gold }}
          >
            <span
              className="text-xl tracking-widest"
              style={{
                color: COLORS.gold,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              G
            </span>
          </div>
          <h1
            className="text-2xl tracking-[0.15em] uppercase"
            style={{
              color: COLORS.text,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            Gainstack
          </h1>
          <p
            className="text-xs tracking-[0.2em] uppercase mt-2"
            style={{ color: COLORS.subtext }}
          >
            Create Your Account
          </p>
        </div>

        {/* card */}
        <div
          className="border px-8 py-10 sm:px-10 sm:py-12"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
        >
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* username */}
            <div>
              <label
                className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{
                  color: focused === "username" ? COLORS.goldBright : COLORS.subtext,
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                placeholder="yourname"
                className="w-full bg-transparent outline-none pb-3 text-[15px]"
                style={{
                  color: COLORS.text,
                  borderBottom: `1px solid ${
                    focused === "username" ? COLORS.gold : COLORS.hairline
                  }`,
                  transition: "border-color 0.3s ease",
                }}
              />
            </div>

            {/* email */}
            <div>
              <label
                className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{
                  color: focused === "email" ? COLORS.goldBright : COLORS.subtext,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none pb-3 text-[15px]"
                style={{
                  color: COLORS.text,
                  borderBottom: `1px solid ${
                    focused === "email" ? COLORS.gold : COLORS.hairline
                  }`,
                  transition: "border-color 0.3s ease",
                }}
              />
            </div>

            {/* password */}
            <div>
              <label
                className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{
                  color: focused === "password" ? COLORS.goldBright : COLORS.subtext,
                }}
              >
                Password
              </label>
              <div
                className="flex items-center pb-3"
                style={{
                  borderBottom: `1px solid ${
                    focused === "password" ? COLORS.gold : COLORS.hairline
                  }`,
                  transition: "border-color 0.3s ease",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-[15px]"
                  style={{ color: COLORS.text }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="ml-3 shrink-0"
                  style={{ color: COLORS.subtext }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* confirm password */}
            <div>
              <label
                className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{
                  color: focused === "confirm" ? COLORS.goldBright : COLORS.subtext,
                }}
              >
                Confirm Password
              </label>
              <div
                className="flex items-center pb-3"
                style={{
                  borderBottom: `1px solid ${
                    focused === "confirm" ? COLORS.gold : COLORS.hairline
                  }`,
                  transition: "border-color 0.3s ease",
                }}
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-[15px]"
                  style={{ color: COLORS.text }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="ml-3 shrink-0"
                  style={{ color: COLORS.subtext }}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 py-3.5 mt-2 text-[13px] tracking-[0.2em] uppercase transition-colors"
              style={{
                backgroundColor: COLORS.gold,
                color: COLORS.bg,
                fontWeight: 600,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.goldBright)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.gold)
              }
            >
              Create Account
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </div>

        <p
          className="text-center text-xs mt-8 tracking-wide"
          style={{ color: COLORS.subtext }}
        >
          Already have an account?{" "}
          <a href="#" style={{ color: COLORS.gold }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

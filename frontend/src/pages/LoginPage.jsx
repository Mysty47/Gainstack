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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        console.log("Login Success");
      } else {
        console.log("Login Failed");
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-10 overflow-x-hidden"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* ambient corner glow */}
      <div
        className="pointer-events-none fixed -top-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20"
        style={{ background: COLORS.gold }}
      />
      <div
        className="pointer-events-none fixed -bottom-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-10"
        style={{ background: COLORS.gold }}
      />

      <div className="relative w-full max-w-md">
        {/* monogram */}
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5 border"
            style={{ borderColor: COLORS.gold }}
          >
            <span
              className="text-lg sm:text-xl tracking-widest"
              style={{
                color: COLORS.gold,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              G
            </span>
          </div>
          <h1
            className="text-xl sm:text-2xl tracking-[0.15em] uppercase text-center"
            style={{
              color: COLORS.text,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            Gainstack
          </h1>
          <p
            className="text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-2 text-center"
            style={{ color: COLORS.subtext }}
          >
            Members Sign In
          </p>
        </div>

        {/* card */}
        <div
          className="border px-6 py-8 sm:px-10 sm:py-12"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
        >
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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

            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs tracking-wide"
                style={{ color: COLORS.subtext }}
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="text-[11px] -mt-2" style={{ color: "#C97A6A" }}>
                {error}
              </p>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-3.5 mt-2 text-[13px] tracking-[0.2em] uppercase transition-colors"
              style={{
                backgroundColor: COLORS.gold,
                color: COLORS.bg,
                fontWeight: 600,
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) =>
                !loading && (e.currentTarget.style.backgroundColor = COLORS.goldBright)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.gold)
              }
            >
              {loading ? "Signing In..." : "Sign In"}
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
          New here?{" "}
          <a href="signup#" style={{ color: COLORS.gold }}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

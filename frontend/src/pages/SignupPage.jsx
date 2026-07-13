import { useState, useMemo } from "react";
import { Eye, EyeOff, ArrowRight, Check, X, AlertCircle } from "lucide-react";
import api from "../config/api";
import {useNavigate} from "react-router-dom";

const COLORS = {
    bg: "#0A0A0B",
    panel: "#141315",
    hairline: "#2B2721",
    gold: "#3f81cc",
    goldBright: "#528bcc",
    goldDim: "#327bcf",
    text: "#F3EFE6",
    subtext: "#8C8578",
    error: "#C97A6A",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordChecks(password) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
}

function getPasswordStrength(checks) {
    const passed = Object.values(checks).filter(Boolean).length;
    if (passed <= 2) return { label: "Weak", value: 1, color: COLORS.error };
    if (passed <= 4) return { label: "Fair", value: 2, color: COLORS.goldDim };
    return { label: "Strong", value: 3, color: COLORS.gold };
}

export default function SignupPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [focused, setFocused] = useState(null);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [signupError, setSignupError] = useState("");

    const emailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
    const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);
    const passwordStrength = useMemo(
        () => getPasswordStrength(passwordChecks),
        [passwordChecks]
    );
    const passwordValid = Object.values(passwordChecks).every(Boolean);
    const confirmValid = confirmPassword.length > 0 && confirmPassword === password;

    const showEmailError = (touched.email || submitted) && email.length > 0 && !emailValid;
    const showConfirmError =
        (touched.confirm || submitted) && confirmPassword.length > 0 && !confirmValid;

    const formValid =
        username.trim().length > 0 && emailValid && passwordValid && confirmValid;

    const handleBlur = (field) => {
        setFocused(null);
        setTouched((t) => ({ ...t, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setSignupError("");

        if (!formValid) return;

        setSubmitting(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                }
            );

            if (response.ok) {
                console.log("Signup Success");
                navigate("/login");
            } else {
                const error = await response.text();
                setSignupError(error || "Signup failed.");
            }
        } catch (err) {
            console.error(err);
            setSignupError("Could not connect to the server.");
        } finally {
            setSubmitting(false);
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
                            Create Your Account
                        </p>
                    </div>

                    {/* card */}
                    <div
                        className="border px-6 py-8 sm:px-10 sm:py-12"
                        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
                    >
                        <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                            {/* signup error banner */}
                            {signupError && (
                                <div
                                    className="flex items-start gap-2 px-3 py-2.5 border"
                                    style={{ borderColor: COLORS.error, backgroundColor: "rgba(201,122,106,0.08)" }}
                                >
                                    <AlertCircle size={14} style={{ color: COLORS.error, marginTop: 2 }} />
                                    <p className="text-[12px]" style={{ color: COLORS.error }}>
                                        {signupError}
                                    </p>
                                </div>
                            )}

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
                                    onBlur={() => handleBlur("username")}
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
                                        color: showEmailError
                                            ? COLORS.error
                                            : focused === "email"
                                                ? COLORS.goldBright
                                                : COLORS.subtext,
                                    }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => handleBlur("email")}
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent outline-none pb-3 text-[15px]"
                                    style={{
                                        color: COLORS.text,
                                        borderBottom: `1px solid ${
                                            showEmailError
                                                ? COLORS.error
                                                : focused === "email"
                                                    ? COLORS.gold
                                                    : COLORS.hairline
                                        }`,
                                        transition: "border-color 0.3s ease",
                                    }}
                                />
                                {showEmailError && (
                                    <p className="text-[11px] mt-2" style={{ color: COLORS.error }}>
                                        Enter a valid email address (e.g. you@example.com)
                                    </p>
                                )}
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
                                        onBlur={() => handleBlur("password")}
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

                                {/* strength meter */}
                                {password.length > 0 && (
                                    <div className="mt-3">
                                        <div className="flex gap-1.5 mb-2">
                                            {[1, 2, 3].map((seg) => (
                                                <div
                                                    key={seg}
                                                    className="h-1 flex-1 rounded-full transition-colors"
                                                    style={{
                                                        backgroundColor:
                                                            passwordStrength.value >= seg
                                                                ? passwordStrength.color
                                                                : COLORS.hairline,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <p
                                            className="text-[11px] mb-2"
                                            style={{ color: passwordStrength.color }}
                                        >
                                            {passwordStrength.label} password
                                        </p>
                                        <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                                            {[
                                                ["length", "8+ characters"],
                                                ["uppercase", "Uppercase letter"],
                                                ["lowercase", "Lowercase letter"],
                                                ["number", "Number"],
                                                ["special", "Special character"],
                                            ].map(([key, label]) => (
                                                <li
                                                    key={key}
                                                    className="flex items-center gap-1.5 text-[11px]"
                                                    style={{
                                                        color: COLORS.subtext,
                                                        opacity: passwordChecks[key] ? 1 : 0.5,
                                                    }}
                                                >
                                                    {passwordChecks[key] ? (
                                                        <Check size={11} style={{ color: COLORS.gold }} />
                                                    ) : (
                                                        <X size={11} />
                                                    )}
                                                    {label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* confirm password */}
                            <div>
                                <label
                                    className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                                    style={{
                                        color: showConfirmError
                                            ? COLORS.error
                                            : focused === "confirm"
                                                ? COLORS.goldBright
                                                : COLORS.subtext,
                                    }}
                                >
                                    Confirm Password
                                </label>
                                <div
                                    className="flex items-center pb-3"
                                    style={{
                                        borderBottom: `1px solid ${
                                            showConfirmError
                                                ? COLORS.error
                                                : focused === "confirm"
                                                    ? COLORS.gold
                                                    : COLORS.hairline
                                        }`,
                                        transition: "border-color 0.3s ease",
                                    }}
                                >
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setFocused("confirm")}
                                        onBlur={() => handleBlur("confirm")}
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
                                {showConfirmError && (
                                    <p className="text-[11px] mt-2" style={{ color: COLORS.error }}>
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            {/* submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="group w-full flex items-center justify-center gap-2 py-3.5 mt-2 text-[13px] tracking-[0.2em] uppercase transition-colors"
                                style={{
                                    backgroundColor: formValid ? COLORS.gold : COLORS.goldDim,
                                    color: COLORS.bg,
                                    fontWeight: 600,
                                    opacity: submitting ? 0.7 : formValid ? 1 : 0.7,
                                }}
                                onMouseEnter={(e) => {
                                    if (formValid && !submitting)
                                        e.currentTarget.style.backgroundColor = COLORS.goldBright;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = formValid
                                        ? COLORS.gold
                                        : COLORS.goldDim;
                                }}
                            >
                                {submitting ? "Creating Account…" : "Create Account"}
                                {!submitting && (
                                    <ArrowRight
                                        size={14}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                )}
                            </button>
                        </form>
                    </div>

                    <p
                        className="text-center text-xs mt-8 tracking-wide"
                        style={{ color: COLORS.subtext }}
                    >
                        Already have an account?{" "}
                        <a href="/login" style={{ color: COLORS.gold }}>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        );
    }
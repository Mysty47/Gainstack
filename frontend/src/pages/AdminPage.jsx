import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Trash2, Home, Dumbbell, User } from "lucide-react";

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

const ROLES = ["USER", "ADMIN"];

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to load users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Couldn't load users. Are you signed in as an admin?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, newRole) => {
    setSavingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error("Failed to update role");
      const updated = await response.json();
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      console.error(err);
      setError("Couldn't update that user's role.");
    } finally {
      setSavingId(null);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      setError("Couldn't delete that user.");
    }
  };

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/workout-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-center gap-2 py-4 border-b"
        style={{ backgroundColor: COLORS.bg, borderColor: COLORS.hairline }}
      >
        <Shield size={18} style={{ color: COLORS.gold }} />
        <h1
          className="text-lg tracking-[0.2em] uppercase"
          style={{ color: COLORS.gold, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Admin
        </h1>
      </header>

      <main className="flex-1 px-5 pt-6 pb-28">
        <p
          className="text-[11px] tracking-[0.2em] uppercase mb-5"
          style={{ color: COLORS.subtext }}
        >
          Manage Users
        </p>

        {error && (
          <p className="text-[13px] mb-4" style={{ color: COLORS.error }}>
            {error}
          </p>
        )}

        {loading && (
          <p className="text-[13px]" style={{ color: COLORS.subtext }}>
            Loading users...
          </p>
        )}

        {!loading && users.length === 0 && !error && (
          <p className="text-[13px]" style={{ color: COLORS.subtext }}>
            No users found.
          </p>
        )}

        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="border px-4 py-4"
              style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="text-[14px] truncate" style={{ color: COLORS.text }}>
                    {u.username}
                  </p>
                  <p className="text-[12px] truncate" style={{ color: COLORS.subtext }}>
                    {u.email}
                  </p>
                </div>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="shrink-0 ml-3"
                  aria-label="Delete user"
                >
                  <Trash2 size={16} style={{ color: COLORS.subtext }} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] tracking-[0.15em] uppercase"
                  style={{ color: COLORS.subtext }}
                >
                  Role
                </span>
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  disabled={savingId === u.id}
                  className="bg-transparent outline-none text-[13px] border-b py-0.5"
                  style={{
                    color: u.role === "ADMIN" ? COLORS.goldBright : COLORS.text,
                    borderColor: COLORS.hairline,
                    opacity: savingId === u.id ? 0.5 : 1,
                  }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} style={{ backgroundColor: COLORS.panel }}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
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

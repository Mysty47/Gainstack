import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, History, Home, Dumbbell, User, X } from "lucide-react";

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

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// mock workout sessions keyed by "YYYY-M-D"
const WORKOUT_NOTES = {
  "2026-6-3": { title: "Full Body 1", description: "Warm up, Squat (Barbell), Incline Bench Press, Lat Pulldown." },
  "2026-6-8": { title: "Push Day", description: "Bench Press, Overhead Press, Tricep Pushdowns. New PR on bench." },
  "2026-6-12": { title: "Leg Day", description: "Squats, Romanian Deadlift, Leg Press, Calf Raises." },
  "2026-6-17": { title: "Pull Day", description: "Deadlift, Bent Over Row, Bicep Curls, Lat Pulldown." },
  "2026-6-24": { title: "Full Body 2", description: "Shoulder Press, Hip Thrust, Leg Extension." },
};

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function ExercisesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [notes, setNotes] = useState(WORKOUT_NOTES);
  const [selectedKey, setSelectedKey] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [createdWorkouts, setCreatedWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [workoutsError, setWorkoutsError] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/workouts");
        if (!response.ok) throw new Error("Failed to fetch workouts");
        const data = await response.json();
        setCreatedWorkouts(data);
      } catch (err) {
        console.error(err);
        setWorkoutsError("Couldn't load created workouts.");
      } finally {
        setLoadingWorkouts(false);
      }
    };
    fetchWorkouts();
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const changeMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const key = `${year}-${month}-${day}`;
    const existing = notes[key];
    setSelectedKey(key);
    setDraftTitle(existing?.title || "");
    setDraftDescription(existing?.description || "");
  };

  const closeModal = () => setSelectedKey(null);

  const saveNote = () => {
    if (!draftTitle.trim() && !draftDescription.trim()) return;
    setNotes((prev) => ({
      ...prev,
      [selectedKey]: { title: draftTitle.trim(), description: draftDescription.trim() },
    }));
    closeModal();
  };

  const deleteNote = () => {
    setNotes((prev) => {
      const next = { ...prev };
      delete next[selectedKey];
      return next;
    });
    closeModal();
  };

  const selectedInfo = useMemo(() => {
    if (!selectedKey) return null;
    const [y, m, d] = selectedKey.split("-").map(Number);
    const dateObj = new Date(y, m, d);
    return {
      day: d,
      weekday: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [selectedKey]);

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/exercises-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col relative"
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

      <main className="flex-1 px-5 pt-6 pb-24">
        {/* action buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate("/workout-creation-page")}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-6 border transition-colors"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.gold }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1C1A16")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.panel)}
          >
            <Plus size={22} style={{ color: COLORS.gold }} />
            <span
              className="text-xs tracking-[0.15em] uppercase text-center"
              style={{ color: COLORS.text }}
            >
              Create New
              <br />
              Workout
            </span>
          </button>

          <button
            className="flex-1 flex flex-col items-center justify-center gap-2 py-6 border transition-colors"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.hairline)}
          >
            <History size={22} style={{ color: COLORS.goldBright }} />
            <span
              className="text-xs tracking-[0.15em] uppercase text-center"
              style={{ color: COLORS.text }}
            >
              Previous
              <br />
              Workouts
            </span>
          </button>
        </div>

        {/* calendar */}
        <div
          className="border px-3 py-4 mx-auto w-full max-w-[500px]"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
        >
          {/* month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => changeMonth(-1)}
              className="text-xs px-2 py-1"
              style={{ color: COLORS.subtext }}
            >
              ‹
            </button>
            <p
              className="text-[11px] tracking-[0.15em] uppercase"
              style={{
                color: COLORS.goldBright,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {MONTH_NAMES[month]} {year}
            </p>
            <button
              onClick={() => changeMonth(1)}
              className="text-xs px-2 py-1"
              style={{ color: COLORS.subtext }}
            >
              ›
            </button>
          </div>

          {/* weekday labels */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div
                key={i}
                className="text-center text-[9px] tracking-widest uppercase"
                style={{ color: COLORS.subtext }}
              >
                {w}
              </div>
            ))}
          </div>

          {/* day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              const key = day ? `${year}-${month}-${day}` : null;
              const hasWorkout = key && notes[key];
              return (
                <button
                  key={i}
                  onClick={() => handleDayClick(day)}
                  disabled={!day}
                  className="aspect-square flex flex-col items-center justify-center relative"
                >
                  {day && (
                    <>
                      <span
                        className="w-6 h-6 flex items-center justify-center text-[12px] rounded-full"
                        style={{
                          color: isToday(day) ? COLORS.bg : COLORS.text,
                          backgroundColor: isToday(day) ? COLORS.gold : "transparent",
                        }}
                      >
                        {day}
                      </span>
                      {hasWorkout && (
                        <span
                          className="w-[3px] h-[3px] rounded-full mt-0.5"
                          style={{
                            backgroundColor: isToday(day) ? COLORS.gold : COLORS.goldBright,
                          }}
                        />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* created workouts */}
        <div className="mt-8">
          <p
            className="text-[11px] tracking-[0.2em] uppercase mb-4"
            style={{ color: COLORS.subtext }}
          >
            Created Workouts
          </p>

          {loadingWorkouts && (
            <p className="text-[13px]" style={{ color: COLORS.subtext }}>
              Loading...
            </p>
          )}

          {workoutsError && (
            <p className="text-[13px]" style={{ color: "#C97A6A" }}>
              {workoutsError}
            </p>
          )}

          {!loadingWorkouts && !workoutsError && createdWorkouts.length === 0 && (
            <p className="text-[13px]" style={{ color: COLORS.subtext }}>
              No workouts created yet.
            </p>
          )}

          <div className="space-y-3">
            {createdWorkouts.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between border px-4 py-3"
                style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
              >
                <p className="text-[14px]" style={{ color: COLORS.text }}>
                  {w.title}
                </p>
                <p className="text-[12px]" style={{ color: COLORS.subtext }}>
                  {new Date(w.workoutDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* note popover */}
      {selectedKey && selectedInfo && (
        <div
          className="fixed inset-0 z-30 flex items-end sm:items-center justify-center px-4 pb-24 sm:pb-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm border px-6 py-6"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.gold }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="text-base"
                  style={{
                    color: COLORS.goldBright,
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {selectedInfo.weekday}
                </p>
                <p className="text-xs mt-1" style={{ color: COLORS.subtext }}>
                  {selectedInfo.fullDate}
                </p>
              </div>
              <button onClick={closeModal} aria-label="Close">
                <X size={18} style={{ color: COLORS.subtext }} />
              </button>
            </div>

            <div className="pt-4 border-t space-y-4" style={{ borderColor: COLORS.hairline }}>
              <div>
                <label
                  className="block text-[11px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: COLORS.subtext }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g. Push Day"
                  className="w-full bg-transparent outline-none pb-2 text-[14px]"
                  style={{
                    color: COLORS.text,
                    borderBottom: `1px solid ${COLORS.hairline}`,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-[11px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: COLORS.subtext }}
                >
                  Note
                </label>
                <textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder="What did you train?"
                  rows={3}
                  className="w-full bg-transparent outline-none pb-2 text-[14px] resize-none"
                  style={{
                    color: COLORS.text,
                    borderBottom: `1px solid ${COLORS.hairline}`,
                  }}
                />
              </div>

              <div className="flex gap-3 pt-1">
                {notes[selectedKey] && (
                  <button
                    onClick={deleteNote}
                    className="flex-1 py-2.5 text-[12px] tracking-[0.15em] uppercase border"
                    style={{ color: COLORS.subtext, borderColor: COLORS.hairline }}
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={saveNote}
                  className="flex-1 py-2.5 text-[12px] tracking-[0.15em] uppercase"
                  style={{ backgroundColor: COLORS.gold, color: COLORS.bg, fontWeight: 600 }}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t z-20"
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

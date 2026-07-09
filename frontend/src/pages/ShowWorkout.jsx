import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  Calendar,
  Dumbbell,
  Trash2,
  Pencil,
  Home,
  User,
  Layers,
  Hash,
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

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ShowWorkoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutId } = useParams();

  const [workout, setWorkout] = useState(location.state?.workout || null);
  const [loading, setLoading] = useState(!location.state?.workout);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (workout) return;

    let cancelled = false;

    const fetchWorkout = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/workouts/${workoutId}`);
        if (!cancelled) setWorkout(response.data);
      } catch (err) {
        console.error("Failed to load workout:", err);
        if (!cancelled) setError("Couldn't load this workout.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (workoutId) fetchWorkout();
    else {
      setLoading(false);
      setError("No workout specified.");
    }

    return () => {
      cancelled = true;
    };
  }, [workoutId, workout]);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/workouts/${workoutId || workout.id}`);
      navigate("/homepage");
    } catch (err) {
      console.error("Failed to delete workout:", err);
      setError("Couldn't delete this workout.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/workout-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  const exercises = workout?.exercises || [];
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0);
  const totalVolume = exercises.reduce(
    (sum, ex) =>
      sum +
      (ex.sets?.reduce(
        (s, set) => s + (Number(set.reps) || 0) * (Number(set.weight) || 0),
        0
      ) || 0),
    0
  );

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
          Workout
        </h1>
      </header>

      <main className="flex-1 px-5 pt-6 pb-28">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Dumbbell size={22} style={{ color: COLORS.subtext }} className="animate-pulse" />
            <p className="text-[13px] tracking-[0.1em] uppercase" style={{ color: COLORS.subtext }}>
              Loading workout…
            </p>
          </div>
        )}

        {!loading && error && !workout && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-[14px]" style={{ color: COLORS.text }}>
              {error}
            </p>
            <button
              onClick={() => navigate("/homepage")}
              className="px-5 py-2.5 text-[12px] tracking-[0.15em] uppercase border"
              style={{ color: COLORS.subtext, borderColor: COLORS.hairline }}
            >
              Back to Home
            </button>
          </div>
        )}

        {!loading && workout && (
          <>
            {/* title + date */}
            <div className="mb-6">
              <h2
                className="text-2xl mb-2"
                style={{ color: COLORS.text, fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {workout.title}
              </h2>
              <div className="flex items-center gap-2">
                <Calendar size={14} style={{ color: COLORS.subtext }} />
                <span className="text-[12px] tracking-[0.05em]" style={{ color: COLORS.subtext }}>
                  {formatDate(workout.workoutDate)}
                </span>
              </div>
            </div>

            {/* summary stats */}
            <div
              className="grid grid-cols-3 border mb-8"
              style={{ borderColor: COLORS.hairline, backgroundColor: COLORS.panel }}
            >
              {[
                { label: "Exercises", value: exercises.length, icon: Dumbbell },
                { label: "Sets", value: totalSets, icon: Layers },
                { label: "Volume (kg)", value: totalVolume.toLocaleString(), icon: Hash },
              ].map(({ label, value, icon: Icon }, i) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-4 gap-1"
                  style={{
                    borderLeft: i !== 0 ? `1px solid ${COLORS.hairline}` : "none",
                  }}
                >
                  <Icon size={14} style={{ color: COLORS.gold }} />
                  <span
                    className="text-[17px]"
                    style={{ color: COLORS.text, fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-[9px] tracking-[0.15em] uppercase"
                    style={{ color: COLORS.subtext }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* exercises list */}
            {exercises.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[13px]" style={{ color: COLORS.subtext }}>
                  No exercises logged for this workout.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {exercises.map((ex, exIndex) => {
                  const bestSet = ex.sets?.reduce(
                    (best, s) =>
                      Number(s.weight) > Number(best?.weight || 0) ? s : best,
                    null
                  );
                  return (
                    <div
                      key={ex.exerciseId ?? ex.id ?? exIndex}
                      className="border px-4 py-4"
                      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[15px]" style={{ color: COLORS.text }}>
                            {ex.name || ex.exerciseName || `Exercise ${exIndex + 1}`}
                          </p>
                          {(ex.muscleGroup || ex.equipment) && (
                            <p className="text-[11px]" style={{ color: COLORS.subtext }}>
                              {[ex.muscleGroup, ex.equipment].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        {bestSet && (
                          <span
                            className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 border"
                            style={{ color: COLORS.goldBright, borderColor: COLORS.hairline }}
                          >
                            Top {bestSet.weight}kg
                          </span>
                        )}
                      </div>

                      {/* set headers */}
                      <div className="grid grid-cols-[auto_1fr_1fr] gap-3 items-center mb-2 px-1">
                        <span className="text-[10px] uppercase w-5" style={{ color: COLORS.subtext }}>
                          Set
                        </span>
                        <span className="text-[10px] uppercase" style={{ color: COLORS.subtext }}>
                          Reps
                        </span>
                        <span className="text-[10px] uppercase" style={{ color: COLORS.subtext }}>
                          Weight (kg)
                        </span>
                      </div>

                      {ex.sets?.map((set, setIndex) => (
                        <div
                          key={set.id ?? setIndex}
                          className="grid grid-cols-[auto_1fr_1fr] gap-3 items-center py-1.5 border-t"
                          style={{ borderColor: COLORS.hairline }}
                        >
                          <span
                            className="text-[13px] w-5 text-center"
                            style={{ color: COLORS.subtext }}
                          >
                            {setIndex + 1}
                          </span>
                          <span className="text-[14px]" style={{ color: COLORS.text }}>
                            {set.reps}
                          </span>
                          <span className="text-[14px]" style={{ color: COLORS.text }}>
                            {set.weight}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() =>
                  navigate(`/edit-workout/${workoutId || workout.id}`, { state: { workout } })
                }
                className="flex-1 py-3.5 flex items-center justify-center gap-2 text-[13px] tracking-[0.2em] uppercase border"
                style={{ color: COLORS.text, borderColor: COLORS.hairline }}
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3.5 flex items-center justify-center gap-2 text-[13px] tracking-[0.2em] uppercase border transition-colors"
                style={{
                  color: confirmDelete ? COLORS.bg : "#D9756C",
                  backgroundColor: confirmDelete ? "#D9756C" : "transparent",
                  borderColor: confirmDelete ? "#D9756C" : COLORS.hairline,
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                <Trash2 size={14} />
                {deleting ? "Deleting…" : confirmDelete ? "Confirm Delete" : "Delete"}
              </button>
            </div>
            {error && workout && (
              <p className="text-[12px] mt-3 text-center" style={{ color: "#D9756C" }}>
                {error}
              </p>
            )}
          </>
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

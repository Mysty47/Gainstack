import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import {
  Search,
  Plus,
  X,
  Trash2,
  Home,
  Dumbbell,
  User,
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

const MUSCLE_GROUPS = [
  "Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Core", "Glutes", "Full Body",
];

const EQUIPMENT_OPTIONS = [
  "Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Kettlebell", "Bands",
];

function makeEmptySet() {
  return { id: Date.now() + Math.random(), reps: "", weight: "" };
}

export default function CreateWorkoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [library, setLibrary] = useState([]);
  const [title, setTitle] = useState("");

  const [showResults, setShowResults] = useState(false);

  const [workoutDate, setWorkoutDate] = useState(
      new Date().toISOString().split("T")[0]
  );
  const [query, setQuery] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMuscleGroup, setNewMuscleGroup] = useState(MUSCLE_GROUPS[0]);
  const [newEquipment, setNewEquipment] = useState(EQUIPMENT_OPTIONS[0]);
  const [filterMuscleGroup, setFilterMuscleGroup] = useState("All");
  const [filterEquipment, setFilterEquipment] = useState("All");

  const results = useMemo(() => {
    return library.filter((exercise) => {
      const matchesName = exercise.name
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesMuscle =
          filterMuscleGroup === "All" ||
          exercise.muscleGroup === filterMuscleGroup;

      const matchesEquipment =
          filterEquipment === "All" ||
          exercise.equipment === filterEquipment;

      return matchesName && matchesMuscle && matchesEquipment;
    });
  }, [library, query, filterMuscleGroup, filterEquipment]);

  useEffect(() => {
    if (!showResults) return;

    const fetchExercises = async () => {
      try {
        const response = await api.get("/api/exercises");
        setLibrary(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExercises();
  }, [showResults]);

  const addExerciseToWorkout = (exercise) => {
    console.log("Clicked:", exercise);
    setWorkoutExercises((prev) => [
      ...prev,
      { ...exercise, sets: [makeEmptySet()] },
    ]);

    setQuery("");
    setShowResults(false);
  };

  const removeExercise = (index) => {
    setWorkoutExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addSet = (exIndex) => {
    setWorkoutExercises((prev) =>
      prev.map((ex, i) =>
        i === exIndex ? { ...ex, sets: [...ex.sets, makeEmptySet()] } : ex
      )
    );
  };

  const removeSet = (exIndex, setId) => {
    setWorkoutExercises((prev) =>
      prev.map((ex, i) =>
        i === exIndex ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) } : ex
      )
    );
  };

  const updateSet = (exIndex, setId, field, value) => {
    setWorkoutExercises((prev) =>
      prev.map((ex, i) =>
        i === exIndex
          ? {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
            }
          : ex
      )
    );
  };

  const createNewExercise = async () => {
    if (!newName.trim()) return;

    try {
      const response = await api.post("/api/exercises", {
        name: newName.trim(),
        muscleGroup: newMuscleGroup,
        equipment: newEquipment,
      });

      const createdExercise = response.data;

      addExerciseToWorkout(createdExercise);

      setNewName("");
      setNewMuscleGroup(MUSCLE_GROUPS[0]);
      setNewEquipment(EQUIPMENT_OPTIONS[0]);
      setShowNewExercise(false);

    } catch (error) {
      console.error("Exercise creation failed:", error);
    }
  };

  const handleSaveWorkout = async () => {

    const payload = {
      title,
      workoutDate,
      exercises: workoutExercises.map((ex) => ({
        exerciseId: ex.id,
        sets: ex.sets.map((s) => ({
          reps: Number(s.reps),
          weight: Number(s.weight),
        })),
      })),
    };


    try {

      const response = await api.post(
          "/workouts",
          payload
      );


      console.log(
          "Workout saved:",
          response.data
      );


      navigate("/homepage");


    } catch(error) {

      console.error(
          "Workout creation failed:",
          error
      );

    }
  };

  const canSave = title.trim().length > 0 && workoutExercises.length > 0;

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/homepage" },
    { key: "exercises", icon: Dumbbell, label: "Exercises", path: "/workout-page" },
    { key: "profile", icon: User, label: "Profile", path: "/profile-page" },
  ];

  return (
      <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
        {/* header */}
        <header
            className="sticky top-0 z-10 flex items-center justify-center py-4 border-b"
            style={{ backgroundColor: COLORS.bg, borderColor: COLORS.hairline }}
        >
          <h1
              className="text-lg tracking-[0.2em] uppercase"
              style={{ color: COLORS.gold, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            New Workout
          </h1>
        </header>

        <main className="flex-1 px-5 pt-6 pb-28">

          {/* title */}
          <div className="mb-6">
            <label
                className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{ color: COLORS.subtext }}
            >
              Workout Title
            </label>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Push Day"
                className="w-full bg-transparent outline-none pb-3 text-[15px]"
                style={{
                  color: COLORS.text,
                  borderBottom: `1px solid ${COLORS.hairline}`
                }}
            />
          </div>


          {/* workout date */}
          <div className="mb-6">
            <label
                className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{ color: COLORS.subtext }}
            >
              Workout Date
            </label>

        {/* search bar */}
        <div
          className="relative"
          style={{
            marginBottom: results.length > 0 ? `${results.length * 52 + 16}px` : "8px",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <label
              className="text-[11px] tracking-[0.2em] uppercase"
              style={{ color: COLORS.subtext }}
            >
            </label>
            <select
              value={filterMuscleGroup}
              onChange={(e) => setFilterMuscleGroup(e.target.value)}
              className="bg-transparent outline-none text-[11px] border-b py-0.5"
              style={{ color: COLORS.subtext, borderColor: COLORS.hairline }}
            >
              <option value="All" style={{ backgroundColor: COLORS.panel }}>
                All Muscles
              </option>
              {MUSCLE_GROUPS.map((mg) => (
                <option key={mg} value={mg} style={{ backgroundColor: COLORS.panel }}>
                  {mg}
                </option>
              ))}
            </select>

            <select
              value={filterEquipment}
              onChange={(e) => setFilterEquipment(e.target.value)}
              className="bg-transparent outline-none text-[11px] border-b py-0.5"
              style={{ color: COLORS.subtext, borderColor: COLORS.hairline }}
            >
              <option value="All" style={{ backgroundColor: COLORS.panel }}>
                All Equipment
              </option>
              {EQUIPMENT_OPTIONS.map((eq) => (
                <option key={eq} value={eq} style={{ backgroundColor: COLORS.panel }}>
                  {eq}
                </option>
              ))}
            </select>
          </div>
          <div
            className="flex items-center gap-2 px-3 border"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
          >
            <Search size={16} style={{ color: COLORS.subtext }} />
            <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="w-full bg-transparent outline-none pb-3 text-[15px]"
                style={{
                  color: COLORS.text,
                  borderBottom: `1px solid ${COLORS.hairline}`
                }}
            />
          </div>


          {/* search bar */}
          <div className="mb-2 relative">
            <label
                className="block text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{ color: COLORS.subtext }}
            >
              Add Exercise
            </label>

            <div
                className="flex items-center gap-2 px-3 border"
                style={{
                  backgroundColor: COLORS.panel,
                  borderColor: COLORS.hairline
                }}
            >
              <Search size={16} style={{ color: COLORS.subtext }} />

              <input
                  type="text"
                  value={query}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => {
                    setTimeout(() => setShowResults(false), 250);
                  }}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full bg-transparent outline-none py-2.5 text-[14px]"
                  style={{ color: COLORS.text }}
              />
            </div>

            {/* search results dropdown */}
            {showResults && results.length > 0 && (
                <div
                    className="absolute left-0 right-0 z-10 border border-t-0"
                    style={{
                      backgroundColor: COLORS.panel,
                      borderColor: COLORS.hairline
                    }}
                >
                  {results.map((ex) => (
                      <button
                          key={ex.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => addExerciseToWorkout(ex)}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-left border-b last:border-b-0"
                          style={{ borderColor: COLORS.hairline }}
                      >
                <span className="text-[14px]" style={{ color: COLORS.text }}>
                  {ex.name}
                </span>

                        <span className="text-[11px]" style={{ color: COLORS.subtext }}>
                  {ex.muscleGroup} · {ex.equipment}
                </span>
                      </button>
                  ))}
                </div>
            )}
          </div>

          {/* rest of your page stays exactly the same */}

        {/* new exercise trigger */}
        <button
          onClick={() => setShowNewExercise(true)}
          className="flex items-center gap-2 mt-3 mb-8 text-[12px] tracking-[0.1em] uppercase"
          style={{ color: COLORS.goldBright }}
        >
          <Plus size={14} />
          Make New Exercise
        </button>

        {/* workout exercises list */}
        <div className="space-y-5">
          {workoutExercises.map((ex, exIndex) => (
            <div
              key={ex.id + exIndex}
              className="border px-4 py-4"
              style={{ backgroundColor: COLORS.panel, borderColor: COLORS.hairline }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[15px]" style={{ color: COLORS.text }}>
                    {ex.name}
                  </p>
                  <p className="text-[11px]" style={{ color: COLORS.subtext }}>
                    {ex.muscleGroup} · {ex.equipment}
                  </p>
                </div>
                <button onClick={() => removeExercise(exIndex)} aria-label="Remove exercise">
                  <Trash2 size={16} style={{ color: COLORS.subtext }} />
                </button>
              </div>

              {/* set headers */}
              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center mb-2 px-1">
                <span className="text-[10px] uppercase w-5" style={{ color: COLORS.subtext }}>
                  Set
                </span>
                <span className="text-[10px] uppercase" style={{ color: COLORS.subtext }}>
                  Reps
                </span>
                <span className="text-[10px] uppercase" style={{ color: COLORS.subtext }}>
                  Weight (kg)
                </span>
                <span className="w-4" />
              </div>

              {ex.sets.map((set, setIndex) => (
                <div
                  key={set.id}
                  className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center mb-2"
                >
                  <span
                    className="text-[13px] w-5 text-center"
                    style={{ color: COLORS.subtext }}
                  >
                    {setIndex + 1}
                  </span>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(exIndex, set.id, "reps", e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent outline-none py-1.5 px-2 text-[14px] border"
                    style={{ color: COLORS.text, borderColor: COLORS.hairline }}
                  />
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(exIndex, set.id, "weight", e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent outline-none py-1.5 px-2 text-[14px] border"
                    style={{ color: COLORS.text, borderColor: COLORS.hairline }}
                  />
                  <button
                    onClick={() => removeSet(exIndex, set.id)}
                    className="w-4"
                    aria-label="Remove set"
                  >
                    <X size={14} style={{ color: COLORS.subtext }} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addSet(exIndex)}
                className="mt-2 text-[11px] tracking-[0.1em] uppercase"
                style={{ color: COLORS.gold }}
              >
                + Add Set
              </button>
            </div>
          ))}
        </div>

        {/* save / cancel buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate("/workout-page")}
            className="flex-1 py-3.5 text-[13px] tracking-[0.2em] uppercase border"
            style={{ color: COLORS.subtext, borderColor: COLORS.hairline }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveWorkout}
            disabled={!canSave}
            className="flex-1 py-3.5 text-[13px] tracking-[0.2em] uppercase transition-colors"
            style={{
              backgroundColor: canSave ? COLORS.gold : COLORS.goldDim,
              color: COLORS.bg,
              fontWeight: 600,
              opacity: canSave ? 1 : 0.6,
            }}
          >
            Save Workout
          </button>
        </div>
        </div>
          </div>
      </main>

      {/* new exercise modal */}
      {showNewExercise && (
        <div
          className="fixed inset-0 z-30 flex items-end sm:items-center justify-center px-4 pb-24 sm:pb-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowNewExercise(false)}
        >
          <div
            className="w-full max-w-sm border px-6 py-6"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.gold }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p
                className="text-base"
                style={{ color: COLORS.goldBright, fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                New Exercise
              </p>
              <button onClick={() => setShowNewExercise(false)} aria-label="Close">
                <X size={18} style={{ color: COLORS.subtext }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-[11px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: COLORS.subtext }}
                >
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Cable Fly"
                  className="w-full bg-transparent outline-none pb-2 text-[14px]"
                  style={{ color: COLORS.text, borderBottom: `1px solid ${COLORS.hairline}` }}
                />
              </div>

              <div>
                <label
                  className="block text-[11px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: COLORS.subtext }}
                >
                  Muscle Group
                </label>
                <select
                  value={newMuscleGroup}
                  onChange={(e) => setNewMuscleGroup(e.target.value)}
                  className="w-full bg-transparent outline-none pb-2 text-[14px]"
                  style={{ color: COLORS.text, borderBottom: `1px solid ${COLORS.hairline}` }}
                >
                  {MUSCLE_GROUPS.map((mg) => (
                    <option key={mg} value={mg} style={{ backgroundColor: COLORS.panel }}>
                      {mg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-[11px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: COLORS.subtext }}
                >
                  Equipment
                </label>
                <select
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  className="w-full bg-transparent outline-none pb-2 text-[14px]"
                  style={{ color: COLORS.text, borderBottom: `1px solid ${COLORS.hairline}` }}
                >
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <option key={eq} value={eq} style={{ backgroundColor: COLORS.panel }}>
                      {eq}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={createNewExercise}
                className="w-full py-3 mt-2 text-[12px] tracking-[0.15em] uppercase"
                style={{ backgroundColor: COLORS.gold, color: COLORS.bg, fontWeight: 600 }}
              >
                Create & Add
              </button>
            </div>
          </div>
        </div>
      )}

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
              <span className="text-[10px] tracking-wide" style={{ color: active ? COLORS.gold : COLORS.subtext }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

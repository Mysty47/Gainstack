import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import api from "../api/axios.js";

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

const MAX_CAPTION_LENGTH = 250;

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get("/workouts");

        setWorkouts(response.data);

      } catch (err) {
        console.error("Failed to load workouts:", err);
      }
    };

    fetchWorkouts();
  }, []);

  // create/revoke the object URL only when the photo actually changes,
  // instead of re-creating it (and leaking memory) on every render
  useEffect(() => {
    if (!photo) {
      setPhotoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handlePhoto = (e) => {
    if (e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const remainingChars = MAX_CAPTION_LENGTH - description.length;
  const nearLimit = remainingChars <= 20;

  const handlePost = async () => {

    let photoUrl = null;

    if(photo){
      const data = new FormData();
      data.append("file", photo);

      const upload = await api.post(
          "/posts/upload",
          data
      );

      photoUrl = upload.data.url;
    }


    await api.post("/posts", {
      caption: description,
      workoutId: Number(selectedWorkout),
      photoUrl
    });


    navigate("/homepage");
  };

  return (
    <div
      className="min-h-screen px-5 py-6"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="max-w-lg mx-auto">
        {/* Cancel */}
        <button
          onClick={() => navigate("/homepage")}
          className="flex items-center gap-2 mb-8 transition-colors"
          style={{ color: COLORS.subtext }}
          onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.gold)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = COLORS.subtext)
          }
        >
          <ArrowLeft size={18} />

          <span className="uppercase tracking-[0.15em] text-xs">
            Cancel
          </span>
        </button>

        {/* Title */}
        <h1
          className="text-2xl text-center mb-8"
          style={{
            color: COLORS.gold,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Create Post
        </h1>

        {/* Caption */}
        <div
          className="border p-5 mb-5"
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.hairline,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <label
              className="uppercase text-xs tracking-[0.2em]"
              style={{ color: COLORS.subtext }}
            >
              Caption
            </label>
            <span
              className="text-[11px] tabular-nums"
              style={{ color: nearLimit ? COLORS.error : COLORS.subtext }}
            >
              {description.length}/{MAX_CAPTION_LENGTH}
            </span>
          </div>

          <textarea
            rows={5}
            value={description}
            maxLength={MAX_CAPTION_LENGTH}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your workout..."
            className="w-full bg-transparent resize-none outline-none"
            style={{ color: COLORS.text }}
          />
        </div>

        {/* Workout */}
        <div
          className="border p-5 mb-5"
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.hairline,
          }}
        >
          <label
            className="block mb-3 uppercase text-xs tracking-[0.2em]"
            style={{ color: COLORS.subtext }}
          >
            Workout
          </label>

          <select
            value={selectedWorkout}
            onChange={(e) => setSelectedWorkout(e.target.value)}
            className="w-full bg-transparent outline-none py-2"
            style={{ color: COLORS.text }}
          >
            <option
              value=""
              style={{
                backgroundColor: COLORS.panel,
                color: COLORS.text,
              }}
            >
              Select workout
            </option>

            {workouts.map((workout) => (
              <option
                key={workout.id}
                value={workout.id}
                style={{
                  backgroundColor: COLORS.panel,
                  color: COLORS.text,
                }}
              >
                {workout.title}
              </option>
            ))}
          </select>
        </div>

        {/* Photo */}
        <div
          className="border p-5 mb-8"
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.hairline,
          }}
        >
          <label
            className="block mb-3 uppercase text-xs tracking-[0.2em]"
            style={{ color: COLORS.subtext }}
          >
            Photo
          </label>

          {!photo && (
            <label
              className="flex flex-col items-center justify-center gap-3 border border-dashed rounded-lg py-10 cursor-pointer transition"
              style={{
                borderColor: COLORS.gold,
                color: COLORS.gold,
              }}
            >
              <ImagePlus size={32} />

              <span className="uppercase tracking-[0.15em] text-xs">
                Choose Image
              </span>

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handlePhoto}
              />
            </label>
          )}

          {photo && photoPreviewUrl && (
            <div className="relative">
              <img
                src={photoPreviewUrl}
                alt="Preview"
                className="w-full rounded-lg object-cover max-h-96"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                aria-label="Remove photo"
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: "rgba(10,10,11,0.75)",
                  border: `1px solid ${COLORS.hairline}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.hairline;
                }}
              >
                <X size={16} style={{ color: COLORS.text }} />
              </button>
            </div>
          )}
        </div>

        {/* Post Button */}
        <button
          onClick={handlePost}
          className="w-full py-4 uppercase tracking-[0.2em] font-semibold transition-colors"
          style={{
            backgroundColor: COLORS.gold,
            color: COLORS.bg,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.goldBright)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.gold)
          }
        >
          Post
        </button>
      </div>
    </div>
  );
}

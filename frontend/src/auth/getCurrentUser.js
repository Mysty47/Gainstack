const API_BASE = "http://localhost:8080";

export async function getCurrentUser() {
console.log("getCurrentUser")
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const response = await fetch(`${API_BASE}/admin/currentUser`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}
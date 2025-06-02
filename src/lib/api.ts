const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const fetchUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

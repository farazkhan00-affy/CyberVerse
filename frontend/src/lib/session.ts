export function getCurrentUserEmail(): string {
  const token = localStorage.getItem("token");
  if (!token) return "guest";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || "guest";
  } catch {
    return "guest";
  }
}

export function userKey(base: string): string {
  return `${base}_${getCurrentUserEmail()}`;
}
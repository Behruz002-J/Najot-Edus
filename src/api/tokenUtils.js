const AUTH_URL = "https://najot-edu.softwareengineer.uz/api/v1/auth/login";

/**
 * JWT payload ni decode qiladi (verify qilmaydi, faqat o'qiydi)
 */
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/**
 * Token hali amal qiladimi? (30 soniya buffer bilan)
 */
function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now() + 30_000;
}

/**
 * Login API ga murojaat qilib yangi token oladi
 */
async function refreshToken() {
  const raw = localStorage.getItem("_creds");
  if (!raw) throw new Error("Credentials topilmadi. Qayta login qiling.");

  const creds = JSON.parse(raw);

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: creds.phone, password: creds.password }),
  });

  if (!res.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("_creds");
    throw new Error("Auto-refresh muvaffaqiyatsiz. Qayta login qiling.");
  }

  const data = await res.json();
  const newToken =
    data?.accessToken ||
    data?.data?.accessToken ||
    data?.data?.token ||
    data?.token ||
    data?.access_token;

  if (!newToken) throw new Error("Yangi token olinmadi.");

  localStorage.setItem("token", newToken);
  return newToken;
}

/**
 * Har doim amal qiladigan token qaytaradi.
 * Agar muddati tugagan bo'lsa avtomatik yangilaydi.
 */
export async function getValidToken() {
  const current = localStorage.getItem("token");

  if (isTokenValid(current)) {
    return current;
  }

  // Token expired — avtomatik yangilaymiz
  console.info("[Auth] Token expired. Auto-refreshing...");
  return await refreshToken();
}

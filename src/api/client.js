const BASE = (import.meta.env.VITE_N8N_BASE_URL ?? "").replace(/\/+$/, "");
const HEADER_NAME = import.meta.env.VITE_N8N_HEADER_NAME ?? "";
const HEADER_VALUE = import.meta.env.VITE_N8N_HEADER_VALUE ?? "";
const TIMEOUT = 15000;
const RETRIES = 2;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const message = (error) =>
  error?.name === "AbortError" ? "The request timed out." : (error?.message ?? "Network request failed.");

const headers = () => {
  const base = { accept: "application/json" };
  return HEADER_NAME && HEADER_VALUE ? { ...base, [HEADER_NAME]: HEADER_VALUE } : base;
};

export async function request(path) {
  if (!BASE) return { ok: false, error: "VITE_N8N_BASE_URL is not set." };
  for (let attempt = 0; ; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const response = await fetch(`${BASE}${path}`, {
        signal: controller.signal,
        credentials: "omit",
        headers: headers(),
      });
      if (!response.ok) throw new Error(`Server responded ${response.status}.`);
      return { ok: true, data: await response.json() };
    } catch (error) {
      if (attempt >= RETRIES) return { ok: false, error: message(error) };
      await wait(2 ** attempt * 400);
    } finally {
      clearTimeout(timer);
    }
  }
}

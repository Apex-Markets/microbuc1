import Cookies from "js-cookie";

// Usage: set a cookie value
export function setCookie(name: string, value: string, days = 30) {
  Cookies.set(name, value, { expires: days, path: "/" });
}

// Usage: get a cookie value
export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

// Usage: remove a cookie
export function removeCookie(name: string) {
  Cookies.remove(name, { path: "/" });
}
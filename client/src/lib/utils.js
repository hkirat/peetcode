const API_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3001";

export const post = async (url, data) => {
  const token = getTokenCookie();
  return await fetch(API_URL + url, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: token },
    body: JSON.stringify(data),
  });
};

export const get = async (url) => {
  const token = getTokenCookie();
  return await fetch(API_URL + url, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: token },
  });
};

export const setTokenCookie = (token, expirationHours) => {
  const d = new Date();
  d.setTime(d.getTime() + expirationHours * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = "token=" + token + ";" + expires + ";path=/";
};

export const getTokenCookie = () => {
  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");
  for (let cookie of cookies) {
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};

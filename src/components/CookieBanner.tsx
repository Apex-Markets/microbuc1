import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

export default function CookieBanner() {
  const [show, setShow] = useState(getCookie("cookieConsent") !== "yes");

  // Prevent scrolling when the overlay is shown
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  const acceptCookies = () => {
    setCookie("cookieConsent", "yes", 365);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-70"
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white max-w-lg w-full m-4 rounded-xl shadow-2xl flex flex-col items-center p-8"
        onClick={e => e.stopPropagation()} // So that inner clicks don't bubble
        style={{ pointerEvents: "auto" }}
      >
        <p className="mb-6 text-lg text-center">
          Cookies help us keep our website safe and give you a better experience. By visiting our website, you agree to our use of essential cookies.
          With your consent, we also use analytics cookies to serve personalized ads or content and analyze our traffic.
        </p>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          onClick={acceptCookies}
          autoFocus
        >
          Accept
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

export default function CookieBanner() {
  const [show, setShow] = useState(getCookie("cookieConsent") !== "yes");

  const acceptCookies = () => {
    setCookie("cookieConsent", "yes", 365);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[10000] cookie-banner bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-6"
      style={{
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
        margin: 0,
      }}
    >
      <span>
        Cookies help us keep our website safe and give you a better experience. By visiting our website, you agree to our use of essential cookies.
        With your consent, we also use analytics cookies for personalized ads/content and to analyze our traffic.
        <a href="/privacy" className="ml-2 underline">Privacy Policy</a>
      </span>
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        onClick={acceptCookies}
        autoFocus
      >
        Accept
      </button>
    </div>
  );
}
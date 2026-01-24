import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

export default function CookieBanner() {
  const [show, setShow] = useState(getCookie("cookieConsent") !== "yes");

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
    document.body.style.overflow = "";
  };

  if (!show) return null;

  return (
    // Overlay blocks all interaction, but is transparent except for the bottom banner area
    <div
      className="fixed inset-0 z-[9999]"
      style={{
        background: "transparent",
        pointerEvents: "auto"
      }}
      tabIndex={-1}
    >
      {/* Bottom-aligned cookie banner */}
      <div
        className="fixed left-0 right-0 bottom-0 z-[10000] cookie-banner bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-6"
        style={{
          pointerEvents: "auto",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
          margin: 0,
        }}
        onClick={e => e.stopPropagation()}
      >
        <span>
          Cookies help us keep our website safe and give you a better experience. By visiting our website, you agree to our use of essential cookies.
          With your consent, we also use analytics cookies for personalized ads/content and to analyze our traffic.
        </span>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          onClick={acceptCookies}
        >
          Accept
        </button>
      </div>
      {/* Make overlay catch all clicks */}
      <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, pointerEvents: "auto"}} onClick={e => e.stopPropagation()} />
    </div>
  );
}
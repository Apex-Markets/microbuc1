import { useState } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

function CookieBanner() {
  const [show, setShow] = useState(getCookie("cookieConsent") !== "yes");

  const acceptCookies = () => {
    setCookie("cookieConsent", "yes", 365);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <p>
        Cookies help us keep our website safe and give you a better experience. By visiting our website, you agree to our use of essential cookies.&nbsp;
        With your consent, we also use analytics cookies to serve personalized ads or content and analyze our traffic.
      </p>
      <button onClick={acceptCookies}>Accept</button>
    </div>
  );
}

export default function CookieBanner() {
  return (
    <div style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      background: "#d72638",
      color: "#fff",
      padding: "2rem",
      zIndex: 99999,
      textAlign: "center",
      fontSize: "1.5rem",
    }}>
      TEST BANNER. If you see this, your component is being rendered!
    </div>
  );
}
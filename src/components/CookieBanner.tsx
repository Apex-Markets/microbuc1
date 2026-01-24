import React, { useState } from "react";
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
      <p>We use cookies to ...</p>
      <button onClick={acceptCookies}>Accept</button>
    </div>
  );
}
import { useEffect, useRef, useCallback } from "react";

// This is your PUBLIC reCAPTCHA site key - safe to expose in frontend
const RECAPTCHA_SITE_KEY = "6LcGhpcrAAAAAN49gBRNY9a_NkXgL5jq_M-Df8wl";

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark";
      }) => number;
      reset: (widgetId?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

export function ReCaptcha({ onVerify, onExpire, onError }: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const isRenderedRef = useRef(false);

  const renderRecaptcha = useCallback(() => {
    if (!containerRef.current || isRenderedRef.current) return;
    
    if (window.grecaptcha && window.grecaptcha.render) {
      try {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
          theme: "light",
        });
        isRenderedRef.current = true;
      } catch (error) {
        console.error("Error rendering reCAPTCHA:", error);
      }
    }
  }, [onVerify, onExpire, onError]);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    
    if (existingScript) {
      // Script already loaded, just render
      if (window.grecaptcha) {
        window.grecaptcha.ready(renderRecaptcha);
      }
    } else {
      // Load the reCAPTCHA script
      window.onRecaptchaLoad = () => {
        window.grecaptcha.ready(renderRecaptcha);
      };

      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      // Clean up on unmount
      isRenderedRef.current = false;
    };
  }, [renderRecaptcha]);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center"
    />
  );
}

export function resetReCaptcha() {
  if (window.grecaptcha) {
    try {
      window.grecaptcha.reset();
    } catch (error) {
      console.error("Error resetting reCAPTCHA:", error);
    }
  }
}
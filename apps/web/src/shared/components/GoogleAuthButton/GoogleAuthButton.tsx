"use client";
import { env } from "@dniproanimals/env";
import { cn } from "@dniproanimals/ui";
import { useEffect, useRef } from "react";

type GoogleButtonText = "signin_with" | "signup_with" | "continue_with";

interface GoogleAuthButtonProps {
  onCredential: (idToken: string) => void;
  text?: GoogleButtonText;
  disabled?: boolean;
}

type GoogleAccountsId = {
  initialize: (options: {
    client_id: string;
    callback: (response: { credential?: string }) => void;
  }) => void;
  renderButton: (
    container: HTMLElement,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      shape?: "rectangular" | "pill" | "circle" | "square";
      text?: GoogleButtonText;
      width?: string;
    },
  ) => void;
};

type GoogleApi = {
  accounts: {
    id: GoogleAccountsId;
  };
};

declare global {
  interface Window {
    google?: GoogleApi;
  }
}

export function GoogleAuthButton({
  onCredential,
  text = "continue_with",
  disabled,
}: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    const init = () => {
      if (!window.google?.accounts?.id) return false;
      window.google.accounts.id.initialize({
        client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response) => {
          const token = response.credential;
          if (token) onCredential(token);
        },
      });
      container.innerHTML = "";
      window.google.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text,
        width: "320",
      });
      initializedRef.current = true;
      return true;
    };

    if (init()) return;

    const interval = window.setInterval(() => {
      if (init()) window.clearInterval(interval);
    }, 200);

    return () => window.clearInterval(interval);
  }, [onCredential, text]);

  return (
    <div
      className={cn(
        "transition-opacity",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <div ref={containerRef} className="w-full flex justify-center min-h-11" />
    </div>
  );
}

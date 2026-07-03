import { supabase } from "@/integrations/supabase/client";

export type ChatEventType = "opened" | "first_message";

export interface ChatEvent {
  id: string;
  event_type: ChatEventType;
  message: string | null;
  path: string | null;
  read: boolean;
  created_at: string;
}

const sessionKey = (t: ChatEventType) => `ec-chat-event-${t}`;

/**
 * Log a chatbot event for admins to see in the notification bell.
 * Each event type fires at most once per browser session so the admin
 * isn't spammed by a single visitor toggling the widget repeatedly.
 * Logging failures are swallowed — they must never break the chat UX.
 */
export async function logChatEvent(type: ChatEventType, message?: string): Promise<void> {
  try {
    if (typeof window !== "undefined" && window.sessionStorage.getItem(sessionKey(type))) {
      return;
    }
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(sessionKey(type), "1");
    }

    const path =
      typeof window !== "undefined" ? window.location.pathname.slice(0, 300) : null;

    // chat_events isn't in the generated Supabase types yet; cast to keep TS happy.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("chat_events").insert({
      event_type: type,
      message: message ? message.slice(0, 2000) : null,
      path,
    });
  } catch (e) {
    console.debug("Failed to log chat event", e);
  }
}

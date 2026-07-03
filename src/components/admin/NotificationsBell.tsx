import { useEffect, useState } from "react";
import { Bell, MessageSquare, DoorOpen, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { ChatEvent } from "@/lib/chatEvents";

const RELATIVE = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
};

const NotificationsBell = () => {
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const unread = events.filter((e) => !e.read).length;

  useEffect(() => {
    let active = true;

    const load = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("chat_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!active) return;
      if (!error && data) setEvents(data as ChatEvent[]);
      setLoading(false);
    };
    void load();

    const channel = supabase
      .channel("chat_events_feed")
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "chat_events" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const ev = payload.new as ChatEvent;
          setEvents((prev) => [ev, ...prev].slice(0, 50));
          toast(
            ev.event_type === "first_message"
              ? "New chat message from a visitor"
              : "A visitor opened the chat",
            { description: ev.message ?? undefined },
          );
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const markRead = async (ids: string[]) => {
    if (ids.length === 0) return;
    setEvents((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, read: true } : e)),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("chat_events")
      .update({ read: true })
      .in("id", ids);
  };

  const markAllRead = () => markRead(events.filter((e) => !e.read).map((e) => e.id));

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Chat activity</div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="h-80">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-1 px-4 text-center">
              <Bell className="h-5 w-5 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">No chat activity yet.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {events.map((e) => {
                const isMsg = e.event_type === "first_message";
                return (
                  <li
                    key={e.id}
                    onClick={() => !e.read && void markRead([e.id])}
                    className={`flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-accent ${
                      e.read ? "opacity-60" : "bg-accent/40"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        isMsg ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isMsg ? <MessageSquare className="h-3.5 w-3.5" /> : <DoorOpen className="h-3.5 w-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium">
                          {isMsg ? "First message" : "Chat opened"}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {RELATIVE(e.created_at)}
                        </span>
                      </div>
                      {isMsg && e.message && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          "{e.message}"
                        </p>
                      )}
                      {e.path && (
                        <Badge variant="outline" className="mt-1 h-4 px-1.5 text-[9px] font-normal">
                          {e.path}
                        </Badge>
                      )}
                    </div>
                    {!e.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;

import { useRef, useState, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const QUICK_REPLIES = [
  "📸 Photography packages",
  "🎬 Wedding film styles",
  "💰 Pricing info",
  "📅 Check availability",
];

interface ChatBotProps {
  variant?: "inline" | "floating";
}

const ChatBot = ({ variant = "inline" }: ChatBotProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi there! 💕 I'd love to hear about your wedding plans. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 60);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    setShowQuickReplies(false);
    const userMsg: Msg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to connect");
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      if (!assistantSoFar) {
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const isFloating = variant === "floating";
  const chatHeight = isFloating ? "h-[350px]" : "h-[380px]";

  return (
    <div className={`w-full ${isFloating ? "" : "max-w-xl mx-auto"}`}>
      <div className={`bg-background overflow-hidden ${isFloating ? "" : "border border-border/40 rounded-xl shadow-sm"}`}>
        {/* Messages */}
        <div ref={scrollRef} className={`${chatHeight} overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin`}>
          {messages.map((msg, i) => (
            <motion.div
              key={`${i}-${msg.content.slice(0, 10)}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-accent/80 text-accent-foreground"
                }`}
              >
                {msg.role === "user" ? <User size={12} /> : <Sparkles size={12} />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[78%] px-3.5 py-2.5 ${
                  msg.role === "user"
                    ? "bg-foreground text-background rounded-2xl rounded-tr-sm"
                    : "bg-muted/60 text-foreground rounded-2xl rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="font-body text-[13px] leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-0.5 prose-p:leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="font-body text-[13px] leading-relaxed">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-accent/80 text-accent-foreground">
                  <Sparkles size={12} />
                </div>
                <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick replies */}
          <AnimatePresence>
            {showQuickReplies && !isLoading && messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex flex-wrap gap-2 pt-1"
              >
                {QUICK_REPLIES.map((text, i) => (
                  <motion.button
                    key={text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    onClick={() => send(text)}
                    className="px-3 py-1.5 rounded-full border border-border/60 bg-background hover:bg-muted/50 font-body text-[11px] text-foreground/70 hover:text-foreground transition-all duration-200 hover:border-foreground/30"
                  >
                    {text}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="border-t border-border/40 bg-muted/20 p-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent font-body text-[13px] text-foreground placeholder:text-muted-foreground/40 px-2 py-1.5 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => send()}
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-20 hover:opacity-80 transition-all duration-200 shrink-0"
          >
            <Send size={13} className="-translate-x-[0.5px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

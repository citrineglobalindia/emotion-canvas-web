import { Instagram } from "lucide-react";
import logoDark from "@/assets/logo-dark.jpg";

const Footer = () => (
  <footer className="bg-foreground py-12 px-6 md:px-10">
    <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-6">
      <img src={logoDark} alt="Black & White" className="h-8 w-auto object-contain invert mix-blend-screen" />
      <a
        href="https://www.instagram.com/storiesby_black_and_white"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-body text-[11px] tracking-[0.2em] text-background/60 hover:text-background transition-colors uppercase"
      >
        <Instagram size={13} />
        @storiesby_black_and_white
      </a>
      <p className="font-body text-[10px] tracking-[0.15em] text-background/40 uppercase">
        © 2026 All rights reserved
      </p>
    </div>
  </footer>
);

export default Footer;

import { Instagram } from "lucide-react";
import logo from "@/assets/logo-clean.png";

const Footer = () => (
  <footer className="border-t border-border py-10 px-6 md:px-10">
    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <img src={logo} alt="Black & White" className="h-7 w-auto dark:invert" />
      <p className="font-body text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
        © 2026 All rights reserved
      </p>
      <a
        href="https://www.instagram.com/storiesby_black_and_white"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-accent transition-colors"
      >
        <Instagram size={15} />
        @storiesby_black_and_white
      </a>
    </div>
  </footer>
);

export default Footer;

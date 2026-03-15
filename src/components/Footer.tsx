import { Instagram, Heart } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12 px-6 md:px-10 bg-card">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Black & White" className="h-8 w-auto dark:invert" />
        </div>
        <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
          Made with <Heart size={12} className="text-accent" fill="currentColor" /> © 2026 All rights reserved.
        </p>
        <a href="https://www.instagram.com/storiesby_black_and_white" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-accent transition-colors group">
          <Instagram size={16} className="group-hover:scale-110 transition-transform" />
          @storiesby_black_and_white
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;

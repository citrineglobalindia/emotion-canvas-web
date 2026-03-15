const Footer = () => (
  <footer className="border-t border-border py-12 px-6 md:px-16">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="font-display text-lg tracking-[0.2em] text-foreground">B&W FILMS</p>
      <p className="font-body text-xs text-muted-foreground tracking-[0.2em]">
        © 2026 Black & White Films. All rights reserved.
      </p>
      <a
        href="https://www.instagram.com/storiesby_black_and_white"
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-xs text-muted-foreground tracking-[0.2em] hover:text-accent transition-colors"
      >
        @storiesby_black_and_white
      </a>
    </div>
  </footer>
);

export default Footer;

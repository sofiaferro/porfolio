import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-12 mt-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-sm font-mono text-muted-foreground">
              © {new Date().getFullYear()} Sofia Ferro. Made with love using v0 🖤. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/sofiaferro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/sofiaferro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors flex items-center"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:svf.inbox@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

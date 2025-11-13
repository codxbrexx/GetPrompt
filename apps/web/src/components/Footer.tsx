import { Github, Twitter, Heart, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const QUICK_LINKS = [
{ to: "/", label: "Browse Prompts" },
{ to: "/submit", label: "Submit Prompt" },
];

const CATEGORIES = [
"Image Generation",
"Video Production",
"Text & Writing",
"Code & Development",
];

const SOCIAL_LINKS = [
{
  href: "https://github.com",
  icon: Github,
  label: "GitHub",
  rotate: 5,
},
{
  href: "https://twitter.com",
  icon: Twitter,
  label: "Twitter",
  rotate: -5,
},
{
  href: "mailto:hello@getprompt.com",
  icon: Mail,
  label: "Email",
  rotate: 5,
},
];

export const Footer = () => {
const currentYear = new Date().getFullYear();

return (
  <footer className="border-t bg-muted/30">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">GetPrompt</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Discover powerful prompts, share your own, and explore the ideas driving the
            future of generative AI.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Categories</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CATEGORIES.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Connect</h3>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  whileHover={{ scale: 1.1, rotate: social.rotate }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-smooth"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
        Made with
        <motion.span
          whileHover={{ scale: 1.08, rotate: [0, -8, 0] }}
          transition={{ duration: 0.28 }}
          className="inline-flex items-center"
          aria-hidden="true"
        >
          <Heart className="h-4 w-4 text-destructive fill-destructive" />
        </motion.span>
        <span className="sr-only">love</span>
        <span className="ml-1">by the</span>
        <Link to="/" className="ml-1 font-medium hover:underline">
          GetPrompt Team
        </Link>
          </p>

          <div className="flex items-center gap-6">
        <nav aria-label="Footer links">
          <ul className="flex items-center gap-4 text-xs text-muted-foreground">
            <li>
          <Link to="/privacy" className="hover:text-primary transition-smooth">
            Privacy
          </Link>
            </li>
            <li>
          <Link to="/terms" className="hover:text-primary transition-smooth">
            Terms
          </Link>
            </li>
          </ul>
        </nav>

        <p className="text-xs text-muted-foreground">
          © {currentYear} GetPrompt. All rights reserved.
        </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
};

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/kcca-logo-enhanced.png";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/events", label: "Events" },
  { path: "/gallery", label: "Gallery" },
  { path: "/news", label: "News" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50">
      {/* Main nav */}
      <nav className="bg-card border-b border-border shadow-sm">
        <div className="container-main flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="KCCA Logo" className="h-11 w-11 rounded-full" />
            <div className="hidden lg:block">
              <span className="font-display text-base font-bold text-foreground leading-tight block">KIAMBU COUNTY</span>
              <span className="font-display text-xs font-semibold text-secondary leading-tight block">CHESS ASSOCIATION</span>
            </div>
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-secondary"
                      : "text-foreground/70 hover:text-secondary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Login + Mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2 rounded-md text-sm font-bold hover:opacity-90 transition-all shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-card border-t border-border overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                      (link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path))
                        ? "bg-secondary/10 text-secondary"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;

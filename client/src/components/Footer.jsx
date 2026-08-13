import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Heart,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-['Outfit']">
                Travel<span className="text-teal-400">Guide</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Explore the world with trusted local guides. Discover authentic culture, breathtaking destinations, and memorable custom travel experiences.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-teal-400 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-teal-400 transition-colors">
                  Local Guides
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/destinations?category=Beach" className="hover:text-teal-400 transition-colors">
                  Beach Getaways
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Mountain" className="hover:text-teal-400 transition-colors">
                  Mountain Treks
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Historical" className="hover:text-teal-400 transition-colors">
                  Heritage & Forts
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Religious" className="hover:text-teal-400 transition-colors">
                  Spiritual Journeys
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Adventure" className="hover:text-teal-400 transition-colors">
                  Adventure Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Headquarters
            </p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Connaught Place, New Delhi, 110001, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@travelguide.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 (11) 4567-8900</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TravelGuide. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for passionate travelers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

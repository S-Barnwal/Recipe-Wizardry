import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Heart,
  ChefHat,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-2">
                <ChefHat className="h-6 w-6 text-orange-500" />
              </div>

              <h2 className="text-2xl font-bold">
                Recipe
                <span className="text-orange-500"> Wizardry</span>
              </h2>
            </div>

            <p className="leading-7 text-slate-400">
              AI-powered recipe platform that transforms ingredients
              into delicious meals. Discover recipes, reduce food waste,
              and cook smarter every day.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com/S-Barnwal"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition-all duration-300 hover:border-orange-500 hover:text-orange-500"
              >
                <Github size={18} />
              </a>

              <a
                href="https://www.linkedin.com/in/sneha-barnwal-90b800262/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition-all duration-300 hover:border-orange-500 hover:text-orange-500"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="mailto:contact.snehabarnwal@gmail.com"
                className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition-all duration-300 hover:border-orange-500 hover:text-orange-500"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-orange-500">
              Navigation
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li>
                <Link to="/" className="hover:text-orange-500 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-orange-500 transition"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-orange-500 transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/community"
                  className="hover:text-orange-500 transition"
                >
                  Community
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-orange-500 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-orange-500">
              Features
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li>🤖 AI Recipe Generation</li>
              <li>📸 Recipe From Images</li>
              <li>🎤 Voice Ingredient Input</li>
              <li>🥗 Personalized Meals</li>
              <li>📅 Meal Planner</li>
              <li>🌱 Reduce Food Waste</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 text-slate-400">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-orange-500" />
              <a
                href="mailto:contact.snehabarnwal@gmail.com"
                className="hover:text-orange-500"
              >
                contact.snehabarnwal@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Github size={18} className="text-orange-500" />
              <a
                href="https://github.com/S-Barnwal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500"
              >
                github.com/S-Barnwal
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Linkedin size={18} className="text-orange-500" />
              <a
                href="https://www.linkedin.com/in/sneha-barnwal-90b800262/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500"
              >
                LinkedIn Profile
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-orange-500" />
              <span>Lucknow, Uttar Pradesh, India</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Recipe Wizardry.
              All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-slate-500 transition hover:text-orange-500"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-slate-500 transition hover:text-orange-500"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/cookies"
                className="text-slate-500 transition hover:text-orange-500"
              >
                Cookies
              </Link>
            </div>

            <p className="flex items-center gap-1 text-sm text-slate-500">
              Built & Designed by Sneha Barnwal
              <Heart
                size={14}
                className="fill-orange-500 text-orange-500"
              />
              for food lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
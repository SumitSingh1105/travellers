import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Target,
  Heart,
  Users,
  ShieldCheck,
  Award,
  Globe2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-20 pb-20 animate-fade-in">
      {/* Header Showcase */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 text-white py-20 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold uppercase tracking-wider border border-white/20">
          <Compass className="w-4 h-4" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-['Outfit'] tracking-tight max-w-4xl mx-auto">
          Empowering Authentic Travel Through Local Knowledge
        </h1>
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          TravelGuide bridges the gap between passionate world explorers and licensed, trustworthy local guides to create bespoke travel memories.
        </p>
      </section>

      {/* Mission & Why We Created TravelGuide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
              <Target className="w-4 h-4" />
              <span>Our Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              Why We Created TravelGuide
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Standard commercial travel itineraries often miss the true soul of a destination. Tourists end up trapped in overcrowded tourist traps without experiencing the genuine folklore, culture, street culinary traditions, or sacred historical contexts.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We built <strong>TravelGuide</strong> to empower local residents, certified guides, and cultural storytellers with a modern platform where they can offer private personalized trips, earn fair transparent livelihoods, and share their love for their homeland.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                <p className="text-2xl font-extrabold text-teal-700 font-['Outfit']">100%</p>
                <p className="text-xs text-slate-600 font-medium">Verified Backgrounds</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                <p className="text-2xl font-extrabold text-cyan-700 font-['Outfit']">0%</p>
                <p className="text-xs text-slate-600 font-medium">Middlemen Commissions</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
              alt="Travelers enjoying a scenic viewpoint"
              className="rounded-3xl shadow-2xl object-cover h-[420px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Benefits for Travelers & Guides */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              A Platform Built for Everyone
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Transforming how travel experiences are discovered and delivered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Travelers Box */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                    Benefits for Travelers
                  </h3>
                  <p className="text-xs text-slate-500">Unfiltered, safe, & custom adventures</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Connect with verified local experts who speak your language.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Bypass tourist traps and discover authentic street food and artisan markets.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Transparent pricing per day with zero hidden surprises.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Personalized flexible schedules that match your family's pace.</span>
                </li>
              </ul>
            </div>

            {/* Guides Box */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                    Benefits for Local Guides
                  </h3>
                  <p className="text-xs text-slate-500">Independence & direct bookings</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Set your own daily rates, working schedule, and availability.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Receive booking requests directly from enthusiastic travelers worldwide.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Build your professional reputation with genuine verified reviews.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Full control over your profile, languages, and regional specialties.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
          Ready to Start Your Journey?
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/destinations"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105"
          >
            Explore Destinations
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all hover:scale-105"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

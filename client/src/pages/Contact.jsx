import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been sent to our travel support team.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
          <span>We're Here to Help</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Have a question about a trip, guide verification, or custom travel inquiries? Reach out to our friendly concierge team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 1 Col: Info Details */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-8 rounded-3xl shadow-xl space-y-8">
          <div>
            <h3 className="text-2xl font-bold font-['Outfit'] mb-2">Get in Touch</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Our travel support specialists are available 7 days a week.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Office Location</p>
                <p className="text-slate-300">Connaught Place, New Delhi, 110001, India</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Email Address</p>
                <p className="text-slate-300">support@travelguide.com</p>
                <p className="text-slate-300">guides@travelguide.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Direct Phone</p>
                <p className="text-slate-300">+91 (11) 4567-8900</p>
                <p className="text-slate-300">+91 98765 43210 (Toll Free)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Working Hours</p>
                <p className="text-slate-300">Mon - Sun: 8:00 AM – 10:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto border-2 border-teal-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                Message Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for reaching out. One of our support managers will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Booking Assistance / Guide Registration Query"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows="5"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message or inquiry here..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;

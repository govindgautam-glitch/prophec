"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, X, Calendar, Check, ExternalLink, Sparkles, AlertCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitted");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#091c09]/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-title"
        className="relative w-full max-w-lg rounded-2xl bg-[#091c09] border border-white/15 p-5 sm:p-6 md:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto my-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 id="audit-title" className="text-lg sm:text-xl font-bold font-urbanist text-white">
              Book an AI Audit
            </h3>
            <p className="text-xs text-white/60">
              Workflow analysis to production automation
            </p>
          </div>
        </div>

        {status === "idle" ? (
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-urbanist">
              Our engineering team analyzes your operational bottlenecks and designs custom AI agent architectures for sales, support, and enterprise workflows.
            </p>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/70 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Sparkles className="w-4 h-4 text-white" />
                <span>PropheC Project Discussion</span>
              </div>
              <p>
                From websites and mobile applications to AI tools, automation, dashboards, SaaS, CRM, ERP and custom software—from concept to deployment and beyond.
              </p>
            </div>

            <div>
              <label htmlFor="audit-email" className="block text-xs font-medium text-white/70 mb-1.5 font-urbanist">
                Work Email Address
              </label>
              <input
                id="audit-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@company.com"
                className="w-full px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="audit-notes" className="block text-xs font-medium text-white/70 mb-1.5 font-urbanist">
                Project Scope or Systems to Automate
              </label>
              <textarea
                id="audit-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. AI agents, CRM integration, WhatsApp automation, enterprise dashboard..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <a
                href="https://x.com/prophecai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 transition-colors py-1"
              >
                Reach out on X <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="submit"
                className="pill-btn-hero-primary shadow-md text-xs py-2.5 px-5 min-h-[44px] w-full sm:w-auto justify-center"
              >
                Submit Project Inquiry
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Request Received</h4>
              <p className="text-sm text-white/70 max-w-sm mx-auto font-urbanist">
                Thank you. We have recorded your request for <strong>{email}</strong>. Our team will get in touch directly.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SearchModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");

  const searchItems = [
    { title: "Overview", section: "Hero", href: "#hero", desc: "Prophec AI platform overview & agent overview" },
    { title: "AI Ecosystem", section: "Services", href: "#services", desc: "Automate sales, support, email and operations" },
    { title: "Argus Platform", section: "Argus AI", href: "#argus", desc: "Neural orchestration engine & agent telemetry" },
    { title: "Capabilities", section: "What We Build", href: "#build", desc: "Digital products, systems, ecosystems and design" },
    { title: "Interactive Playground", section: "Lab", href: "#playground", desc: "2D physics simulation & theme controllers" },
    { title: "Our Work", section: "Collaborations", href: "#work", desc: "Trusted by forward-thinking teams & enterprises" },
    { title: "X (Twitter)", section: "Social", href: "https://x.com/prophecai", desc: "@prophecai on X" },
    { title: "Instagram", section: "Social", href: "https://www.instagram.com/prophec.ai/", desc: "@prophec.ai on Instagram" },
  ];

  const filtered = query.trim() === ""
    ? searchItems.slice(0, 6)
    : searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 p-3 sm:p-4 bg-[#091c09]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick search"
        className="relative w-full max-w-xl rounded-2xl bg-[#091c09] border border-white/15 overflow-hidden shadow-2xl text-white max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-white/50" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search solutions, platform, agents, sections..."
            className="w-full bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                      {item.section}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-xs text-white/40 group-hover:text-white">→</span>
              </a>
            ))
          ) : (
            <div className="p-8 text-center text-white/50">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-white/30" />
              <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-white/40 mt-1">Try searching for &quot;Services&quot;, &quot;Argus&quot;, or &quot;Build&quot;</p>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#091c09]/90 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
          <span>Navigate with click or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export const NotificationsDrawer: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-[#091c09]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className="w-full max-w-sm rounded-2xl bg-[#091c09] border border-white/15 p-5 shadow-2xl text-white relative animate-in slide-in-from-right duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white" />
            <h3 className="font-bold text-sm">Announcements</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 py-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-white/80">No New Unread Notifications</p>
          <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
            Truthful notification contract: all systems are currently nominal. Live service broadcasts will appear here upon production deployment.
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/70 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfileModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091c09]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Account identity preview"
        className="relative w-full max-w-md rounded-2xl bg-[#091c09] border border-white/15 p-6 shadow-2xl text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-[#091c09] flex items-center justify-center font-bold text-lg text-white">
              NR
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Navraj Rathore
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                Figma Spec
              </span>
            </h3>
            <p className="text-xs text-white/60">Innovidea Pvt. Ltd.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-white/75 bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <p className="font-semibold text-white/90">Preview Identity Contract</p>
          <p>
            Account identity preserved from Figma specification for visual fidelity.
          </p>
          <p className="text-white/50">
            In production, this control mounts your enterprise OAuth / SSO session provider (e.g. NextAuth, Clerk, WorkOS).
          </p>
        </div>

        <div className="mt-5 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

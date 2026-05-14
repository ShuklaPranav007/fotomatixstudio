import { useEffect, useState } from "react";
import axios from "axios";
import img from "../assets/logo.png";

const API = import.meta.env.VITE_API_URL || "https://fotomatixstudio-backend.onrender.com";
const CATEGORIES = [
  "wedding",
  "prewedding",
  "commercial",
  "event",
  "maternity",
];

const categoryConfig = {
  wedding: {
    label: "Wedding Shoot",
    desc: "Capturing the love, joy, and unforgettable moments of your special day.",
  },
  prewedding: {
    label: "Pre Wedding Shoot",
    desc: "Beautiful pre-wedding stories told through stunning frames.",
  },
  commercial: {
    label: "Commercial Shoot",
    desc: "Professional commercial photography for your brand and business.",
  },
  event: {
    label: "Event Shoot",
    desc: "Every event deserves to be remembered — we make sure it is.",
  },
  maternity: {
    label: "Maternity Photoshoot",
    desc: "Celebrating the beautiful journey of motherhood, frame by frame.",
  },
};

const Blob = ({ style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      pointerEvents: "none",
      ...style,
    }}
  />
);

export default function Home() {
  const [mediaByCategory, setMediaByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          CATEGORIES.map((cat) =>
            axios
              .get(`${API}/api/gallery?category=${cat}`)
              .then((r) => ({ cat, data: r.data })),
          ),
        );
        const grouped = {};
        results.forEach(({ cat, data }) => {
          grouped[cat] = data;
        });
        setMediaByCategory(grouped);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#0f0f1a 0%,#1a0f2e 40%,#0f1a2e 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .hero-title { font-size: 54px; }
        .stats-grid { grid-template-columns: repeat(4,1fr); }
        .contact-btns { flex-direction: row; }
        
        /* 1. NEW UNIFORM GRID */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* 2. THE CARD & HOVER EFFECT */
        .gallery-item {
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          position: relative;
          aspect-ratio: 4 / 5; /* Forces all cards to be uniform portrait rectangles */
          
          /* Smooth bouncy transition for the pop-up */
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }
        
        /* The Pop-Up action */
        .gallery-item:hover {
          transform: scale(1.04) translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.6);
          z-index: 10;
        }

        /* 3. IMAGE SIZING INSIDE THE CARD */
        .gallery-media {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Centers the image flawlessly without distortion */
          display: block;
          transition: transform 0.5s ease; /* Smooth internal zoom */
        }

        /* Internal image zoom on hover for extra premium feel */
        .gallery-item:hover .gallery-media {
          transform: scale(1.05);
        }

        /* Text overlay transition */
        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top,rgba(0,0,0,0.8),transparent);
          padding: 30px 16px 16px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0.9;
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        /* RESPONSIVENESS */
        @media (max-width: 1024px) {
          .hero-title { font-size: 42px; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 32px; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 26px; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .gallery-grid { grid-template-columns: 1fr; }
          .contact-btns { flex-direction: column; align-items: stretch; }
          .contact-btns a, .contact-btns button { width: 100%; }
        }
      `}</style>

      <Blob style={{ top: "-120px", left: "-120px", width: "600px", height: "600px", background: "radial-gradient(circle,rgba(120,60,255,0.18),transparent 70%)" }} />
      <Blob style={{ top: "300px", right: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle,rgba(60,180,255,0.13),transparent 70%)" }} />
      <Blob style={{ bottom: "200px", left: "30%", width: "400px", height: "400px", background: "radial-gradient(circle,rgba(80,200,120,0.09),transparent 70%)" }} />

      {/* HERO */}
      <section id="home" style={{ padding: "clamp(48px,8vw,90px) clamp(16px,4vw,32px) clamp(40px,6vw,70px)", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div className="fade-up">
          <img src={img} alt="Foto Matix Studio" style={{ height: "clamp(48px,8vw,70px)", objectFit: "contain", marginBottom: "20px", display: "block", margin: "0 auto 20px" }} />
          <h1 className="hero-title" style={{ fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: "18px", letterSpacing: "-0.02em" }}>
            Capturing moments <br />
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              that last forever
            </span>
          </h1>
          <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "rgba(255,255,255,0.5)", maxWidth: "460px", margin: "0 auto 24px", lineHeight: 1.8 }}>
            Wedding, pre-wedding, commercial, events and maternity photography. Every frame tells your story.
          </p>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: "36px" }}>
            <a href="tel:+918960889997" style={{ color: "#a78bfa" }}>+91 89608 89997</a>
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-solid" onClick={() => document.getElementById("wedding")?.scrollIntoView({ behavior: "smooth" })}>View Gallery</button>
            <button className="btn-glass" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Book a Session</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-grid" style={{ display: "grid", gap: "12px", padding: "0 clamp(16px,4vw,32px) clamp(40px,6vw,64px)", position: "relative", zIndex: 2 }}>
        {[
          { num: "100+", label: "Weddings & Events" },
          { num: "6+ years ", label: "Experience" },
          { num: "Certified", label: "Delhi College of photography" },
          { num: "Mirror Less 4k", label: "photographer & Cinematographer" },
        ].map((s, i) => (
          <div key={i} className="card-hover" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "clamp(14px,2vw,22px)", textAlign: "center" }}>
            <div style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{s.num}</div>
            <div style={{ fontSize: "clamp(11px,1.5vw,12px)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CATEGORY SECTIONS */}
      {loading ? (
        <p style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Loading...</p>
      ) : (
        CATEGORIES.map((cat) => {
          const items = mediaByCategory[cat] || [];
          const config = categoryConfig[cat];
          if (items.length === 0) return null;

          return (
            <section key={cat} id={cat} style={{ padding: "clamp(32px,5vw,48px) clamp(16px,4vw,32px)", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px", flexWrap: "wrap" }}>
                <div style={{ width: "4px", height: "32px", background: "linear-gradient(to bottom,#7c3aed,#2563eb)", borderRadius: "2px", flexShrink: 0 }} />
                <h2 style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 700, color: "#fff" }}>{config.label}</h2>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{items.length} items</span>
              </div>
              <p style={{ fontSize: "clamp(13px,1.8vw,14px)", color: "rgba(255,255,255,0.4)", marginBottom: "28px", marginLeft: "20px", lineHeight: 1.7 }}>{config.desc}</p>
              <div style={{ height: "1px", background: "linear-gradient(to right,rgba(124,58,237,0.5),rgba(37,99,235,0.3),transparent)", marginBottom: "28px" }} />

              {/* NEW UNIFORM GRID */}
              <div className="gallery-grid">
                {items.map((item) => (
                  <div key={item._id} className="gallery-item">
                    {item.type === "video" ? (
                      <video
                        src={item.url}
                        controls
                        className="gallery-media"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={cat}
                        className="gallery-media"
                        loading="lazy"
                      />
                    )}
                    <div className="gallery-overlay">
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" }}>
                        {config.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* CONTACT */}
      <section id="contact" style={{ padding: "clamp(32px,5vw,48px) clamp(16px,4vw,32px) clamp(40px,6vw,64px)", position: "relative", zIndex: 2 }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "clamp(28px,5vw,48px) clamp(20px,4vw,40px)", textAlign: "center", backdropFilter: "blur(20px)" }}>
          <img src={img} alt="Foto Matix Studio" style={{ height: "clamp(40px,6vw,56px)", objectFit: "contain", marginBottom: "20px" }} />
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Let's Talk!</h2>
          <p style={{ fontSize: "clamp(13px,1.8vw,14px)", color: "rgba(255,255,255,0.45)", marginBottom: "8px", lineHeight: 1.8 }}>An open invitation to connect and explore collaborative opportunities.</p>

          <div style={{ display: "inline-flex", alignItems: "flex-start", gap: "8px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "12px", padding: "12px 20px", margin: "16px auto 32px", maxWidth: "420px" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: "2px", flexShrink: 0 }}>
              <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(167,139,250,0.8)" />
            </svg>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "clamp(12px,1.8vw,13px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>Kamla Nagar Colony, Raebareli Road<br />Ayodhya — 224001</div>
            </div>
          </div>

          <div className="contact-btns" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+918960889997" style={{ flex: "1 1 auto", maxWidth: "220px" }}>
              <button className="btn-solid" style={{ width: "100%" }}>+91 89608 89997</button>
            </a>
            <a href="mailto:fotomatixstudio99@gmail.com" style={{ flex: "1 1 auto", maxWidth: "280px" }}>
              <button className="btn-glass" style={{ width: "100%" }}>fotomatixstudio99@gmail.com</button>
            </a>
          </div>

          <div style={{ marginTop: "40px" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginBottom: "8px" }}>© 2026 Foto Matix Studio. All rights reserved.</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginBottom: "14px" }}>
              Made by <a href="https://www.instagram.com/sprnv007" target="_blank" rel="noreferrer" style={{ color: "rgba(167,139,250,0.7)", textDecoration: "none" }}>@sprnv007</a> with ♥
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

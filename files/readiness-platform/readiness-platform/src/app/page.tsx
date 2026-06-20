'use client';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, BarChart3, FileText, Layers } from 'lucide-react';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'white' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 700 }}>F&F</span>
            </div>
            <span style={{ fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em' }}>Frame & Flight</span>
          </div>
          <Link href="/assess" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ink)', color: 'white', padding: '9px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'opacity 0.15s' }}>
            Start Assessment <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '96px 32px 80px' }}>
        <div style={{ display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 28 }}>
          PLM Readiness Assessment v1.1
        </div>
        <h1 className="serif" style={{ fontSize: 'clamp(42px, 6vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 740, marginBottom: 28 }}>
          Know exactly where your PLM stands
        </h1>
        <p style={{ fontSize: 18, color: 'var(--slate)', maxWidth: 560, lineHeight: 1.7, marginBottom: 48 }}>
          Score your organization across nine capability areas — from supplier management to artwork — and receive a detailed readiness dashboard with a PDF report.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/assess" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ink)', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
            Begin Assessment <ArrowRight size={17} />
          </Link>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--ink)', border: '1px solid var(--border)', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 400 }}>
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ height: 1, background: 'var(--border)' }} />
      </div>

      {/* Features */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          {[
            { icon: <Layers size={22} />, title: '9 Capability Areas', body: 'Supplier Management, Raw Materials, Formula Creation & Management, Trade, Claims, Label Copy, Packaging, and Artwork.' },
            { icon: <BarChart3 size={22} />, title: 'Four-Dimension Scoring', body: 'Rate your Process, Technology, People, and Data maturity on a 1–5 scale for each capability.' },
            { icon: <CheckCircle2 size={22} />, title: 'Readiness Dashboard', body: 'Radar charts and section breakdowns highlight exactly where to invest effort for maximum impact.' },
            { icon: <FileText size={22} />, title: 'PDF Report', body: 'Download a board-ready PDF with your scores, readiness levels, and prioritized recommendations.' },
          ].map((f) => (
            <div key={f.title} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
              <div style={{ color: 'var(--accent)', marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring legend */}
      <section style={{ background: 'var(--ink)', color: 'white' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px' }}>
          <h2 className="serif" style={{ fontSize: 32, marginBottom: 8 }}>How scoring works</h2>
          <p style={{ color: '#9ca3af', marginBottom: 40, fontSize: 15 }}>Each question is rated 1–5 across four dimensions.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { score: '1', label: 'Nothing in place', color: '#dc2626' },
              { score: '2', label: 'Ad hoc / partial', color: '#f97316' },
              { score: '3', label: 'Basic capability', color: '#eab308' },
              { score: '4', label: 'Consistent & broad', color: '#84cc16' },
              { score: '5', label: 'Fully integrated', color: '#16a34a' },
            ].map((s) => (
              <div key={s.score} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: s.color, minWidth: 32 }}>{s.score}</div>
                <span style={{ color: '#d1d5db', fontSize: 14 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: 'var(--slate)', borderTop: '1px solid var(--border)' }}>
        © {new Date().getFullYear()} Frame & Flight · PLM Readiness Assessment
      </footer>
    </main>
  );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ASSESSMENT_SECTIONS, SCORING_DIMENSIONS, DIMENSION_LABELS, RUBRIC, ScoreMap, totalQuestions } from '@/lib/assessmentData';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

type Step = 'intro' | 'assess' | 'submitting';

type UserInfo = {
  company_name: string;
  respondent_name: string;
  respondent_email: string;
  respondent_role: string;
};

const TOTAL_SECTIONS = ASSESSMENT_SECTIONS.length;

export default function AssessPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [userInfo, setUserInfo] = useState<UserInfo>({ company_name: '', respondent_name: '', respondent_email: '', respondent_role: '' });
  const [sectionIndex, setSectionIndex] = useState(0);
  const [scores, setScores] = useState<ScoreMap>({});
  const [error, setError] = useState('');

  const currentSection = ASSESSMENT_SECTIONS[sectionIndex];

  const answeredInSection = useCallback(() => {
    return currentSection.questions.filter(q => scores[q.id] && SCORING_DIMENSIONS.every(d => scores[q.id][d] > 0)).length;
  }, [currentSection, scores]);

  const totalAnswered = Object.keys(scores).filter(qid =>
    SCORING_DIMENSIONS.every(d => scores[qid]?.[d] > 0)
  ).length;

  const progress = totalAnswered / totalQuestions();

  function setScore(questionId: string, dim: string, value: number) {
    setScores(prev => ({
      ...prev,
      [questionId]: { ...(prev[questionId] || {}), [dim]: value },
    }));
  }

  function getScore(questionId: string, dim: string): number {
    return scores[questionId]?.[dim as keyof typeof scores[string]] ?? 0;
  }

  async function handleSubmit() {
    setStep('submitting');
    try {
      const { data, error: err } = await supabase
        .from('assessments')
        .insert({
          ...userInfo,
          scores,
          completed: true,
          section_progress: TOTAL_SECTIONS,
        })
        .select('id')
        .single();

      if (err) throw err;
      router.push(`/dashboard?id=${data.id}`);
    } catch (e: unknown) {
      console.error(e);
      setError('Failed to save assessment. Please check your Supabase configuration.');
      setStep('assess');
    }
  }

  if (step === 'submitting') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--chalk)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--slate)', fontSize: 15 }}>Saving your assessment…</p>
        </div>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--slate)', textDecoration: 'none', marginBottom: 40 }}>
            <ChevronLeft size={15} /> Home
          </a>
          <h1 className="serif" style={{ fontSize: 40, letterSpacing: '-0.02em', marginBottom: 12 }}>Before we begin</h1>
          <p style={{ color: 'var(--slate)', fontSize: 15, marginBottom: 40, lineHeight: 1.7 }}>
            Tell us who is completing this assessment. This helps us contextualize your results.
          </p>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { key: 'company_name', label: 'Company Name', placeholder: 'Acme Foods Inc.' },
              { key: 'respondent_name', label: 'Your Name', placeholder: 'Jane Smith' },
              { key: 'respondent_email', label: 'Email Address', placeholder: 'jane@acmefoods.com' },
              { key: 'respondent_role', label: 'Your Role', placeholder: 'VP of R&D / PLM Manager' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--ink)' }}>{f.label}</label>
                <input
                  type={f.key === 'respondent_email' ? 'email' : 'text'}
                  placeholder={f.placeholder}
                  value={userInfo[f.key as keyof UserInfo]}
                  onChange={e => setUserInfo(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'var(--chalk)' }}
                />
              </div>
            ))}
            {error && <p style={{ color: 'var(--not-ready)', fontSize: 13 }}>{error}</p>}
            <button
              onClick={() => {
                if (!userInfo.company_name || !userInfo.respondent_name || !userInfo.respondent_email) {
                  setError('Please fill in Company, Name, and Email.');
                  return;
                }
                setError('');
                setStep('assess');
              }}
              style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--ink)', color: 'white', border: 'none', padding: '13px 24px', borderRadius: 9, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
            >
              Start Assessment <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--slate)' }}>
              Section {sectionIndex + 1} of {TOTAL_SECTIONS} — <strong style={{ color: 'var(--ink)' }}>{currentSection.title}</strong>
            </span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>
              {totalAnswered}/{totalQuestions()} answered
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Section header */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => (
            <button
              key={i}
              onClick={() => setSectionIndex(i)}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: i === sectionIndex ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: i < sectionIndex ? 'var(--ink)' : i === sectionIndex ? 'var(--accent)' : 'white',
                color: i <= sectionIndex ? 'white' : 'var(--slate)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {i < sectionIndex ? <CheckCircle2 size={13} /> : i + 1}
            </button>
          ))}
        </div>

        <h2 className="serif" style={{ fontSize: 30, letterSpacing: '-0.02em', marginTop: 20, marginBottom: 6 }}>
          {currentSection.title}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 32 }}>
          Rate each capability 1–5 across all four dimensions. Hover over a score to see its description.
        </p>

        {/* Dimension header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 120px)', gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          <div />
          {SCORING_DIMENSIONS.map(d => (
            <div key={d} style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--slate)', textAlign: 'center' }}>
              {DIMENSION_LABELS[d]}
            </div>
          ))}
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {currentSection.questions.map((q, qi) => {
            const isAnswered = SCORING_DIMENSIONS.every(d => getScore(q.id, d) > 0);
            return (
              <div
                key={q.id}
                className="fade-in"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr repeat(4, 120px)',
                  gap: 8,
                  padding: '18px 0',
                  borderBottom: qi < currentSection.questions.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center',
                  background: isAnswered ? 'rgba(200,135,58,0.03)' : 'transparent',
                  borderRadius: 8,
                  marginBottom: 2,
                }}
              >
                <div style={{ paddingRight: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    {q.capability}
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.5 }}>{q.text}</p>
                </div>
                {SCORING_DIMENSIONS.map(dim => {
                  const val = getScore(q.id, dim);
                  return (
                    <div key={dim} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div className="mono" style={{
                        fontSize: 22, fontWeight: 700,
                        color: val === 0 ? 'var(--border)' : val >= 4 ? 'var(--ready)' : val >= 2 ? 'var(--progress)' : 'var(--not-ready)',
                        transition: 'color 0.2s',
                      }}>
                        {val || '–'}
                      </div>
                      <input
                        type="range"
                        min={1} max={5} step={1}
                        value={val || 1}
                        onChange={e => setScore(q.id, dim, Number(e.target.value))}
                        onMouseDown={() => { if (val === 0) setScore(q.id, dim, 1); }}
                        title={val > 0 ? RUBRIC[dim][val] : `Rate ${DIMENSION_LABELS[dim]}`}
                        style={{ width: 100 }}
                      />
                      <div style={{ fontSize: 10, color: 'var(--slate)', textAlign: 'center', lineHeight: 1.3, minHeight: 28, maxWidth: 110 }}>
                        {val > 0 ? RUBRIC[dim][val] : 'Not rated'}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 0 64px' }}>
          <button
            onClick={() => setSectionIndex(i => Math.max(0, i - 1))}
            disabled={sectionIndex === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'white', fontSize: 14, cursor: sectionIndex === 0 ? 'not-allowed' : 'pointer', opacity: sectionIndex === 0 ? 0.4 : 1, color: 'var(--ink)' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div style={{ fontSize: 13, color: 'var(--slate)' }}>
            {answeredInSection()} / {currentSection.questions.length} rated this section
          </div>

          {sectionIndex < TOTAL_SECTIONS - 1 ? (
            <button
              onClick={() => setSectionIndex(i => i + 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, background: 'var(--ink)', border: 'none', color: 'white', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}
            >
              Next section <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: 'white', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}
            >
              Submit Assessment <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

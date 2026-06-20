'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { ASSESSMENT_SECTIONS, SCORING_DIMENSIONS, DIMENSION_LABELS, calculateSectionScore, calculateOverallScore, getReadinessLevel, ScoreMap } from '@/lib/assessmentData';
import { supabase, AssessmentRecord } from '@/lib/supabase';
import { Download, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const DIM_COLORS: Record<string, string> = {
  process: '#c8873a',
  technology: '#3b82f6',
  people: '#16a34a',
  data: '#8b5cf6',
};

function ReadinessBadge({ avg }: { avg: number }) {
  const { label, color } = getReadinessLevel(avg);
  return (
    <span className="score-pill" style={{ background: color + '18', color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
}

function SectionCard({ section, scores, expanded, onToggle }: {
  section: typeof ASSESSMENT_SECTIONS[0];
  scores: ScoreMap;
  expanded: boolean;
  onToggle: () => void;
}) {
  const sectionScore = calculateSectionScore(scores, section);
  const avg = Object.values(sectionScore).reduce((a, b) => a + b, 0) / 4;

  const radarData = SCORING_DIMENSIONS.map(d => ({
    dim: DIMENSION_LABELS[d],
    value: sectionScore[d],
    fullMark: 5,
  }));

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{section.title}</div>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>{section.questions.length} capabilities</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ReadinessBadge avg={avg} />
          <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: avg >= 4 ? 'var(--ready)' : avg >= 2 ? 'var(--progress)' : 'var(--not-ready)' }}>
            {avg.toFixed(1)}
          </span>
          {expanded ? <ChevronUp size={16} color="var(--slate)" /> : <ChevronDown size={16} color="var(--slate)" />}
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Radar dataKey="value" stroke="#c8873a" fill="#c8873a" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
                {SCORING_DIMENSIONS.map(d => (
                  <div key={d} style={{ background: 'var(--chalk)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      {DIMENSION_LABELS[d]}
                    </div>
                    <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: DIM_COLORS[d] }}>
                      {sectionScore[d].toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--ink)' }}>Capability breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {section.questions.map(q => {
                  const qScores = scores[q.id];
                  if (!qScores) return null;
                  const qAvg = SCORING_DIMENSIONS.reduce((s, d) => s + (qScores[d] || 0), 0) / 4;
                  return (
                    <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, fontSize: 12, color: 'var(--slate)', lineHeight: 1.4 }}>{q.capability}</div>
                      <div style={{ width: 100, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(qAvg / 5) * 100}%`, background: qAvg >= 4 ? 'var(--ready)' : qAvg >= 2 ? 'var(--progress)' : 'var(--not-ready)', borderRadius: 2 }} />
                      </div>
                      <div className="mono" style={{ fontSize: 12, width: 28, textAlign: 'right', color: 'var(--slate)' }}>{qAvg.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(ASSESSMENT_SECTIONS[0].id);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    supabase.from('assessments').select('*').eq('id', id).single().then(({ data }) => {
      setRecord(data as AssessmentRecord | null);
      setLoading(false);
    });
  }, [id]);

  async function handlePDFDownload() {
    if (!record) return;
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const overall = calculateOverallScore(record.scores as ScoreMap);
    const overallAvg = Object.values(overall).reduce((a, b) => a + b, 0) / 4;

    // Cover page
    doc.setFillColor(15, 14, 12);
    doc.rect(0, 0, W, 297, 'F');

    doc.setTextColor(200, 135, 58);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('FRAME & FLIGHT', 20, 30);
    doc.text('PLM READINESS ASSESSMENT', 20, 36);

    doc.setTextColor(247, 244, 239);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('Readiness Report', 20, 80);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(record.company_name, 20, 95);
    doc.text(`Completed by ${record.respondent_name} · ${record.respondent_role}`, 20, 103);

    const { label: overallLabel } = getReadinessLevel(overallAvg);
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 135, 58);
    doc.text(overallAvg.toFixed(1), 20, 160);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(247, 244, 239);
    doc.text(`Overall Score · ${overallLabel}`, 20, 172);

    doc.setFontSize(9);
    doc.setTextColor(75, 75, 82);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 20, 280);

    // Dimension summary page
    doc.addPage();
    doc.setFillColor(247, 244, 239);
    doc.rect(0, 0, W, 297, 'F');

    doc.setTextColor(15, 14, 12);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Dimension Summary', 20, 30);

    const dimRows = SCORING_DIMENSIONS.map(d => {
      const { label } = getReadinessLevel(overall[d]);
      return [DIMENSION_LABELS[d], overall[d].toFixed(2), label];
    });

    autoTable(doc, {
      startY: 40,
      head: [['Dimension', 'Score (avg)', 'Readiness']],
      body: dimRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 14, 12], textColor: [247, 244, 239], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'center' } },
      margin: { left: 20, right: 20 },
    });

    // Section details
    for (const section of ASSESSMENT_SECTIONS) {
      doc.addPage();
      const sectionScore = calculateSectionScore(record.scores as ScoreMap, section);
      const sAvg = Object.values(sectionScore).reduce((a, b) => a + b, 0) / 4;
      const { label: sLabel } = getReadinessLevel(sAvg);

      doc.setFillColor(247, 244, 239);
      doc.rect(0, 0, W, 297, 'F');

      doc.setTextColor(200, 135, 58);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('SECTION', 20, 20);

      doc.setTextColor(15, 14, 12);
      doc.setFontSize(18);
      doc.text(section.title, 20, 30);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(74, 74, 82);
      doc.text(`Average Score: ${sAvg.toFixed(2)} · ${sLabel}`, 20, 40);

      const capRows = section.questions.map(q => {
        const qS = record.scores[q.id] as Record<string, number> | undefined;
        if (!qS) return [q.capability, '–', '–', '–', '–', '–'];
        const qAvg = SCORING_DIMENSIONS.reduce((s, d) => s + (qS[d] || 0), 0) / 4;
        return [
          q.capability,
          qS.process?.toString() ?? '–',
          qS.technology?.toString() ?? '–',
          qS.people?.toString() ?? '–',
          qS.data?.toString() ?? '–',
          qAvg.toFixed(1),
        ];
      });

      autoTable(doc, {
        startY: 50,
        head: [['Capability', 'Process', 'Technology', 'People', 'Data', 'Avg']],
        body: capRows,
        theme: 'striped',
        headStyles: { fillColor: [15, 14, 12], textColor: [247, 244, 239], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 0: { cellWidth: 70 }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center', fontStyle: 'bold' } },
        margin: { left: 20, right: 20 },
      });
    }

    doc.save(`${record.company_name.replace(/\s+/g, '_')}_PLM_Readiness_Report.pdf`);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ color: 'var(--slate)', fontSize: 16 }}>No assessment found. Complete an assessment first.</p>
        <Link href="/assess" style={{ background: 'var(--ink)', color: 'white', padding: '10px 22px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
          Start Assessment
        </Link>
      </div>
    );
  }

  const scores = record.scores as ScoreMap;
  const overall = calculateOverallScore(scores);
  const overallAvg = Object.values(overall).reduce((a, b) => a + b, 0) / 4;

  const overviewBarData = ASSESSMENT_SECTIONS.map(s => {
    const ss = calculateSectionScore(scores, s);
    const avg = Object.values(ss).reduce((a, b) => a + b, 0) / 4;
    return { name: s.title.replace(' Management', '').replace(' Creation', '').replace(' Copy', ''), avg: parseFloat(avg.toFixed(2)) };
  });

  const radarData = SCORING_DIMENSIONS.map(d => ({ dim: DIMENSION_LABELS[d], value: overall[d], fullMark: 5 }));

  return (
    <main style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
      {/* Header */}
      <div style={{ background: 'var(--ink)', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', textDecoration: 'none', marginBottom: 8 }}>
              <ArrowLeft size={13} /> Home
            </Link>
            <h1 className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>Readiness Dashboard</h1>
            <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>
              {record.company_name} · {record.respondent_name}
            </p>
          </div>
          <button
            onClick={handlePDFDownload}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--accent)', border: 'none', color: 'white', padding: '11px 20px', borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            <Download size={15} /> Download PDF Report
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
        {/* Overall score cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 36 }}>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate)', marginBottom: 8 }}>Overall</div>
            <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: overallAvg >= 4 ? 'var(--ready)' : overallAvg >= 2 ? 'var(--progress)' : 'var(--not-ready)' }}>
              {overallAvg.toFixed(1)}
            </div>
            <ReadinessBadge avg={overallAvg} />
          </div>
          {SCORING_DIMENSIONS.map(d => (
            <div key={d} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate)', marginBottom: 8 }}>{DIMENSION_LABELS[d]}</div>
              <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: DIM_COLORS[d] }}>
                {overall[d].toFixed(1)}
              </div>
              <ReadinessBadge avg={overall[d]} />
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, marginBottom: 36 }}>
          <div className="chart-container">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Dimension Radar</div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11, fill: '#4a4a52' }} />
                <Radar dataKey="value" stroke="#c8873a" fill="#c8873a" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Section Averages</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={overviewBarData} margin={{ top: 4, right: 20, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#4a4a52' }} angle={-30} textAnchor="end" interval={0} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} tickCount={6} />
                <Tooltip formatter={(v: number) => v.toFixed(2)} />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                  {overviewBarData.map((entry) => (
                    <Cell key={entry.name} fill={entry.avg >= 4 ? '#16a34a' : entry.avg >= 2 ? '#d97706' : '#dc2626'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
          {[{ color: 'var(--ready)', label: 'Ready (avg > 4)' }, { color: 'var(--progress)', label: 'In Progress (2–4)' }, { color: 'var(--not-ready)', label: 'Not Ready (< 2)' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--slate)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Section accordions */}
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Section Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ASSESSMENT_SECTIONS.map(section => (
            <SectionCard
              key={section.id}
              section={section}
              scores={scores}
              expanded={expanded === section.id}
              onToggle={() => setExpanded(prev => prev === section.id ? null : section.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}

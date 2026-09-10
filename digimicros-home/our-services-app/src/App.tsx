import { useState, useRef, useCallback } from 'react'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'
import {
  RefreshCw,
  BrainCircuit,
  ShieldCheck,
  Lightbulb,
  Cloud,
  HeartPulse,
  ClipboardCheck,
  Users,
  ArrowRight,
  Phone,
  CheckCircle2,
} from 'lucide-react'
import './index.css'

// ─── Service data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    subtitle: 'Infrastructure and Application Services',
    description:
      'Helping organizations transform products, services and operations to meet evolving market and customer expectations. We design modernization roadmaps that align technology investment with business outcomes.',
    href: '/digital-transformation-infrastructure-and-application-services/',
    icon: RefreshCw,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#2E6FF2',
    tags: ['Cloud Migration', 'App Modernization', 'DevOps', 'API Integration'],
    highlights: [
      'End-to-end digital strategy and roadmap design',
      'Legacy system modernization and re-platforming',
      'API-first integration and microservices architecture',
      'DevOps, CI/CD pipeline implementation',
      'Infrastructure as Code (IaC) and cloud-native adoption',
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI and Automation',
    subtitle: 'Intelligent Process Optimization',
    description:
      'Future-proofing your organization by identifying the right AI solutions and intelligent automation. We help you move from experimentation to production-grade AI that delivers measurable ROI.',
    href: '/ai-and-automation/',
    icon: BrainCircuit,
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#7C3AED',
    tags: ['Generative AI', 'RPA', 'ML Ops', 'Predictive Analytics'],
    highlights: [
      'AI readiness assessment and use-case prioritization',
      'Generative AI and LLM integration for enterprise workflows',
      'Robotic Process Automation (RPA) design and deployment',
      'MLOps pipelines and model governance frameworks',
      'Predictive analytics and intelligent decision support',
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    subtitle: 'Cyber Secure and Resilient',
    description:
      'A cyber secure and resilient approach, equipping clients with the right security solutions. From threat modeling and zero-trust architecture to incident response and compliance readiness.',
    href: '/cyber-security/',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#DC2626',
    tags: ['Zero Trust', 'SIEM / SOC', 'Pen Testing', 'Compliance'],
    highlights: [
      'Zero Trust architecture design and implementation',
      'SIEM/SOC strategy, deployment and managed detection',
      'Penetration testing and vulnerability assessments',
      'Regulatory compliance (NIST, ISO 27001, SOC 2, HIPAA)',
      'Incident response planning and tabletop exercises',
    ],
  },
  {
    id: 'technology-innovation',
    title: 'Technology Innovation Enablement',
    subtitle: 'Staying Ahead of Trends',
    description:
      'Building a supportive environment to develop and implement new technologies and stay ahead of trends. We help organizations build innovation labs, run technology pilots, and scale winning ideas.',
    href: '/technology-innovation-enablement/',
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#D97706',
    tags: ['Innovation Labs', 'Emerging Tech', 'PoC Design', 'Tech Strategy'],
    highlights: [
      'Technology landscape assessment and emerging trend analysis',
      'Innovation lab setup, governance and KPI frameworks',
      'Proof-of-concept (PoC) design and rapid prototyping',
      'Technology scouting and vendor evaluation',
      'Innovation culture enablement and change management',
    ],
  },
  {
    id: 'cloud-data-center',
    title: 'Cloud and Data Center',
    subtitle: 'Hybrid and Multi-Cloud Environments',
    description:
      'Preparing, planning, migrating and optimizing your data centers for hybrid or multi-cloud environments. We bring vendor-neutral expertise across AWS, Azure, and GCP to lower cost and increase resilience.',
    href: '/cloud-and-data-center/',
    icon: Cloud,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#0B3D91',
    tags: ['AWS / Azure / GCP', 'FinOps', 'Hybrid Cloud', 'Data Center Exit'],
    highlights: [
      'Cloud readiness and total cost of ownership (TCO) analysis',
      'Multi-cloud and hybrid cloud strategy and architecture',
      'Data center consolidation, exit and migration planning',
      'FinOps optimization and cloud cost governance',
      'Disaster recovery and high-availability design',
    ],
  },
  {
    id: 'operational-resilience',
    title: 'Operational Resilience',
    subtitle: 'Business Continuity and Recovery',
    description:
      'A proactive approach that helps organizations build plans to prevent operational disruptions. We design BCP/DR frameworks, run resilience exercises, and help you meet regulatory expectations.',
    href: '/operational-resilience/',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#059669',
    tags: ['BCP / DR', 'Crisis Management', 'RTO / RPO Design', 'Regulatory'],
    highlights: [
      'Business impact analysis (BIA) and risk assessment',
      'Business continuity and disaster recovery (BCP/DR) planning',
      'RTO/RPO design and recovery strategy optimization',
      'Crisis management and communication frameworks',
      'Resilience testing, simulation and maturity assessments',
    ],
  },
  {
    id: 'audit',
    title: 'Audit',
    subtitle: 'IT Audit and Assurance',
    description:
      'Evaluating IT infrastructure, applications and cyber preparedness to ensure effective, secure and compliant controls. Our audit services span SOX, SOC 2, HIPAA, and custom frameworks.',
    href: '/audit/',
    icon: ClipboardCheck,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#2E6FF2',
    tags: ['SOX', 'SOC 2', 'HIPAA', 'Internal IT Audit'],
    highlights: [
      'IT general controls (ITGC) and application controls review',
      'SOX compliance and IT audit support',
      'SOC 1 / SOC 2 audit readiness and advisory',
      'HIPAA security and privacy rule assessments',
      'Internal IT audit co-sourcing and quality assurance',
    ],
  },
  {
    id: 'third-party-risk',
    title: 'Third Party Risk Management',
    subtitle: 'Vendor and Supply Chain Risk',
    description:
      'A risk-first framework focused on identifying and reducing risks relating to the use of third parties. We build TPRM programs that scale — from onboarding due diligence to continuous monitoring.',
    href: '/third-party-risk-management/',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=640&h=640&fit=crop&q=70&auto=format',
    accent: '#7C3AED',
    tags: ['Vendor Due Diligence', 'TPRM Programs', 'Risk Scoring', 'Monitoring'],
    highlights: [
      'TPRM program design, policy and governance framework',
      'Vendor onboarding due diligence and risk tiering',
      'Risk scoring methodology and automated monitoring',
      'Fourth-party and supply chain risk assessment',
      'Regulatory alignment (DORA, OCC Guidance, ISO 27036)',
    ],
  },
]

const CAROUSEL_SLIDES = SERVICES.map((s) => ({
  src: s.image,
  alt: s.title,
  title: s.title,
}))

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(6,11,24,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <a href="/" aria-label="DigiMicros home" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.01em', textDecoration: 'none' }}>
          <svg style={{ width: 34, height: 34, flexShrink: 0 }} viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="38" height="38" rx="10" stroke="#00D4C7" strokeWidth="1.5" />
            <path d="M20 8 L30 13 V22 C30 28 26 31.5 20 33 C14 31.5 10 28 10 22 V13 Z" stroke="#2E6FF2" strokeWidth="1.6" fill="rgba(46,111,242,0.12)" />
            <path d="M15.5 20.5 L18.5 23.5 L25 16.5" stroke="#00D4C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            DigiMicros
            <small style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00D4C7', marginTop: 2 }}>Excellence Of Execution</small>
          </span>
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} aria-label="Primary">
          <ul style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><a href="/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,247,250,0.85)', textDecoration: 'none' }}>Home</a></li>
            <li><a href="/our-services/" aria-current="page" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>Services</a></li>
            <li><a href="/about-us/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,247,250,0.85)', textDecoration: 'none' }}>About Us</a></li>
            <li><a href="/contact-us/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,247,250,0.85)', textDecoration: 'none' }}>Contact Us</a></li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="tel:18006473107" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
              <Phone style={{ width: 16, height: 16, color: '#00D4C7' }} />
              1 (800) 647-3107
            </a>
            <a
              href="/contact-us/"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-pill)', fontWeight: 600, fontSize: '0.875rem',
                background: 'linear-gradient(135deg,#2E6FF2,#0B3D91)',
                color: '#fff', boxShadow: '0 10px 30px rgba(46,111,242,0.35)',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              Request a Meeting
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

// ─── Service grid ─────────────────────────────────────────────────────────────

function ServiceGrid({
  activeIndex,
  onSelect,
}: {
  activeIndex: number
  onSelect: (i: number) => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.875rem',
      }}
    >
      {SERVICES.map((s, i) => {
        const Icon = s.icon
        const isActive = i === activeIndex
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={isActive}
            aria-label={`Select ${s.title}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${isActive ? s.accent : 'var(--color-border-light)'}`,
              background: isActive ? `${s.accent}0d` : '#fff',
              boxShadow: isActive
                ? `0 0 0 4px ${s.accent}22, 0 8px 30px rgba(11,61,145,0.10)`
                : '0 2px 12px rgba(11,61,145,0.06)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 180ms ease, background 180ms ease, box-shadow 180ms ease',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Active indicator bar at top */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 3,
                  background: s.accent,
                  borderRadius: '4px 4px 0 0',
                }}
              />
            )}

            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? `${s.accent}20` : 'var(--color-bg-alt)',
                border: `1px solid ${isActive ? s.accent + '55' : 'var(--color-border-light)'}`,
                transition: 'all 180ms ease',
                flexShrink: 0,
              }}
            >
              <Icon
                style={{
                  width: 24,
                  height: 24,
                  color: isActive ? s.accent : 'var(--color-text-muted)',
                  transition: 'color 180ms ease',
                }}
              />
            </div>

            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 600,
                lineHeight: 1.35,
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                transition: 'color 180ms ease, font-weight 180ms ease',
              }}
            >
              {s.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Service detail panel ─────────────────────────────────────────────────────

function ServiceDetail({
  service,
  index,
}: {
  service: typeof SERVICES[0]
  index: number
}) {
  const Icon = service.icon

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid var(--color-border-light)`,
        borderTop: `4px solid ${service.accent}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: `0 12px 40px rgba(11,61,145,0.10), 0 0 0 1px ${service.accent}18`,
        overflow: 'hidden',
        animation: 'fadeSlideUp 0.32s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Top bar with icon + title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '2rem 2.5rem 1.5rem',
          background: `linear-gradient(135deg, ${service.accent}08 0%, transparent 60%)`,
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${service.accent}18`,
            border: `1.5px solid ${service.accent}44`,
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: 28, height: 28, color: service.accent }} />
        </div>
        <div>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: service.accent,
              marginBottom: '0.25rem',
            }}
          >
            Practice Area {String(index + 1).padStart(2, '0')} &nbsp;·&nbsp; {service.subtitle}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 2.2vw, 1.9rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            {service.title}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '2.5rem',
          padding: '2rem 2.5rem 2.5rem',
        }}
      >
        {/* Left — description + highlights + CTA */}
        <div>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              marginBottom: '1.75rem',
            }}
          >
            {service.description}
          </p>

          {/* Capability highlights */}
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-soft)',
              marginBottom: '0.875rem',
            }}
          >
            What We Deliver
          </p>
          <ul style={{ listStyle: 'none', margin: '0 0 2rem', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {service.highlights.map((h) => (
              <li
                key={h}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  fontSize: '0.9375rem',
                  color: 'var(--color-text)',
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle2
                  style={{
                    width: 17,
                    height: 17,
                    color: service.accent,
                    flexShrink: 0,
                    marginTop: '0.15rem',
                  }}
                />
                {h}
              </li>
            ))}
          </ul>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {service.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.35rem 0.875rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  background: `${service.accent}12`,
                  color: service.accent,
                  border: `1px solid ${service.accent}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={service.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                background: `linear-gradient(135deg, ${service.accent}, ${service.accent}cc)`,
                color: '#fff',
                boxShadow: `0 10px 28px ${service.accent}40`,
                textDecoration: 'none',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
              }}
            >
              Explore This Service
              <ArrowRight style={{ width: 16, height: 16 }} />
            </a>
            <a
              href="/contact-us/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                background: 'transparent',
                color: 'var(--color-primary)',
                border: '1.5px solid var(--color-border-light)',
                textDecoration: 'none',
                transition: 'border-color 180ms ease, color 180ms ease',
              }}
            >
              Request a Meeting
            </a>
          </div>
        </div>

        {/* Right — image */}
        <div
          style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--color-border-light)',
            alignSelf: 'start',
            position: 'sticky',
            top: '6rem',
          }}
        >
          <img
            src={service.image}
            alt={service.title}
            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              padding: '1rem 1.25rem',
              background: `${service.accent}0a`,
              borderTop: `2px solid ${service.accent}33`,
            }}
          >
            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: service.accent,
                marginBottom: '0.2rem',
              }}
            >
              {service.title}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {service.subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const detailRef = useRef<HTMLDivElement>(null)
  const activeService = SERVICES[activeIndex]

  // Single handler used by both carousel and grid — updates state and scrolls detail into view
  const handleSelect = useCallback((i: number) => {
    setActiveIndex(i)
    // Small delay so React has rendered the new detail panel before scrolling
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <a className="skip-link" href="#main">Skip to main content</a>
      <Header />

      <main id="main" style={{ paddingTop: 'var(--header-h)' }}>

        {/* ── Page hero ──────────────────────────────────────────── */}
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</a>
              <span className="sep">/</span>
              <span aria-current="page">Our Services</span>
            </nav>
            <p className="eyebrow">Our Services</p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem,4.5vw,4rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                color: 'var(--color-text)',
                marginBottom: '1rem',
              }}
            >
              Eight Practice Areas,{' '}
              <span
                style={{
                  background: 'linear-gradient(105deg,#00D4C7 0%,#2E6FF2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                One Advisory Partner
              </span>
            </h1>
            <p className="lede" style={{ maxWidth: '60ch' }}>
              We help companies achieve their business goals with insights and cost-effective technology solutions
              tailored to the changing needs of their customers, operations, and employees.
            </p>
          </div>
        </section>

        {/* ── Carousel ─────────────────────────────────────────────── */}
        <section
          style={{ background: 'var(--color-bg-alt)', paddingBlock: '3rem', borderBottom: '1px solid var(--color-border-light)' }}
          aria-label="Services carousel"
        >
          <div className="container">
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.5rem',
              }}
            >
              Drag or use arrow keys to browse — click a card or button below to view details
            </p>
            <CoverflowCarousel
              slides={CAROUSEL_SLIDES}
              cardWidth="clamp(160px, 18vw, 260px)"
              showNavigation
              showPagination
              loop
              label="IT Services"
              onSelect={handleSelect}
            />
          </div>
        </section>

        {/* ── Service grid ──────────────────────────────────────────── */}
        <section
          style={{ background: 'var(--color-bg)', paddingTop: '3.5rem', paddingBottom: '1.5rem' }}
          aria-label="Service selector"
        >
          <div className="container">
            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.25rem',
              }}
            >
              Select a service to view details
            </p>
            <ServiceGrid activeIndex={activeIndex} onSelect={handleSelect} />
          </div>
        </section>

        {/* ── Service detail ─────────────────────────────────────────── */}
        <section
          ref={detailRef}
          style={{ background: 'var(--color-bg)', paddingTop: '1.5rem', paddingBottom: '5rem' }}
          aria-label="Selected service detail"
          aria-live="polite"
        >
          <div className="container">
            <ServiceDetail key={activeIndex} service={activeService} index={activeIndex} />
          </div>
        </section>

        {/* ── CTA band ──────────────────────────────────────────────── */}
        <section className="cta-band" aria-labelledby="cta-heading">
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
            <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
              <g stroke="#00D4C7" strokeWidth="1" opacity="0.3">
                <line x1="100" y1="80" x2="300" y2="180" />
                <line x1="300" y1="180" x2="250" y2="320" />
                <line x1="900" y1="60" x2="1050" y2="200" />
                <line x1="1050" y1="200" x2="950" y2="340" />
              </g>
            </svg>
          </div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h2 id="cta-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3vw,2.75rem)', fontWeight: 700, color: 'var(--color-text-inverse)', marginBottom: '1rem' }}>
              Not sure where to start?
            </h2>
            <p style={{ fontSize: 'clamp(1.05rem,1.3vw,1.2rem)', color: 'var(--color-text-inverse-muted)', lineHeight: 1.65, maxWidth: '55ch', marginInline: 'auto', marginBottom: '2.5rem' }}>
              Tell us about your priorities and a DigiMicros advisor will help you scope the right practice area for your organization.
            </p>
            <a
              href="/contact-us/"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', padding: '1rem 2rem',
                borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '0.9375rem',
                background: '#fff', color: 'var(--color-primary-dark)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)', textDecoration: 'none',
              }}
            >
              Request a Meeting
            </a>
          </div>
        </section>
      </main>

      <footer style={{ background: 'var(--color-bg-dark)', color: 'var(--color-text-inverse)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-inverse-muted)' }}>
          <p>© 2026 DigiMicros. Future-proofing Businesses. All Rights Reserved.</p>
          <p>Dallas, Texas, United States · 1 (800) 647-3107</p>
        </div>
      </footer>
    </div>
  )
}

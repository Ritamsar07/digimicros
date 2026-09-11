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
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react'
import './index.css'

// ─── Service data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    subtitle: 'Infrastructure and Application Services',
    description:
      'Helping organizations transform products, services and operations to meet evolving market and customer expectations. We design modernization roadmaps that align technology investment with business outcomes, then stay through delivery so the roadmap actually gets executed, not just documented.',
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
    outcomes: [
      'Faster release cycles and less time lost to legacy constraints',
      'One modernization roadmap that leadership and delivery teams both work from',
      'Infrastructure and applications that scale with demand instead of against it',
    ],
    approach: [
      { step: 'Assess', detail: 'We map the current estate, dependencies and constraints before proposing anything.' },
      { step: 'Design', detail: 'A phased roadmap sequenced by business value and risk, not by technology fashion.' },
      { step: 'Deliver', detail: 'We stay through execution, adjusting the plan as reality meets the roadmap.' },
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI and Automation',
    subtitle: 'Intelligent Process Optimization',
    description:
      'Future-proofing your organization by identifying the right AI solutions and intelligent automation. We help you move from experimentation to production-grade AI that delivers measurable ROI, with governance built in from day one rather than bolted on after the fact.',
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
    outcomes: [
      'Repetitive, high-volume work handled without adding headcount',
      'A shortlist of AI use cases ranked by value and feasibility, not hype',
      'Governance that lets you adopt AI without inheriting unmanaged risk',
    ],
    approach: [
      { step: 'Identify', detail: 'We find where AI and automation genuinely fit your processes and your data.' },
      { step: 'Pilot', detail: 'Small, measurable pilots that prove value before you commit at scale.' },
      { step: 'Scale', detail: 'Production rollout with monitoring, governance and clear ownership.' },
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    subtitle: 'Cyber Secure and Resilient',
    description:
      'A cyber secure and resilient approach, equipping clients with the right security solutions. From threat modeling and zero-trust architecture to incident response and compliance readiness, we combine strong governance with AI-powered monitoring so protection holds up under real conditions.',
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
    outcomes: [
      'Faster detection and containment when something does get through',
      'A security program leadership can evidence to auditors and boards',
      'Controls that hold up in practice, not only on paper',
    ],
    approach: [
      { step: 'Evaluate', detail: 'We baseline your current posture, controls and exposure.' },
      { step: 'Harden', detail: 'Governance, zero trust architecture and detection capability put in place.' },
      { step: 'Sustain', detail: 'Ongoing monitoring, testing and response readiness as threats evolve.' },
    ],
  },
  {
    id: 'technology-innovation',
    title: 'Technology Innovation Enablement',
    subtitle: 'Staying Ahead of Trends',
    description:
      'Building a supportive environment to develop and implement new technologies and stay ahead of trends. We help organizations build innovation labs, run technology pilots, and scale winning ideas, while retiring the ones that do not pan out before they drain budget.',
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
    outcomes: [
      'A repeatable path from idea to pilot to production',
      'Clear criteria for retiring ideas early instead of funding them indefinitely',
      'Teams that adopt new technology rather than resisting it',
    ],
    approach: [
      { step: 'Scout', detail: 'We track emerging technology and filter it against your actual business needs.' },
      { step: 'Prototype', detail: 'Rapid proof-of-concept work that tests assumptions cheaply.' },
      { step: 'Embed', detail: 'Governance, enablement and change support so the winners stick.' },
    ],
  },
  {
    id: 'cloud-data-center',
    title: 'Cloud and Data Center',
    subtitle: 'Hybrid and Multi-Cloud Environments',
    description:
      'Preparing, planning, migrating and optimizing your data centers for hybrid or multi-cloud environments. We bring vendor-neutral expertise across major cloud platforms to lower cost and increase resilience, so the environment you end up with matches how the business actually runs.',
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
    outcomes: [
      'Cloud spend you can forecast instead of react to',
      'Right-sized environments matched to real workload demand',
      'A resilient footprint with recovery you have actually tested',
    ],
    approach: [
      { step: 'Plan', detail: 'Readiness, cost modelling and target architecture before anything moves.' },
      { step: 'Migrate', detail: 'Sequenced migration with rollback paths and minimal disruption.' },
      { step: 'Optimize', detail: 'Continuous right-sizing, cost governance and resilience testing.' },
    ],
  },
  {
    id: 'operational-resilience',
    title: 'Operational Resilience',
    subtitle: 'Business Continuity and Recovery',
    description:
      'A proactive approach that helps organizations build plans to prevent operational disruptions. We design BCP/DR frameworks, run resilience exercises, and help you meet regulatory expectations, then keep testing those plans as the business and threat landscape evolve.',
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
    outcomes: [
      'Critical operations that keep running through disruption',
      'Plans your teams have rehearsed, not just read',
      'Evidence of resilience your regulators and clients will accept',
    ],
    approach: [
      { step: 'Analyze', detail: 'Business impact analysis to identify what truly cannot stop.' },
      { step: 'Design', detail: 'Continuity and recovery plans built around those critical services.' },
      { step: 'Test', detail: 'Exercises and simulations that find the gaps before an incident does.' },
    ],
  },
  {
    id: 'audit',
    title: 'Audit',
    subtitle: 'IT Audit and Assurance',
    description:
      'Evaluating IT infrastructure, applications and cyber preparedness to ensure effective, secure and compliant controls. Our audit services span common regulatory and industry frameworks, and every finding comes with a practical remediation path, not just a list of gaps.',
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
    outcomes: [
      'A clear, evidence-based view of where your controls actually stand',
      'Findings paired with practical remediation, not just a gap list',
      'Audit readiness that reduces surprises at assessment time',
    ],
    approach: [
      { step: 'Scope', detail: 'We agree the frameworks, systems and risks in scope up front.' },
      { step: 'Test', detail: 'Controls are evaluated against real evidence and real conditions.' },
      { step: 'Report', detail: 'Findings, severity and a remediation path leadership can act on.' },
    ],
  },
  {
    id: 'third-party-risk',
    title: 'Third Party Risk Management',
    subtitle: 'Vendor and Supply Chain Risk',
    description:
      'A risk-first framework focused on identifying and reducing risks relating to the use of third parties. We build TPRM programs that scale, from onboarding due diligence to continuous monitoring, so risk gets caught before it becomes impact rather than after.',
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
    outcomes: [
      'Visibility into which third parties actually carry meaningful risk',
      'A consistent, defensible process for onboarding and review',
      'Issues surfaced while they are still manageable',
    ],
    approach: [
      { step: 'Tier', detail: 'Vendors are assessed and tiered by access, criticality and exposure.' },
      { step: 'Assess', detail: 'Due diligence proportionate to each tier, not one-size-fits-all.' },
      { step: 'Monitor', detail: 'Ongoing monitoring and periodic review across the vendor lifecycle.' },
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
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header
      className={navOpen ? 'app-header nav-open' : 'app-header'}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        background: '#060B18',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <a href="/" aria-label="DigiMicros home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/assets/logo_image.png"
            alt="DigiMicros, Future-Proofing Businesses"
            width={677}
            height={368}
            style={{ height: 52, width: 'auto', display: 'block', flexShrink: 0 }}
          />
        </a>

        <nav className="app-nav" aria-label="Primary">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li><a href="/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,247,250,0.85)', textDecoration: 'none' }}>Home</a></li>
            <li className="app-has-dropdown" style={{ position: 'relative' }}>
              <a href="/our-services/" aria-current="page" aria-haspopup="true" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
                Services
                <ChevronDown style={{ width: 13, height: 13 }} />
              </a>
              <div className="app-dropdown" role="menu">
                {SERVICES.map((s) => (
                  <a key={s.id} role="menuitem" href={s.href}>{s.title}</a>
                ))}
              </div>
            </li>
            <li><a href="/about-us/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,247,250,0.85)', textDecoration: 'none' }}>About Us</a></li>
            <li><a href="/contact-us/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,247,250,0.85)', textDecoration: 'none' }}>Contact Us</a></li>
          </ul>
          <div className="app-nav-actions">
            <a className="app-nav-phone" href="tel:18006473107">
              <Phone style={{ width: 16, height: 16, color: '#00D4C7' }} />
              1 (800) 647-3107
            </a>
            <a className="app-nav-cta" href="/contact-us/">Request a Meeting</a>
          </div>
        </nav>

        <button
          type="button"
          className="app-nav-toggle"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div
        className="app-nav-scrim"
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />
    </header>
  )
}

// ─── Footer (mirrors the static pages' full footer) ──────────────────────────

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Services', href: '/our-services/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact Us', href: '/contact-us/' },
]

const SOCIALS = [
  { label: 'DigiMicros on LinkedIn', href: 'https://www.linkedin.com/company/digimicros/', d: 'M6.94 8.5H4v11h2.94v-11ZM5.47 7.2A1.7 1.7 0 1 0 5.47 3.8a1.7 1.7 0 0 0 0 3.4ZM20 13.7c0-3-1.6-4.4-3.75-4.4-1.73 0-2.5 1-2.94 1.66V8.5H10.4c.04.85 0 11 0 11h2.9v-6.14c0-.33.02-.65.12-.89.26-.65.85-1.32 1.83-1.32 1.3 0 1.82.98 1.82 2.43V19.5H20V13.7Z' },
  { label: 'DigiMicros on Facebook', href: 'https://www.facebook.com/profile.php?id=61581446564197', d: 'M15 8.5h2V5.6c-.35-.05-1.54-.15-2.93-.15-2.9 0-4.87 1.77-4.87 5.02V13H6.3v3.25h2.9V21h3.36v-4.75h2.78L15.8 13h-3.24v-2.2c0-.94.26-1.58 1.6-1.58Z' },
  { label: 'DigiMicros on X (Twitter)', href: 'https://twitter.com/digimicros', d: 'M4 4l7.2 9.4L4.3 20H6l6-6.5 4 6.5h4l-7.5-9.7L19.5 4h-1.7l-5.5 6-3.7-6H4Z' },
]

function SiteFooter() {
  const [callbackSent, setCallbackSent] = useState(false)

  return (
    <footer className="app-footer">
      <div className="container app-footer-top">
        <div className="app-footer-brand">
          <a href="/" aria-label="DigiMicros home">
            <img
              src="/assets/logo_image.png"
              alt="DigiMicros, Future-Proofing Businesses"
              width={677}
              height={368}
              style={{ height: 60, width: 'auto', display: 'block' }}
            />
          </a>
          <p>
            We help companies achieve their business goals with insights and cost-effective technology
            solutions tailored to the changing needs of their customers, operations, and employees.
          </p>
          <div className="app-footer-contact">
            <a href="tel:18006473107"><Phone /> 1 (800) 647-3107</a>
            <a href="/contact-us/"><Mail /> Email Us</a>
            <a href="/contact-us/"><MapPin /> Dallas, Texas, United States</a>
          </div>
          <div className="app-footer-socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={s.d} fill="currentColor" /></svg>
              </a>
            ))}
          </div>
        </div>

        <div className="app-footer-col">
          <h4>Quick Links</h4>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="app-footer-col">
          <h4>Our Services</h4>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.id}><a href={s.href}>{s.title}</a></li>
            ))}
          </ul>
        </div>

        <div className="app-footer-col">
          <h4>Request a Call Back</h4>
          <p className="app-footer-note">Leave your number, we'll call you.</p>
          <form
            className="app-callback-form"
            onSubmit={(e) => {
              e.preventDefault()
              setCallbackSent(true)
              e.currentTarget.reset()
              window.setTimeout(() => setCallbackSent(false), 5000)
            }}
          >
            <label htmlFor="appCallbackPhone" className="app-visually-hidden">Phone number</label>
            <input id="appCallbackPhone" type="tel" name="phone" placeholder="Your phone number" required />
            <button type="submit" aria-label="Request a call back">
              <ArrowRight />
            </button>
          </form>
          {callbackSent && <p className="app-callback-success">Got it, we'll call you soon.</p>}
        </div>
      </div>

      <div className="container app-footer-bottom">
        <p>© {new Date().getFullYear()} DigiMicros. Future-proofing Businesses. All Rights Reserved.</p>
        <p>Dallas, Texas, United States · 1 (800) 647-3107</p>
      </div>
    </footer>
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
    <div className="svc-grid">
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
        className="svc-detail-head"
        style={{
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
      <div className="svc-detail-body">
        {/* Left, description + highlights + CTA */}
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

          {/* How we engage */}
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
            How We Engage
          </p>
          <ol className="svc-approach" style={{ marginBottom: '2rem' }}>
            {service.approach.map((a, i) => (
              <li key={a.step}>
                <span className="svc-approach-num" style={{ background: `${service.accent}15`, color: service.accent, borderColor: `${service.accent}40` }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <strong style={{ color: 'var(--color-text)' }}>{a.step}</strong>
                  <p style={{ color: 'var(--color-text-muted)' }}>{a.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Business outcomes */}
          <div className="svc-outcomes" style={{ borderColor: `${service.accent}30`, background: `${service.accent}08` }}>
            <p style={{ color: service.accent }}>What You Get</p>
            <ul>
              {service.outcomes.map((o) => (
                <li key={o}>
                  <ArrowRight style={{ width: 15, height: 15, color: service.accent, flexShrink: 0, marginTop: '0.2rem' }} />
                  {o}
                </li>
              ))}
            </ul>
          </div>

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

        {/* Right, image */}
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

  // Single handler used by both carousel and grid, just updates which service is shown.
  // Deliberately does not scroll the page; the detail panel updates in place.
  const handleSelect = useCallback((i: number) => {
    setActiveIndex(i)
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
          style={{
            position: 'relative',
            background: 'var(--color-bg-dark)',
            paddingBlock: '4rem',
            overflow: 'hidden',
          }}
          aria-label="Services carousel"
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 55% 65% at 50% 40%, rgba(46,111,242,0.28), transparent 65%), ' +
                'radial-gradient(ellipse 40% 50% at 85% 15%, rgba(0,212,199,0.22), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <div className="container" style={{ position: 'relative' }}>
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: 'var(--color-text-inverse-muted)',
                marginBottom: '2rem',
              }}
            >
              Drag or use arrow keys to browse, click a card or button below to view details
            </p>
            <CoverflowCarousel
              slides={CAROUSEL_SLIDES}
              cardWidth="clamp(160px, 18vw, 260px)"
              showNavigation
              showPagination
              loop
              label="IT Services"
              onSelect={handleSelect}
              cardClassName="cf-card-glow"
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

      <SiteFooter />
    </div>
  )
}

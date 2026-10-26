import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code,
  Globe,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Mail,
  Send,
  CheckCircle2,
  Download,
  Terminal,
  ShieldCheck,
  Server,
  Activity,
  ArrowRight,
} from "../components/Icons";
import { Card, Header, Button } from "../components/UI";
import { useForm, validators } from "../hooks/useForm";
import { TextInput, TextareaField } from "../components/forms";

export const portfolioProjects = [
  {
    id: "netflow-telemetry",
    title: "NetFlow: Smart Campus Network Monitoring System",
    category: "Full System",
    tagline: "Enterprise real-time infrastructure telemetry & status dashboard",
    description:
      "A multi-page SPA featuring live telemetry simulations, campus topology visualization, device CRUD registry, and automated incident triage correlation.",
    tech: ["React 18", "React Router 6", "Context API", "CSS Grid & Flexbox"],
    metrics: "Sub-15ms live simulation loop, 98.4% uptime telemetry, zero-dependency charts",
    link: "/portfolio/netflow-telemetry",
    demoPath: "/",
    featured: true,
  },
  {
    id: "requisition-cart",
    title: "Campus Hardware Requisition & Shopping Cart Engine",
    category: "State Management",
    tagline: "Fine-grained Zustand store with equipment catalog & validation checkout",
    description:
      "A complete Shopping Cart mini-project utilizing Zustand for selector subscriptions, local storage persistence, duration calculations, and strict validation checkout.",
    tech: ["Zustand", "Custom useForm", "Controlled Components", "Validation Strategies"],
    metrics: "Atomic re-renders, 100% academic subsidy workflow, automatic booking synchronization",
    link: "/portfolio/requisition-cart",
    demoPath: "/cart",
    featured: true,
  },
  {
    id: "campus-topology",
    title: "Interactive Campus Network Topology Visualizer",
    category: "UI / Canvas",
    tagline: "Coordinate-based interactive map connecting physical and virtual nodes",
    description:
      "Dynamic visual map of university network backbones, gateways, and edge nodes with real-time ping simulation and node inspector overlays.",
    tech: ["SVG / CSS Positioning", "DOM Events", "Async ICMP Simulation", "Context Hook"],
    metrics: "7 core node zones, live packet loss & interface saturation metrics",
    link: "/portfolio/campus-topology",
    demoPath: "/network",
    featured: false,
  },
  {
    id: "incident-triage",
    title: "Incident Triage Board & Device Status Correlation",
    category: "Diagnostics",
    tagline: "Automated event escalation board triggered by device state changes",
    description:
      "Incident tracker that automatically generates High Severity alerts whenever a critical switch or router is powered down or loses packets.",
    tech: ["Event-Driven State", "Filter Pipelines", "Real-Time Logs", "Modal Portals"],
    metrics: "Instant power toggle simulation, multi-level severity filtering",
    link: "/portfolio/incident-triage",
    demoPath: "/incidents",
    featured: false,
  },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [contactSuccess, setContactSuccess] = useState(false);

  const filterOptions = ["All", "Full System", "State Management", "UI / Canvas", "Diagnostics"];

  const filteredProjects = portfolioProjects.filter((p) =>
    filter === "All" ? true : p.category === filter
  );

  // Contact form using custom useForm hook with validation
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "Front End Engineering-II Project Query",
      message: "",
    },
    validationRules: {
      name: [validators.required("Your name is required."), validators.minLength(2)],
      email: [validators.required("Email address is required."), validators.email()],
      message: [
        validators.required("Message cannot be empty."),
        validators.minLength(10, "Please enter at least 10 characters."),
      ],
    },
    onSubmit: async (fValues) => {
      await new Promise((r) => setTimeout(r, 600));
      setContactSuccess(true);
      resetForm();
      setTimeout(() => setContactSuccess(false), 5000);
    },
  });

  return (
    <div className="portfolio-wrapper">
      {/* Hero Developer Card */}
      <div className="portfolio-hero">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={14} /> Front End Engineering-II • Course 25CSE0203
          </div>
          <h1>Student Developer & UI/UX Engineer</h1>
          <p className="hero-lead">
            B.E. Computer Science & Engineering (3rd Semester). Specializing in modern React 18
            Single-Page Application architecture, custom state management with <b>Context API</b> and{" "}
            <b>Zustand</b>, robust form validation strategies, and enterprise dashboard engineering.
          </p>

          <div className="hero-badges">
            <span className="badge-tech">React 18</span>
            <span className="badge-tech">React Router 6</span>
            <span className="badge-tech">Zustand Store</span>
            <span className="badge-tech">Context API</span>
            <span className="badge-tech">Vitest / RTL</span>
            <span className="badge-tech">CSS Design Tokens</span>
          </div>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              <FolderGit2 size={16} /> Explore Projects
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                alert("Downloading Student Developer Resume / Project Specification PDF...");
              }}
            >
              <Download size={16} /> Download Project CV
            </button>
          </div>
        </div>

        <div className="hero-aside-card">
          <div className="dev-avatar-box">
            <div className="dev-avatar">FE</div>
            <div className="dev-details">
              <b>CSE Engineering Student</b>
              <small>B.E. (Batch 2025) • 3rd Sem</small>
            </div>
          </div>
          <div className="dev-stats-grid">
            <div className="d-stat">
              <b>12+</b>
              <span>SPA Pages & Views</span>
            </div>
            <div className="d-stat">
              <b>2</b>
              <span>Mini-Projects</span>
            </div>
            <div className="d-stat">
              <b>100%</b>
              <span>Topics Verified</span>
            </div>
            <div className="d-stat">
              <b>Vitest</b>
              <span>Automated Tests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <Card style={{ margin: "24px 0" }}>
        <Header
          title="Core Technical Competencies & Syllabus Coverage"
          subtitle="Front End Engineering-II required topics and demonstrated practical applications"
        />

        <div className="skills-grid">
          <div className="skill-box">
            <div className="skill-icon">
              <Code size={20} />
            </div>
            <h4>Modern React & Routing</h4>
            <p>
              Functional components, custom hooks, nested layouts with <code>&lt;Outlet /&gt;</code>,
              dynamic route parameters (<code>useParams</code>), route guards (<code>ProtectedRoute</code>).
            </p>
          </div>

          <div className="skill-box">
            <div className="skill-icon">
              <Layers size={20} />
            </div>
            <h4>State Architecture</h4>
            <p>
              Local state (<code>useState</code>), multi-provider React Context API (
              <code>AuthContext</code>, <code>DataContext</code>), and lightweight fine-grained global
              store with <b>Zustand</b>.
            </p>
          </div>

          <div className="skill-box">
            <div className="skill-icon">
              <Terminal size={20} />
            </div>
            <h4>Form Handling & Validation</h4>
            <p>
              Controlled forms, reusable input components (<code>TextInput</code>,{" "}
              <code>SelectField</code>, <code>TextareaField</code>), regex validators (RFC email,
              IPv4, length), on-blur touch tracking.
            </p>
          </div>

          <div className="skill-box">
            <div className="skill-icon">
              <Activity size={20} />
            </div>
            <h4>Async State & Testing</h4>
            <p>
              Loading skeletons, error states with retry fallback, asynchronous Promise simulation,
              and comprehensive unit/integration testing with <b>Vitest</b>.
            </p>
          </div>
        </div>
      </Card>

      {/* Projects Showcase with Routing */}
      <div id="projects" style={{ marginTop: "32px" }}>
        <Card>
          <Header
            title="Featured Projects & Case Studies"
            subtitle="Click any project to inspect the full case study with dynamic route parameters (/portfolio/:projectId)"
          />

          <div className="filter-pills" style={{ marginBottom: "20px" }}>
            {filterOptions.map((opt) => (
              <button
                key={opt}
                className={`filter-pill ${filter === opt ? "active" : ""}`}
                onClick={() => setFilter(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="portfolio-projects-grid">
            {filteredProjects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-card-header">
                  <span className="project-category-badge">{project.category}</span>
                  {project.featured && <span className="featured-pill">Featured</span>}
                </div>

                <h3>{project.title}</h3>
                <p className="project-tagline">{project.tagline}</p>
                <p className="project-desc">{project.description}</p>

                <div className="project-tech-tags">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-metrics-box">
                  <small>Performance & Architecture:</small>
                  <b>{project.metrics}</b>
                </div>

                <div className="project-card-actions">
                  <Link to={project.link} className="btn btn-primary sm">
                    Case Study & Details <ArrowRight size={14} />
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost sm"
                    onClick={() => navigate(project.demoPath)}
                  >
                    Live Module <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Interactive Contact / Viva Form */}
      <Card style={{ marginTop: "28px" }}>
        <Header
          title="Examiner & Inquirer Contact Channel"
          subtitle="Form handling demonstrated with custom validation hook and reusable input components"
        />

        {contactSuccess && (
          <div className="success-banner" role="alert">
            <CheckCircle2 size={18} />
            <span>Thank you! Your feedback message has been submitted successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
          <TextInput
            label="Your Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            touched={touched.name}
            required
            placeholder="e.g. Professor / Assessment Examiner"
          />

          <TextInput
            label="Your Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
            placeholder="e.g. examiner@university.edu"
          />

          <TextareaField
            label="Feedback / Assessment Note"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.message}
            touched={touched.message}
            required
            placeholder="Write your comments regarding the portfolio site or mini project..."
            rows={4}
            maxLength={300}
          />

          <div style={{ marginTop: "16px" }}>
            <Button type="submit" disabled={isSubmitting} icon={<Send size={15} />}>
              {isSubmitting ? "Sending..." : "Submit Message"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

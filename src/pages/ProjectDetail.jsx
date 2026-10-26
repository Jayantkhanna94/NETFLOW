import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Code,
  Layers,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Server,
} from "../components/Icons";
import { portfolioProjects } from "./Portfolio";
import { Card, Header, Button } from "../components/UI";

// Detailed architectural breakdown for each project
const projectDetailsData = {
  "netflow-telemetry": {
    architecture: [
      "Vite + React 18 functional component tree with clean separation of presentation and logic.",
      "DataContext custom provider running an active 3.5-second telemetry simulation loop.",
      "Live metrics computation (moving average throughput, packet loss jitter, active ports).",
      "Dynamic theme switching using CSS root tokens and dataset attributes.",
    ],
    challenges: [
      "Maintaining high UI framerate during rolling 3.5s interval state updates.",
      "Preventing cascading re-renders across the dashboard table by using memoized derivations.",
      "Responsive layout transitioning seamlessly from desktop 4-column cards to mobile single-column stacks.",
    ],
    topicsCovered: [
      "React Router nested routes (<Outlet />) with route guards",
      "Context API state sharing without prop-drilling",
      "CSS Grid & Flexbox responsive design",
      "DOM manipulation via document.documentElement.dataset",
    ],
    demoRoute: "/",
  },
  "requisition-cart": {
    architecture: [
      "Fine-grained global store using Zustand with zero boilerplate provider wrappers.",
      "Slice design pattern handling cart items, catalog lookup, and order history.",
      "Browser LocalStorage synchronization ensuring state persists across page refreshes.",
      "Strict form validation strategy verifying RFC email format, return dates, and required fields.",
    ],
    challenges: [
      "Synchronizing Zustand checkout orders with React Context bookings in real time.",
      "Managing item duration calculations and date range bounds safely.",
      "Designing controlled inputs that deliver instant on-blur and on-change feedback.",
    ],
    topicsCovered: [
      "Intro to Zustand / Redux Toolkit state pattern",
      "Global vs local state separation",
      "Shopping cart CRUD (add, update quantity, remove, clear)",
      "Reusable controlled input components and validation rules",
    ],
    demoRoute: "/cart",
  },
  "campus-topology": {
    architecture: [
      "Relative coordinate percentage positioning (x%, y%) creating scalable network map.",
      "SVG connection lines representing fiber trunks and Ethernet distribution links.",
      "Bi-directional status synchronization matching live devices registered in DataContext.",
      "Diagnostic ICMP ping terminal simulation executing multi-packet echo requests.",
    ],
    challenges: [
      "Handling dynamic status changes when a device is toggled offline in another tab/view.",
      "Building a terminal emulator with simulated asynchronous network latencies (10-30ms).",
    ],
    topicsCovered: [
      "DOM event handling and interactive coordinate canvas",
      "Async Promise sequencing with setTimeout / interval",
      "Context consumption in nested child components",
    ],
    demoRoute: "/network",
  },
  "incident-triage": {
    architecture: [
      "Automatic incident escalation engine triggered when device power status is toggled.",
      "Severity-based filtering pipeline (Critical, High, Medium, Low, Resolved).",
      "Real-time activity audit log stream tracking all user actions.",
      "Modal popup for incident reporting with controlled inputs.",
    ],
    challenges: [
      "Correlating device IDs with active incident tickets automatically.",
      "Persisting resolved status without mutating historical logs.",
    ],
    topicsCovered: [
      "Event-driven state synchronization",
      "Filter pipelines and memoized arrays",
      "Accessible modal overlays and keyboard interactions",
    ],
    demoRoute: "/incidents",
  },
};

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = portfolioProjects.find((p) => p.id === projectId);
  const details = projectDetailsData[projectId];

  if (!project) {
    return (
      <Card style={{ textAlign: "center", padding: "48px 24px" }}>
        <h2>Project Case Study Not Found</h2>
        <p style={{ color: "var(--muted)" }}>
          The requested project ID <code>{projectId}</code> does not exist in the portfolio.
        </p>
        <Link to="/portfolio" className="btn btn-primary" style={{ marginTop: "16px" }}>
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </Card>
    );
  }

  return (
    <div className="project-detail-wrapper">
      {/* Breadcrumb Navigation */}
      <div className="detail-breadcrumb">
        <Link to="/portfolio">Portfolio</Link>
        <span>/</span>
        <b>{project.title}</b>
      </div>

      <div className="detail-header-card">
        <div className="d-head-left">
          <span className="role">{project.category}</span>
          <h1>{project.title}</h1>
          <p className="detail-tagline">{project.tagline}</p>
        </div>
        <div className="d-head-actions">
          <Link to="/portfolio" className="btn btn-ghost sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <button
            type="button"
            className="btn btn-primary sm"
            onClick={() => navigate(project.demoPath)}
          >
            Launch Live Module <ExternalLink size={14} />
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left Column: Problem & Architecture */}
        <div className="detail-main">
          <Card>
            <Header
              title="Project Architecture & Implementation"
              subtitle="Structural breakdown of components, state, and rendering pipeline"
            />
            <ul className="detail-list">
              {details?.architecture?.map((item, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card style={{ marginTop: "20px" }}>
            <Header
              title="Engineering Challenges & Solutions"
              subtitle="Key technical hurdles addressed during development"
            />
            <div className="challenges-list">
              {details?.challenges?.map((item, idx) => (
                <div key={idx} className="challenge-item">
                  <span className="challenge-num">{idx + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Topics & Specs */}
        <div className="detail-sidebar">
          <Card>
            <Header
              title="Syllabus Topics Verified"
              subtitle="Curriculum skills demonstrated"
            />
            <div className="topics-covered-list">
              {details?.topicsCovered?.map((topic, idx) => (
                <div key={idx} className="topic-badge-row">
                  <Cpu size={14} color="var(--success)" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ marginTop: "20px" }}>
            <Header title="Technology Stack" subtitle="Libraries & tooling" />
            <div className="detail-tech-stack">
              {project.tech.map((t, idx) => (
                <span key={idx} className="badge-tech">
                  {t}
                </span>
              ))}
            </div>
            <div style={{ marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => navigate(project.demoPath)}
              >
                Open Live Interactive Demo <ExternalLink size={14} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

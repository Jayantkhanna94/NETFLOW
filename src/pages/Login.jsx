import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  LogOut,
  ShieldCheck,
} from "../components/Icons";
import { useAuth } from "../contexts/AuthContext";
import { AuthLayout, AuthHead, Input } from "../components/UI";
import { validateEmail, validateRequired } from "../services/validation";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loggedIn, currentUser, logout } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [notice, setNotice] = useState(location.state?.message || "");

  const handleDemoLogin = () => {
    setEmail("admin@netflow.com");
    setPass("admin123");
    setErr("");
    setFieldErrors({});
    const result = login("admin@netflow.com", "admin123", remember);
    if (result.success) {
      navigate("/", { replace: true });
    }
  };

  const validate = () => {
    const errs = {};
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const passErr = validateRequired(pass, "Password");
    if (passErr) errs.password = passErr;

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  function submit(e) {
    e.preventDefault();
    setErr("");
    setNotice("");
    setTouched({ email: true, password: true });

    if (!validate()) {
      return;
    }

    const result = login(email, pass, remember);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setErr(result.error || "Invalid login credentials.");
    }
  }

  const handleLogoutCurrent = () => {
    logout();
    setEmail("");
    setPass("");
  };

  return (
    <AuthLayout
      title="Welcome to NetFlow"
      desc="Sign in to your smart campus monitoring and network control portal."
      features={[
        "First-time login authentication protection",
        "Real-time campus network & device visibility",
        "Multi-page session logout controls",
      ]}
    >
      <form className="auth-card" onSubmit={submit} noValidate>
        <AuthHead
          title="Sign in"
          desc="Enter your credentials to access the NetFlow portal"
        />

        {loggedIn && currentUser && (
          <div
            style={{
              background: "rgba(61, 131, 246, 0.08)",
              border: "1px solid rgba(61, 131, 246, 0.25)",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "20px",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <ShieldCheck size={16} color="var(--primary)" />
              <b>Already signed in</b>
            </div>
            <div style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "10px" }}>
              Logged in as <b>{currentUser.name}</b> ({currentUser.email})
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, height: "36px", fontSize: "11px" }}
                onClick={() => navigate("/")}
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{
                  height: "36px",
                  fontSize: "11px",
                  color: "var(--danger)",
                  borderColor: "rgba(255, 92, 101, 0.3)",
                }}
                onClick={handleLogoutCurrent}
              >
                <LogOut size={13} style={{ marginRight: "4px" }} />
                Logout
              </button>
            </div>
          </div>
        )}

        {notice && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(50, 213, 131, 0.09)",
              border: "1px solid rgba(50, 213, 131, 0.25)",
              color: "var(--success)",
              fontSize: "11px",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <CheckCircle2 size={15} />
            {notice}
          </div>
        )}

        {/* 1-Click Demo Login Action */}
        <button
          type="button"
          onClick={handleDemoLogin}
          style={{
            width: "100%",
            padding: "11px 16px",
            background: "linear-gradient(135deg, rgba(61, 131, 246, 0.12), rgba(31, 183, 214, 0.12))",
            border: "1px dashed var(--primary)",
            borderRadius: "10px",
            color: "var(--primary)",
            fontWeight: 700,
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            marginBottom: "18px",
            transition: "all 0.2s",
          }}
        >
          <Zap size={15} />
          <span>⚡ One-Click Demo Admin Login</span>
        </button>

        <label htmlFor="login-email">Email address</label>
        <Input
          id="login-email"
          icon={<Mail size={17} />}
          value={email}
          onChange={(v) => setEmail(String(v))}
          onBlur={() => handleBlur("email")}
          error={fieldErrors.email}
          touched={touched.email}
          type="email"
          placeholder="admin@netflow.com"
        />

        <label htmlFor="login-password" style={{ marginTop: "14px", display: "block" }}>Password</label>
        <div
          className="input-wrap"
          style={
            fieldErrors.password && touched.password
              ? { borderColor: "var(--danger)", boxShadow: "0 0 0 1px var(--danger)" }
              : undefined
          }
        >
          <Lock size={17} />
          <input
            id="login-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onBlur={() => handleBlur("password")}
            type={show ? "text" : "password"}
            placeholder="Enter your password (e.g. admin123)"
            required
          />
          <button
            type="button"
            className="input-action"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {fieldErrors.password && touched.password && (
          <small role="alert" style={{ color: "var(--danger)", fontSize: "10px", display: "block", marginTop: "4px" }}>
            {fieldErrors.password}
          </small>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
            fontSize: "11px",
            color: "var(--muted)",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", margin: 0 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: "var(--primary)" }}
            />
            <span>Remember me</span>
          </label>
          <span style={{ color: "var(--muted)", fontSize: "10px" }}>
            Demo: admin@netflow.com / admin123
          </span>
        </div>

        {err && <div className="form-error">{err}</div>}

        <button className="auth-submit" type="submit">
          Sign in <ArrowUpRight size={17} />
        </button>

        <div className="auth-divider">New to NetFlow?</div>
        <Link className="auth-secondary" to="/signup">
          Create an account
        </Link>
      </form>
    </AuthLayout>
  );
}

export { Login };
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, UserRound, ArrowUpRight } from "../components/Icons";
import { useAuth } from "../contexts/AuthContext";
import { AuthLayout, AuthHead, Input } from "../components/UI";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
} from "../services/validation";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [f, setF] = useState({
    name: "",
    email: "",
    role: "Student",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [show, setShow] = useState(false);

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const strength =
    f.password.length >= 10
      ? 4
      : f.password.length >= 8
      ? 3
      : f.password.length >= 6
      ? 2
      : f.password
      ? 1
      : 0;

  const validate = () => {
    const errs = {};
    const nameErr = validateRequired(f.name, "Full Name");
    if (nameErr) errs.name = nameErr;

    const emailErr = validateEmail(f.email);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(f.password, 6);
    if (passErr) errs.password = passErr;

    const matchErr = validatePasswordMatch(f.password, f.confirm);
    if (matchErr) errs.confirm = matchErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  function submit(e) {
    e.preventDefault();
    setErr("");
    setTouched({ name: true, email: true, password: true, confirm: true });

    if (!validate()) {
      return;
    }

    const result = signup({
      name: f.name,
      email: f.email,
      role: f.role,
      password: f.password,
    });

    if (result.success) {
      // Automatically log the new user into the platform and enter dashboard
      login(f.email, f.password);
      navigate("/", { replace: true });
    } else {
      setErr(result.error || "Failed to create account.");
    }
  }

  return (
    <AuthLayout
      title="Join the NetFlow network."
      desc="Create an account for smart campus monitoring, resources, alerts and telemetry."
      features={[
        "Infrastructure and device management",
        "Incident and alert visibility",
      ]}
    >
      <form className="auth-card signup-card" onSubmit={submit} noValidate>
        <AuthHead title="Create account" desc="Set up your NetFlow profile" />
        <div className="two-col">
          <div>
            <label htmlFor="signup-name">Full name</label>
            <Input
              id="signup-name"
              icon={<User size={17} />}
              value={f.name}
              onChange={(v) => set("name", String(v))}
              onBlur={() => handleBlur("name")}
              error={errors.name}
              touched={touched.name}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="signup-role">Account type</label>
            <div className="input-wrap">
              <UserRound size={17} />
              <select
                id="signup-role"
                value={f.role}
                onChange={(e) => set("role", e.target.value)}
              >
                <option>Student</option>
                <option>Faculty</option>
              </select>
            </div>
          </div>
        </div>

        <label htmlFor="signup-email">Email address</label>
        <Input
          id="signup-email"
          icon={<Mail size={17} />}
          value={f.email}
          onChange={(v) => set("email", String(v))}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          touched={touched.email}
          type="email"
          placeholder="you@college.edu"
        />

        <div className="two-col">
          <div>
            <label htmlFor="signup-password">Password</label>
            <div
              className="input-wrap"
              style={
                errors.password && touched.password
                  ? { borderColor: "var(--danger)", boxShadow: "0 0 0 1px var(--danger)" }
                  : undefined
              }
            >
              <Lock size={17} />
              <input
                id="signup-password"
                value={f.password}
                onChange={(e) => set("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                type={show ? "text" : "password"}
                placeholder="Minimum 6 characters"
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
            {errors.password && touched.password && (
              <small role="alert" style={{ color: "var(--danger)", fontSize: "10px", display: "block", marginTop: "4px" }}>
                {errors.password}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="signup-confirm">Confirm password</label>
            <Input
              id="signup-confirm"
              icon={<Lock size={17} />}
              value={f.confirm}
              onChange={(v) => set("confirm", String(v))}
              onBlur={() => handleBlur("confirm")}
              error={errors.confirm}
              touched={touched.confirm}
              type={show ? "text" : "password"}
              placeholder="Repeat password"
            />
          </div>
        </div>

        <div className="strength">
          <div>
            {[1, 2, 3, 4].map((i) => (
              <i key={i} className={i <= strength ? "filled" : ""} />
            ))}
          </div>
          <span>
            {["Password strength", "Weak", "Fair", "Good", "Strong"][strength]}
          </span>
        </div>

        {err && <div className="form-error">{err}</div>}

        <label className="check-line">
          <input type="checkbox" required />{" "}
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>

        <button className="auth-submit" type="submit">
          Create account <ArrowUpRight size={17} />
        </button>

        <div className="auth-login-line">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export { Signup };

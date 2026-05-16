import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { loginSchema } from "../../validations/auth.validation";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { CheckCircle2, Loader2, LayoutDashboard, Shield, Zap, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.data.user, data.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", fontFamily: "inherit" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "48%",
          backgroundColor: "#0F172A",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glows */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(16,185,129,0.08)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(16,185,129,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LayoutDashboard style={{ width: 18, height: 18, color: "#34d399" }} />
          </div>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Worksync</span>
        </div>

        {/* Main copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 999, padding: "5px 14px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
            <span style={{ color: "#34d399", fontSize: 11, fontWeight: 500, letterSpacing: "0.04em" }}>Trusted by 10,000+ teams</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 700, lineHeight: 1.22, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Manage your workspace<br />
            <span style={{ color: "#34d399" }}>with pure elegance.</span>
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65, marginBottom: 28, maxWidth: 300 }}>
            Organize tasks, track project progress, and ship faster with our productivity platform built for modern teams.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { Icon: CheckCircle2, text: "Real-time collaboration" },
              { Icon: Zap, text: "Automated workflows" },
              { Icon: Shield, text: "Enterprise-grade security" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 13, height: 13, color: "#34d399" }} />
                </div>
                <span style={{ color: "#cbd5e1", fontSize: 13 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex" }}>
            {[["#7c3aed", "A"], ["#0284c7", "B"], ["#d97706", "C"], ["#db2777", "D"]].map(([bg, l], i) => (
              <div key={l} style={{ width: 28, height: 28, borderRadius: "50%", background: bg, border: "2px solid #0F172A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, marginLeft: i === 0 ? 0 : -8 }}>
                {l}
              </div>
            ))}
          </div>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Join thousands of happy teams</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#f0fdf4", border: "1px solid #d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LayoutDashboard style={{ width: 18, height: 18, color: "#059669" }} />
              </div>
              <span style={{ color: "#111827", fontWeight: 600, fontSize: 16 }}>Worksync</span>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", marginBottom: 6 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
              Sign in to continue to your workspace.
            </p>
            <div style={{ marginTop: 12, padding: "10px 14px", backgroundColor: "#f0fdf4", border: "1px solid #d1fae5", borderRadius: 8, fontSize: 13, color: "#047857" }}>
              <strong>🚀 Demo Accounts (ready to use):</strong><br />
              Admin: <code>admin@demo.com</code> / <code>password123</code><br />
              Member: <code>alice@demo.com</code> / <code>password123</code>
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>

            {/* Email field */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="email"
                style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 8 }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                {...register("email")}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: errors.email ? "1.5px solid #fca5a5" : "1.5px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#111827",
                  background: errors.email ? "#fff7f7" : "#f9fafb",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "#059669"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(5,150,105,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? "#fca5a5" : "#e5e7eb"; e.target.style.background = errors.email ? "#fff7f7" : "#f9fafb"; e.target.style.boxShadow = "none"; }}
              />
              {errors.email && (
                <p style={{ marginTop: 6, fontSize: 12.5, fontWeight: 500, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#fee2e2", color: "#ef4444", fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>!</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label
                  htmlFor="password"
                  style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}
                >
                  Password
                </label>
                <Link
                  to="#"
                  style={{ fontSize: 12.5, fontWeight: 600, color: "#059669", textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("password")}
                    style={{
                      width: "100%",
                      padding: "11px 40px 11px 14px",
                      border: errors.password ? "1.5px solid #fca5a5" : "1.5px solid #e5e7eb",
                      borderRadius: 10,
                      fontSize: 14,
                      color: "#111827",
                      background: errors.password ? "#fff7f7" : "#f9fafb",
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#059669"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(5,150,105,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = errors.password ? "#fca5a5" : "#e5e7eb"; e.target.style.background = errors.password ? "#fff7f7" : "#f9fafb"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              {errors.password && (
                <p style={{ marginTop: 6, fontSize: 12.5, fontWeight: 500, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#fee2e2", color: "#ef4444", fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>!</span>
                  {errors.password.message}
                </p>
              )}
            </div>

          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "13px 20px",
              background: isLoading ? "#6ee7b7" : "#059669",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 20,
              transition: "background 0.15s",
              boxSizing: "border-box",
            }}
            onMouseEnter={e => { if (!isLoading) e.target.style.background = "#047857"; }}
            onMouseLeave={e => { if (!isLoading) e.target.style.background = "#059669"; }}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                Signing in…
              </>
            ) : "Sign in"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, letterSpacing: "0.05em" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
          </div>

          {/* Sign-up */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#059669", fontWeight: 700, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>

          {/* Trust */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Shield style={{ width: 13, height: 13, color: "#d1d5db", flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: "#9ca3af" }}>256-bit SSL encrypted · SOC 2 compliant</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
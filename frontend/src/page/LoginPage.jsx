import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthShell, PosterSide, Field, SocialRow, Divider, BTN_PRIMARY, Sparkle } from '../components/AuthLayout';

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <AuthShell
      side={
        <PosterSide
          kicker="◆ WELCOME BACK"
          headline={<>Don't break<br/><em>the chain.</em></>}
          sub="Your streak is right where you left it. Today's problem is already in your queue."
          badge={{ kicker: "DAY", big: "47", bigSize: 56, sub: "STREAK" }}
          testimonial={{
            q: "Best part of my morning. Coffee, then a graph problem, then meetings.",
            initial: "R", who: "RACHEL K. · SR. ENG @ ANTHROPIC",
          }}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.2em", color: "var(--cobalt)" }}>SIGN IN</div>
        <h1 style={{ fontFamily: "var(--f-display)", fontSize: 72, lineHeight: 0.95, margin: "10px 0 8px", color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Hey, you're <em style={{ color: "var(--cobalt)" }}>back.</em>
        </h1>
        <p style={{ fontSize: 14, color: "rgba(15,26,61,0.7)", margin: "0 0 30px" }}>
          New here?{" "}
          <Link to="/signup" style={{ color: "var(--cobalt)", textDecoration: "underline" }}>Make an account →</Link>
        </p>

        <SocialRow />
        <Divider>or</Divider>

        <Field
          label="Email"
          type="email"
          placeholder="rachel@gmail.com"
          reg={register("email")}
          error={errors.email?.message}
        />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••••"
          reg={register("password")}
          error={errors.password?.message}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center", margin: "4px 0 22px", fontSize: 13, color: "rgba(15,26,61,0.8)" }}>
          <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "#1E3FA8" }}/>
          Remember me on this device
        </label>

        <button type="submit" disabled={isLoggingIn} style={BTN_PRIMARY}>
          {isLoggingIn ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Continue your streak →"}
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22, fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em", color: "rgba(15,26,61,0.55)" }}>
          <Sparkle size={10} color="var(--cobalt)" />
          <span>SECURED · END-TO-END</span>
          <Sparkle size={10} color="var(--cobalt)" />
        </div>
      </form>
    </AuthShell>
  );
};

export default LoginPage;

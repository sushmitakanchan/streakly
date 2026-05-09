import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthShell, PosterSide, Field, SocialRow, Divider, BTN_PRIMARY } from '../components/AuthLayout';

const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpPage = () => {
  const { signup, isSigninUp } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
    } catch (err) {
      console.error("SignUp failed", err);
    }
  };

  return (
    <AuthShell
      side={
        <PosterSide
          kicker="◆ JOIN THE STREAK"
          headline={<>Day one,<br/><em>right now.</em></>}
          sub="2,400 problems. 180 community playlists. Four languages. One cobalt square at a time."
          badge={{ kicker: "FREE", big: "14d", sub: "TRIAL" }}
          stats={[{ k: "12,481", l: "ACTIVE TODAY" }, { k: "2,400+", l: "PROBLEMS" }, { k: "47", l: "AVG STREAK" }]}
          testimonial={{
            q: "Started for interview prep. Stayed for the streak calendar.",
            initial: "R", who: "RACHEL K. · 120-DAY STREAK",
          }}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.2em", color: "var(--cobalt)" }}>CREATE ACCOUNT</div>
        <h1 style={{ fontFamily: "var(--f-display)", fontSize: 64, lineHeight: 0.95, margin: "10px 0 8px", color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Make an <em style={{ color: "var(--cobalt)" }}>account.</em>
        </h1>
        <p style={{ fontSize: 14, color: "rgba(15,26,61,0.7)", margin: "0 0 28px" }}>
          Already streaking?{" "}
          <Link to="/login" style={{ color: "var(--cobalt)", textDecoration: "underline" }}>Sign in →</Link>
        </p>

        <SocialRow />
        <Divider>or with email</Divider>

        <Field
          label="Full name"
          placeholder="Rachel Kim"
          reg={register("name")}
          error={errors.name?.message}
        />
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
          helper="At least 6 characters."
          reg={register("password")}
          error={errors.password?.message}
        />

        <label style={{ display: "flex", gap: 10, alignItems: "start", margin: "8px 0 22px", fontSize: 13, color: "rgba(15,26,61,0.75)", lineHeight: 1.5 }}>
          <input type="checkbox" defaultChecked style={{ marginTop: 3, width: 16, height: 16, accentColor: "#1E3FA8" }}/>
          <span>Email me today's problem at 9:00 AM. (Change anytime.)</span>
        </label>

        <button type="submit" disabled={isSigninUp} style={BTN_PRIMARY}>
          {isSigninUp ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : "Start your streak →"}
        </button>

        <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "rgba(15,26,61,0.55)", marginTop: 18, textAlign: "center", lineHeight: 1.6 }}>
          BY SIGNING UP YOU AGREE TO OUR TERMS AND PRIVACY POLICY.
        </p>
      </form>
    </AuthShell>
  );
};

export default SignUpPage;

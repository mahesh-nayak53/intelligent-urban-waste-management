import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Recycle,
  ShieldCheck,
} from "lucide-react";

import {
  loginUser,
  registerCitizen,
  requestPasswordOtp,
  resetPassword,
} from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registration, setRegistration] = useState({
    name: "",
    phone: "",
  });
  const [registrationComplete, setRegistrationComplete] =
    useState(false);
  const [registrationRole, setRegistrationRole] =
    useState("CITIZEN");
  const [isResetting, setIsResetting] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("EMAIL");
  const [otp, setOtp] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password);

      const token = data.token?.trim();
      const role = data.role?.trim().toUpperCase();

      if (
        !token ||
        !["ADMIN", "STAFF", "CITIZEN", "WORKER"].includes(role)
      ) {
        throw new Error(
          "Login response contains an invalid role"
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", data.name);

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STAFF") {
        navigate("/staff/dashboard");
      } else if (role === "WORKER") {
        navigate("/worker/dashboard");
      } else {
        navigate("/citizen/dashboard");
      }
    } catch (requestError) {
      const status = requestError.response?.status;
      const serverMessage = requestError.response?.data?.message;

      setError(
        serverMessage ||
          (status
            ? `Login failed (${status}). Please verify your credentials.`
            : "Unable to reach the login service.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");
    setRegistrationComplete(false);
    setIsSubmitting(true);

    try {
      await registerCitizen({
        name: registration.name,
        email,
        password,
        phone: registration.phone,
        role: registrationRole,
      });

      setIsRegistering(false);
      setRegistrationComplete(true);
      setPassword("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      if (!otpRequested) {
        await requestPasswordOtp({
          email,
          method: deliveryMethod,
        });

        setOtpRequested(true);
      } else {
        await resetPassword({
          email,
          otp,
          newPassword: password,
        });

        setIsResetting(false);
        setOtpRequested(false);
        setRegistrationComplete(true);
        setPassword("");
        setOtp("");
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to reset your password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRegistration = (field, value) => {
    setRegistration((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const beginRegistration = (role) => {
    setIsRegistering(true);
    setIsResetting(false);
    setRegistrationRole(role);
    setError("");
    setRegistrationComplete(false);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  const iconInputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      {/* Left Brand Panel */}
      <section
        aria-labelledby="brand-title"
        className="relative hidden min-h-screen overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between"
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col px-10 py-10 xl:px-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Recycle size={23} strokeWidth={2.5} />
            </span>

            <span className="text-xl font-bold tracking-tight">
              CleanCity
            </span>
          </div>

          {/* Main Copy */}
          <div className="my-auto max-w-xl py-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              City operations platform
            </p>

            <h1
              id="brand-title"
              className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl"
            >
              A cleaner city starts with better coordination.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Intelligent tools for the teams keeping every
              street, service, and community moving forward.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck size={19} />
                </span>

                <div>
                  <strong className="block text-sm font-semibold text-white">
                    Smart Complaint Management
                  </strong>

                  <small className="mt-1 block text-sm text-slate-500">
                    Resolve issues with clarity and speed.
                  </small>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <Activity size={19} />
                </span>

                <div>
                  <strong className="block text-sm font-semibold text-white">
                    Workforce &amp; Task Coordination
                  </strong>

                  <small className="mt-1 block text-sm text-slate-500">
                    Keep field teams aligned in real time.
                  </small>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <Recycle size={19} />
                </span>

                <div>
                  <strong className="block text-sm font-semibold text-white">
                    City Operations Analytics
                  </strong>

                  <small className="mt-1 block text-sm text-slate-500">
                    Turn daily activity into better decisions.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
            INTELLIGENT URBAN WASTE MANAGEMENT SYSTEM
          </p>
        </div>
      </section>

      {/* Right Panel */}
      <section
        aria-label="Sign in"
        className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10"
      >
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Recycle size={20} strokeWidth={2.5} />
            </span>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              CleanCity
            </span>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            {/* Heading */}
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                {isRegistering
                  ? `${registrationRole} access`
                  : isResetting
                  ? "Account recovery"
                  : "Secure access"}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {isRegistering
                  ? `Create a ${registrationRole.toLowerCase()} account`
                  : isResetting
                  ? "Reset your password"
                  : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isRegistering
                  ? "Register to access the CleanCity platform."
                  : isResetting
                  ? "Choose where to receive a one-time verification code."
                  : "Sign in to continue to your operations dashboard."}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={
                isRegistering
                  ? handleRegistration
                  : isResetting
                  ? handlePasswordReset
                  : handleLogin
              }
              className="space-y-5"
            >
              {/* Name */}
              {isRegistering && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={registration.name}
                    autoComplete="name"
                    required
                    onChange={(e) =>
                      updateRegistration(
                        "name",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    autoComplete="email"
                    required
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className={iconInputClass}
                  />
                </div>
              </div>

              {/* Phone */}
              {isRegistering && (
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={registration.phone}
                    autoComplete="tel"
                    onChange={(e) =>
                      updateRegistration(
                        "phone",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )}

              {/* Delivery Method */}
              {isResetting && !otpRequested && (
                <div>
                  <label
                    htmlFor="delivery-method"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Send code by
                  </label>

                  <select
                    id="delivery-method"
                    value={deliveryMethod}
                    onChange={(e) =>
                      setDeliveryMethod(e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              )}

              {/* OTP */}
              {isResetting && otpRequested && (
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    One-time code
                  </label>

                  <input
                    id="otp"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    required
                    onChange={(e) => setOtp(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              {/* Password */}
              {(!isResetting || otpRequested) && (
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    {isResetting
                      ? "New password"
                      : "Password"}
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      aria-hidden="true"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      autoComplete={
                        isRegistering || isResetting
                          ? "new-password"
                          : "current-password"
                      }
                      required
                      minLength={6}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className={iconInputClass}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold">
                    !
                  </span>

                  <span>{error}</span>
                </div>
              )}

              {/* Success */}
              {registrationComplete && (
                <div
                  role="status"
                  className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check size={13} />
                  </span>

                  <span>
                    Account created. You can now sign in.
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? isRegistering
                    ? "Creating account..."
                    : isResetting
                    ? otpRequested
                      ? "Resetting password..."
                      : "Sending code..."
                    : "Signing in..."
                  : isRegistering
                  ? `Create ${registrationRole.toLowerCase()} account`
                  : isResetting
                  ? otpRequested
                    ? "Reset password"
                    : "Send verification code"
                  : "Sign in"}

                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 flex flex-col items-center gap-3 text-sm">
              {isRegistering ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError("");
                    setRegistrationComplete(false);
                  }}
                  className="font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
                >
                  Already have an account? Sign in
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    beginRegistration("CITIZEN")
                  }
                  className="font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
                >
                  Need a citizen account? Sign up
                </button>
              )}

              {!isRegistering && !isResetting && (
                <button
                  type="button"
                  onClick={() => {
                    setIsResetting(true);
                    setError("");
                    setRegistrationComplete(false);
                  }}
                  className="font-medium text-slate-500 transition hover:text-slate-700 hover:underline"
                >
                  Forgot your password?
                </button>
              )}

              {isResetting && (
                <button
                  type="button"
                  onClick={() => {
                    setIsResetting(false);
                    setOtpRequested(false);
                    setError("");
                  }}
                  className="font-medium text-slate-500 transition hover:text-slate-700 hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>

            {/* Assurance */}
            <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs font-medium text-slate-400">
              <Check size={15} className="text-emerald-500" />
              Protected municipal operations access
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;



import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md p-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            EduManage
          </h1>

          <p className="text-slate-500 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* ==========================================
            LOGIN FORM
        ========================================== */}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* ERROR MESSAGE */}

          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              disabled:bg-indigo-400
              disabled:cursor-not-allowed
              text-white
              font-medium
              py-3
              rounded-xl
              transition
            `}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* ==========================================
            DEMO ACCOUNTS
        ========================================== */}

        <p className="text-center text-sm text-slate-500 mt-6">
          Admin: admin@school.com / password
          <br />
          Teacher: teacher@school.com / password
        </p>

      </div>
    </div>
  );
}


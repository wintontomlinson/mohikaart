import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo auth
    if (email === "admin@mohikaart.com" && password === "admin123") {
      localStorage.setItem("mohika.admin", "true");
      navigate("/admin");
    } else {
      setError("Invalid credentials");
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center px-4">
      <div className={`w-full max-w-sm bg-white rounded-2xl p-8 shadow-lg ${error ? "animate-shake" : ""}`}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-[#1a1208] rounded-full flex items-center justify-center text-[#fdf9f0] font-serif text-xl font-bold mb-3">
            M
          </div>
          <h1 className="text-xl font-serif text-[#1a1208]">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1208] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1208] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-3.5 text-xs text-[#1a1208]/40"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold rounded-full hover:bg-[#1a1208]/90 transition-colors"
          >
            Login &rarr;
          </button>
        </form>

        <p className="text-[10px] text-[#1a1208]/30 text-center mt-6">
          Demo: admin@mohikaart.com / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

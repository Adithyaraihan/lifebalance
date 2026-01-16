import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { Activity, Loader, LogIn } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        identifier,
        password,
      });

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message ||
          "Login gagal, periksa koneksi atau kredensial Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page-container">
        {/* Elemen latar belakang cair (untuk ilusi liquid glass) */}
        <div className="liquid-blur-1"></div>
        <div className="liquid-blur-2"></div>

        <div className="login-card">
          {/* Header: Logo dan Nama Brand */}
          <div className="text-center">
            <div className="brand-logo mx-auto mb-2">
              <Activity size={24} />
            </div>
            <h2 className="brand-name">FitLife</h2>
            <p className="welcome-message">Selamat datang kembali</p>
          </div>

          {/* Pesan Error */}
          {error && <div className="error-message">{error}</div>}

          {/* Formulir */}
          <form onSubmit={handleLogin} className="form-spacing">
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="text"
                placeholder="nama@email.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            {/* Remember Me dan Lupa Password */}
            <div className="flex-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    marginRight: "8px",
                    accentColor: "var(--fit-green)",
                  }}
                />
                Ingat saya
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader size={20} className="mr-2 animate-spin" />{" "}
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Link Daftar */}
          <p className="register-text">
            Belum punya akun?{" "}
            <Link to="/register" className="register-link">
              Daftar sekarang
            </Link>
          </p>

          {/* Syarat & Ketentuan */}
          <p className="terms-privacy-text">
            Dengan masuk, Anda menyetujui{" "}
            <Link to="/syarat" className="terms-link">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link to="/kebijakan" className="terms-link">
              Kebijakan Privasi
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

// CSS Internal (Dengan penyesuaian jarak dan Glassmorphism)
const styles = `
    /* Definisi Warna FitLife */
    :root {
      --fit-green: #10B981; 
      --fit-green-dark: #059669; 
      --fit-gray-text: #4b5563; 
      --fit-link-green: #10B981;
      --fit-red: #ef4444; 
    }

    .login-page-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #e0f2f1, #d1f4d1); 
        padding: 20px;
        position: relative; /* Untuk menempatkan blur effect */
        overflow: hidden; /* Penting untuk mengontrol blur */
    }

    /* --- LIQUID GLASS/BLUR EFFECTS --- */
    .liquid-blur-1 {
        position: absolute;
        top: 10%;
        left: 5%;
        width: 300px;
        height: 300px;
        background: rgba(16, 185, 129, 0.6); /* Hijau */
        border-radius: 50%;
        filter: blur(80px); /* Efek blur yang kuat */
        z-index: 0;
        animation: float 10s infinite ease-in-out alternate;
    }

    .liquid-blur-2 {
        position: absolute;
        bottom: 10%;
        right: 5%;
        width: 400px;
        height: 400px;
        background: rgba(255, 255, 255, 0.4); /* Putih/Terang */
        border-radius: 50%;
        filter: blur(100px);
        z-index: 0;
        animation: float 12s infinite ease-in-out alternate-reverse;
    }
    
    @keyframes float {
        0% { transform: translate(0, 0); }
        100% { transform: translate(20px, 30px); }
    }
    /* -------------------------------- */

    .login-card {
        background: rgba(255, 255, 255, 0.7); /* Lebih transparan */
        padding: 50px 40px; /* Padding lebih besar */
        border-radius: 20px; 
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15); /* Shadow Glassmorphism */
        border: 1px solid rgba(255, 255, 255, 0.2); /* Border tipis transparan */
        width: 100%;
        max-width: 380px; 
        position: relative; /* Penting agar z-index di atas blur */
        z-index: 1; 
        
        /* Efek Frosted Glass / Glassmorphism */
        backdrop-filter: blur(10px); 
        -webkit-backdrop-filter: blur(10px); 
    }

    /* Peningkatan Jarak */
    .brand-name { margin-top: 10px; margin-bottom: 5px; }
    .welcome-message { margin-bottom: 30px; }

    .form-spacing {
        display: flex;
        flex-direction: column;
        gap: 20px; /* Jarak antar input field */
    }

    .input-group {
        display: flex;
        flex-direction: column;
    }

    .input-label { display: none; }
    
    .input-field {
        width: 100%;
        border: 1px solid #d1d5db;
        padding: 12px 15px; 
        border-radius: 10px; 
        transition: border-color 0.2s, box-shadow 0.2s;
        font-size: 1rem;
        color: var(--fit-gray-text);
        background: rgba(255, 255, 255, 0.8); /* Membuat input sedikit transparan */
    }

    .input-field:focus {
        border-color: var(--fit-green);
        box-shadow: 0 0 0 1px var(--fit-green);
        outline: none;
    }
    
    /* Remember Me dan Lupa Password */
    .flex-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
    }

    .forgot-password {
        color: var(--fit-green); 
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }
    
    .submit-button {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        background-color: var(--fit-green-dark); 
        border: none;
        cursor: pointer;
        margin-top: 5px !important; /* Jarak dari elemen di atasnya diperbaiki */
    }

    .register-text {
        font-size: 0.9rem;
        text-align: center;
        color: var(--fit-gray-text);
        margin-top: 30px; /* Jarak dari tombol login diperbesar */
    }

    .register-link {
        color: var(--fit-link-green);
        text-decoration: none;
        font-weight: 600;
    }

    /* Syarat & Ketentuan */
    .terms-privacy-text {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-top: 25px;
        text-align: center;
    }
    
    /* Error Message */
    .error-message {
        background-color: #fef2f2;
        border: 1px solid var(--fit-red);
        color: var(--fit-red);
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-size: 0.9rem;
        text-align: center;
    }

    /* Animasi */
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

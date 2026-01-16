import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance"; 
import { User, Mail, Lock, Eye, EyeOff, Activity, UserPlus, Loader2Icon } from "lucide-react";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    // Validasi Password: Minimal 8 karakter
    const isPasswordValid = form.password.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError([]);
        setLoading(true);

        if (!isPasswordValid) {
            setError(["Password minimal harus 8 karakter."]);
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/auth/register", form);

            alert(response.data.message || "Registrasi berhasil! Silakan login.");
            navigate("/login");
        } catch (err) {
            console.error("Register Error:", err.response?.data || err.message);
            const backendErrors = err.response?.data?.errors || [err.response?.data?.message];
            setError(backendErrors.filter(e => e)); // Filter out undefined messages
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="register-page-container">
                <div className="register-card">
                    
                    {/* Header Gaya FitLife */}
                    <div className="text-center mb-6">
                        <div className="brand-logo mx-auto mb-3">
                            <Activity size={24} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-800">
                            Buat Akun LifeBalence
                        </h2>
                        <p className="welcome-message">Daftar sekarang untuk memulai</p>
                    </div>

                    {/* Pesan Error */}
                    {error.length > 0 && (
                        <div className="error-message">
                            {error.map((e, i) => <p key={i}>{e}</p>)}
                        </div>
                    )}

                    {/* Formulir */}
                    <form onSubmit={handleSubmit} className="form-spacing">
                        {/* Full Name */}
                        <div className="input-group">
                            <div className="icon-input-wrapper">
                                <User size={20} className="input-icon" />
                                <input name="fullName" placeholder="Nama Lengkap" value={form.fullName} onChange={handleChange} required className="input-field" />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="input-group">
                            <div className="icon-input-wrapper">
                                <User size={20} className="input-icon" />
                                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="input-field" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <div className="icon-input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="input-field" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <div className="icon-input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input name="password" placeholder="Password (Min. 8 Karakter)" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required className={`input-field ${!isPasswordValid && form.password.length > 0 ? 'input-invalid' : ''}`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {form.password.length > 0 && (
                                <p className={`validation-message ${isPasswordValid ? 'valid' : 'invalid'}`}>
                                    {isPasswordValid ?  '' : `! Password harus minimal 8 karakter (${form.password.length}/8)`}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <div className="icon-input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input name="confirmPassword" placeholder="Konfirmasi Password" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} required className="input-field" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className={`submit-button ${loading ? "loading" : ""}`}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2Icon size={20} className="mr-2 animate-spin" />
                                </span>
                            ) : (
                                "Daftar Akun"
                            )}
                        </button>
                    </form>

                    <p className="login-text">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="login-link">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

// CSS Internal (Gaya FitLife dengan peningkatan struktur form)
const styles = `
    :root {
      --fit-green: #10B981; 
      --fit-green-dark: #059669; 
      --fit-gray-text: #4b5563; 
      --fit-link-green: #10B981;
      --fit-red: #ef4444; 
      --fit-yellow: #f59e0b;
    }

    .register-page-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #e0f2f1, #d1f4d1); 
        padding: 20px;
        position: relative;
        overflow: hidden;
    }

    /* --- LIQUID GLASS/BLUR EFFECTS (Disalin dari Login) --- */
    .liquid-blur-1 {
        position: absolute;
        top: 10%;
        left: 5%;
        width: 300px;
        height: 300px;
        background: rgba(16, 185, 129, 0.6);
        border-radius: 50%;
        filter: blur(80px); 
        z-index: 0;
        animation: float 10s infinite ease-in-out alternate;
    }

    .liquid-blur-2 {
        position: absolute;
        bottom: 10%;
        right: 5%;
        width: 400px;
        height: 400px;
        background: rgba(255, 255, 255, 0.4);
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

    .register-card {
        background: rgba(255, 255, 255, 0.85); 
        padding: 30px 40px; 
        border-radius: 20px; 
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2); 
        width: 100%;
        max-width: 420px; /* Sedikit lebih lebar karena banyak input */
        position: relative; 
        z-index: 1; 
        backdrop-filter: blur(10px); 
        -webkit-backdrop-filter: blur(10px); 
    }

    /* Header */
    .brand-logo {
        width: 50px;
        height: 50px;
        background-color: var(--fit-green);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        margin-bottom: 10px;
    }
    .welcome-message {
        color: #9ca3af;
        font-size: 0.9rem;
        margin-top: 5px;
    }

    /* Form Spacing */
    .form-spacing {
        display: flex;
        flex-direction: column;
        gap: 15px; /* Jarak antar grup input */
        margin-top: 25px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    /* Input Styling */
    .icon-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .input-icon {
        position: absolute;
        left: 15px;
        color: #9ca3af;
        z-index: 2;
    }

    .input-field {
        width: 100%;
        border: 1px solid #d1d5db;
        padding: 12px 15px 12px 45px; /* Padding kiri untuk ikon */
        border-radius: 10px; 
        transition: border-color 0.2s, box-shadow 0.2s;
        font-size: 1rem;
        color: var(--fit-gray-text);
        background: rgba(255, 255, 255, 0.8);
    }

    .input-field:focus {
        border-color: var(--fit-green);
        box-shadow: 0 0 0 1px var(--fit-green);
        outline: none;
    }

    /* Toggle Password */
    .toggle-password {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        cursor: pointer;
        color: #9ca3af;
        padding: 0;
    }
    
    /* Validasi Password */
    .validation-message {
        font-size: 0.8rem;
        margin-top: 5px;
        padding-left: 10px;
    }
    .validation-message.invalid {
        color: var(--fit-red);
    }
    .validation-message.valid {
        color: var(--fit-green-dark);
    }


    /* Tombol Submit */
    .submit-button {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        color: white;
        font-weight: 700;
        background-color: var(--fit-green-dark); 
        border: none;
        cursor: pointer;
        margin-top: 10px !important;
    }

    .submit-button:hover:not(:disabled) {
        background-color: var(--fit-green);
    }

    .submit-button.loading {
        background-color: #a7f3d0; 
        cursor: not-allowed;
        opacity: 0.9;
    }

    /* Link Login */
    .login-text {
        font-size: 0.9rem;
        text-align: center;
        color: var(--fit-gray-text);
        margin-top: 20px;
    }
    .login-link {
        color: var(--fit-link-green);
        text-decoration: none;
        font-weight: 600;
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
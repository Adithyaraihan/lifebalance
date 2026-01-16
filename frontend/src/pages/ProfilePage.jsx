import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Briefcase,
  Calendar,
  ChevronLeft,
  Loader,
} from "lucide-react";
import api from "../api/axiosInstance";
import ChangePasswordForm from "../components/ChangePasswordForm"; // Pastikan path ini benar!

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Peringatan Mentor: Logika fetching ini seharusnya berada di Global State Management (Context/Zustand)
  const fetchUserData = async () => {
    try {
      setLoading(true);
      // API call DUPLIKAT dari Navbar
      const response = await api.get("/auth/me");
      const userData = response.data.data || response.data;
      setUser(userData);
    } catch (error) {
      console.error("Gagal mengambil data user di Halaman Profil:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // --- RENDERING LOGIC ---

  return (
    <div className="profile-page-container">
      <style>{styles}</style>

      {/* HEADER SECTION */}
      <div className="page-header">
        <button onClick={() => navigate("/")} className="back-btn">
          <ChevronLeft size={24} />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      <div className="content-wrapper">
        <div className="profile-grid">
          {/* COLUMN KIRI: DETAIL PROFIL */}
          <div className="profile-card detail-column">
            {loading ? (
              // Loading State
              <div className="loading-state">
                <Loader className="spin text-green" size={24} />
                <p>Memuat data profil...</p>
              </div>
            ) : user ? (
              // Data Profil Ditemukan
              <>
                <div className="profile-header">
                  <div className="avatar-large">
                    <User size={48} />
                  </div>
                  <h2>{user.username || "User"}</h2>
                </div>

                <div className="profile-details">
                  <h3>Detail Akun</h3>

                  <div className="detail-item">
                    <Mail size={18} className="icon-detail" />
                    <span>Email:</span>
                    <p>{user.email}</p>
                  </div>

                  <div className="detail-item">
                    <Briefcase size={18} className="icon-detail" />
                    <span>Full Name:</span>
                    <p>{user.fullName}</p>
                  </div>

                  {user.createdAt && (
                    <div className="detail-item">
                      <Calendar size={18} className="icon-detail" />
                      <span>Bergabung:</span>
                      <p>
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  className="edit-button"
                  onClick={() => alert("Fitur Edit Profil siap dikembangkan!")}
                >
                  Edit Data Profil
                </button>
              </>
            ) : (
              // Error/User not logged in State
              <div className="loading-state error-state">
                <h1>Akses Ditolak 🛑</h1>
                <p>Gagal memuat profil. Silakan login kembali.</p>
                <button
                  className="edit-button"
                  onClick={() => navigate("/login")}
                >
                  Menuju Halaman Login
                </button>
              </div>
            )}
          </div>

          {/* COLUMN KANAN: UBAH PASSWORD */}
          <div className="password-column">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CSS Internal (FitLife Green Theme + Grid Layout) ---
const styles = `
  :root {
    --fit-green: #16a34a;
    --fit-green-dark: #15803d;
    --fit-green-light: #dcfce7;
    --bg-color: #f8fafc;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
  }

  .profile-page-container {
    min-height: 100vh;
    background-color: var(--bg-color);
    font-family: 'Inter', sans-serif;
    padding-bottom: 40px;
  }

  /* HEADER */
  .page-header {
    background-color: white;
    padding: 16px 32px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 32px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: color 0.2s;
  }

  .back-btn:hover {
    color: var(--fit-green);
  }

  /* CONTENT & GRID */
  .content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .profile-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 24px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }

  /* CARD DETAIL PROFIL */
  .profile-card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  
  .profile-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .avatar-large {
    width: 90px;
    height: 90px;
    background: var(--fit-green-light);
    color: var(--fit-green-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px auto;
  }

  .profile-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .profile-header .role {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 5px;
    text-transform: capitalize;
  }

  .profile-details {
    margin-bottom: 30px;
  }

  .profile-details h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #f1f5f9;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    font-size: 15px;
  }
  
  .icon-detail {
      color: var(--fit-green-dark);
  }

  .detail-item span {
    font-weight: 500;
    color: var(--text-primary);
    flex-basis: 120px; 
  }

  .detail-item p {
    color: var(--text-secondary);
    margin: 0;
    flex-grow: 1;
  }

  /* BUTTON EDIT DATA PROFIL */
  .edit-button {
    width: 100%;
    padding: 12px;
    background-color: var(--fit-green);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .edit-button:hover {
    background-color: var(--fit-green-dark);
  }

  /* LOADING & ERROR STATES */
  .loading-state { 
      text-align: center; 
      padding: 40px; 
      color: var(--text-secondary); 
  }
  
  .loading-state h1 {
    color: #ef4444; 
    margin-bottom: 10px;
  }
  
  .loading-state p {
    margin-bottom: 20px;
  }
  
  .spin { animation: spin 1s linear infinite; }
  .text-green { color: var(--fit-green); }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }


  /* --- STYLES UNTUK CHANGE PASSWORD FORM (Diambil dari ChangePasswordForm.jsx) --- */
  
  .change-password-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .password-form { 
      display: flex; 
      flex-direction: column; 
      gap: 16px; 
  }

  .card-header-simple {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f1f5f9;
  }

  .card-header-simple h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-primary);
  }

  .input-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 6px;
  }

  .password-form input {
      width: 100%;
      padding: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s, box-shadow 0.2s;
  }

  .password-form input:focus {
      border-color: var(--fit-green);
      box-shadow: 0 0 0 3px var(--fit-green-light);
  }

  .submit-btn-pass {
      margin-top: 8px;
      background-color: #ef4444;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s;
  }

  .submit-btn-pass:hover:not(:disabled) {
      background-color: #dc2626;
  }

  .submit-btn-pass:disabled {
      background-color: #94a3b8;
      cursor: not-allowed;
  }

  .form-message {
      padding: 10px 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
  }

  .message-error {
      color: #991b1b;
      background-color: #fee2e2;
      border: 1px solid #fca5a5;
  }

  .message-success {
      color: #166534;
      background-color: #dcfce7;
      border: 1px solid #86efac;
  }
`;

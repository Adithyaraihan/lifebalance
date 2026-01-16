import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Settings,
  BarChart,
  Calendar,
  LogOut,
  HelpCircle,
  Bed,
  FileText,
  Activity,
} from "lucide-react";
// Import Axios Instance
import api from "../api/axiosInstance";

// URL Logout Anda
const LOGOUT_URL = "/auth/logout";
// Asumsi base URL (http://localhost:5000) sudah diatur di axiosInstance.js

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // --- FUNGSI LOGOUT MENGGUNAKAN AXIOS ---
  const handleLogout = async () => {
    if (!confirm("Yakin ingin keluar?")) {
      return;
    }

    try {
      // 1. Panggil endpoint logout di backend menggunakan Axios POST
      // Axios secara otomatis mengirim cookie jika 'withCredentials: true' disetel pada instance.
      const response = await api.post(LOGOUT_URL);

      // Jika status 2xx (200 OK, 204 No Content), berarti server berhasil menghapus cookie.
      if (response.status >= 200 && response.status < 300) {
        console.log("Logout berhasil. Cookies dihapus oleh server.");
      } else {
        console.warn(
          "Server gagal menghapus cookie, tapi tetap mengarahkan ke halaman login."
        );
      }
    } catch (error) {
      // Jika server tidak merespons atau ada error jaringan
      console.error("Gagal melakukan permintaan logout:", error);
      // Tetap log out user di sisi frontend meskipun permintaan gagal,
      // karena user ingin keluar dan token mungkin kadaluarsa.
      alert("Logout terjadi kesalahan. Mencoba keluar paksa.");
    } finally {
      // 2. Arahkan pengguna ke halaman login
      // Hapus token yang mungkin tersisa di localStorage (praktik pembersihan)
      localStorage.clear();
      window.location.href = "/Login";
    }
  };
  // ------------------------------------

  return (
    <>
      <style>{styles}</style>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">
            <Activity size={28} />
          </div>
          <h2>LifeBalence</h2>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <Link
              to="/"
              className={`nav-item ${isActive("/") ? "active" : ""}`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/Chatwithai"
              className={`nav-item ${isActive("/Chatwithai") ? "active" : ""}`}
            >
              <Users size={20} />
              <span>AI Assistant</span>
            </Link>
          </div>

     
          <div className="nav-section">
            <div className="section-label">GENERAL</div>
            <Link
              to="/settings"
              className={`nav-item ${isActive("/settings") ? "active" : ""}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>

            <div className="nav-item">
              <HelpCircle size={20} />
              <span>Help</span>
            </div>

            <div
              className="nav-item logout-btn"
              // Panggil fungsi logout baru
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

// CSS Internal Updated (Tidak diubah)
const styles = `
    /* Definisi Warna Hijau FitLife */
    :root {
      --fit-green: #16a34a; /* Hijau Utama */
      --fit-green-light: #dcfce7; /* Hijau Muda untuk Hover */
      --fit-green-dark: #15803d; /* Hijau Tua */
    }

    .sidebar {
      width: 260px;
      background-color: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      height: 100vh;
      flex-shrink: 0;
      position: sticky;
      top: 0;
    }

    .sidebar-header {
      padding: 24px;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Logo Styling mirip referensi */
    .brand-logo {
      width: 40px;
      height: 40px;
      background-color: var(--fit-green);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-header h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1f2937; /* Dark Gray */
      margin: 0;
    }

    .sidebar-nav {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #9ca3af;
      padding: 0 12px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      color: #4b5563; /* Gray-600 */
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
    }

    /* Hover State: Hijau Muda */
    .nav-item:hover {
      background-color: var(--fit-green-light);
      color: var(--fit-green-dark);
    }

    /* ACTIVE STATE: Hijau Solid + Teks Putih (Sesuai Gambar) */
    .nav-item.active {
      background-color: var(--fit-green);
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2);
    }

    .logout-btn:hover {
      background-color: #fef2f2;
      color: #ef4444;
    }
`;

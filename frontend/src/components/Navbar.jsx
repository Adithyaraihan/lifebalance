import React, { useEffect, useState } from "react";
import { User } from "lucide-react"; 
import { Link } from "react-router-dom"; // 👈 WAJIB: Gunakan Link untuk navigasi SPA
import api from "../api/axiosInstance"; 

// ... CSS Internal (styles) tetap dipertahankan sesuai permintaan Anda ...

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // KODE INI AKAN SAYA TINGGALKAN, TAPI INGAT: HARUS DIREFACTOR KE CONTEXT
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      if (response.data && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      // Di dunia nyata: Tambahkan logika logout jika error 401
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <header className="navbar">
        <div className="navbar-left"></div>

        <div className="navbar-right">
          {/* PERUBAHAN UTAMA: Gunakan <Link> untuk mengarahkan ke /profile */}
          <Link to="/profile" className="profile"> 
            {loading ? (
              <span className="loading-text">Memuat...</span>
            ) : (
              <>
                <div className="user-info">
                  <span className="username">
                    {user?.fullName || "User"} 
                  </span>
                </div>
                
                <div className="avatar">
                  <User size={20} />
                </div>
              </>
            )}
          </Link>
        </div>
      </header>
    </>
  );
} 

// CSS Internal (Dibersihkan dari style logo & logout)
const styles = `
  .navbar {
    height: 64px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Menjaga profil tetap di kanan */
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    border-radius: 8px;
    background-color: #f9fafb;
    border: 1px solid #f3f4f6;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;
  }

  .username {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
    text-transform: capitalize;
  }

  .role-badge {
    font-size: 11px;
    color: #6b7280;
  }

  .loading-text {
    font-size: 13px;
    color: #9ca3af;
  }

  .avatar {
    width: 38px;
    height: 38px;
    background: #e0e7ff;
    color: #4f46e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;
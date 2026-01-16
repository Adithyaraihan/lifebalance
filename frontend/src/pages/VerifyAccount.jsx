import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useSearchParams untuk mengambil query
import api from "../api/axiosInstance";
import { CheckCircle, XCircle, Loader, LogIn } from "lucide-react";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activationCode = searchParams.get("code"); 

  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("Memverifikasi akun Anda...");

  useEffect(() => {
    const verifyAccount = async (code) => {
      if (!code) {
        setStatus("error");
        setMessage(
          "Kode aktivasi tidak ditemukan. Cek kembali tautan email Anda."
        );
        return;
      }

      try {
        const res = await api.get(`/auth/verify?code=${code}`);

        if (res.status === 200) {
          setStatus("success");
          setMessage(
            "Aktivasi akun berhasil! Anda akan diarahkan ke halaman login."
          );

          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        }
      } catch (err) {
        console.error("Verifikasi Akun Gagal:", err);

        const errorMessage =
          err.response?.data?.message ||
          "Gagal mengaktifkan akun. Kode mungkin sudah kedaluwarsa atau salah.";

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    if (activationCode) {
      verifyAccount(activationCode);
    } else {
      setStatus("error");
      setMessage("Akses tidak valid. Kode verifikasi diperlukan.");
    }
  }, [activationCode, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "loading" && (
          <div style={{ textAlign: "center" }}>
            <Loader
              size={48}
              color="#007bff"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <h2 style={styles.title}>Verifikasi Sedang Diproses...</h2>
          </div>
        )}

        {status === "success" && (
          <div style={{ textAlign: "center" }}>
            <CheckCircle size={48} color="#28a745" />
            <h2 style={styles.title}>Aktivasi Berhasil!</h2>
            <p>{message}</p>
            <Link to="/login" style={styles.loginLink}>
              <LogIn size={16} style={{ marginRight: 8 }} />
              Klik untuk Login Sekarang
            </Link>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign: "center" }}>
            <XCircle size={48} color="#dc3545" />
            <h2 style={styles.title}>Aktivasi Gagal</h2>
            <p>{message}</p>
            <Link to="/register" style={styles.registerLink}>
              Daftar Ulang atau Cek Email
            </Link>
          </div>
        )}
      </div>

      {/* Gaya animasi untuk loader - biasanya di CSS file */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Gaya dasar (bisa dipindahkan ke CSS module atau styled-components)
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  card: {
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
  },
  title: {
    marginTop: "15px",
    marginBottom: "20px",
    color: "#343a40",
  },
  loginLink: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: "10px",
    color: "#dc3545",
    textDecoration: "none",
    display: "block",
  },
};

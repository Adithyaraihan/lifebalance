// src/components/ChangePasswordForm.jsx
import React, { useState } from "react";
import { Key, Loader, AlertTriangle } from "lucide-react";
import api from "../api/axiosInstance";

// Catatan: CSS untuk komponen ini akan kita masukkan di akhir
export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // --- Validasi Klien ---
    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Kata sandi baru minimal 8 karakter.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Kata sandi baru dan konfirmasi sandi tidak cocok.",
      });
      return;
    }
    // ----------------------

    setLoading(true);
    try {
      // 🎯 Mengikuti struktur endpoint dan body yang Anda berikan,
      // namun menggunakan nama variabel yang lebih semantik (currentPassword).
      await api.post("/auth/reset-password", {
        password: currentPassword, // Dikirim sebagai 'password' (Sandi Lama)
        newPassword: newPassword, // Dikirim sebagai 'newPassword' (Sandi Baru)
      });

      setMessage({ type: "success", text: "✅ Kata sandi berhasil diubah!" });
      // Bersihkan input setelah sukses
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Gagal ubah kata sandi:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Gagal mengubah kata sandi. Cek sandi lama Anda.";
      setMessage({ type: "error", text: `❌ ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-card">
      <div className="card-header-simple">
        <Key size={20} className="text-gray-500" />
        <h3>Ubah Kata Sandi</h3>
      </div>

      {message && (
        <div className={`form-message message-${message.type}`}>
          {message.type === "error" && <AlertTriangle size={18} />}
          <p>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="password-form">
        <div className="input-group">
          <label>Sandi Lama</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label>Sandi Baru (Min. 8 Karakter)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label>Konfirmasi Sandi Baru</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn-pass">
          {loading ? (
            <>
              <Loader className="spin" size={18} /> Memproses...
            </>
          ) : (
            "Ubah Sandi"
          )}
        </button>
      </form>
    </div>
  );
}

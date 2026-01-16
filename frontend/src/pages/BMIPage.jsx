import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  ChevronLeft,
  Activity,
  Ruler,
  Weight,
  Loader,
  History,
  TrendingUp,
} from "lucide-react";

export default function BMIPage() {
  const navigate = useNavigate();
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");

  const [latestBMI, setLatestBMI] = useState(null); // Data terbaru { BMIScore, Status_Berat_Badan }
  const [listBMI, setListBMI] = useState([]); // Riwayat data

  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await api.get("/bmi");

      setListBMI(response.data);
    } catch (error) {
      console.error("Gagal mengambil riwayat BMI:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 2. Ambil Skor BMI Terbaru (Card)
  const fetchLatestBMI = async () => {
    try {
      setLoadingLatest(true);
      const response = await api.get("/bmi/BMI-Score");
      setLatestBMI(response.data);
    } catch (error) {
      console.error("Gagal mengambil skor BMI terbaru:", error);
      setLatestBMI(null); // Reset jika gagal atau data kosong
    } finally {
      setLoadingLatest(false);
    }
  };

  // --- Fungsi Submit Form ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weightKg || !heightCm) return;

    try {
      setCalculating(true);
      // 1. POST data baru
      await api.post("/bmi", {
        weightKg: parseFloat(weightKg),
        heightCm: parseFloat(heightCm),
      });

      // 2. Reset form
      setWeightKg("");
      setHeightCm("");

      // 3. Refresh kedua data setelah sukses POST
      await Promise.all([fetchLatestBMI(), fetchHistory()]);
    } catch (error) {
      console.error("Gagal menyimpan BMI:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setCalculating(false);
    }
  };

  // --- useEffect ---

  useEffect(() => {
    // Ambil semua data saat komponen dimuat
    fetchLatestBMI();
    fetchHistory();
  }, []);

  // --- Fungsi Helper untuk Badge Kategori ---
  const getBadgeClass = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s.includes("normal")) return "badge-green";
    if (s.includes("kurus") || s.includes("underweight")) return "badge-yellow";
    if (
      s.includes("gemuk") ||
      s.includes("obesitas") ||
      s.includes("overweight")
    )
      return "badge-red";
    return "";
  };

  // --- Render ---

  // Tampilan Loader untuk Card Terbaru
  const latestBMILoader = (
    <div className="loading-state-card">
      <Loader className="spin text-white" size={24} />
      <p>Memuat skor terbaru...</p>
    </div>
  );

  // Tampilan Konten untuk Card Terbaru
  const latestBMIContent = latestBMI ? (
    <>
      <div className="latest-score">
        <span className="bmi-value">{latestBMI.BMIScore}</span>
        <span className="unit">BMI</span>
      </div>
      <div className="latest-status">
        <span
          className={`badge ${getBadgeClass(latestBMI.Status_Berat_Badan)}`}
        >
          {latestBMI.Status_Berat_Badan}
        </span>
      </div>
    </>
  ) : (
    <div className="empty-state-card">
      <p>
        Belum ada data BMI terbaru yang tersedia. Silakan masukkan data Anda.
      </p>
    </div>
  );

  return (
    <div className="bmi-page-container">
      <style>{styles}</style>

      {/* HEADER SECTION */}
      <div className="page-header">
        <button onClick={() => navigate("/")} className="back-btn">
          <ChevronLeft size={24} />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      <div className="content-wrapper">
        {/* TOP SECTION: LATEST BMI CARD (Memanjang Hijau) */}
        <div className="latest-bmi-card green-card">
          <div className="card-header-simple">
            <TrendingUp size={20} color="white" />
            <h3 className="text-white">Skor BMI Terbaru</h3>
          </div>
          <div className="latest-bmi-body">
            {loadingLatest ? latestBMILoader : latestBMIContent}
          </div>
        </div>

        {/* GRID SECTION: FORM & HISTORY */}
        <div className="bmi-grid">
          {/* LEFT COLUMN: FORM INPUT */}
          <div className="form-card">
            <div className="card-header">
              <div className="icon-bg">
                <Activity size={24} color="white" />
              </div>
              <h2>Kalkulator BMI</h2>
            </div>
            <p className="card-desc">
              Masukkan berat dan tinggi badan untuk menghitung dan menyimpan
              data BMI baru.
            </p>

            <form onSubmit={handleSubmit} className="bmi-form">
              {/* Input Berat Badan */}
              <div className="input-group">
                <label>Berat Badan (kg)</label>
                <div className="input-wrapper">
                  <Weight size={18} className="input-icon" />
                  <input
                    type="number"
                    placeholder="0"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Input Tinggi Badan */}
              <div className="input-group">
                <label>Tinggi Badan (cm)</label>
                <div className="input-wrapper">
                  <Ruler size={18} className="input-icon" />
                  <input
                    type="number"
                    placeholder="0"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={calculating || loadingLatest || loadingHistory}
                className="submit-btn"
              >
                {calculating ? (
                  <>
                    <Loader className="spin" size={18} /> Menghitung...
                  </>
                ) : (
                  "Hitung & Simpan"
                )}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: HISTORY TABLE */}
          <div className="history-card">
            <div className="card-header-simple">
              <History size={20} className="text-gray-500" />
              <h3>Riwayat Pengukuran</h3>
            </div>

            <div className="table-container">
              {loadingHistory ? (
                <div className="loading-state">
                  <Loader className="spin text-green" size={24} />
                  <p>Memuat riwayat data...</p>
                </div>
              ) : (
                <table className="bmi-table">
                  <thead>
                    <tr>
                      <th>Berat</th>
                      <th>Tinggi</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listBMI.length > 0 ? (
                      listBMI.map((item) => (
                        <tr key={item.id}>
                          <td>{item.weightKg} kg</td>
                          <td>{item.heightCm} cm</td>
                          <td className="date-col">
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-row">
                          Belum ada data riwayat.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS Internal - FitLife Green Theme (DENGAN PERUBAHAN UNTUK CARD HIJAU)
const styles = `
  :root {
    --fit-green: #16a34a;
    --fit-green-dark: #15803d;
    --fit-green-light: #dcfce7;
    --bg-color: #f8fafc;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --white: #ffffff;
  }

  .bmi-page-container {
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

  /* LAYOUT */
  .content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .bmi-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr; 
    gap: 24px;
    align-items: start;
  }
  
  /* Responsive Mobile */
  @media (max-width: 768px) {
    .bmi-grid {
      grid-template-columns: 1fr;
    }
  }

  /* CARD STYLES */
  .form-card, .history-card, .latest-bmi-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  
  /* LATEST BMI CARD SPECIFIC STYLES (PERUBAHAN UTAMA DI SINI) */
  .latest-bmi-card {
    margin-bottom: 24px; /* Memberi jarak ke grid di bawahnya */
    border: none; /* Hilangkan border asli */
  }

  .latest-bmi-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  /* KARTU HIJAU BARU */
  .green-card {
    background-color: var(--fit-green);
    color: var(--white);
    box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3), 0 4px 6px -4px rgba(22, 163, 74, 0.1);
  }

  /* Mengubah warna teks untuk elemen di dalam kartu hijau */
  .green-card .card-header-simple {
    border-bottom-color: rgba(255, 255, 255, 0.2); /* Border bawah putih transparan */
  }
  
  .green-card .card-header-simple h3 {
    color: var(--white);
  }

  .green-card .latest-score {
    margin: 16px 0 12px 0;
  }
  
  .green-card .bmi-value {
    font-size: 4.5rem; /* Lebih besar */
    font-weight: 700;
    color: var(--white); /* PENTING: Ubah skor jadi putih */
    line-height: 1;
  }
  
  .green-card .unit {
    font-size: 1.5rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7); /* Putih transparan */
  }
  

  
  /* Khusus Loading & Empty State di Kartu Hijau */
  .green-card .loading-state-card p,
  .green-card .empty-state-card p {
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* Menjaga warna badge tetap konsisten (badge-green harus tetap hijau muda) */
  .green-card .badge-green { 
    background-color: var(--fit-green-light); 
    color: var(--fit-green-dark); 
  }
  
  .green-card .badge-yellow { 
    background-color: #fffbeb; 
    color: #854d0e; 
  }
  
  .green-card .badge-red { 
    background-color: #fef2f2; 
    color: #991b1b; 
  }


  /* FORM CARD STYLES (Tidak berubah dari sebelumnya, hanya dimasukkan) */

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .card-header-simple {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
    width: 100%;
  }

  .card-header-simple h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  .icon-bg {
    width: 40px;
    height: 40px;
    background-color: var(--fit-green);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2 { margin: 0; font-size: 1.25rem; color: var(--text-primary); }
  .card-desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px; line-height: 1.5; }

  /* FORM STYLES */
  .bmi-form { display: flex; flex-direction: column; gap: 16px; }

  .input-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 6px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    color: #94a3b8;
  }

  .input-wrapper input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
  }

  .input-wrapper input:focus {
    border-color: var(--fit-green);
    box-shadow: 0 0 0 3px var(--fit-green-light);
  }

  .submit-btn {
    margin-top: 8px;
    background-color: var(--fit-green);
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

  .submit-btn:hover:not(:disabled) {
    background-color: var(--fit-green-dark);
  }

  .submit-btn:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }

  /* TABLE STYLES */
  .table-container { overflow-x: auto; }

  .bmi-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .bmi-table th {
    text-align: left;
    padding: 12px;
    color: var(--text-secondary);
    font-weight: 600;
    background-color: #f8fafc;
    border-radius: 6px;
  }

  .bmi-table td {
    padding: 16px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: var(--text-primary);
  }

  .bmi-table tr:last-child td { border-bottom: none; }

  .date-col { color: var(--text-secondary); font-size: 0.8rem; }
  .empty-row { text-align: center; color: var(--text-secondary); padding: 32px; }

  /* BADGES */
  .badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .badge-green { background-color: #dcfce7; color: #166534; }
  .badge-yellow { background-color: #fef9c3; color: #854d0e; }
  .badge-red { background-color: #fee2e2; color: #991b1b; }

  /* UTILS */
  .spin { animation: spin 1s linear infinite; }
  .text-green { color: var(--fit-green); }
  .text-white { color: var(--white); }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .loading-state { text-align: center; padding: 40px; color: var(--text-secondary); }
  .loading-state-card { text-align: center; padding: 10px 0; color: var(--white); }
  .empty-state-card { text-align: center; padding: 10px 0; color: rgba(255, 255, 255, 0.9); }
`;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { ChevronLeft, Moon, Clock, TrendingUp, History, Loader, BedDouble } from "lucide-react";

export default function SleepPage() {
  const navigate = useNavigate();
  
  // State
  const [hours, setHours] = useState("");
  const [sleepHistory, setSleepHistory] = useState([]);
  const [sleepScore, setSleepScore] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyRes, scoreRes] = await Promise.all([
        api.get("/sleep"),
        api.get("/sleep/score"),
      ]);

      setSleepHistory(historyRes.data.sleeps || []);
      setSleepScore(scoreRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!hours || isNaN(hours) || hours <= 0 || hours > 24) {
      alert("Masukkan jam tidur yang valid (0-24 jam).");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/sleep", { hours: parseFloat(hours) });
      
      setHours("");
      await fetchData(); // Refresh data
    } catch (err) {
      console.error("Error saving:", err);
      setError(err.response?.data?.error || "Gagal menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="sleep-page-container">
      <style>{styles}</style>

      {/* HEADER SECTION */}
      <div className="page-header">
        <button onClick={() => navigate("/")} className="back-btn">
          <ChevronLeft size={24} />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      <div className="content-wrapper">
        
        {/* Error Alert */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="sleep-grid">
          
          {/* KOLOM KIRI: INPUT & SCORE CARD */}
          <div className="left-column">
            
            {/* 1. SCORE CARD (Highlight) */}
            <div className="score-card">
              <div className="score-header">
                <TrendingUp size={20} className="text-white opacity-80" />
                <span>Kualitas Tidur (7 Hari)</span>
              </div>
              
              <div className="score-content">
                {loading ? (
                  <Loader className="spin text-white" />
                ) : sleepScore ? (
                  <>
                    <div className="big-score">
                      {sleepScore.score || sleepScore.average || "-"}
                    </div>
                    <p className="score-desc">
                      {sleepScore.message || sleepScore.quality || "Analisis Data"}
                    </p>
                  </>
                ) : (
                  <p className="no-score">Belum cukup data</p>
                )}
              </div>
            </div>

            {/* 2. INPUT FORM */}
            <div className="form-card">
              <div className="card-header">
                <div className="icon-bg">
                  <Moon size={24} color="white" />
                </div>
                <h2>Input Tidur</h2>
              </div>
              <p className="card-subtext">Berapa jam Anda tidur semalam?</p>

              <form onSubmit={handleSubmit} className="sleep-form">
                <div className="input-wrapper">
                  <Clock size={20} className="input-icon" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 7.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    required
                  />
                  <span className="unit">Jam</span>
                </div>

                <button type="submit" disabled={submitting} className="submit-btn">
                  {submitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: RIWAYAT TABLE */}
          <div className="history-card">
            <div className="card-header-simple">
              <History size={20} className="text-gray-500" />
              <h3>Riwayat Tidur</h3>
            </div>

            <div className="table-container">
              {loading && sleepHistory.length === 0 ? (
                <div className="loading-state">
                  <Loader className="spin text-green" size={24} />
                  <p>Memuat riwayat...</p>
                </div>
              ) : (
                <table className="sleep-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Durasi</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sleepHistory.length > 0 ? (
                      sleepHistory.map((item, index) => (
                        <tr key={index}>
                          <td className="date-cell">
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              weekday: "long", day: "numeric", month: "long"
                            })}
                          </td>
                          <td className="duration-cell">
                            <Clock size={14} className="inline mr-1" />
                            {item.hours} Jam
                          </td>
                          <td>
                            <span className={`badge ${item.hours >= 7 ? 'badge-green' : 'badge-yellow'}`}>
                              {item.hours >= 7 ? "Cukup" : "Kurang"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="empty-row">
                          Belum ada data tidur.
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

// CSS Internal - FitLife Green Palette
const styles = `
  :root {
    --fit-green: #16a34a;
    --fit-green-dark: #15803d;
    --fit-green-light: #dcfce7;
    --bg-color: #f8fafc;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
  }

  .sleep-page-container {
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

  .content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .error-banner {
    background-color: #fee2e2;
    color: #991b1b;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #fecaca;
  }

  /* GRID LAYOUT */
  .sleep-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 24px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .sleep-grid { grid-template-columns: 1fr; }
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* SCORE CARD (Gradient Green) */
  .score-card {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);
    text-align: center;
  }

  .score-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.9rem;
    margin-bottom: 16px;
    opacity: 0.9;
  }

  .big-score {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
  }

  .score-desc { font-size: 1rem; opacity: 0.9; }
  .no-score { font-size: 0.9rem; opacity: 0.7; font-style: italic; }

  /* FORM CARD */
  .form-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
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

  h2 { margin: 0; font-size: 1.2rem; color: var(--text-primary); }
  .card-subtext { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px; }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .input-icon { position: absolute; left: 12px; color: #94a3b8; }
  .unit { position: absolute; right: 12px; color: #94a3b8; font-size: 0.9rem; font-weight: 500; }

  .input-wrapper input {
    width: 100%;
    padding: 12px 50px 12px 40px; /* Space for icon and unit */
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1.1rem;
    outline: none;
    transition: border 0.2s;
  }

  .input-wrapper input:focus {
    border-color: var(--fit-green);
    box-shadow: 0 0 0 3px var(--fit-green-light);
  }

  .submit-btn {
    width: 100%;
    background-color: var(--fit-green);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .submit-btn:hover:not(:disabled) { background-color: var(--fit-green-dark); }
  .submit-btn:disabled { background-color: #94a3b8; cursor: not-allowed; }

  /* HISTORY CARD & TABLE */
  .history-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .card-header-simple {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .card-header-simple h3 { margin: 0; font-size: 1.1rem; color: var(--text-primary); }

  .sleep-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .sleep-table th {
    text-align: left;
    padding: 12px;
    color: var(--text-secondary);
    font-weight: 600;
    background-color: #f8fafc;
    border-radius: 6px;
  }

  .sleep-table td {
    padding: 16px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: var(--text-primary);
  }

  .date-cell { font-weight: 500; text-transform: capitalize; }
  .duration-cell { display: flex; align-items: center; color: var(--text-secondary); }
  .empty-row { text-align: center; color: var(--text-secondary); padding: 40px; }

  /* BADGES */
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
  .badge-green { background-color: #dcfce7; color: #166534; }
  .badge-yellow { background-color: #fef9c3; color: #854d0e; }

  /* UTILS */
  .spin { animation: spin 1s linear infinite; }
  .text-green { color: var(--fit-green); }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .loading-state { text-align: center; padding: 40px; color: var(--text-secondary); }
`;
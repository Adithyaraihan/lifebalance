import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../api/axiosInstance";
import {
  Slack,
  FileText,
  BarChart,
  Bed,
  Loader,
  Activity,
  TrendingUp,
  CalendarCheck,
  Bot,
  PenSquareIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function HomePage() {
  const navigate = useNavigate();

  // State Data
  const [fitnessData, setFitnessData] = useState(null);
  const [todaySteps, setTodaySteps] = useState(0);

  // State UI
  const [fitnessLoading, setFitnessLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const cards = [
    {
      id: 1,
      title: "BMI Calculator",
      icon: Slack,
      path: "/BMI",
      theme: "theme-blue",
    },
    {
      id: 2,
      title: "Skor Tidur",
      icon: Bed,
      path: "/Sleep",
      theme: "theme-purple",
    },
    {
      id: 3,
      title: "Tes Mental",
      icon: PenSquareIcon,
      path: "/GHQtest",
      theme: "theme-teal",
    },
    {
      id: 4,
      title: "Jurnal Harian",
      icon: FileText,
      path: "/Jurnal",
      theme: "theme-orange",
    },
    {
      id: 5,
      title: "Todo List",
      icon: CalendarCheck,
      path: "/Todo",
      theme: "theme-rose",
    },
    {
      id: 6,
      title: "AI Assistant",
      icon: Bot,
      path: "/Chatwithai",
      theme: "theme-indigo",
    },
  ];

  // --- 1. Fetch Data Langkah saat Load ---
  useEffect(() => {
    const fetchData = async () => {
      setFitnessLoading(true);
      try {
        // Panggil endpoint backend TANPA kirim token manual.
        // Backend otomatis cek database user berdasarkan JWT.
        const res = await api.get("/step");

        const data = res.data.activityData;
        setFitnessData(data);
        setIsConnected(true); // Sukses = Connected

        // Ambil data langkah hari terakhir (paling baru)
        if (data && data.length > 0) {
          setTodaySteps(data[data.length - 1].steps);
        }
      } catch (err) {
        console.error("Gagal ambil data langkah:", err);
        // Jika backend merespon 400/401, artinya belum connect Google Fit
        if (err.response?.status === 400 || err.response?.status === 401) {
          setIsConnected(false);
        }
      } finally {
        setFitnessLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. Fungsi Handle Connect Google (FIX UNAUTHORIZED) ---
  const handleConnectGoogle = async () => {
    try {
      setFitnessLoading(true);
      // Minta URL Auth ke backend dulu (Token JWT otomatis terkirim via api instance)
      const res = await api.get("/googlefit/google");

      // Jika dapat URL, baru redirect browser
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Gagal inisialisasi Google Auth:", err);
      alert("Gagal menghubungkan. Pastikan Anda sudah login.");
      setFitnessLoading(false);
    }
  };

  const renderFitnessContent = () => {
    // A. Belum Login Google Fit
    if (!isConnected && !fitnessLoading) {
      return (
        <div className="empty-fitness-state">
          <p>Hubungkan akun untuk melihat progres Anda.</p>
          <button
            onClick={handleConnectGoogle} // Panggil fungsi handler baru
            className="login-btn"
          >
            Hubungkan Google Fit
          </button>
        </div>
      );
    }

    // B. Loading
    if (fitnessLoading) {
      return (
        <div className="loading-state">
          <Loader className="spin" size={32} />
          <span>Mengambil data langkah...</span>
        </div>
      );
    }

    // C. Ada Data (Tampilkan Dashboard Hijau)
    if (fitnessData) {
      return (
        <div className="fitness-dashboard-content">
          {/* A. CARD HIJAU BESAR (Statistik Utama) */}
          <div className="green-stat-card">
            <div className="stat-icon-box">
              <Activity size={32} color="white" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Langkah Hari Ini</span>
              <h2 className="stat-value">{todaySteps.toLocaleString()}</h2>
            </div>
          </div>

          {/* B. GRAFIK (Chart) */}
          <div className="chart-container-inner">
            <h4 className="chart-title-small">
              Grafik Langkah 7 Hari Terakhir
            </h4>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <AreaChart data={fitnessData}>
                  <defs>
                    <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    style={{ fontSize: "11px", fontWeight: "500" }}
                    tick={{ fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    style={{ fontSize: "11px", fontWeight: "500" }}
                    tick={{ fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ color: "#16a34a", fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="steps"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSteps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    return <p className="no-data">Tidak ada data aktivitas.</p>;
  };

  return (
    <div className="layout-container">
      <style>{styles}</style>

      {/* 1. SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT */}
      <main className="main-wrapper">
        <Navbar />

        <div className="content-container">

          {/* HERO CARD (PROGRESS KEBUGARAN) */}
          <div className="fitness-hero-card">
            <div className="card-top-header">
              <div>
                <h3>Progress Kebugaran Harian</h3>
                <p>Data langkah kaki dari Google Fit</p>
              </div>
              {isConnected && (
                <span className="badge-connected">● Terhubung</span>
              )}
            </div>

            <div className="card-body-content">{renderFitnessContent()}</div>
          </div>

          {/* FEATURE CARDS GRID */}
          <div className="cards-grid">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.path)}
                  className={`menu-card ${card.theme}`} // Inject class theme
                >
                  <div className="card-decoration"></div>{" "}
                  {/* Garis warna di atas */}
                  <div className="icon-wrapper">
                    <Icon size={28} />
                  </div>
                  <span>{card.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// CSS Internal: Tema Hijau & Card Colorful
const styles = `
  /* VARIABLES */
  :root {
    --fit-green: #16a34a;
    --fit-green-dark: #15803d;
    --fit-green-light: #dcfce7;
    --text-dark: #1f2937;
    --text-gray: #6b7280;
  }

  /* LAYOUT */
  .layout-container {
    display: flex;
    min-height: 100vh;
    background-color: #f8fafc; /* Background abu-abu muda bersih */
    font-family: 'Inter', sans-serif;
  }

  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  .content-container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .content-header {
    margin-bottom: 32px;
  }

  .content-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 8px 0;
  }

  .content-header p {
    color: var(--text-gray);
    font-size: 1rem;
    margin: 0;
  }

  /* --- HERO CARD STYLE (Card Besar Hijau Putih) --- */
  .fitness-hero-card {
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    margin-bottom: 40px;
  }

  .card-top-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .card-top-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0 0 4px 0;
  }

  .card-top-header p {
    color: var(--text-gray);
    font-size: 0.9rem;
    margin: 0;
  }

  .badge-connected {
    background-color: var(--fit-green-light);
    color: var(--fit-green-dark);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* --- STAT BLOCK (Kotak Hijau) --- */
  .green-stat-card {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); /* Gradient Hijau */
    border-radius: 12px;
    padding: 24px;
    color: white;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
    box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);
  }

  .stat-icon-box {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.1;
  }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    margin-top: 8px;
    background: rgba(255,255,255,0.15);
    width: fit-content;
    padding: 4px 8px;
    border-radius: 6px;
  }

  /* CHART AREA */
  .chart-title-small {
    font-size: 1rem;
    color: var(--text-gray);
    margin-bottom: 16px;
    font-weight: 500;
  }

  .login-btn {
    background-color: var(--fit-green);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .login-btn:hover {
    background-color: var(--fit-green-dark);
  }

  .empty-fitness-state, .loading-state {
    text-align: center;
    padding: 40px;
    color: var(--text-gray);
  }

  .spin {
    animation: spin 1s linear infinite;
    color: var(--fit-green);
    margin-bottom: 12px;
  }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  
  .no-data { text-align: center; color: #999; padding: 20px; }

  /* --- MENU CARDS (Colorful) --- */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
  }

  .menu-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border: 1px solid #f0f0f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Efek Hover Naik */
  .menu-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  /* Garis warna di atas card */
  .card-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: #e5e7eb;
  }

  .icon-wrapper {
    padding: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
  }

  .menu-card:hover .icon-wrapper {
    transform: scale(1.1) rotate(5deg);
  }

  .menu-card span {
    font-weight: 600;
    color: var(--text-dark);
    font-size: 1rem;
  }

  /* WARNA TEMA UNTUK KARTU (Cerah & Menarik) */
  
  /* Blue Theme */
  .theme-blue .card-decoration { background: #3b82f6; }
  .theme-blue .icon-wrapper { background: #eff6ff; color: #3b82f6; }
  .theme-blue:hover { border-color: #bfdbfe; }

  /* Purple Theme */
  .theme-purple .card-decoration { background: #a855f7; }
  .theme-purple .icon-wrapper { background: #faf5ff; color: #a855f7; }
  .theme-purple:hover { border-color: #e9d5ff; }

  /* Teal Theme */
  .theme-teal .card-decoration { background: #14b8a6; }
  .theme-teal .icon-wrapper { background: #ccfbf1; color: #0d9488; }
  .theme-teal:hover { border-color: #99f6e4; }

  /* Orange Theme */
  .theme-orange .card-decoration { background: #f97316; }
  .theme-orange .icon-wrapper { background: #fff7ed; color: #f97316; }
  .theme-orange:hover { border-color: #fed7aa; }

  /* Rose Theme */
  .theme-rose .card-decoration { background: #f43f5e; }
  .theme-rose .icon-wrapper { background: #fff1f2; color: #f43f5e; }
  .theme-rose:hover { border-color: #fecdd3; }

  /* Indigo Theme */
  .theme-indigo .card-decoration { background: #6366f1; }
  .theme-indigo .icon-wrapper { background: #e0e7ff; color: #4338ca; }
  .theme-indigo:hover { border-color: #c7d2fe; }
`;

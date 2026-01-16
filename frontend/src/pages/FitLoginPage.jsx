import React, { useEffect, useState, useMemo } from "react"; // 💡 useMemo ditambahkan
import axios from "axios";

export default function FitLoginPage() {
    const [token, setToken] = useState(null);
    const [REFRESH_TOKEN, setRefreshToken] = useState(null); 
    const [data, setData] = useState({ activityData: [], latestWeight: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const stepsToday = useMemo(() => {
        if (data.activityData.length === 0) return null;

        const todayDateFormatted = new Date().toLocaleDateString(
            "id-ID",
            { weekday: "short", day: "2-digit", month: "short" }
        );

        const todayData = data.activityData.find(d => d.date === todayDateFormatted);

        return todayData ? todayData.steps : 0; // Kembalikan jumlah langkah atau 0
    }, [data.activityData]);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token");
        const rt = params.get("refresh"); 
        
        if (t) {
            setToken(t);
            localStorage.setItem("fit_token", t);
            
            if (rt) {
                setRefreshToken(rt); 
                localStorage.setItem("fit_refresh_token", rt);
            }

            window.history.pushState({}, document.title, window.location.pathname);
            
        } else {
            const savedToken = localStorage.getItem("fit_token");
            const savedRefresh = localStorage.getItem("fit_refresh_token");
            if (savedToken) setToken(savedToken);
            if (savedRefresh) setRefreshToken(savedRefresh);
        }
    }, []);

    // 2️⃣ Fetch data dari backend
    const fetchData = async () => {
        if (!token) {
            setError("Token tidak ditemukan. Silakan login.");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const res = await axios.get(`http://localhost:5000/api/step?token=${token}`);
            setData(res.data); 
            
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Gagal mengambil data dari Google Fit.";
            
            if (err.response?.status === 401) {
                alert("Token kedaluwarsa atau tidak valid. Silakan login ulang.");
                localStorage.removeItem("fit_token");
                localStorage.removeItem("fit_refresh_token");
                setToken(null);
                setRefreshToken(null);
            }
            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fit-container">
            <h1>🏃 Google Fit Health Dashboard</h1>

            {error && <p className="error-message">🛑 {error}</p>}

            {!token ? (
                // Tampilan saat belum login
                <a href="http://localhost:5000/auth/google">
                    <button className="login-button">
                        Login dengan Google Fit
                    </button>
                </a>
            ) : (
                <>
                    <p>✅ Koneksi Google Fit berhasil.</p>
                    <button 
                        onClick={fetchData} 
                        className="fetch-button"
                        disabled={loading}
                    >
                        {loading ? "Memuat Data..." : "Ambil Data Terbaru"}
                    </button>

                    {/* 💡 KARTU LANGKAH HARI INI */}
                    {stepsToday !== null && (
                         <div className="steps-today-card">
                             <h2>Langkah Kaki Hari Ini</h2>
                             <p className="steps-value">{stepsToday.toLocaleString()}</p>
                             <p className="steps-hint">Total langkah hingga saat ini.</p>
                         </div>
                    )}


                    {/* CONTAINER BERAT BADAN */}
                    {data.latestWeight !== null && (
                         <div className="weight-card">
                             <h2>Berat Badan Terbaru</h2>
                             <p className="weight-value">{data.latestWeight || 'N/A'} kg</p>
                             <p className="weight-hint">Diambil dari data terakhir yang tersimpan di Google Fit.</p>
                         </div>
                    )}

                    {/* Tampilkan detail aktivitas harian */}
                    {data.activityData.length > 0 && (
                        <>
                            <h2>Data Aktivitas 7 Hari Terakhir</h2>
                            <div className="data-grid">
                                {data.activityData.map((d, index) => (
                                    <div key={index} className="data-card">
                                        <h3 className="card-date">{d.date}</h3>
                                        <p>Langkah: <span>{d.steps.toLocaleString()}</span></p>
                                        <p>Kalori: <span>{d.calories.toLocaleString()} kkal</span></p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
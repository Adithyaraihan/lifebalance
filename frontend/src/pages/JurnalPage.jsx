import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  ChevronLeft,
  BookOpen,
  User,
  ExternalLink,
  Loader,
} from "lucide-react";

export default function JournalPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/article");
      setArticles(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil jurnal:", err);
      setError("Gagal memuat daftar jurnal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="journal-page-container">
      <style>{styles}</style>

      {/* HEADER SECTION */}
      <div className="page-header">
        <div className="header-content">
          <button onClick={() => navigate("/")} className="back-btn">
            <ChevronLeft size={24} />
            <span>Kembali ke Dashboard</span>
          </button>

          <div className="header-title-block">
            <h1>Repository Jurnal</h1>
            <p>Temukan wawasan terbaru seputar kesehatan mental dan fisik.</p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <Loader className="spin text-green" size={32} />
            <p>Memuat artikel...</p>
          </div>
        ) : (
          /* ARTICLES GRID - Layout 2 Kolom */
          <div className="articles-grid">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="article-card">
                  {/* Card Body */}
                  <div className="card-body">
                    {/* Tag Visual */}
                    <div className="card-tags">
                      <span className="tag-pill">Kesehatan</span>
                      <span className="read-time">• Artikel Ilmiah</span>
                    </div>

                    <h3 className="article-title">{article.judul}</h3>

                    {/* ABSTRAK FULL TEXT (Tanpa pemotongan) */}
                    <div className="article-abstract">{article.abstract}</div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <div className="author-info">
                      <div className="author-avatar">
                        <User size={16} color="white" />
                      </div>
                      <div className="author-text">
                        <span className="author-name">
                          {article.author || "Admin"}
                        </span>
                        <span className="author-role">Penulis</span>
                      </div>
                    </div>

                    {/* TOMBOL LINK DINAMIS DARI DB */}
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="read-btn"
                    >
                      Baca Artikel
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <BookOpen size={48} className="text-gray-300 mb-2" />
                <p>Belum ada artikel yang tersedia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// CSS Internal - FitLife Green Theme
const styles = `
  :root {
    --fit-green: #16a34a;
    --fit-green-dark: #15803d;
    --fit-green-light: #dcfce7;
    --bg-color: #f8fafc;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
  }

  .journal-page-container {
    min-height: 100vh;
    background-color: var(--bg-color);
    font-family: 'Inter', sans-serif;
    padding-bottom: 60px;
  }

  /* HEADER */
  .page-header {
    background-color: white;
    padding: 24px 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 40px;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
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
    width: fit-content;
  }
  .back-btn:hover { color: var(--fit-green); }

  .header-title-block h1 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 8px 0;
  }
  
  .header-title-block p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin: 0;
  }

  /* WRAPPER */
  .content-wrapper {
    max-width: 1000px; /* Lebar konten dibatasi agar nyaman dibaca */
    margin: 0 auto;
    padding: 0 24px;
  }

  /* GRID SYSTEM (MODIFIKASI: 2 KOLOM PER BARIS) */
  .articles-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Force 2 Kolom */
    gap: 32px; /* Jarak antar kartu lebih lega */
    align-items: start; /* Kartu tidak dipaksa sama tinggi, mengikuti konten */
  }

  /* CARD STYLE */
  .article-card {
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  .article-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
    border-color: var(--fit-green-light);
  }

  .card-body {
    padding: 32px; /* Padding lebih besar */
    flex: 1;
  }

  /* Tags */
  .card-tags {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 0.8rem;
  }

  .tag-pill {
    background-color: var(--fit-green-light);
    color: var(--fit-green-dark);
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 600;
  }

  .read-time { color: #94a3b8; }

  /* Typography */
  .article-title {
    font-size: 1.5rem; /* Judul lebih besar */
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 16px 0;
    line-height: 1.3;
  }

  /* MODIFIKASI ABSTRAK: Full Text */
  .article-abstract {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7; /* Line height nyaman untuk membaca panjang */
    margin: 0;
    white-space: pre-wrap; /* Menjaga paragraf/enter dari database */
  }

  /* Footer */
  .card-footer {
    padding: 20px 32px;
    border-top: 1px solid #f1f5f9;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .author-avatar {
    width: 36px;
    height: 36px;
    background-color: var(--fit-green);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .author-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .author-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .author-role {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  /* Button Link */
  .read-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--fit-green);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
  }

  .read-btn:hover {
    background-color: var(--fit-green-dark);
  }

  /* UTILS */
  .error-banner {
    background-color: #fee2e2;
    color: #991b1b;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    text-align: center;
  }

  .loading-state {
    text-align: center;
    padding: 80px 0;
    color: var(--text-secondary);
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 0;
    color: #94a3b8;
  }

  .spin { animation: spin 1s linear infinite; margin-bottom: 12px; }
  .text-green { color: var(--fit-green); }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Responsive Mobile (Tetap 1 kolom di HP) */
  @media (max-width: 768px) {
    .page-header { padding: 16px 0; margin-bottom: 24px; }
    .content-wrapper { padding: 0 16px; }
    
    .articles-grid {
      grid-template-columns: 1fr; /* Mobile jadi 1 kolom */
    }

    .card-footer {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    .read-btn { width: 100%; justify-content: center; }
  }
`;

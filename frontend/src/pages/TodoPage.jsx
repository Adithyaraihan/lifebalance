import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronLeft,
  Target,
  Plus,
  ListTodo,
  Loader,
} from "lucide-react";

export default function TodoPage() {
  const navigate = useNavigate();

  // State
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- LOGIC PROGRESS ---
  const totalTasks = todos.length;
  const completedTasks = todos.filter((todo) => todo.completed).length;
  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // --- FETCH DATA ---
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/todo");
      setTodos(res.data);
    } catch (err) {
      console.error("Gagal load todo:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ADD TODO ---
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!text.trim() || !deadline) return;

    try {
      setSubmitting(true);
      const isoDeadline = new Date(deadline).toISOString();

      const res = await api.post("/todo", {
        text,
        deadline: isoDeadline,
      });

      setTodos([...todos, res.data]);
      setText("");
      setDeadline("");
    } catch (err) {
      console.error("Gagal tambah todo:", err);
      alert("Gagal menambahkan tugas.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- TOGGLE COMPLETE ---
  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/todo/${id}`);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: res.data.completed } : todo
        )
      );
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  // --- DELETE TODO ---
  const handleDelete = async (id) => {
    if (!confirm("Hapus tugas ini?")) return;
    try {
      await api.delete(`/todo/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todo-page-container">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="page-header">
        <button onClick={() => navigate("/")} className="back-btn">
          <ChevronLeft size={24} />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      <div className="content-wrapper">
        <div className="todo-grid">
          {/* LEFT COLUMN: PROGRESS & FORM */}
          <div className="left-column">
            {/* 1. PROGRESS CARD (Green Gradient) */}
            <div className="progress-card">
              <div className="progress-header">
                <Target size={20} className="text-white opacity-90" />
                <span>Target Harian</span>
              </div>

              <div className="progress-stats">
                <span className="big-percent">{progressPercentage}%</span>
                <span className="stats-text">
                  {completedTasks} dari {totalTasks} Selesai
                </span>
              </div>

              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* 2. ADD FORM */}
            <div className="form-card">
              <div className="card-header">
                <div className="icon-bg">
                  <Plus size={24} color="white" />
                </div>
                <h2>Tambah Tugas</h2>
              </div>

              <form onSubmit={handleAddTodo} className="todo-form">
                <div className="input-group">
                  <label>Nama Tugas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jogging Pagi"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="submit-btn"
                >
                  {submitting ? "Menyimpan..." : "Tambah Tugas"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: LIST */}
          <div className="list-card">
            <div className="card-header-simple">
              <ListTodo size={20} className="text-gray-500" />
              <h3>Daftar Tugas Saya</h3>
            </div>

            <div className="list-container">
              {loading ? (
                <div className="loading-state">
                  <Loader className="spin text-green" size={24} />
                  <p>Memuat tugas...</p>
                </div>
              ) : todos.length > 0 ? (
                <div className="todo-items">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`todo-item ${
                        todo.completed ? "completed" : ""
                      }`}
                    >
                      <button
                        onClick={() => handleToggle(todo.id)}
                        className="check-btn"
                      >
                        {todo.completed ? (
                          <CheckCircle2
                            className="w-6 h-6 text-green"
                            fill="#dcfce7"
                          />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300 hover:text-green-500 transition-colors" />
                        )}
                      </button>

                      <div className="todo-content">
                        <span className="todo-text">{todo.text}</span>
                        <div className="todo-meta">
                          <Calendar size={12} />
                          {new Date(todo.deadline).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="delete-btn"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Target size={48} className="text-gray-200 mb-2" />
                  <p>Tidak ada tugas aktif. Yuk mulai produktif!</p>
                </div>
              )}
            </div>
          </div>
        </div>
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

  .todo-page-container {
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
  .back-btn:hover { color: var(--fit-green); }

  .content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* GRID SYSTEM */
  .todo-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 24px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .todo-grid { grid-template-columns: 1fr; }
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* PROGRESS CARD (Gradient) */
  .progress-card {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);
  }

  .progress-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    margin-bottom: 16px;
  }

  .progress-stats {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
  }

  .big-percent { font-size: 2.5rem; font-weight: 800; line-height: 1; }
  .stats-text { font-size: 0.85rem; opacity: 0.9; padding-bottom: 4px; }

  .progress-bar-bg {
    background-color: rgba(255, 255, 255, 0.2);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar-fill {
    background-color: white;
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease-out;
  }

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
    margin-bottom: 20px;
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

  .todo-form { display: flex; flex-direction: column; gap: 16px; }

  .input-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 6px;
  }

  .input-group input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
    box-sizing: border-box; /* Fix width overflow */
  }

  .input-group input:focus {
    border-color: var(--fit-green);
    box-shadow: 0 0 0 3px var(--fit-green-light);
  }

  .submit-btn {
    background-color: var(--fit-green);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 8px;
  }
  .submit-btn:hover:not(:disabled) { background-color: var(--fit-green-dark); }
  .submit-btn:disabled { background-color: #94a3b8; cursor: not-allowed; }

  /* LIST CARD */
  .list-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    min-height: 400px;
    display: flex;
    flex-direction: column;
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

  .list-container { flex: 1; }

  .todo-items { display: flex; flex-direction: column; gap: 12px; }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    transition: all 0.2s;
  }

  .todo-item:hover {
    border-color: var(--fit-green-light);
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  .todo-item.completed {
    background-color: #f8fafc;
    border-color: transparent;
  }

  .check-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }

  .text-green { color: var(--fit-green); }

  .todo-content { flex: 1; }

  .todo-text {
    display: block;
    font-weight: 500;
    color: var(--text-primary);
    transition: color 0.2s;
  }

  .completed .todo-text {
    text-decoration: line-through;
    color: #94a3b8;
  }

  .todo-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .delete-btn {
    background: none;
    border: none;
    color: #cbd5e1;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .delete-btn:hover {
    background-color: #fee2e2;
    color: #ef4444;
  }

  .empty-state {
    text-align: center;
    color: var(--text-secondary);
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .loading-state { text-align: center; padding: 40px; color: var(--text-secondary); }
  .spin { animation: spin 1s linear infinite; margin-bottom: 8px; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

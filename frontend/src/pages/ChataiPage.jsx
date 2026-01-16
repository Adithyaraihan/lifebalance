import { useEffect, useState, useRef } from "react";
import api from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Send, Trash2, Bot, User, Loader, Cpu } from "lucide-react";

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
    try {
      const res = await api.get("/aichat");
      const formattedHistory = res.data.flatMap((chat) => [
        { id: `q-${chat.id}`, type: "user", text: chat.question },
        { id: `a-${chat.id}`, type: "ai", text: chat.answer },
      ]);
      setMessages(formattedHistory);
    } catch (err) {
      console.error("Gagal memuat chat:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    const tempId = Date.now(); // ID sementara

    const newUserMsg = { id: tempId, type: "user", text: userText };
    setMessages((prev) => [...prev, newUserMsg]);

    setInput(""); // Reset input
    setLoading(true); // Mulai loading (typing indicator)

    try {
      const res = await api.post("/aichat/ask", { question: userText });

      const newAiMsg = {
        id: `a-${res.data.chat.id}`,
        type: "ai",
        text: res.data.chat.answer,
      };

      setMessages((prev) => [...prev, newAiMsg]);
    } catch (err) {
      console.error("Error sending message:", err);
      // Opsional: Hapus pesan user jika gagal, atau beri tanda error
      alert("Gagal mengirim pesan. Coba lagi.");
    } finally {
      setLoading(false); // Hentikan animasi typing
    }
  };

  // 3. DELETE: Hapus Semua Chat
  const handleDeleteHistory = async () => {
    if (messages.length === 0) return;
    if (!confirm("Yakin ingin menghapus semua riwayat percakapan?")) return;

    try {
      await api.delete("/aichat");
      setMessages([]);
    } catch (err) {
      console.error("Gagal menghapus chat:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="layout-container">
      <style>{styles}</style>

      {/* 1. SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN WRAPPER */}
      <main className="main-wrapper">
        <Navbar />

        {/* CHAT CONTAINER */}
        <div className="chat-page-container">
          {/* HEADER CHAT */}
          <div className="chat-header-custom">
            <div className="bot-info">
              <div className="bot-avatar-header">
                <Bot size={24} color="white" />
              </div>
              <div className="header-text">
                <h1 className="bot-name">AI Assistant</h1>
                <p className="bot-status">
                  {loading ? "Sedang mengetik..." : "Siap membantu Anda"}
                </p>
              </div>
            </div>

            <button
              onClick={handleDeleteHistory}
              className="delete-btn"
              title="Hapus Semua Chat"
              disabled={messages.length === 0 || loading}
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* AREA PESAN */}
          <div className="chat-area">
            {messages.length === 0 && !loading && (
              <div className="empty-state">
                <Cpu size={48} color="#cbd5e1" />
                <p>Belum ada percakapan. Mulai bertanya sekarang!</p>
              </div>
            )}

            {/* MAPPING DATA FLAT */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-row ${
                  msg.type === "user" ? "row-user" : "row-ai"
                }`}
              >
                {/* JIKA TIPE USER */}
                {msg.type === "user" && (
                  <div className="user-container">
                    <div className="bubble bubble-user">
                      <div className="bubble-text">{msg.text}</div>
                    </div>
                    <div className="user-avatar">
                      <User size={16} color="white" />
                    </div>
                  </div>
                )}

                {/* JIKA TIPE AI */}
                {msg.type === "ai" && (
                  <div className="ai-container">
                    <div className="ai-icon">
                      <Bot size={20} color="white" />
                    </div>
                    <div className="bubble bubble-ai">
                      <div className="bubble-text">{msg.text}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* LOADING INDICATOR (Typing Bubble) */}
            {loading && (
              <div className="message-row row-ai">
                <div className="ai-container">
                  <div className="ai-icon">
                    <Bot size={20} color="white" />
                  </div>
                  <div className="bubble bubble-ai typing">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="input-section">
            <form onSubmit={handleSend} className="input-wrapper">
              <input
                type="text"
                className="chat-input"
                placeholder="Ketik pertanyaan Anda di sini..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!input.trim() || loading}
              >
                <Send size={20} color="white" />
              </button>
            </form>
            <p className="disclaimer">
              AI dapat membuat kesalahan. Harap verifikasi informasi penting.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// CSS STYLING
const styles = `
  /* Layout Dasar */
  .layout-container {
    display: flex;
    height: 100vh;
    background-color: #f9fafb;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }
  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  /* Chat Container */
  .chat-page-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px); 
    background-color: #f4f6f8;
    position: relative;
  }

  /* Header Chat */
  .chat-header-custom {
    background: white;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;
  }
  
  .bot-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bot-avatar-header {
    width: 40px;
    height: 40px;
    background-color: #1c8c4c;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-text {
    display: flex;
    flex-direction: column;
  }

  .bot-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .bot-status {
    font-size: 12px;
    color: #666;
    margin: 0;
  }

  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s;
  }
  .delete-btn:hover:not(:disabled) {
    background-color: #fee2e2;
    color: #ef4444;
  }
  .delete-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  /* Area Chat */
  .chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px; /* Spasi antar pesan */
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #94a3b8;
    gap: 10px;
  }

  /* Row Message Styling */
  .message-row {
    display: flex;
    width: 100%;
    margin-bottom: 4px;
  }

  .row-user {
    justify-content: flex-end;
  }

  .row-ai {
    justify-content: flex-start;
  }

  /* AI Styling */
  .ai-container {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    max-width: 80%;
  }

  .ai-icon {
    width: 32px;
    height: 32px;
    background-color: #1c8c4c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* User Styling */
  .user-container {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    max-width: 80%;
    justify-content: flex-end;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    background-color: #64748b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Bubbles */
  .bubble {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.5;
    position: relative;
    border-radius: 12px;
    word-wrap: break-word;
  }

  .bubble-ai {
    background-color: white;
    color: #333;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    border-top-left-radius: 4px;
    white-space: pre-wrap;
  }

  .bubble-user {
    background-color: #1c8c4c;
    color: white;
    border-top-right-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  /* Typing Dots Animation */
  .typing-dots {
    display: flex;
    gap: 4px;
    padding: 4px 0;
  }
  .typing-dots span {
    width: 6px;
    height: 6px;
    background: #9ca3af;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out both;
  }
  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  /* Input Section */
  .input-section {
    background-color: #f4f6f8;
    padding: 16px 20px;
    flex-shrink: 0;
    border-top: 1px solid #e2e8f0;
  }

  .input-wrapper {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .chat-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    padding: 8px;
    color: #333;
  }

  .send-btn {
    background-color: #8cc6a1;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .send-btn:hover:not(:disabled) {
    background-color: #1c8c4c;
  }
  .send-btn:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
  }
  .disclaimer {
    font-size: 10px;
    color: #94a3b8;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 0;
  }
`;

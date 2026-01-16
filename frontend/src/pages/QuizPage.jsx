import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Brain, CheckCircle2, AlertCircle } from "lucide-react";

// Opsi Jawaban (Skala GHQ-12)
const opsi = ["Tidak sama sekali", "Sedikit", "Cukup sering", "Sangat sering"];

// Pertanyaan GHQ-12
const quizQuestions = [
  {
    id: 1,
    question:
      "Apakah Anda merasa mampu berkonsentrasi pada apa yang Anda lakukan?",
  },
  {
    id: 2,
    question: "Apakah Anda kehilangan waktu tidur karena kekhawatiran?",
  },
  { id: 3, question: "Apakah Anda merasa berperan dalam berbagai hal?" },
  { id: 4, question: "Apakah Anda merasa mampu membuat keputusan?" },
  {
    id: 5,
    question: "Apakah Anda merasa terus-menerus berada di bawah tekanan?",
  },
  { id: 6, question: "Apakah Anda merasa tidak mampu mengatasi kesulitan?" },
  {
    id: 7,
    question: "Apakah Anda merasa bisa menikmati kegiatan sehari-hari?",
  },
  { id: 8, question: "Apakah Anda merasa mampu menghadapi masalah?" },
  { id: 9, question: "Apakah Anda merasa tidak bahagia dan tertekan?" },
  { id: 10, question: "Apakah Anda kehilangan kepercayaan diri?" },
  { id: 11, question: "Apakah Anda berpikir bahwa Anda tidak berharga?" },
  { id: 12, question: "Apakah Anda merasa bahagia secara umum?" },
];

export default function MentalHealthPage() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Logic Menyimpan Jawaban
  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: optionIndex, // Simpan index opsi (0, 1, 2, 3)
    });
  };

  // Navigasi Next Question
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  // Kalkulasi Skor (Metode GHQ-12 Likert: 0-1-2-3)
  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      const answerIdx = userAnswers[q.id];
      if (answerIdx !== undefined) {
        score += answerIdx; // 0, 1, 2, atau 3
      }
    });
    return score;
  };

  const score = calculateScore();

  // Interpretasi Hasil
  const getResultInterpretation = () => {
    if (score <= 12)
      return {
        status: "Normal",
        color: "green",
        desc: "Kondisi mental Anda stabil. Pertahankan gaya hidup sehat Anda.",
      };
    if (score <= 20)
      return {
        status: "Ringan",
        color: "yellow",
        desc: "Terdapat indikasi stres ringan. Cobalah relaksasi dan istirahat cukup.",
      };
    if (score <= 28)
      return {
        status: "Sedang",
        color: "orange",
        desc: "Indikasi tekanan psikologis sedang. Pertimbangkan untuk berbicara dengan teman dekat atau konselor.",
      };
    return {
      status: "Berat",
      color: "red",
      desc: "Indikasi tekanan psikologis berat. Sangat disarankan untuk berkonsultasi dengan profesional.",
    };
  };

  const resultInfo = getResultInterpretation();

  // RENDER: Pertanyaan
  const renderQuestion = () => (
    <div className="quiz-card">
      <div className="quiz-header">
        <div className="progress-text">
          Soal {currentQuestionIndex + 1}{" "}
          <span className="text-gray-400">/ {quizQuestions.length}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quizQuestions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <h2 className="question-text">{currentQuestion.question}</h2>

      <div className="options-container">
        {opsi.map((option, index) => {
          const isSelected = userAnswers[currentQuestion.id] === index;
          return (
            <button
              key={index}
              className={`option-btn ${isSelected ? "selected" : ""}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div
                className={`radio-circle ${isSelected ? "radio-checked" : ""}`}
              ></div>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <button
        className="next-btn"
        onClick={handleNext}
        disabled={userAnswers[currentQuestion.id] === undefined}
      >
        {currentQuestionIndex === quizQuestions.length - 1
          ? "Lihat Hasil"
          : "Lanjut"}
      </button>
    </div>
  );

  // RENDER: Hasil
  const renderResult = () => (
    <div className="result-card">
      <div className={`result-icon-bg bg-${resultInfo.color}`}>
        {resultInfo.color === "green" ? (
          <CheckCircle2 size={48} color="white" />
        ) : (
          <AlertCircle size={48} color="white" />
        )}
      </div>

      <h2 className="result-title">Hasil Analisis</h2>

      <div className="score-box">
        <span className="score-label">Skor GHQ-12</span>
        <span className={`score-value text-${resultInfo.color}`}>{score}</span>
      </div>

      <div
        className={`status-badge bg-${resultInfo.color}-light text-${resultInfo.color}-dark`}
      >
        Kondisi: {resultInfo.status}
      </div>

      <p className="result-desc">{resultInfo.desc}</p>

      <button
        className="restart-btn"
        onClick={() => {
          setCurrentQuestionIndex(0);
          setUserAnswers({});
          setShowResult(false);
        }}
      >
        Ulangi Tes
      </button>
    </div>
  );

  return (
    <div className="page-container">
      <style>{styles}</style>

      {/* HEADER SECTION */}
      <div className="page-header">
        <div className="header-content">
          <button onClick={() => navigate("/")} className="back-btn">
            <ChevronLeft size={24} />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="hero-section">
          <div className="icon-wrapper">
            <Brain size={32} color="white" />
          </div>
          <h1>Tes Kesehatan Mental</h1>
          <p>
            Kuesioner GHQ-12 untuk mendeteksi kondisi psikologis non-psikotik.
          </p>
        </div>

        {showResult ? renderResult() : renderQuestion()}
      </div>
    </div>
  );
}

// CSS Internal - FitLife Theme
const styles = `
  :root {
    --fit-green: #16a34a;
    --fit-green-dark: #15803d;
    --fit-green-light: #dcfce7;
    --bg-color: #f8fafc;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
  }

  .page-container {
    min-height: 100vh;
    background-color: var(--bg-color);
    font-family: 'Inter', sans-serif;
    padding-bottom: 40px;
  }

  /* HEADER */
  .page-header {
    background-color: white;
    padding: 16px 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 32px;
  }

  .header-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
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

  /* CONTENT */
  .content-wrapper {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 32px;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    background-color: var(--fit-green);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
  }

  .hero-section h1 {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 8px 0;
  }

  .hero-section p {
    color: var(--text-secondary);
    font-size: 1rem;
    margin: 0;
  }

  /* QUIZ CARD */
  .quiz-card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .quiz-header { margin-bottom: 24px; }

  .progress-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
  }

  .progress-bar-bg {
    height: 8px;
    background-color: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background-color: var(--fit-green);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .question-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 24px;
    line-height: 1.4;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .option-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 1px solid #e2e8f0;
    background-color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-size: 1rem;
    color: var(--text-primary);
  }

  .option-btn:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }

  .option-btn.selected {
    background-color: var(--fit-green-light);
    border-color: var(--fit-green);
    color: var(--fit-green-dark);
    font-weight: 500;
  }

  .radio-circle {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e1;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
  }

  .option-btn.selected .radio-circle {
    border-color: var(--fit-green);
  }

  .option-btn.selected .radio-circle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: var(--fit-green);
    border-radius: 50%;
  }

  .next-btn {
    width: 100%;
    background-color: var(--fit-green);
    color: white;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .next-btn:hover:not(:disabled) {
    background-color: var(--fit-green-dark);
  }

  .next-btn:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }

  /* RESULT CARD */
  .result-card {
    background: white;
    border-radius: 16px;
    padding: 40px 32px;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .result-icon-bg {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  .bg-green { background-color: #16a34a; }
  .bg-yellow { background-color: #eab308; }
  .bg-orange { background-color: #f97316; }
  .bg-red { background-color: #ef4444; }

  .result-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 24px 0;
  }

  .score-box {
    margin-bottom: 16px;
  }

  .score-label {
    display: block;
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .score-value {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
  }

  .text-green { color: #16a34a; }
  .text-yellow { color: #ca8a04; }
  .text-orange { color: #ea580c; }
  .text-red { color: #dc2626; }

  .status-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .bg-green-light { background-color: #dcfce7; color: #166534; }
  .bg-yellow-light { background-color: #fef9c3; color: #854d0e; }
  .bg-orange-light { background-color: #ffedd5; color: #9a3412; }
  .bg-red-light { background-color: #fee2e2; color: #991b1b; }

  .result-desc {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 32px;
    max-width: 400px;
  }

  .restart-btn {
    background-color: white;
    border: 1px solid #cbd5e1;
    color: var(--text-primary);
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .restart-btn:hover {
    background-color: #f8fafc;
    border-color: var(--fit-green);
    color: var(--fit-green);
  }
`;

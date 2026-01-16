import React from "react";
import Sidebar from "./Sidebar";
// import   "../css/Dashboard.jsx"; // Pastikan CSS diim\port di sini

export default function Layout({ children }) {
  return (
    <div className="dashboard-container">
      {/* Sidebar Statis di Kiri */}
      <Sidebar />

      {/* Konten Dinamis di Kanan */}
      <main className="main-content">
        {/* Header bisa dipisah juga jika mau, tapi ditaruh sini ok */}
        <header className="content-header">
          <div className="header-left">
            <h1>Selamat Datang</h1>
            <p>Pantau kesehatan dan produktivitasmu hari ini.</p>
          </div>
        </header>

        {/* Child components (Halaman yang sedang dibuka) akan render di sini */}
        <div className="content-grid">{children}</div>
      </main>
    </div>
  );
}

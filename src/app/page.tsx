"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [status, setStatus] = useState<string>("loading...");
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/aws-instance");
      const data = await res.json();
      
      if (data.status) {
        setStatus(data.status);
        setIp(data.ip);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch("/api/aws-instance", { method: "POST" });
      setStatus("pending");
      // Poll faster while pending
      setTimeout(fetchStatus, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyIp = () => {
    if (ip) {
      navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isRunning = status === "running";
  const isPending = status === "pending" || status === "stopping";

  return (
    <main className={`${styles.container} ${isRunning ? styles.online : ''}`}>
      <h1 className={styles.title}>Minecraft Fabric</h1>
      <p className={styles.subtitle}>Server Controller Panel</p>

      <div className={styles.statusCard}>
        <div className={styles.statusLabel}>Server Status</div>
        <div className={styles.statusValue}>
          <span className={`${styles.indicator} ${styles[status] || ''}`}></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        
        {isRunning && ip && (
          <div className={styles.ipBox} onClick={copyIp} title="Click to copy">
            {copied ? "Copied!" : ip}
          </div>
        )}
      </div>

      <button 
        className={styles.button}
        onClick={handleStart}
        disabled={loading || isRunning || isPending}
      >
        {loading ? "Please wait..." : isRunning ? "Server Online" : isPending ? "Starting up..." : "Start Server"}
      </button>
    </main>
  );
}

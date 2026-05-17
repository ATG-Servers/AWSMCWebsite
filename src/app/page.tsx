"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [status, setStatus] = useState<string>("loading...");
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/aws-instance");
      const data = await res.json();
      
      if (data.error) {
        setStatus("error");
        setErrorMsg(data.error);
      } else if (data.status) {
        setStatus(data.status);
        setIp(data.ip);
        setErrorMsg(null);
      } else {
        setStatus("error");
        setErrorMsg("Unknown API response.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to connect to the server API.");
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
      const res = await fetch("/api/aws-instance", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setStatus("error");
        setErrorMsg(data.error);
      } else {
        setStatus("pending");
        setErrorMsg(null);
        setTimeout(fetchStatus, 3000);
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to start the server.");
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
    <div className={styles.page}>
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

      <div className={`${styles.helperText} ${status === 'error' ? styles.helperTextError : ''}`}>
        {status === "loading..." && "Checking server status..."}
        {status === "error" && `Error: ${errorMsg || "An unknown error occurred. Please contact the server admin."}`}
        {status === "stopped" && "The server is currently offline to save resources. Click 'Start Server' below to boot it up!"}
        {status === "pending" && "The AWS machine is booting up! Please wait about 1 minute..."}
        {status === "running" && "AWS is online! Minecraft is starting. You can usually join ~2 mins after the IP appears."}
        {status === "stopping" && "The server is shutting down. Please wait."}
      </div>

      <button 
        className={styles.button}
        onClick={handleStart}
        disabled={loading || isRunning || isPending}
      >
        {loading ? "Please wait..." : isRunning ? "Server Online" : isPending ? "Starting up..." : "Start Server"}
      </button>
      </main>

      <section className={styles.featuresWrapper}>
        <h2 className={styles.featuresTitle}>Server Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏰</div>
            <h3>Epic Exploration</h3>
            <p>Completely overhauled world generation with beautiful towns, custom dungeons, and biome-specific repurposed structures.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💎</div>
            <h3>Mining Rewarded</h3>
            <p>Mining regular stone now has a 5% chance to drop valuable minerals like Diamonds, Emeralds, and Gold.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤝</div>
            <h3>Multiplayer QoL</h3>
            <p>Instantly chop down entire trees, feed your friends, and safely teleport with your pets without taking damage.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🥩</div>
            <h3>Edible Ingredients</h3>
            <p>Eat raw ingredients in a pinch! Blaze Powder gives Strength, Sugar gives Speed, and Ghast Tears give Regen for 30s.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚔️</div>
            <h3>Upgraded Combat</h3>
            <p>Expanded enchantments, more mob variations, and massive upgrades to the Hero of the Village buffs.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Ultra Optimized</h3>
            <p>Running a premium suite of optimization mods like Lithium and VMP ensuring zero block lag or rubberbanding.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

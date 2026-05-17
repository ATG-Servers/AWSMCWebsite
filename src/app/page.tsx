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
            <div className={styles.featureIcon}>🌍</div>
            <h3>Ultimate World Generation</h3>
            <p>Completely rewrites the game's generation for breathtaking landscapes across all three dimensions.</p>
            <div className={styles.modTags}>
              <span className={styles.modTag}>Terralith</span>
              <span className={styles.modTag}>Incendium</span>
              <span className={styles.modTag}>Amplified Nether</span>
              <span className={styles.modTag}>Nullscape</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏰</div>
            <h3>Massive Dungeons</h3>
            <p>Find hundreds of new, highly detailed castles, towers, ruined strongholds, and hidden taverns.</p>
            <div className={styles.modTags}>
              <span className={styles.modTag}>Explorify</span>
              <span className={styles.modTag}>Structory Towers</span>
              <span className={styles.modTag}>Dungeons & Taverns</span>
              <span className={styles.modTag}>Katters Structures</span>
              <span className={styles.modTag}>Repurposed Structures</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚔️</div>
            <h3>The WASD Arsenal</h3>
            <p>A massive expansion of craftable weaponry and tools! Wield Hammers, Spears, Magic Wands, Crazy Swords, Custom Bows, Rings, and upgraded armor sets.</p>
            <div className={styles.modTags}>
              <span className={styles.modTag}>WASD Swords</span>
              <span className={styles.modTag}>WASD Spears</span>
              <span className={styles.modTag}>WASD Wands</span>
              <span className={styles.modTag}>WASD Bows</span>
              <span className={styles.modTag}>WASD Rings</span>
              <span className={styles.modTag}>+15 more</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✨</div>
            <h3>Magic & Utility</h3>
            <p>Armor Trims now grant magical effects! Plus, enjoy craftable Backpacks and a vastly improved Better Enderchest system for unlimited storage.</p>
            <div className={styles.modTags}>
              <span className={styles.modTag}>Trim Effects</span>
              <span className={styles.modTag}>Better Enderchest</span>
              <span className={styles.modTag}>Backpacks</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⛏️</div>
            <h3>Quality of Life Mastered</h3>
            <p>Veinminer and FallingTree let you harvest resources instantly. Find buried treasure easily, and enjoy your pets safely teleporting without taking damage.</p>
            <div className={styles.modTags}>
              <span className={styles.modTag}>Veinminer</span>
              <span className={styles.modTag}>FallingTree</span>
              <span className={styles.modTag}>Mine Treasure</span>
              <span className={styles.modTag}>Followers Teleport Too</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🥩</div>
            <h3>Enhanced Survival</h3>
            <p>Eat raw ingredients for emergency buffs, fight custom mob variants, and master the fully overhauled Enchantments Encore system.</p>
            <div className={styles.modTags}>
              <span className={styles.modTag}>Edibles</span>
              <span className={styles.modTag}>More Mobs</span>
              <span className={styles.modTag}>Enchantments Encore</span>
              <span className={styles.modTag}>Mineral Chance</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

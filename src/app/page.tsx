"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

// MODS DATA
const MOD_CATEGORIES = [
  {
    id: "world-gen",
    title: "🌍 World Generation",
    desc: "Massive overhauls to the shape and scope of the world.",
    items: [
      { name: "Terralith", desc: "Rewrites Overworld generation with nearly 100 new biomes, massive caves, and breathtaking terrain features.", link: "https://modrinth.com/mod/terralith" },
      { name: "Incendium", desc: "Expands the Nether with 8 new biomes, custom mobs, and massive structures.", link: "https://modrinth.com/mod/incendium" },
      { name: "Amplified Nether", desc: "Increases the height of the Nether to 256 blocks for massive, cavernous 3D biomes.", link: "https://modrinth.com/mod/amplified-nether" },
      { name: "Nullscape", desc: "An incredible expansion to the End dimension, adding alien terrain, massive floating islands, and height variations.", link: "https://modrinth.com/mod/nullscape" }
    ]
  },
  {
    id: "structures",
    title: "🏰 Structures & Exploration",
    desc: "New locations, ruins, cities, and dungeons to explore.",
    items: [
      { name: "Explorify", desc: "Adds vanilla-styled dungeons, crypts, and ruins across the Overworld.", link: "https://modrinth.com/mod/explorify" },
      { name: "Moog's End Structures", desc: "Dozens of new ruin types across the End.", link: "https://modrinth.com/mod/moogs-end-structures" },
      { name: "Moog's Missing Villages", desc: "Populates previously empty biomes with distinct village variants.", link: "https://modrinth.com/mod/moogs-missing-villages" },
      { name: "Moog's Nether Structures", desc: "Ancient debris fortresses and ruined piglin camps.", link: "https://modrinth.com/mod/moogs-nether-structures" },
      { name: "Moog's Soaring Structures", desc: "Floating sky-islands offering high-risk platforming rewards.", link: "https://modrinth.com/mod/moogs-soaring-structures" },
      { name: "Moog's Voyager Structures", desc: "Overworld traversal camps and hidden lore locations.", link: "https://modrinth.com/mod/moogs-voyager-structures" },
      { name: "Structory Towers", desc: "Beautifully designed, immersive watchtowers dotting the landscape.", link: "https://modrinth.com/mod/structory-towers" },
      { name: "Dungeons+", desc: "Additional challenging dungeons spanning all biomes.", link: "https://modrinth.com/mod/dungeons-plus" },
      { name: "Dungeons & Taverns", desc: "Procedural underground labyrinths and roadside taverns.", link: "https://modrinth.com/mod/dungeons-and-taverns" },
      { name: "Repurposed Structures", desc: "Takes vanilla structures and creates biome-specific variants.", link: "https://modrinth.com/mod/repurposed-structures" },
      { name: "Katters Structures", desc: "Ambient builds like bridges, abandoned homes, and ruins.", link: "https://modrinth.com/mod/katters-structures" },
      { name: "Adorabuild Structures", desc: "Small, cozy generated houses.", link: "https://modrinth.com/mod/adorabuild-structures" },
      { name: "Towns and Towers (t_and_t)", desc: "Highly detailed sprawling cities and pillager outposts.", link: "https://modrinth.com/mod/towns-and-towers" },
      { name: "Vanilla Structure Update", desc: "Modernizes and enhances classic structures.", link: "https://modrinth.com/mod/vanilla-structure-update" },
      { name: "Trek", desc: "Tools and utility for massive world exploration.", link: "https://modrinth.com/mod/trek" }
    ]
  },
  {
    id: "weapons",
    title: "⚔️ Weapons & Arsenal",
    desc: "Devastating new tools of war and destruction.",
    items: [
      { name: "Gamingbarn's Guns", desc: "Introduces ranged ballistic firearms.", link: "https://modrinth.com/datapack/gamingbarns-guns" },
      { name: "WASD Crazy Swords", desc: "Wield massive buster swords and katanas.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Diamond Swords", desc: "Advanced diamond-tier bladed weapons.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Hammers", desc: "Heavy melee weapons focusing on sweeping knockback.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Axes", desc: "Expanded battleaxe combat.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Bows & Crossbows", desc: "Adds explosive bows, multi-shot artifacts, and sniper variants.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Spears", desc: "Long-reach poke weapons.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Swords", desc: "Even more sword variations for every playstyle.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar TNT", desc: "Nuke-tier explosives and utility bombs.", link: "https://modrinth.com/user/WASD_Builds" }
    ]
  },
  {
    id: "magic",
    title: "✨ Magic & Gear",
    desc: "Artifacts, magical spells, and defensive gear.",
    items: [
      { name: "WASD Wands", desc: "Shoot fireballs, summon lightning, or heal allies.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Rings", desc: "Equip magical rings to gain passive buffs.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Totems", desc: "Totems of Undying with special secondary effects upon use.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Boots & Helmets", desc: "Custom armor pieces granting situational awareness or speed.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "Trim Effects", desc: "Armor Trims give passive buffs based on material.", link: "https://modrinth.com/datapack/trim-effects" },
      { name: "Tool Trims", desc: "Allows aesthetic trimming of tools and weapons.", link: "https://modrinth.com/mod/tool-trims" },
      { name: "Enchantments Encore", desc: "Rebalances the enchanting table and adds dozens of powerful enchantments.", link: "https://modrinth.com/mod/enchantments-encore" },
      { name: "Backpacks", desc: "Craftable bags to store immense amounts of loot.", link: "https://modrinth.com/datapack/backpacks" }
    ]
  },
  {
    id: "qol",
    title: "🛠️ Quality of Life",
    desc: "Tweaks and mechanics that make life easier.",
    items: [
      { name: "FallingTree", desc: "Break the bottom block of a tree, and the entire tree falls.", link: "https://modrinth.com/mod/fallingtree" },
      { name: "Veinminer", desc: "Hold a specific key while mining an ore to instantly mine the entire vein.", link: "https://modrinth.com/mod/veinminer" },
      { name: "Mine Treasure", desc: "Buried treasure is much more rewarding and visually distinct.", link: "https://modrinth.com/mod/mine-treasure" },
      { name: "Mineral Chance", desc: "A tiny percentage chance to find rare minerals while mining stone.", link: "https://modrinth.com/mod/mineral-chance" },
      { name: "Edibles", desc: "Eat raw ingredients (blaze powder, sugar) for emergency potion effects.", link: "https://modrinth.com/mod/edibles" },
      { name: "Let Your Friend Eating", desc: "Feed food directly to other players or pets.", link: "https://modrinth.com/mod/letyourfriendeating" },
      { name: "Followers Teleport Too", desc: "Pets safely follow you through nether portals.", link: "https://modrinth.com/mod/followers-teleport-too" },
      { name: "DoubleJump", desc: "Allows mid-air double jumping for incredible mobility.", link: "https://modrinth.com/datapack/double-jump" },
      { name: "Leaf Me Alone", desc: "Better leaf decay and management.", link: "https://modrinth.com/mod/leaf-me-alone" },
      { name: "NetherPortalFix", desc: "Fixes the math for exact portal linking in multiplayer.", link: "https://modrinth.com/mod/netherportalfix" },
      { name: "Vanilla Refresh", desc: "Subtle animation and UI enhancements.", link: "https://modrinth.com/mod/vanilla-refresh" },
      { name: "Village Hero Plus", desc: "Upgrades the rewards and discounts for defending a village.", link: "https://modrinth.com/mod/village-hero-plus" },
      { name: "More Mobs", desc: "Ambient wildlife and terrifying night-time predators.", link: "https://modrinth.com/mod/more-mobs" },
      { name: "WASD Utilities Suite", desc: "Moar Apples, Bosses, Hoes, Pearls, Pickaxes, Redstone, Shovels, and Machines.", link: "https://modrinth.com/user/WASD_Builds" }
    ]
  }
];

export default function Home() {
  // Server State
  const [status, setStatus] = useState<string>("loading...");
  const [ip, setIp] = useState<string | null>(null);
  const [minecraftOnline, setMinecraftOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UI State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<"stop" | "reboot" | null>(null);
  const [pin, setPin] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);

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
        setMinecraftOnline(data.minecraft_online || false);
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

  const executeAction = async (action: "start" | "stop" | "reboot", enteredPin?: string) => {
    setLoading(true);
    setShowModal(false);
    setPin("");
    
    try {
      const res = await fetch("/api/aws-instance", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, pin: enteredPin })
      });
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
      setErrorMsg(err.message || `Failed to ${action} the server.`);
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
  const isFullyReady = isRunning && minecraftOnline;

  const getAWSStatusColor = () => {
    if (isRunning) return "running";
    if (isPending) return "pending";
    if (status === "error") return "error";
    return "";
  };

  const getMCStatusColor = () => {
    if (isFullyReady) return "running";
    if (isRunning && !minecraftOnline) return "pending";
    return "error";
  };

  return (
    <div className={styles.page}>
      {/* Decorative Backgrounds */}
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>

      <main className={`${styles.container} ${isFullyReady ? styles.online : ''}`}>
        <h1 className={styles.title}>Minecraft Fabric</h1>
        <p className={styles.subtitle}>Server Controller Panel</p>

        <div className={styles.statusCard}>
          {/* AWS VM Status Row */}
          <div className={styles.statusRow}>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>AWS Virtual Machine</span>
              <div className={styles.statusValue}>
                <span className={`${styles.indicator} ${styles[getAWSStatusColor()] || ''}`}></span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            {isRunning && ip && (
              <div className={styles.ipBox} onClick={copyIp} title="Click to copy">
                {copied ? "Copied!" : ip}
              </div>
            )}
          </div>

          {/* Minecraft Status Row */}
          <div className={styles.statusRow}>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Minecraft Game Server</span>
              <div className={styles.statusValue}>
                <span className={`${styles.indicator} ${styles[getMCStatusColor()] || ''}`}></span>
                {isFullyReady ? "Online" : isRunning ? "Booting..." : "Offline"}
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.helperText} ${status === 'error' ? styles.helperTextError : ''}`}>
          {status === "loading..." && "Connecting to AWS..."}
          {status === "error" && `Error: ${errorMsg || "An unknown error occurred."}`}
          {status === "stopped" && "The VM is offline. Click Start Server to boot up!"}
          {status === "pending" && "AWS machine is booting up. Please wait..."}
          {isRunning && !minecraftOnline && "AWS is running. Minecraft is launching (takes ~2 mins)."}
          {isFullyReady && "Minecraft is ONLINE and ready to join! Copy the IP above."}
          {status === "stopping" && "The server is shutting down. Please wait."}
        </div>

        {/* Action Controls */}
        <div className={styles.buttonGroup}>
          {!isRunning && !isPending && (
            <button 
              className={styles.button}
              onClick={() => executeAction("start")}
              disabled={loading || status === "error"}
            >
              {loading ? "Please wait..." : "Start Server"}
            </button>
          )}

          {isRunning && (
            <>
              <button 
                className={`${styles.button} ${styles.buttonStop}`}
                onClick={() => { setPendingAction("stop"); setShowModal(true); }}
                disabled={loading}
              >
                Stop AWS
              </button>
              <button 
                className={`${styles.button} ${styles.buttonReboot}`}
                onClick={() => { setPendingAction("reboot"); setShowModal(true); }}
                disabled={loading}
              >
                Reboot AWS (Restarts MC)
              </button>
            </>
          )}

          {isPending && (
            <button className={styles.button} disabled>
              Processing...
            </button>
          )}
        </div>
      </main>

      {/* Admin PIN Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Admin Authorization</h2>
            <p className={styles.modalDesc}>
              {pendingAction === "stop" 
                ? "Stopping the server will disconnect all players. Enter PIN to confirm."
                : "Rebooting will restart the AWS instance and Minecraft. Enter PIN to confirm."}
            </p>
            <input 
              type="password" 
              className={styles.pinInput}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoFocus
            />
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancel}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.modalConfirm}
                onClick={() => executeAction(pendingAction as "stop" | "reboot", pin)}
                disabled={!pin || loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sophisticated Tabular Mods Repository */}
      <section className={styles.featuresWrapper}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Server Features & Modifications</h2>
          <p className={styles.featuresSubtitle}>Explore the {MOD_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0)} custom mods and datapacks installed on our server.</p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabMenu}>
          {MOD_CATEGORIES.map((cat, index) => (
            <button 
              key={cat.id}
              className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Active Tab Content - CSS Grid of Cards */}
        <div className={styles.tabContentContainer}>
          <div className={styles.tabContentHeader}>
            <h3>{MOD_CATEGORIES[activeTab].title}</h3>
            <p>{MOD_CATEGORIES[activeTab].desc}</p>
          </div>
          <div className={styles.cardGrid}>
            {MOD_CATEGORIES[activeTab].items.map((mod, i) => (
              <div key={i} className={styles.modCard}>
                <div className={styles.modCardHeader}>
                  <h4 className={styles.modName}>{mod.name}</h4>
                  <a href={mod.link} target="_blank" rel="noopener noreferrer" className={styles.modLink}>
                    Wiki ↗
                  </a>
                </div>
                <p className={styles.modDesc}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}

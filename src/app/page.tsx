"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

// ─── MOD DATA ────────────────────────────────────────────────────────────────
const MOD_CATEGORIES = [
  {
    id: "world-gen",
    title: "🌍 World Generation",
    desc: "Massive overhauls to the shape and scope of every dimension.",
    items: [
      { name: "Terralith", desc: "Rewrites Overworld generation with nearly 100 new biomes, massive cave systems, and breathtaking terrain features — all without adding custom blocks.", link: "https://modrinth.com/mod/terralith" },
      { name: "Incendium", desc: "Expands the Nether with 8 completely new biomes, custom mobs with unique drops, and massive hazardous structures filled with powerful loot.", link: "https://modrinth.com/mod/incendium" },
      { name: "Amplified Nether", desc: "Increases the Nether ceiling to 256 blocks, creating cavernous 3D biomes with towering lava falls and massive open chambers.", link: "https://modrinth.com/mod/amplified-nether" },
      { name: "Nullscape", desc: "A dramatic expansion of the End dimension. Adds alien terrain, towering floating islands, and deeply varied height — making the End worth exploring.", link: "https://modrinth.com/mod/nullscape" },
    ],
  },
  {
    id: "structures",
    title: "🏰 Structures & Exploration",
    desc: "Hundreds of new locations, ruins, cities, and dungeons scattered across all dimensions.",
    items: [
      { name: "Explorify", desc: "Adds hundreds of vanilla-styled dungeons, crypts, abandoned camps, and ruins seamlessly integrated across the Overworld.", link: "https://modrinth.com/mod/explorify" },
      { name: "Moog's End Structures", desc: "Dozens of new ruin types, crashed ships, and alien outposts scattered across the End islands.", link: "https://modrinth.com/mod/moogs-end-structures" },
      { name: "Moog's Missing Villages", desc: "Populates previously empty biomes (mushroom islands, ice spikes, badlands) with distinct, hand-crafted village variants.", link: "https://modrinth.com/mod/moogs-missing-villages" },
      { name: "Moog's Nether Structures", desc: "Ancient debris fortresses, ruined piglin trading camps, and lava-flooded ruins rise from the Nether floor.", link: "https://modrinth.com/mod/moogs-nether-structures" },
      { name: "Moog's Soaring Structures", desc: "Spectacular floating sky-islands and aerial fortresses offering platforming challenges and high-tier loot.", link: "https://modrinth.com/mod/moogs-soaring-structures" },
      { name: "Moog's Voyager Structures", desc: "Overworld traversal camps, roadside shrines, and hidden lore locations that reward thorough exploration.", link: "https://modrinth.com/mod/moogs-voyager-structures" },
      { name: "Structory Towers", desc: "Beautifully designed, lore-rich watchtowers dotting the landscape in every biome, each with unique interiors and loot.", link: "https://modrinth.com/mod/structory-towers" },
      { name: "Dungeons+", desc: "Additional challenging dungeons spanning all biomes, from frozen tundra crypts to jungle temples.", link: "https://modrinth.com/mod/dungeons-plus" },
      { name: "Dungeons & Taverns", desc: "Overhauls strongholds into elaborate labyrinths. Adds roadside taverns with custom trades and quests.", link: "https://modrinth.com/mod/dungeons-and-taverns" },
      { name: "Repurposed Structures", desc: "Takes every vanilla structure (temples, mineshafts, strongholds) and adds biome-specific variants — e.g., nether mineshafts, ocean villages, icy outposts.", link: "https://modrinth.com/mod/repurposed-structures" },
      { name: "Katters Structures", desc: "Ambient real-world-style builds: stone bridges, broken windmills, abandoned homes, and overgrown ruins.", link: "https://modrinth.com/mod/katters-structures" },
      { name: "Adorabuild Structures", desc: "Small, cozy generated cottages and farmhouses scattered throughout the Overworld to make it feel lived-in.", link: "https://modrinth.com/mod/adorabuild-structures" },
      { name: "Towns and Towers", desc: "Replaces vanilla villages and outposts with highly detailed sprawling settlements, unique to each biome.", link: "https://modrinth.com/mod/towns-and-towers" },
      { name: "Vanilla Structure Update", desc: "Completely redesigns all vanilla structures — desert temples, jungle temples, witch huts — with elaborate interiors and tougher traps.", link: "https://modrinth.com/mod/vanilla-structure-update" },
      { name: "Trek", desc: "Adds mounts, exploration tools, and new travel mechanics to make traversing massive world distances rewarding.", link: "https://modrinth.com/mod/trek" },
    ],
  },
  {
    id: "weapons",
    title: "⚔️ Weapons & Arsenal",
    desc: "Devastating new tools of war — blades, hammers, bows, explosives and more.",
    items: [
      { name: "Gamingbarn's Guns", desc: "Introduces craftable ballistic firearms — pistols, rifles, and heavy guns with realistic projectile physics and custom reload animations.", link: "https://modrinth.com/datapack/gamingbarns-guns" },
      { name: "WASD Crazy Swords", desc: "Wield outlandish buster swords, katanas, and massive two-handed blades each with unique combat properties.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Diamond Swords", desc: "Expands diamond-tier weaponry with specialized blade types optimised for different combat scenarios.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Hammers", desc: "Slow but devastating hammers with sweeping AOE knockback — perfect for crowd control.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Axes", desc: "Expanded battleaxe lineup spanning all tiers, from wooden choppers to netherite war-axes.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Bows", desc: "Adds explosive bows, sniper bows with extended range, scatter-shot arrows and artifact bows with magical effects.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Crossbows", desc: "Rapid-fire crossbows, siege crossbows, and multi-bolt variants for ranged specialists.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Spears", desc: "Long-reach poke weapons that can be thrown and retrieved — excellent for keeping enemies at range.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Swords", desc: "Dozens of new sword variants spanning every material tier, each with unique attack patterns and speeds.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar TNT", desc: "Nuke-tier explosives, shaped-charge bombs, directional blasters, and utility grenades.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Pickaxes", desc: "Advanced mining tools including auto-smelting pickaxes, excavation drills, and silk-touch variants.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Shovels", desc: "Expanded shovel lineup for digging, including tunnel bores and sand collectors.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Hoes", desc: "Advanced farming tools that till large areas instantly and interact with custom crop mechanics.", link: "https://modrinth.com/user/WASD_Builds" },
    ],
  },
  {
    id: "magic",
    title: "✨ Magic & Gear",
    desc: "Artifacts, magical spells, enchantments, rings and specialized armor.",
    items: [
      { name: "WASD Wands", desc: "Craftable magic staves that shoot fireballs, summon lightning strikes, heal nearby allies, or create frost barriers.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Rings", desc: "Equip magical rings to gain passive combat buffs — speed rings, jump-boost rings, resistance rings, and more.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Totems", desc: "Totems of Undying with powerful secondary effects on activation — some grant temporary invincibility, others summon guardian entities.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Boots", desc: "Specialized boots granting permanent speed buffs, feather falling, or water walking depending on their tier.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Helmets", desc: "Custom helms that grant night vision, underwater breathing, or damage reduction to specific damage types.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Pearls", desc: "Expanded Ender Pearl variants — short-blink pearls, homing pearls, and phase pearls for advanced mobility.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Bosses", desc: "New boss encounters hidden across the world, each with unique mechanics and exclusive loot drops.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "Trim Effects", desc: "Applying Armor Trims now grants passive buffs — Redstone gives speed, Amethyst gives night vision, Emerald gives hero-of-the-village.", link: "https://modrinth.com/datapack/trim-effects" },
      { name: "Tool Trims", desc: "Extends the armor trim system to tools and weapons, allowing full aesthetic customization of your entire gear set.", link: "https://modrinth.com/mod/tool-trims" },
      { name: "Enchantments Encore", desc: "Rebalances the entire enchanting table system and adds dozens of new powerful enchantments across all equipment types.", link: "https://modrinth.com/mod/enchantments-encore" },
      { name: "Backpacks", desc: "Craftable and upgradable backpacks that provide massive portable storage without cluttering your main inventory.", link: "https://modrinth.com/datapack/backpacks" },
      { name: "WASD Machines", desc: "Adds complex craftable machines for automation — auto-sorters, ore processors, and item pipelines.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Apples", desc: "Expanded golden apple variants — notch apples that grant extended regeneration, resistance apples, and rare luck apples.", link: "https://modrinth.com/user/WASD_Builds" },
      { name: "WASD Moar Redstone", desc: "Advanced redstone components including wireless switches, signal amplifiers and timing modules.", link: "https://modrinth.com/user/WASD_Builds" },
    ],
  },
  {
    id: "qol",
    title: "🛠️ Quality of Life",
    desc: "Tweaks and mechanics that make survival smoother and more rewarding.",
    items: [
      { name: "FallingTree", desc: "Break the bottom block of any tree and the entire thing falls at once, saving massive amounts of chopping time.", link: "https://modrinth.com/mod/fallingtree" },
      { name: "Veinminer", desc: "Hold the configured key while mining an ore and it mines every connected block of the same type in one action.", link: "https://modrinth.com/mod/veinminer" },
      { name: "Mine Treasure", desc: "Completely reworks buried treasure to contain far more valuable and varied loot, with custom maps that actually make treasure hunting fun.", link: "https://modrinth.com/mod/mine-treasure" },
      { name: "Mineral Chance", desc: "Every stone and deepslate block you mine has a small percentage chance to yield a bonus rare mineral — makes routine mining rewarding.", link: "https://modrinth.com/mod/mineral-chance" },
      { name: "Edibles", desc: "Enables eating raw ingredients — blaze powder for fire resistance, sugar for speed, ghast tears for instant health.", link: "https://modrinth.com/mod/edibles" },
      { name: "Let Your Friend Eating", desc: "Feed food items directly to other players or tamed pets by right-clicking them, enabling cooperative survival mechanics.", link: "https://modrinth.com/mod/letyourfriendeating" },
      { name: "Followers Teleport Too", desc: "All tamed pets and animals follow you through Nether and End portals safely without taking portal damage.", link: "https://modrinth.com/mod/followers-teleport-too" },
      { name: "DoubleJump", desc: "Grants the ability to jump again mid-air, providing massively improved mobility for parkour and traversal.", link: "https://modrinth.com/datapack/double-jump" },
      { name: "Leaf Me Alone", desc: "Leaves from fallen trees decay instantly and correctly, preventing the familiar floating leaf-island problem.", link: "https://modrinth.com/mod/leaf-me-alone" },
      { name: "NetherPortalFix", desc: "Fixes the broken multiplayer portal linking algorithm — every portal now correctly connects to its paired destination.", link: "https://modrinth.com/mod/netherportalfix" },
      { name: "Vanilla Refresh", desc: "Subtle animation polish, improved item display, and UI quality-of-life tweaks that make the base game feel modern.", link: "https://modrinth.com/mod/vanilla-refresh" },
      { name: "Village Hero Plus", desc: "Greatly expands the rewards and trade discounts for defending a village — makes heroism actually worthwhile.", link: "https://modrinth.com/mod/village-hero-plus" },
      { name: "More Mobs", desc: "Adds ambient wildlife (deer, fireflies, crabs) and dangerous night predators (stalkers, horrors) for a more alive world.", link: "https://modrinth.com/mod/more-mobs" },
      { name: "ACE — Armor Combat Enchants", desc: "Adds combat-focused armor enchantments like thorns upgrades, dash charges, and parry effects.", link: "https://modrinth.com/mod/ace" },
    ],
  },
];

// ─── TEXT SHELL COMMANDS ──────────────────────────────────────────────────────
const SHELL_HELP = `Available commands:
  stop mc       — Gracefully stops the Minecraft server
  stop aws      — Powers off the AWS instance (disconnects all players)
  status        — Shows current server status
  clear         — Clears the terminal
  help          — Shows this message`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Home() {
  // Server state
  const [status, setStatus] = useState<string>("loading...");
  const [ip, setIp] = useState<string | null>(null);
  const [minecraftOnline, setMinecraftOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal state (for PIN)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // UI state
  const [activeTab, setActiveTab] = useState<number>(0);

  // Shell state
  const [shellInput, setShellInput] = useState<string>("");
  const [shellLines, setShellLines] = useState<{ text: string; type: "input" | "output" | "error" | "success" }[]>([
    { text: 'Type "help" to see available commands.', type: "output" },
  ]);
  const shellEndRef = useRef<HTMLDivElement>(null);

  // ── Fetch status ─────────────────────────────────────────────────────────────
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
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to connect to the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    shellEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shellLines]);

  // ── API caller ───────────────────────────────────────────────────────────────
  const callAction = async (action: string, enteredPin?: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch("/api/aws-instance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, pin: enteredPin }),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Action failed.");
    return data;
  };

  // ── Generate Connection Link (start AWS) ──────────────────────────────────────
  const handleStartAWS = async () => {
    setActionLoading(true);
    try {
      await callAction("start-aws");
      setStatus("pending");
      setErrorMsg(null);
      setTimeout(fetchStatus, 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Start Minecraft ──────────────────────────────────────────────────────────
  const handleStartMC = async (enteredPin: string) => {
    setShowModal(false);
    setPin("");
    setActionLoading(true);
    try {
      const result = await callAction("start-mc", enteredPin);
      if (!result.success) {
        setErrorMsg(result.message);
      } else {
        setErrorMsg(null);
        setTimeout(fetchStatus, 5000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Text Shell ───────────────────────────────────────────────────────────────
  const addShellLine = (text: string, type: "input" | "output" | "error" | "success") => {
    setShellLines((prev) => [...prev, { text, type }]);
  };

  const handleShellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = shellInput.trim().toLowerCase();
    if (!cmd) return;

    addShellLine(`> ${shellInput.trim()}`, "input");
    setShellInput("");

    if (cmd === "clear") {
      setShellLines([]);
      return;
    }
    if (cmd === "help") {
      addShellLine(SHELL_HELP, "output");
      return;
    }
    if (cmd === "status") {
      addShellLine(
        `AWS: ${status} | MC: ${minecraftOnline ? "Online" : "Offline"} | IP: ${ip || "N/A"}`,
        "output"
      );
      return;
    }
    if (cmd === "stop mc" || cmd === "stop aws") {
      setPendingAction(cmd === "stop mc" ? "stop-mc" : "stop-aws");
      setShowModal(true);
      return;
    }

    addShellLine(`Unknown command: "${cmd}". Type "help" for available commands.`, "error");
  };

  const handleShellConfirm = async (enteredPin: string) => {
    setShowModal(false);
    setPin("");
    addShellLine(`Executing: ${pendingAction}...`, "output");
    try {
      await callAction(pendingAction, enteredPin);
      addShellLine(
        pendingAction === "stop-mc"
          ? "Minecraft server is stopping gracefully."
          : "AWS instance is powering off.",
        "success"
      );
      setTimeout(fetchStatus, 5000);
    } catch (err: any) {
      addShellLine(`Error: ${err.message}`, "error");
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
  const totalMods = MOD_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      {/* ── Hero / Controller ────────────────────────────────────────────── */}
      <main className={`${styles.container} ${isFullyReady ? styles.online : ""}`}>
        <h1 className={styles.title}>Minecraft Fabric</h1>
        <p className={styles.subtitle}>Server Controller Panel</p>

        {/* Status Card */}
        <div className={styles.statusCard}>
          <div className={styles.statusRow}>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>AWS Virtual Machine</span>
              <div className={styles.statusValue}>
                <span className={`${styles.indicator} ${isRunning ? styles.running : isPending ? styles.pending : status === "error" ? styles.error : ""}`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            {isRunning && ip && (
              <div className={styles.ipBox} onClick={copyIp} title="Click to copy IP">
                {copied ? "✓ Copied!" : `⛏ ${ip}`}
              </div>
            )}
          </div>

          <div className={styles.statusRow}>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Minecraft Game Server</span>
              <div className={styles.statusValue}>
                <span className={`${styles.indicator} ${isFullyReady ? styles.running : isRunning ? styles.pending : styles.error}`} />
                {isFullyReady ? "Online & Ready" : isRunning ? "Booting..." : "Offline"}
              </div>
            </div>
          </div>
        </div>

        {/* Helper text */}
        <div className={`${styles.helperText} ${status === "error" ? styles.helperTextError : ""}`}>
          {status === "loading..." && "Connecting to AWS..."}
          {status === "error" && `Error: ${errorMsg || "An unknown error occurred."}`}
          {status === "stopped" && "The VM is offline. Press Generate Connection Link to boot it up."}
          {status === "pending" && "AWS machine is booting up. This takes about 1 minute..."}
          {isRunning && !minecraftOnline && !errorMsg && "AWS is running. The Minecraft server is starting (~2 mins). You can also start it manually below."}
          {isRunning && errorMsg && `Warning: ${errorMsg}`}
          {isFullyReady && "Minecraft is ONLINE and ready to join! Click the IP above to copy it."}
          {status === "stopping" && "The server is shutting down. Please wait."}
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          {/* Generate Connection Link — only shown when AWS is off */}
          {!isRunning && !isPending && (
            <div className={styles.buttonWrap}>
              <button
                className={styles.button}
                onClick={handleStartAWS}
                disabled={actionLoading || status === "error" || status === "loading..."}
              >
                {actionLoading ? "Starting..." : "⚡ Generate Connection Link"}
              </button>
              <p className={styles.buttonNote}>
                Only press this if no IP address is visible above.
              </p>
            </div>
          )}

          {/* If AWS is pending, show disabled placeholder */}
          {isPending && (
            <button className={styles.button} disabled>
              AWS is Booting...
            </button>
          )}

          {/* If AWS is running, show Start MC button */}
          {isRunning && !isFullyReady && (
            <div className={styles.buttonWrap}>
              <button
                className={`${styles.button} ${styles.buttonMC}`}
                onClick={() => { setPendingAction("start-mc"); setShowModal(true); }}
                disabled={actionLoading}
              >
                {actionLoading ? "Please wait..." : "🎮 Start Minecraft Server"}
              </button>
              <p className={styles.buttonNote}>
                Only press if Minecraft shows Offline above. Requires admin PIN.
              </p>
            </div>
          )}

          {isFullyReady && (
            <button className={`${styles.button} ${styles.buttonOnline}`} disabled>
              ✅ Server is Online
            </button>
          )}
        </div>

        {/* Text Shell */}
        <div className={styles.shell}>
          <div className={styles.shellTitleBar}>
            <span className={styles.shellDot} style={{ background: "#ef4444" }} />
            <span className={styles.shellDot} style={{ background: "#f59e0b" }} />
            <span className={styles.shellDot} style={{ background: "#10b981" }} />
            <span className={styles.shellTitle}>admin@mc-controller</span>
          </div>
          <div className={styles.shellOutput}>
            {shellLines.map((line, i) => (
              <div key={i} className={`${styles.shellLine} ${styles[`shell_${line.type}`]}`}>
                {line.text}
              </div>
            ))}
            <div ref={shellEndRef} />
          </div>
          <form onSubmit={handleShellSubmit} className={styles.shellForm}>
            <span className={styles.shellPrompt}>$</span>
            <input
              className={styles.shellInput}
              value={shellInput}
              onChange={(e) => setShellInput(e.target.value)}
              placeholder='Type "help" for commands...'
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </main>

      {/* ── Admin PIN Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Admin Authorization</h2>
            <p className={styles.modalDesc}>
              {pendingAction === "stop-aws" && "This will power off the AWS instance and disconnect all players."}
              {pendingAction === "stop-mc" && "This will gracefully stop the Minecraft server without touching the AWS VM."}
              {pendingAction === "start-mc" && "This will start the Minecraft server on the running AWS VM."}
            </p>
            <input
              type="password"
              className={styles.pinInput}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && pin) { pendingAction === "start-mc" ? handleStartMC(pin) : handleShellConfirm(pin); }}}
              placeholder="Enter PIN"
              autoFocus
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => { setShowModal(false); setPin(""); }}>Cancel</button>
              <button
                className={styles.modalConfirm}
                onClick={() => { pendingAction === "start-mc" ? handleStartMC(pin) : handleShellConfirm(pin); }}
                disabled={!pin}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mods Repository ──────────────────────────────────────────────── */}
      <section className={styles.featuresWrapper}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Server Features & Modifications</h2>
          <p className={styles.featuresSubtitle}>
            {totalMods} custom mods and datapacks — explore them by category below.
          </p>
        </div>

        <div className={styles.tabMenu}>
          {MOD_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              className={`${styles.tabButton} ${activeTab === i ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {cat.title}
            </button>
          ))}
        </div>

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

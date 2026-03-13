/**
 * ISRO Rocket Launch Timeline — Express Backend
 * Run: npm install express cors && node server.js
 * API runs on http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// MISSION DATABASE
// ============================================================
const MISSIONS = {
  chandrayaan3: {
    id: "chandrayaan3",
    name: "Chandrayaan-3",
    vehicle: "LVM3-M4",
    date: "14 Jul 2023",
    site: "SDSC SHAR",
    orbit: "Lunar Surface",
    status: "SUCCESS",
    description: "India's third lunar exploration mission. Historic soft landing near lunar south pole on Aug 23, 2023.",
    events: [
      { t: "T–6h 00m", name: "Fueling Complete", desc: "S200 boosters loaded. C25 cryogenic loading in progress.", phase: "pre" },
      { t: "T–30m", name: "Final Systems Check", desc: "Onboard computer initialized. INS alignment locked.", phase: "pre" },
      { t: "T+0s", name: "IGNITION — LIFT-OFF!", desc: "S200 solid strap-on boosters ignite. 5,150 kN combined thrust.", phase: "launch", highlight: true },
      { t: "T+1m 54s", name: "S200 Jettison", desc: "Strap-on boosters separate at ~45 km altitude.", phase: "ascent" },
      { t: "T+3m 37s", name: "Max-Q Passed", desc: "Maximum dynamic pressure zone survived at ~30 kPa.", phase: "ascent" },
      { t: "T+5m 07s", name: "Payload Fairing Jettison", desc: "Heat shield jettisoned at ~115 km altitude.", phase: "ascent" },
      { t: "T+5m 14s", name: "L110 Core MECO", desc: "Core stage Vikas engines shut down.", phase: "ascent" },
      { t: "T+5m 21s", name: "Stage Separation", desc: "L110 separates; C25 cryogenic stage ignites.", phase: "staging", highlight: true },
      { t: "T+16m 14s", name: "Spacecraft Separation", desc: "Chandrayaan-3 enters 170×36,500 km parking orbit.", phase: "orbit" },
    ],
    telemetry: {
      time:      [0, 30, 60, 120, 200, 300, 420, 520, 700, 980],
      altitude:  [0, 2,  8,  25,  50,  90,  130, 180, 250, 36500],
      velocity:  [0, 0.3,0.8,1.8, 3.2, 5.1, 7.2, 8.5, 10.2,10.9],
      maxQ:      [0, 2,  8,  22,  44,  30,  18,  10,  4,   1],
      propellant: [
        { name: "S200 Boosters (HTPB Solid)", pct: 0,  color: "#ff6b1a" },
        { name: "L110 Core (UDMH/N2O4)",      pct: 5,  color: "#ffaa44" },
        { name: "C25 Cryo (LOX/LH2)",          pct: 85, color: "#00d4ff" },
      ]
    },
    milestones: [
      { t: "T+0s",     title: "Lift-Off",       detail: "5,150 kN from S200 boosters",       status: "complete" },
      { t: "T+110s",   title: "S200 Jettison",  detail: "Strap-ons drop at 45 km",           status: "complete" },
      { t: "T+307s",   title: "Fairing Sep",    detail: "Heat shield drops at 115 km",        status: "complete" },
      { t: "T+321s",   title: "C25 Ignition",   detail: "Cryogenic engine starts",            status: "complete" },
      { t: "T+974s",   title: "Orbit Confirmed",detail: "170×36,500 km parking orbit",        status: "complete" },
      { t: "Aug 23",   title: "Lunar Landing",  detail: "Vikram touches down — south pole",   status: "complete" },
    ]
  },

  mangalyaan: {
    id: "mangalyaan",
    name: "Mangalyaan (MOM)",
    vehicle: "PSLV-C25",
    date: "05 Nov 2013",
    site: "SDSC SHAR FLP",
    orbit: "Mars Orbit",
    status: "SUCCESS",
    description: "Mars Orbiter Mission — India's first interplanetary spacecraft.",
    events: [
      { t: "T–15m",   name: "Auto Sequence Start", desc: "Onboard sequencer takes command.", phase: "pre" },
      { t: "T+0s",    name: "PSLV LIFT-OFF",        desc: "Stage-1 + 4 ground-lit strap-ons ignite.", phase: "launch", highlight: true },
      { t: "T+25s",   name: "PSOM Sep (4)",          desc: "Ground-lit strap-ons separate.", phase: "ascent" },
      { t: "T+91s",   name: "PSOM Sep (2)",          desc: "Air-lit strap-ons separate.", phase: "ascent" },
      { t: "T+113s",  name: "Fairing Jettison",      desc: "Heat shield drops at 115 km.", phase: "ascent" },
      { t: "T+161s",  name: "Stage 1→2",             desc: "S139 drops; Vikas liquid engine ignites.", phase: "staging" },
      { t: "T+355s",  name: "Stage 2→3",             desc: "Liquid stage MECO; solid stage-3 ignites.", phase: "staging" },
      { t: "T+444s",  name: "Stage 3→4",             desc: "PS4 twin restartable engines start.", phase: "staging", highlight: true },
      { t: "T+43m",   name: "MOM Separation",        desc: "247×23,500 km parking orbit confirmed.", phase: "orbit" },
    ],
    telemetry: {
      time:      [0, 25, 60,  95,  130, 185, 260, 355, 444, 2580],
      altitude:  [0, 1,  5,   18,  45,  90,  140, 180, 210, 23500],
      velocity:  [0, 0.2,0.6, 1.5, 3.0, 4.6, 6.1, 7.5, 9.1, 9.8],
      maxQ:      [0, 1,  5,   18,  36,  25,  14,  7,   2,   0],
      propellant: [
        { name: "S139 + Strap-ons (Solid)",  pct: 0,  color: "#ff3c3c" },
        { name: "Stage-2 Vikas (Liquid)",    pct: 12, color: "#ffaa44" },
        { name: "PS4 Upper Stage (Biprop)",  pct: 92, color: "#00d4ff" },
      ]
    },
    milestones: [
      { t: "T+0s",     title: "PSLV Lift-Off",    detail: "Stage-1 + strap-ons ignite",          status: "complete" },
      { t: "T+113s",   title: "Fairing Sep",      detail: "Heat shield jettisoned at 115 km",     status: "complete" },
      { t: "T+444s",   title: "PS4 Ignition",     detail: "Restartable upper stage starts",        status: "complete" },
      { t: "T+43m",    title: "MOM in Orbit",     detail: "247×23,500 km — Earth parking orbit",  status: "complete" },
      { t: "Sep 24 '14", title: "Mars Arrival",   detail: "MOI burn success — India at Mars!",    status: "complete" },
    ]
  },

  gaganyaan: {
    id: "gaganyaan",
    name: "Gaganyaan — Crewed",
    vehicle: "LVM3 (Human Rated)",
    date: "Q4 2026 (Planned)",
    site: "SDSC SHAR SLP",
    orbit: "400 km LEO",
    status: "IN PREPARATION",
    description: "India's first human spaceflight. Vyomnauts to orbit for 3 days at 400 km LEO.",
    events: [
      { t: "T–3h",    name: "Crew Access Arm Extended", desc: "Vyomnauts board Orbital Module in pressure suits.", phase: "pre" },
      { t: "T–20m",   name: "Cabin Pressurized",        desc: "Crew Module sealed. Life support activated.", phase: "pre" },
      { t: "T+0s",    name: "CREWED LAUNCH!",            desc: "First Indian Vyomnauts begin journey to orbit.", phase: "launch", highlight: true },
      { t: "T+26s",   name: "Max-Q",                     desc: "Peak aerodynamic loads — crew feels 1.5g lateral.", phase: "ascent" },
      { t: "T+115s",  name: "S200 Jettison / CES Safe",  desc: "Solid boosters drop. Crew Escape System inhibited.", phase: "ascent" },
      { t: "T+205s",  name: "Fairing Jettison",          desc: "Crew Module windows now view open space.", phase: "ascent", highlight: true },
      { t: "T+315s",  name: "L110 Sep / C25 Start",      desc: "Cryogenic stage ignites. Brief microgravity.", phase: "staging" },
      { t: "T+970s",  name: "Orbit Insertion",            desc: "400 km circular orbit. Vyomnauts officially in space.", phase: "orbit" },
      { t: "T+3 days",name: "De-orbit & Splashdown",     desc: "Retrofire manoeuvre. Bay of Bengal recovery.", phase: "orbit", highlight: true },
    ],
    telemetry: {
      time:      [0, 26, 70,  120, 195, 310, 430, 515, 700, 970],
      altitude:  [0, 3,  10,  28,  55,  95,  145, 200, 300, 400],
      velocity:  [0, 0.35,0.9,1.9, 3.3, 5.2, 7.1, 7.8, 7.9, 7.8],
      maxQ:      [0, 3,  12,  28,  48,  32,  19,  8,   2,   0],
      propellant: [
        { name: "S200 Boosters (HTPB Solid)", pct: 0,  color: "#ff6b1a" },
        { name: "L110 Core (UDMH/N2O4)",      pct: 8,  color: "#ffaa44" },
        { name: "C25 Cryo (LOX/LH2)",          pct: 78, color: "#00d4ff" },
      ]
    },
    milestones: [
      { t: "T+0s",    title: "Crewed Lift-Off",  detail: "First Indian Vyomnauts launch",       status: "critical" },
      { t: "T+26s",   title: "Max-Q",            detail: "Peak aerodynamic pressure",           status: "critical" },
      { t: "T+115s",  title: "S200 Jettison",   detail: "CES inhibited — crew safe",            status: "nominal" },
      { t: "T+205s",  title: "Fairing Sep",      detail: "Crew views Earth curvature",          status: "nominal" },
      { t: "T+970s",  title: "Orbit Insertion",  detail: "400 km LEO confirmed",               status: "nominal" },
      { t: "+3 days", title: "Splashdown",       detail: "Bay of Bengal crew recovery",         status: "nominal" },
    ]
  }
};

// ============================================================
// API ROUTES
// ============================================================

// GET all missions (summary list)
app.get('/api/missions', (req, res) => {
  const summaries = Object.values(MISSIONS).map(m => ({
    id: m.id, name: m.name, vehicle: m.vehicle,
    date: m.date, status: m.status, orbit: m.orbit
  }));
  res.json({ success: true, count: summaries.length, missions: summaries });
});

// GET specific mission by ID
app.get('/api/missions/:id', (req, res) => {
  const mission = MISSIONS[req.params.id];
  if (!mission) {
    return res.status(404).json({ success: false, error: `Mission '${req.params.id}' not found` });
  }
  res.json({ success: true, mission });
});

// GET telemetry only
app.get('/api/missions/:id/telemetry', (req, res) => {
  const mission = MISSIONS[req.params.id];
  if (!mission) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, missionId: req.params.id, telemetry: mission.telemetry });
});

// GET timeline events only
app.get('/api/missions/:id/events', (req, res) => {
  const mission = MISSIONS[req.params.id];
  if (!mission) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, missionId: req.params.id, events: mission.events });
});

// GET milestones only
app.get('/api/missions/:id/milestones', (req, res) => {
  const mission = MISSIONS[req.params.id];
  if (!mission) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, missionId: req.params.id, milestones: mission.milestones });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'NOMINAL', timestamp: new Date().toISOString(), missions: Object.keys(MISSIONS).length });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 ISRO Mission Control API running on http://localhost:${PORT}`);
  console.log(`\n  GET /api/missions              — All missions`);
  console.log(`  GET /api/missions/:id          — Mission details`);
  console.log(`  GET /api/missions/:id/telemetry — Flight data`);
  console.log(`  GET /api/missions/:id/events    — Timeline events`);
  console.log(`  GET /api/missions/:id/milestones— Key milestones`);
  console.log(`  GET /api/health                — System status\n`);
});
// Initialize Lucide Icons
lucide.createIcons();

// ============================================================================
// 1. THREE.JS 3D IMMERSIVE NEURAL CORE BACKGROUND
// ============================================================================
let isThinking = false;

function init3DScene() {
  const canvas = document.getElementById("bg-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 26;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Central Wireframe AI Core
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const outerGeo = new THREE.IcosahedronGeometry(6.5, 2);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.14,
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  coreGroup.add(outerMesh);

  const innerGeo = new THREE.OctahedronGeometry(3.8, 1);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerMesh);

  // Floating 3D Particle Field
  const particleCount = 900;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 90;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.16,
    transparent: true,
    opacity: 0.65,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse Parallax Tracking
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const speedMultiplier = isThinking ? 5.5 : 1;

    outerMesh.rotation.x += 0.002 * speedMultiplier;
    outerMesh.rotation.y += 0.003 * speedMultiplier;

    innerMesh.rotation.x -= 0.004 * speedMultiplier;
    innerMesh.rotation.y -= 0.003 * speedMultiplier;

    particleSystem.rotation.y += 0.0007 * speedMultiplier;

    // Smooth camera parallax
    camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 4 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    // Dynamic pulse color when thinking
    outerMat.color.setHex(isThinking ? 0x8b5cf6 : 0x00f2fe);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

init3DScene();

// ============================================================================
// 2. 3D PERSPECTIVE TILT EFFECT ON HUD PANELS
// ============================================================================
document.querySelectorAll(".tilt-element").forEach((el) => {
  const maxTilt = parseFloat(el.dataset.tiltMax || 4);

  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
});

// ============================================================================
// 3. FASTAPI BACKEND INTEGRATION (/api/health, /api/chat, /api/ingest)
// ============================================================================
const healthText = document.getElementById("health-text");
const statusDot = document.querySelector(".status-dot");
const orbIndicator = document.getElementById("orb-indicator");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const questionInput = document.getElementById("question-input");
const sendBtn = document.getElementById("send-btn");
const traceList = document.getElementById("trace-list");
const citationsList = document.getElementById("citations-list");
const rewrittenQueryBox = document.getElementById("rewritten-query-box");

// Check API Health
async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    if (res.ok) {
      const data = await res.json();
      statusDot.classList.add("online");
      healthText.textContent = "System Online";
      healthText.title = data.service;
    } else {
      throw new Error("Health check failed");
    }
  } catch {
    statusDot.classList.remove("online");
    healthText.textContent = "Backend Offline";
  }
}
checkHealth();

// Helper to append chat bubbles
function appendMessage(role, content, sourceUsed = "direct") {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${role === "user" ? "user-message" : "assistant-message"}`;

  const badgeLabels = {
    private_kb: "PRIVATE KB",
    web_search: "WEB SEARCH",
    direct: "DIRECT LLM",
    insufficient_evidence: "INSUFFICIENT EVIDENCE",
  };

  const badgeHTML =
    role === "assistant"
      ? `<span class="source-badge badge-${sourceUsed}">${badgeLabels[sourceUsed] || sourceUsed}</span>`
      : "";

  const renderedBody =
    role === "assistant" ? marked.parse(content) : `<p>${escapeHtml(content)}</p>`;

  msgDiv.innerHTML = `
    <div class="avatar-3d">
      <i data-lucide="${role === "user" ? "user" : "bot"}"></i>
    </div>
    <div class="message-body">
      <div class="message-meta">
        <span class="sender-name">${role === "user" ? "IT OPERATOR" : "NEXUS COPILOT"}</span>
        ${badgeHTML}
      </div>
      <div class="message-content">${renderedBody}</div>
    </div>
  `;

  chatMessages.appendChild(msgDiv);
  lucide.createIcons();
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgDiv;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[m]);
}

// Render Telemetry & Citations
function updateTelemetry(trace = [], citations = [], rewrittenQuery = "") {
  rewrittenQueryBox.textContent = rewrittenQuery || "N/A";

  // Render LangGraph Trace Steps
  traceList.innerHTML = "";
  if (!trace.length) {
    traceList.innerHTML = `<div class="trace-empty">No trace steps recorded.</div>`;
  } else {
    trace.forEach((step, idx) => {
      const stepEl = document.createElement("div");
      stepEl.className = "trace-step";
      stepEl.style.animationDelay = `${idx * 70}ms`;
      stepEl.innerHTML = `
        <span class="step-index">${idx + 1}</span>
        <span>${escapeHtml(step)}</span>
      `;
      traceList.appendChild(stepEl);
    });
  }

  // Render Citations
  citationsList.innerHTML = "";
  if (!citations.length) {
    citationsList.innerHTML = `<div class="trace-empty">No external or KB citations attached.</div>`;
  } else {
    citations.forEach((cit) => {
      const card = document.createElement("div");
      card.className = "citation-card";
      const linkHtml = cit.url
        ? `<a href="${cit.url}" target="_blank" rel="noopener" class="citation-link">OPEN ↗</a>`
        : `<span class="citation-link">PRIVATE KB</span>`;
      card.innerHTML = `
        <span class="citation-title" title="${escapeHtml(cit.title || "")}">${escapeHtml(cit.title || "Document")}</span>
        ${linkHtml}
      `;
      citationsList.appendChild(card);
    });
  }
}

// Handle Chat Submission -> POST /api/chat
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  if (question.length < 2 || isThinking) return;

  appendMessage("user", question);
  questionInput.value = "";
  questionInput.style.height = "auto";

  // Activate 3D Warp & Thinking state
  isThinking = true;
  orbIndicator.classList.add("thinking");
  sendBtn.disabled = true;

  const loadingBubble = appendMessage(
    "assistant",
    "Executing LangGraph workflow (`route_question` → `retrieve_kb` / `search_web`)...",
    "direct"
  );

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    loadingBubble.remove();

    if (!res.ok) {
      appendMessage(
        "assistant",
        `**Backend Error:** ${data.detail || "Unexpected server error"}`,
        "insufficient_evidence"
      );
      return;
    }

    appendMessage("assistant", data.answer, data.source_used);
    updateTelemetry(data.trace, data.citations, data.rewritten_query);
  } catch (err) {
    loadingBubble.remove();
    appendMessage(
      "assistant",
      `**Connection Error:** Could not reach \`/api/chat\`. (${err.message})`,
      "insufficient_evidence"
    );
  } finally {
    isThinking = false;
    orbIndicator.classList.remove("thinking");
    sendBtn.disabled = false;
  }
});

// Enter to send, Shift+Enter for new line
questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

// Sample Prompt Chips
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    questionInput.value = chip.dataset.prompt;
    chatForm.requestSubmit();
  });
});

// Clear Chat Button
document.getElementById("clear-chat").addEventListener("click", () => {
  chatMessages.innerHTML = "";
  appendMessage("assistant", "Session cleared. Ready for new IT support queries.", "direct");
});

// ============================================================================
// 4. DOCUMENT INGESTION PORTAL -> POST /api/ingest
// ============================================================================
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const selectedFileName = document.getElementById("selected-file-name");
const ingestForm = document.getElementById("ingest-form");
const ingestStatus = document.getElementById("ingest-status");
const ingestBtn = document.getElementById("ingest-btn");

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    selectedFileName.textContent = e.dataTransfer.files[0].name;
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    selectedFileName.textContent = fileInput.files[0].name;
  }
});

ingestForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const adminKey = document.getElementById("admin-key").value.trim();
  const file = fileInput.files[0];

  if (!file) {
    showIngestStatus("Please select a .pdf, .docx, .md, or .txt file first.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  ingestBtn.disabled = true;
  isThinking = true;
  showIngestStatus("Chunking & embedding into Pinecone...", "success");

  try {
    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      showIngestStatus(data.detail || "Ingestion failed", "error");
    } else {
      showIngestStatus(data.message, "success");
      fileInput.value = "";
      selectedFileName.textContent = "Drag & drop IT document or click";
    }
  } catch (err) {
    showIngestStatus(`Network error: ${err.message}`, "error");
  } finally {
    ingestBtn.disabled = false;
    isThinking = false;
  }
});

function showIngestStatus(message, type) {
  ingestStatus.textContent = message;
  ingestStatus.className = `ingest-status ${type}`;
}
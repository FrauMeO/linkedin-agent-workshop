const form = document.querySelector("#briefForm");
const contentPlanInput = document.querySelector("#contentPlanInput");
const topicInput = document.querySelector("#topicInput");
const audiencePreset = document.querySelector("#audiencePreset");
const audienceInput = document.querySelector("#audienceInput");
const povInput = document.querySelector("#povInput");
const actionInput = document.querySelector("#actionInput");
const lengthInput = document.querySelector("#lengthInput");
const orientationInput = document.querySelector("#orientationInput");

const researchButton = document.querySelector("#researchButton");
const writeButton = document.querySelector("#writeButton");
const imageButton = document.querySelector("#imageButton");
const fullRunButton = document.querySelector("#fullRunButton");
const allButtons = [researchButton, writeButton, imageButton, fullRunButton];

const runState = document.querySelector("#runState");
const statusItems = Array.from(document.querySelectorAll(".status-item"));
const metaPanel = document.querySelector("#metaPanel");
const errorPanel = document.querySelector("#errorPanel");
const tabs = Array.from(document.querySelectorAll(".tab"));
const fileLabel = document.querySelector("#fileLabel");
const fileLink = document.querySelector("#fileLink");
const fileViewer = document.querySelector("#fileViewer");
const previewText = document.querySelector("#previewText");
const previewStatus = document.querySelector("#previewStatus");
const imageFrame = document.querySelector("#imageFrame");
const postsList = document.querySelector("#postsList");
const progressPanel = document.querySelector("#progressPanel");
const progressFill = document.querySelector("#progressFill");
const progressLabel = document.querySelector("#progressLabel");
const activityLog = document.querySelector("#activityLog");

const STEP_PROGRESS = {
  brief: { active: 2, complete: 8 },
  research: { active: 10, complete: 55 },
  write: { active: 58, complete: 85 },
  image: { active: 88, complete: 100 },
};

let folderName = null;
let currentFiles = { research: "", post: "", "image-prompt": "" };
let activeTab = "research";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runFullPipeline();
});

researchButton.addEventListener("click", () => runStep("research"));
writeButton.addEventListener("click", () => runStep("write"));
imageButton.addEventListener("click", () => runStep("image"));

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeTab = tab.dataset.tab;
    renderActiveTab();
  });
});

contentPlanInput.addEventListener("change", () => {
  if (contentPlanInput.value) topicInput.value = contentPlanInput.value;
});

audiencePreset.addEventListener("change", () => {
  if (audiencePreset.value === "__custom__") {
    audienceInput.classList.remove("hidden");
    audienceInput.value = "";
    audienceInput.focus();
  } else {
    audienceInput.classList.add("hidden");
    audienceInput.value = audiencePreset.value;
  }
});

loadPostsList();
loadContentPlan();
connectWatch();

function currentBrief() {
  return {
    topic: topicInput.value.trim(),
    audience: audienceInput.value.trim(),
    pointOfView: povInput.value.trim(),
    desiredAction: actionInput.value.trim(),
    length: lengthInput.value,
    orientation: orientationInput.value,
  };
}

async function ensureFolder() {
  const brief = currentBrief();
  if (!brief.topic) throw new Error("Enter a topic first.");

  const response = await postJson("/api/brief", brief);
  folderName = response.folderName;
  return response;
}

async function runStep(step) {
  setError("");
  setBusy(true);

  try {
    if (!folderName) await ensureFolder();

    setStepState(step, "active");
    if (step === "research") {
      const result = await postJson("/api/research", { folderName });
      currentFiles.research = result.research;
      activeTab = "research";
    } else if (step === "write") {
      const result = await postJson("/api/write", { folderName });
      currentFiles.post = result.post;
      activeTab = "post";
    } else if (step === "image") {
      const result = await postJson("/api/image", { folderName, orientation: orientationInput.value });
      currentFiles["image-prompt"] = await fetchText(
        `/posts/${encodeURIComponent(folderName)}/image-prompt.md`
      );
      renderImage(result.imageUrl, null, result.orientation);
      activeTab = "image-prompt";
    }
    setStepState(step, "complete");
    renderActiveTab();
    renderPreviewText();
    setMeta(`<div><strong>Folder</strong><span>posts/${folderName}</span></div>`);
    loadPostsList();
  } catch (error) {
    setStepState(step, "error");
    setError(error.message);
  } finally {
    setBusy(false);
  }
}

function runFullPipeline() {
  setError("");
  setBusy(true);
  ["research", "write", "image"].forEach((step) => setStepState(step, "pending"));

  const brief = currentBrief();
  if (!brief.topic) {
    setError("Enter a topic first.");
    setBusy(false);
    return;
  }

  currentFiles = { research: "", post: "", "image-prompt": "" };
  startProgress();

  const params = new URLSearchParams(brief);
  const source = new EventSource(`/api/full-run-stream?${params.toString()}`);

  source.addEventListener("step", (event) => {
    const data = JSON.parse(event.data);
    logLine(data.message, "step");
    setProgress(data.step, data.status);
    if (data.folderName) folderName = data.folderName;

    if (data.step === "research") setStepState("research", data.status === "complete" ? "complete" : "active");
    if (data.step === "write") setStepState("write", data.status === "complete" ? "complete" : "active");
    if (data.step === "image") setStepState("image", data.status === "complete" ? "complete" : "active");

    if (data.step === "image" && data.status === "complete") {
      renderImage(data.imageUrl, null, data.orientation);
    }
  });

  source.addEventListener("delta", (event) => {
    const data = JSON.parse(event.data);
    if (data.step === "research") currentFiles.research += data.text;
    if (data.step === "write") currentFiles.post += data.text;
    appendStream(data.step, data.text);
    if (data.step === "research") activeTab = "research";
    if (data.step === "write") activeTab = "post";
    renderActiveTab();
    if (data.step === "write") renderPreviewText();
  });

  source.addEventListener("error", (event) => {
    let message = "Connection to the server was lost.";
    if (event.data) {
      try {
        message = JSON.parse(event.data).message || message;
      } catch (_) {
        // Ignore malformed error payloads.
      }
    }
    logLine(message, "error");
    setError(message);
    source.close();
    setBusy(false);
  });

  source.addEventListener("done", async (event) => {
    const data = JSON.parse(event.data);
    folderName = data.folderName;
    source.close();
    setBusy(false);
    progressLabel.textContent = "Done.";

    currentFiles["image-prompt"] = await fetchText(
      `/posts/${encodeURIComponent(folderName)}/image-prompt.md`
    );
    activeTab = "post";
    renderActiveTab();
    renderPreviewText();
    setMeta(`<div><strong>Folder</strong><span>posts/${folderName}</span></div>`);
    loadPostsList();
  });
}

function startProgress() {
  progressPanel.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressLabel.textContent = "Starting…";
  activityLog.innerHTML = "";
}

function setProgress(step, status) {
  const target = STEP_PROGRESS[step];
  if (!target) return;
  progressFill.style.width = `${status === "complete" ? target.complete : target.active}%`;
}

function logLine(text, kind) {
  const line = document.createElement("p");
  line.className = `log-line ${kind}`;
  line.textContent = text;
  activityLog.appendChild(line);
  progressLabel.textContent = text;
  activityLog.scrollTop = activityLog.scrollHeight;
}

function appendStream(step, text) {
  let line = activityLog.querySelector(`[data-stream="${step}"]`);
  if (!line) {
    line = document.createElement("p");
    line.className = "log-line stream";
    line.dataset.stream = step;
    activityLog.appendChild(line);
  }
  line.textContent += text;
  activityLog.scrollTop = activityLog.scrollHeight;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok || result.error) throw new Error(result.error || "Request failed.");
  return result;
}

async function fetchText(url) {
  const response = await fetch(`${url}?t=${Date.now()}`);
  return response.ok ? response.text() : "";
}

function setBusy(isBusy) {
  allButtons.forEach((button) => {
    button.disabled = isBusy;
  });
  runState.textContent = isBusy ? "Running" : "Idle";
}

function setStepState(step, state) {
  const item = statusItems.find((el) => el.dataset.step === step);
  if (!item) return;
  item.classList.remove("active", "complete", "error");
  if (state !== "pending") item.classList.add(state);
}

function renderPreviewText() {
  const postBody = extractSection(currentFiles.post, "Post") || currentFiles.post || "";
  previewText.textContent = postBody.trim() || "Your generated LinkedIn post will appear here.";
  previewStatus.textContent = currentFiles.post ? "Ready" : "Waiting";
}

function renderImage(url, errorMessage, orientation) {
  imageFrame.classList.toggle("landscape", orientation === "landscape");
  if (url) {
    imageFrame.innerHTML = `<img src="${url}" alt="Generated LinkedIn post artwork" />`;
    previewStatus.textContent = "Ready";
  } else {
    imageFrame.innerHTML = `<span>${escapeHtml(errorMessage || "Image was not generated.")}</span>`;
  }
}

function renderActiveTab() {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === activeTab);
  });

  const filenames = { research: "research.md", post: "post.md", "image-prompt": "image-prompt.md" };
  const filename = filenames[activeTab];
  const content = currentFiles[activeTab];

  fileLabel.textContent = filename;
  fileViewer.textContent = content || "No file generated yet.";

  if (folderName) {
    fileLink.href = `/posts/${encodeURIComponent(folderName)}/${filename}`;
    fileLink.classList.remove("hidden");
    fileLink.setAttribute("aria-label", `Open ${filename}`);
  } else {
    fileLink.classList.add("hidden");
  }
}

async function loadPostsList() {
  try {
    const response = await fetch("/api/posts");
    const result = await response.json();
    postsList.innerHTML = (result.posts || [])
      .map((post) => {
        const badges = [
          post.hasResearch ? "Research" : null,
          post.hasPost ? "Post" : null,
          post.hasImage ? "Image" : null,
        ]
          .filter(Boolean)
          .join(" · ");
        const thumb = post.imageUrl
          ? `<img src="${escapeHtml(post.imageUrl)}" alt="" loading="lazy" />`
          : `<span>No image yet</span>`;
        return `<article class="post-card" data-folder="${escapeHtml(post.folderName)}">
          <div class="post-card-thumb">${thumb}</div>
          <p class="post-card-title">${escapeHtml(post.topic)}</p>
          <small class="post-card-badges">${badges || "brief only"}</small>
        </article>`;
      })
      .join("");

    Array.from(postsList.querySelectorAll(".post-card")).forEach((card) => {
      card.addEventListener("click", () => openPost(card.dataset.folder));
    });
  } catch (_) {
    // Posts list is a convenience panel; ignore failures silently.
  }
}

async function loadContentPlan() {
  try {
    const response = await fetch("/api/content-plan");
    const result = await response.json();
    contentPlanInput.innerHTML =
      `<option value="">— pick a planned topic —</option>` +
      (result.items || [])
        .map(
          (item) =>
            `<option value="${escapeHtml(item.topic)}">${item.done ? "✓ " : ""}${escapeHtml(item.topic)}</option>`
        )
        .join("");
  } catch (_) {
    // Content plan is a convenience picker; ignore failures silently.
  }
}

function connectWatch() {
  try {
    const source = new EventSource("/api/watch");
    source.addEventListener("change", () => {
      loadPostsList();
      loadContentPlan();
    });
    source.onerror = () => {
      // Browser auto-retries EventSource connections; nothing else to do.
    };
  } catch (_) {
    // Autoreload is a convenience; ignore if unsupported.
  }
}

async function openPost(name) {
  setError("");
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(name)}`);
    const result = await response.json();
    if (!response.ok || result.error) throw new Error(result.error || "Could not load post.");

    folderName = result.folderName;
    currentFiles.research = result.research || "";
    currentFiles.post = result.post || "";
    currentFiles["image-prompt"] = result.imagePromptMd || "";

    if (result.brief) {
      const topicMatch = result.brief.match(/Topic: (.*)/);
      const audienceMatch = result.brief.match(/Audience: (.*)/);
      const povMatch = result.brief.match(/Point of view: (.*)/);
      const actionMatch = result.brief.match(/Desired action: (.*)/);
      if (topicMatch) topicInput.value = topicMatch[1].trim();
      if (povMatch) povInput.value = povMatch[1].replace("(not set)", "").trim();
      if (actionMatch) actionInput.value = actionMatch[1].replace("(not set)", "").trim();

      const audience = audienceMatch ? audienceMatch[1].replace("(not set)", "").trim() : "";
      const presetOption = Array.from(audiencePreset.options).find((opt) => opt.value === audience);
      if (presetOption) {
        audiencePreset.value = audience;
        audienceInput.classList.add("hidden");
        audienceInput.value = audience;
      } else {
        audiencePreset.value = audience ? "__custom__" : "";
        audienceInput.classList.toggle("hidden", !audience);
        audienceInput.value = audience;
      }
    }

    setStepState("research", currentFiles.research ? "complete" : "pending");
    setStepState("write", currentFiles.post ? "complete" : "pending");
    setStepState("image", result.imageUrl ? "complete" : "pending");

    activeTab = currentFiles.post ? "post" : "research";
    renderActiveTab();
    renderPreviewText();
    renderImage(result.imageUrl, null, orientationInput.value);
    setMeta(`<div><strong>Folder</strong><span>posts/${folderName}</span></div>`);
  } catch (error) {
    setError(error.message);
  }
}

function extractSection(markdown, heading) {
  if (!markdown) return "";
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`## ${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, "i");
  const match = markdown.match(pattern);
  return match ? match[1].trim() : "";
}

function setMeta(html) {
  metaPanel.innerHTML = html;
  metaPanel.classList.toggle("hidden", !html);
}

function setError(message) {
  errorPanel.textContent = message;
  errorPanel.classList.toggle("hidden", !message);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

#!/usr/bin/env node
const http = require("node:http");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(__dirname, "public");
const POSTS_DIR = path.join(ROOT, "posts");
const SKILLS_DIR = path.join(ROOT, "skills");
const CONTENT_PLAN_PATH = path.join(ROOT, "content-plan.md");

const IMAGE_ORIENTATIONS = {
  portrait: { size: "1024x1536", label: "Portrait (4:5 feed)" },
  landscape: { size: "1536x1024", label: "Landscape (wide)" },
};

loadDotenv(path.join(ROOT, ".env"));

const PORT = Number(process.env.PORT || 4322);
const HOST = process.env.HOST || "127.0.0.1";
const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-5.6";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function loadDotenv(filePath) {
  if (!fsSync.existsSync(filePath)) return;

  for (const rawLine of fsSync.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;

    const [rawKey, ...rest] = line.split("=");
    const key = rawKey.trim();
    let value = rest.join("=").trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

async function sendFile(res, filePath, headOnly = false) {
  const ext = path.extname(filePath).toLowerCase();
  const stat = await fs.stat(filePath);
  if (!stat.isFile()) throw Object.assign(new Error("Not found"), { code: "ENOENT" });

  const body = await fs.readFile(filePath);
  res.writeHead(200, {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  res.end(headOnly ? undefined : body);
}

function safeResolve(baseDir, requestPath) {
  const resolved = path.resolve(baseDir, requestPath);
  if (resolved !== baseDir && !resolved.startsWith(`${baseDir}${path.sep}`)) {
    throw new Error("Path is outside the allowed directory.");
  }
  return resolved;
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "linkedin-post"
  );
}

async function handleContentPlan(req, res) {
  try {
    const raw = await readIfExists(CONTENT_PLAN_PATH);
    const topics = raw
      ? raw
          .split("\n")
          .map((line) => line.match(/^\d+\.\s+(.*)/))
          .filter(Boolean)
          .map((match) => match[1].trim())
      : [];

    const dirs = await listPostDirs();
    const dirWords = dirs.map((dir) => new Set(dir.replace(/^\d{3}-/, "").split("-").filter(Boolean)));

    const items = topics.map((topic) => {
      const topicWords = new Set(slugify(topic).split("-").filter((w) => w.length > 3));
      const done = dirWords.some((words) => {
        const overlap = [...topicWords].filter((w) => words.has(w)).length;
        return topicWords.size > 0 && overlap / topicWords.size >= 0.5;
      });
      return { topic, done };
    });

    sendJson(res, 200, { items });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function listPostDirs() {
  await fs.mkdir(POSTS_DIR, { recursive: true });
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && /^\d{3}-/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

// Every topic gets exactly one posts/NNN-slug/ folder, created at research time and
// never renumbered — see CLAUDE.md's naming rule. Reuse an existing folder by slug
// match; otherwise take the next unused number.
async function getOrCreatePostFolder(topic) {
  const slug = slugify(topic);
  const dirs = await listPostDirs();
  const existing = dirs.find((dir) => dir.replace(/^\d{3}-/, "") === slug);

  if (existing) {
    return {
      slug,
      created: false,
      folderName: existing,
      folderPath: path.join(POSTS_DIR, existing),
    };
  }

  const highest = dirs.reduce((max, dir) => {
    const match = dir.match(/^(\d{3})-/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  const folderName = `${String(highest + 1).padStart(3, "0")}-${slug}`;
  const folderPath = path.join(POSTS_DIR, folderName);

  await fs.mkdir(path.join(folderPath, "images"), { recursive: true });
  return { slug, created: true, folderName, folderPath };
}

function resolvePostFolder(folderName) {
  if (!folderName || !/^\d{3}-[a-z0-9-]+$/.test(folderName)) {
    throw new Error("Missing or invalid folderName.");
  }
  return safeResolve(POSTS_DIR, folderName);
}

async function readIfExists(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function imageVersion(filename) {
  const match = filename.match(/-v(\d+)\./);
  return match ? Number(match[1]) : 1;
}

async function findExistingImage(folderPath) {
  const imageDir = path.join(folderPath, "images");
  try {
    const entries = await fs.readdir(imageDir, { withFileTypes: true });
    const candidates = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /^post-image(?:-v\d+)?\.(png|jpe?g|webp)$/i.test(name))
      .sort((a, b) => imageVersion(a) - imageVersion(b));
    return candidates.at(-1) || null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function nextImagePath(folderPath) {
  const imageDir = path.join(folderPath, "images");
  await fs.mkdir(imageDir, { recursive: true });

  const entries = await fs.readdir(imageDir, { withFileTypes: true });
  const existing = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^post-image(?:-v\d+)?\.png$/i.test(name));

  if (!existing.includes("post-image.png")) {
    return path.join(imageDir, "post-image.png");
  }

  const highest = existing.reduce((max, name) => Math.max(max, imageVersion(name)), 1);
  return path.join(imageDir, `post-image-v${highest + 1}.png`);
}

async function readSkill(name) {
  const content = await readIfExists(path.join(SKILLS_DIR, name, "SKILL.md"));
  if (!content) throw new Error(`Missing skill: skills/${name}/SKILL.md`);
  return content;
}

async function createResponse(input, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Add it to session-25-live/.env, then restart the app."
    );
  }

  const payload = {
    model: options.model || TEXT_MODEL,
    input,
    max_output_tokens: options.maxOutputTokens || 6000,
  };

  if (options.tools) payload.tools = options.tools;

  let response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`OpenAI request failed: ${error.message}`);
  }

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}: ${bodyText}`);
  }

  const body = JSON.parse(bodyText);
  const text = extractOutputText(body);
  if (!text) throw new Error("OpenAI returned no text output.");
  return text.trim();
}

async function createResponseStream(input, options = {}, onDelta) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Add it to session-25-live/.env, then restart the app."
    );
  }

  const payload = {
    model: options.model || TEXT_MODEL,
    input,
    max_output_tokens: options.maxOutputTokens || 6000,
    stream: true,
  };

  if (options.tools) payload.tools = options.tools;

  let response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`OpenAI request failed: ${error.message}`);
  }

  if (!response.ok || !response.body) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`OpenAI API error ${response.status}: ${bodyText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const dataLines = rawEvent.split("\n").filter((line) => line.startsWith("data:"));
      if (!dataLines.length) continue;
      const dataStr = dataLines.map((line) => line.slice(5).trim()).join("\n");
      if (dataStr === "[DONE]") continue;

      let event;
      try {
        event = JSON.parse(dataStr);
      } catch (_) {
        continue;
      }

      if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
        fullText += event.delta;
        if (onDelta) onDelta(event.delta, fullText);
      } else if (event.type === "response.failed" || event.type === "error") {
        throw new Error(event.error?.message || event.message || "OpenAI streaming error");
      }
    }
  }

  if (!fullText.trim()) throw new Error("OpenAI returned no text output.");
  return fullText.trim();
}

function extractOutputText(responseBody) {
  if (typeof responseBody.output_text === "string") return responseBody.output_text;

  const chunks = [];
  for (const item of responseBody.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
      if (typeof content.output_text === "string") chunks.push(content.output_text);
    }
  }
  return chunks.join("\n").trim();
}

function briefToMarkdown(brief) {
  return `# Brief

- Topic: ${brief.topic}
- Audience: ${brief.audience || "(not set)"}
- Point of view: ${brief.pointOfView || "(not set)"}
- Desired action: ${brief.desiredAction || "(not set)"}
- Length knob: ${brief.length || "medium"}
`;
}

async function handleBrief(req, res) {
  try {
    const body = await readJson(req);
    const topic = String(body.topic || "").trim();
    if (!topic) return sendJson(res, 400, { error: "Enter a topic first." });

    const folder = await getOrCreatePostFolder(topic);
    const brief = {
      topic,
      audience: String(body.audience || "").trim(),
      pointOfView: String(body.pointOfView || "").trim(),
      desiredAction: String(body.desiredAction || "").trim(),
      length: String(body.length || "medium").trim(),
    };

    await fs.writeFile(path.join(folder.folderPath, "brief.md"), briefToMarkdown(brief), "utf8");

    sendJson(res, 200, { folderName: folder.folderName, created: folder.created, brief });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function buildResearchPrompt(skill, brief, today) {
  return `
You are following the research skill below. Produce save-ready Markdown only, no surrounding commentary.

Skill rules:
${skill}

Today's date: ${today}
Default time window: last 30 days unless the topic is evergreen.

Brief:
${brief}

Structure:
# Research Brief

**Time Window:**
**Last Updated:**

## Summary

## Key Points
- 3-6 bullets, each labelled (fact) / (inference) / (opinion)

## Notable Statistics
Small Markdown table. If no verified stats exist, say "No verified stats found."

## Counterpoint

## Sources
Markdown table with source, URL, date, and what it supports.
`;
}

function lengthHintFor(brief) {
  return (
    {
      short: "600-900 characters",
      medium: "1,200-1,500 characters",
      long: "1,800-2,200 characters",
    }[(brief.match(/Length knob: (\w+)/) || [])[1]] || "1,200-1,500 characters"
  );
}

function buildWritePrompt(skill, brief, research) {
  return `
You are following the writing skill below. Produce save-ready Markdown only, no surrounding commentary.

Skill rules:
${skill}

Target length: ${lengthHintFor(brief)}
No unsupported claims beyond the research. No external links in the post body. 3-5 hashtags at the end only.

Output exactly this structure:
# LinkedIn Post

## Post
[final post]

## Notes
[1-2 lines on what was simplified or left out from the research]

Brief:
${brief}

Research brief:
${research}
`;
}

async function handleResearch(req, res) {
  try {
    const { folderName } = await readJson(req);
    const folderPath = resolvePostFolder(folderName);

    const brief = await readIfExists(path.join(folderPath, "brief.md"));
    if (!brief) throw new Error("No brief.md found for this topic. Save the brief first.");

    const skill = await readSkill("research");
    const today = new Date().toISOString().slice(0, 10);
    const prompt = buildResearchPrompt(skill, brief, today);

    const research = await createResponse(prompt, {
      tools: [{ type: "web_search" }],
      maxOutputTokens: 8000,
    });

    await fs.writeFile(path.join(folderPath, "research.md"), `${research.trim()}\n`, "utf8");
    sendJson(res, 200, { folderName, research });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleWrite(req, res) {
  try {
    const { folderName } = await readJson(req);
    const folderPath = resolvePostFolder(folderName);

    const research = await readIfExists(path.join(folderPath, "research.md"));
    if (!research) throw new Error("No research.md found. Run research first.");
    const brief = (await readIfExists(path.join(folderPath, "brief.md"))) || "";

    const skill = await readSkill("write-linkedin");
    const prompt = buildWritePrompt(skill, brief, research);

    const post = await createResponse(prompt, { maxOutputTokens: 5000 });
    await fs.writeFile(path.join(folderPath, "post.md"), `${post.trim()}\n`, "utf8");
    sendJson(res, 200, { folderName, post });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function resolveSkillFile(relativePath) {
  const filePath = path.join(SKILLS_DIR, relativePath);
  if (!fsSync.existsSync(filePath)) throw new Error(`Missing skill file: ${relativePath}`);
  return filePath;
}

function parseJsonObject(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error("Could not parse image plan JSON.");
  }
}

async function generateImagePlan(skill, postMarkdown, orientation) {
  const styleGuide = await fs.readFile(resolveSkillFile("linkedin-image/style-guide.json"), "utf8");
  const orientationNote =
    orientation === "landscape"
      ? "Target a landscape/wide frame (1536x1024). Compose for a horizontal crop: spread the hero subject and negative space across the width rather than stacking vertically, and keep the headline readable in a short, wide band."
      : "Target the standing portrait frame (1024x1536). Compose within a centred 4:5-safe region so the artwork stays strong when cropped for a LinkedIn feed.";
  const prompt = `
You are following the visual skill below. Read the finished LinkedIn post and derive the house-style image variables.

Skill rules:
${skill}

Orientation: ${orientationNote}

Return JSON only. No Markdown fences.

Required JSON shape:
{
  "archetype": "...",
  "visualIdea": "...",
  "subject": "...",
  "humanRole": "...",
  "actionOrRelationship": "...",
  "composition": "...",
  "background": "...",
  "palette": "...",
  "headline": "...",
  "supportingLine": "...",
  "displayType": "...",
  "prompt": "..."
}

Rules:
- Use the provided style guide.
- Select one archetype from the style guide.
- The headline must be 1-5 words; the supporting line is optional and no longer than 10 words.
- The prompt must be a complete image-generation prompt using the style guide.
- Keep the result mobile-readable and consistent with the editorial scale-play poster system.

Style guide:
${styleGuide}

Finished post:
${postMarkdown}
`;

  const text = await createResponse(prompt, { maxOutputTokens: 2500 });
  return parseJsonObject(text);
}

function imagePromptMarkdown(imagePlan) {
  return `# Image prompt

- Archetype: ${imagePlan.archetype}
- Visual idea: ${imagePlan.visualIdea}
- Subject: ${imagePlan.subject}
- Human role: ${imagePlan.humanRole}
- Action/relationship: ${imagePlan.actionOrRelationship}
- Composition: ${imagePlan.composition}
- Background: ${imagePlan.background}
- Palette: ${imagePlan.palette}
- Headline: "${imagePlan.headline}"
- Supporting line: "${imagePlan.supportingLine}"
- Display type: ${imagePlan.displayType}

## Prompt

${imagePlan.prompt}
`;
}

async function generateImage(folderPath, postMarkdown, orientation) {
  const resolvedOrientation = IMAGE_ORIENTATIONS[orientation] ? orientation : "portrait";
  const skill = await readSkill("create-visual");
  const imagePlan = await generateImagePlan(skill, postMarkdown, resolvedOrientation);
  const outputPath = await nextImagePath(folderPath);
  const scriptPath = resolveSkillFile("linkedin-image/generate_image.py");
  const size = IMAGE_ORIENTATIONS[resolvedOrientation].size;

  await new Promise((resolve, reject) => {
    const child = spawn(
      "python3",
      [scriptPath, imagePlan.prompt, "--output", outputPath, "--size", size],
      {
        cwd: ROOT,
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
      }
    );

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error((stderr || stdout || `Image generation exited with code ${code}`).trim()));
    });
  });

  await fs.writeFile(
    path.join(folderPath, "image-prompt.md"),
    imagePromptMarkdown(imagePlan),
    "utf8"
  );

  return { outputPath, imagePlan, orientation: resolvedOrientation };
}

function publicPostUrl(folderName, filename) {
  return `/posts/${encodeURIComponent(folderName)}/images/${encodeURIComponent(filename)}?t=${Date.now()}`;
}

async function handleImage(req, res) {
  try {
    const { folderName, orientation } = await readJson(req);
    const folderPath = resolvePostFolder(folderName);

    const post = await readIfExists(path.join(folderPath, "post.md"));
    if (!post) throw new Error("No post.md found. Run write first.");

    const { outputPath, imagePlan, orientation: usedOrientation } = await generateImage(
      folderPath,
      post,
      orientation
    );
    const imageFilename = path.basename(outputPath);

    sendJson(res, 200, {
      folderName,
      imagePlan,
      orientation: usedOrientation,
      imagePromptPath: path.join(folderPath, "image-prompt.md"),
      imageUrl: publicPostUrl(folderName, imageFilename),
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleFullRun(req, res) {
  try {
    const body = await readJson(req);
    const briefRes = await runInline(handleBrief, body);
    if (briefRes.error) return sendJson(res, 500, briefRes);

    const researchRes = await runInline(handleResearch, { folderName: briefRes.folderName });
    if (researchRes.error) return sendJson(res, 500, { ...briefRes, ...researchRes });

    const writeRes = await runInline(handleWrite, { folderName: briefRes.folderName });
    if (writeRes.error) return sendJson(res, 500, { ...briefRes, ...researchRes, ...writeRes });

    const imageRes = await runInline(handleImage, {
      folderName: briefRes.folderName,
      orientation: body.orientation,
    });

    sendJson(res, 200, { ...briefRes, ...researchRes, ...writeRes, ...imageRes });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function sseSend(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// Streams full-run progress over SSE: one "step" event per phase transition, plus
// "delta" events with the live text as research/post generation streams in, so the
// UI can show a progress bar and the actual model output arriving instead of a blank
// spinner during the run.
async function handleFullRunStream(req, res, query) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store",
    Connection: "keep-alive",
  });
  res.write(": connected\n\n");

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);
  req.on("close", () => clearInterval(heartbeat));

  try {
    const topic = String(query.get("topic") || "").trim();
    if (!topic) throw new Error("Enter a topic first.");

    const brief = {
      topic,
      audience: String(query.get("audience") || "").trim(),
      pointOfView: String(query.get("pointOfView") || "").trim(),
      desiredAction: String(query.get("desiredAction") || "").trim(),
      length: String(query.get("length") || "medium").trim(),
    };
    const orientation = query.get("orientation") || "portrait";

    sseSend(res, "step", { step: "brief", status: "active", message: `Setting up posts/ folder for "${topic}"…` });
    const folder = await getOrCreatePostFolder(topic);
    const folderPath = folder.folderPath;
    await fs.writeFile(path.join(folderPath, "brief.md"), briefToMarkdown(brief), "utf8");
    sseSend(res, "step", {
      step: "brief",
      status: "complete",
      message: `Folder ready: posts/${folder.folderName}`,
      folderName: folder.folderName,
    });

    sseSend(res, "step", {
      step: "research",
      status: "active",
      message: "Searching the web and drafting the research brief…",
    });
    const researchSkill = await readSkill("research");
    const today = new Date().toISOString().slice(0, 10);
    const researchPrompt = buildResearchPrompt(researchSkill, briefToMarkdown(brief), today);
    const research = await createResponseStream(
      researchPrompt,
      { tools: [{ type: "web_search" }], maxOutputTokens: 8000 },
      (delta) => sseSend(res, "delta", { step: "research", text: delta })
    );
    await fs.writeFile(path.join(folderPath, "research.md"), `${research.trim()}\n`, "utf8");
    sseSend(res, "step", { step: "research", status: "complete", message: "Research brief saved." });

    sseSend(res, "step", { step: "write", status: "active", message: "Drafting the LinkedIn post…" });
    const writeSkill = await readSkill("write-linkedin");
    const writePrompt = buildWritePrompt(writeSkill, briefToMarkdown(brief), research);
    const post = await createResponseStream(writePrompt, { maxOutputTokens: 5000 }, (delta) =>
      sseSend(res, "delta", { step: "write", text: delta })
    );
    await fs.writeFile(path.join(folderPath, "post.md"), `${post.trim()}\n`, "utf8");
    sseSend(res, "step", { step: "write", status: "complete", message: "Post draft saved." });

    sseSend(res, "step", {
      step: "image",
      status: "active",
      message: "Deriving the image concept from the post…",
    });
    const imageSkill = await readSkill("create-visual");
    const resolvedOrientation = IMAGE_ORIENTATIONS[orientation] ? orientation : "portrait";
    const imagePlan = await generateImagePlan(imageSkill, post, resolvedOrientation);
    sseSend(res, "step", {
      step: "image",
      status: "active",
      message: `Rendering "${imagePlan.headline}" (${IMAGE_ORIENTATIONS[resolvedOrientation].label}) via gpt-image-1 — this can take 20-40s…`,
    });

    const outputPath = await nextImagePath(folderPath);
    const scriptPath = resolveSkillFile("linkedin-image/generate_image.py");
    const size = IMAGE_ORIENTATIONS[resolvedOrientation].size;
    await new Promise((resolve, reject) => {
      const child = spawn(
        "python3",
        [scriptPath, imagePlan.prompt, "--output", outputPath, "--size", size],
        { cwd: ROOT, env: process.env, stdio: ["ignore", "pipe", "pipe"] }
      );
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
      child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) return resolve();
        reject(new Error((stderr || stdout || `Image generation exited with code ${code}`).trim()));
      });
    });

    await fs.writeFile(path.join(folderPath, "image-prompt.md"), imagePromptMarkdown(imagePlan), "utf8");
    const imageFilename = path.basename(outputPath);
    sseSend(res, "step", {
      step: "image",
      status: "complete",
      message: "Image generated.",
      imageUrl: publicPostUrl(folder.folderName, imageFilename),
      orientation: resolvedOrientation,
    });

    sseSend(res, "done", { folderName: folder.folderName });
  } catch (error) {
    sseSend(res, "error", { message: error.message });
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
}

// Runs a handler in-process against a plain object body instead of a real request,
// so /api/full-run can chain the same step logic used by the individual endpoints.
function runInline(handler, body) {
  return new Promise((resolve) => {
    const fakeReq = (async function* () {
      yield Buffer.from(JSON.stringify(body));
    })();
    let captured = null;
    const fakeRes = {
      writeHead() {
        return this;
      },
      end(payload) {
        captured = payload ? JSON.parse(payload) : {};
        resolve(captured);
      },
    };
    handler(fakeReq, fakeRes);
  });
}

async function handleListPosts(req, res) {
  try {
    const dirs = await listPostDirs();
    const posts = await Promise.all(
      dirs.map(async (folderName) => {
        const folderPath = path.join(POSTS_DIR, folderName);
        const [brief, hasResearch, hasPost, hasImagePrompt, image] = await Promise.all([
          readIfExists(path.join(folderPath, "brief.md")),
          fileExists(path.join(folderPath, "research.md")),
          fileExists(path.join(folderPath, "post.md")),
          fileExists(path.join(folderPath, "image-prompt.md")),
          findExistingImage(folderPath),
        ]);
        const topicMatch = brief && brief.match(/Topic: (.*)/);
        return {
          folderName,
          topic: topicMatch ? topicMatch[1].trim() : folderName.replace(/^\d{3}-/, "").replace(/-/g, " "),
          hasBrief: Boolean(brief),
          hasResearch,
          hasPost,
          hasImagePrompt,
          hasImage: Boolean(image),
          imageUrl: image ? publicPostUrl(folderName, image) : null,
        };
      })
    );
    sendJson(res, 200, { posts });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function fileExists(filePath) {
  return (await readIfExists(filePath)) !== null;
}

async function handleGetPost(req, res, folderName) {
  try {
    const folderPath = resolvePostFolder(folderName);
    const [brief, research, post, imagePromptMd, imageFilename] = await Promise.all([
      readIfExists(path.join(folderPath, "brief.md")),
      readIfExists(path.join(folderPath, "research.md")),
      readIfExists(path.join(folderPath, "post.md")),
      readIfExists(path.join(folderPath, "image-prompt.md")),
      findExistingImage(folderPath),
    ]);

    sendJson(res, 200, {
      folderName,
      brief,
      research,
      post,
      imagePromptMd,
      imageUrl: imageFilename ? publicPostUrl(folderName, imageFilename) : null,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function handleWatch(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store",
    Connection: "keep-alive",
  });
  res.write(": connected\n\n");

  let timer = null;
  const notify = () => {
    clearTimeout(timer);
    timer = setTimeout(() => res.write("event: change\ndata: posts\n\n"), 150);
  };

  const watcher = fsSync.watch(POSTS_DIR, { recursive: true }, notify);
  req.on("close", () => {
    clearTimeout(timer);
    watcher.close();
  });
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  try {
    if (req.method === "POST" && pathname === "/api/brief") return handleBrief(req, res);
    if (req.method === "POST" && pathname === "/api/research") return handleResearch(req, res);
    if (req.method === "POST" && pathname === "/api/write") return handleWrite(req, res);
    if (req.method === "POST" && pathname === "/api/image") return handleImage(req, res);
    if (req.method === "POST" && pathname === "/api/full-run") return handleFullRun(req, res);
    if (req.method === "GET" && pathname === "/api/posts") return handleListPosts(req, res);
    if (req.method === "GET" && pathname === "/api/content-plan") return handleContentPlan(req, res);
    if (req.method === "GET" && pathname === "/api/watch") return handleWatch(req, res);
    if (req.method === "GET" && pathname === "/api/full-run-stream") {
      return handleFullRunStream(req, res, url.searchParams);
    }

    const postMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
    if (req.method === "GET" && postMatch) return handleGetPost(req, res, postMatch[1]);

    const headOnly = req.method === "HEAD";
    if (req.method !== "GET" && !headOnly) {
      return sendText(res, 405, "Method not allowed");
    }

    if (pathname === "/") {
      return await sendFile(res, path.join(PUBLIC_DIR, "index.html"), headOnly);
    }

    if (pathname.startsWith("/posts/")) {
      const filePath = safeResolve(POSTS_DIR, pathname.replace(/^\/posts\//, ""));
      return await sendFile(res, filePath, headOnly);
    }

    const publicPath = pathname === "/favicon.ico" ? "favicon.ico" : pathname.slice(1);
    const filePath = safeResolve(PUBLIC_DIR, publicPath);
    return await sendFile(res, filePath, headOnly);
  } catch (error) {
    if (error.code === "ENOENT") return sendText(res, 404, "Not found");
    sendText(res, 500, error.message);
  }
}

const server = http.createServer(route);
server.listen(PORT, HOST, () => {
  console.log(`session-25-live web skin running at http://${HOST}:${PORT}`);
});

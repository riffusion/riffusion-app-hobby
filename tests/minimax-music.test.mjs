import { test } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

// Load the handler from its .js source. Next API routes use plain exports,
// so we can import the module file directly.
const routePath = new URL("../pages/api/minimax-music.js", import.meta.url).pathname;
const routeURL = pathToFileURL(routePath).href;

async function loadHandler() {
  const mod = await import(routeURL);
  return mod.default;
}

async function callHandler({ method, body, rawBody } = {}) {
  const handler = await loadHandler();
  const req = {
    method: method || "POST",
    body: rawBody !== undefined ? rawBody : body !== undefined ? JSON.stringify(body) : undefined,
  };
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; },
  };
  await handler(req, res);
  return res;
}

let lastFetch = null;

test("rejects non-POST methods", async () => {
  const res = await callHandler({ method: "GET" });
  assert.equal(res.statusCode, 405);
  assert.equal(res.body.error, "Method not allowed");
});

test("rejects unsupported models", async () => {
  const res = await callHandler({ body: { model: "bogus-model" } });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /Unsupported model/);
});

test("rejects unsupported output_format", async () => {
  const res = await callHandler({ body: { model: "music-3.0", output_format: "ogg" } });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /Unsupported output_format/);
});

test("rejects stream output_format that is not hex", async () => {
  const res = await callHandler({ body: { model: "music-3.0", stream: true, output_format: "url" } });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /stream output_format/);
});

test("posts to the global endpoint and parses a completed response", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (endpoint, init) => {
    lastFetch = { endpoint, init };
    return { json: async () => ({ base_resp: { status_code: 0 }, data: { status: 2, audio: "https://example.com/track.mp3" } }) };
  };
  const res = await callHandler({ body: { model: "music-2.6", prompt: "funk guitar" } });
  globalThis.fetch = original;
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.region, "global_en");
  assert.equal(res.body.status, "completed");
  assert.equal(res.body.audio, "https://example.com/track.mp3");
  assert.equal(lastFetch.endpoint, "https://api.minimax.io/v1/music_generation");
  const sent = JSON.parse(lastFetch.init.body);
  assert.equal(sent.model, "music-2.6");
  assert.equal(sent.prompt, "funk guitar");
});

test("accepts cover models and forwards cover fields with bearer auth", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.MINIMAX_API_KEY;
  process.env.MINIMAX_API_KEY = "test-api-key";
  globalThis.fetch = async (endpoint, init) => {
    lastFetch = { endpoint, init };
    return { json: async () => ({ base_resp: { status_code: 0 }, data: { status: 2, audio: "cover-audio" } }) };
  };

  try {
    for (const model of ["music-cover", "music-cover-free"]) {
      const res = await callHandler({
        body: {
          model,
          audio_url: "https://example.com/source.mp3",
          cover_feature_id: "feature-123",
        },
      });
      assert.equal(res.statusCode, 200);
      assert.equal(lastFetch.init.headers.Authorization, "Bearer test-api-key");
      const sent = JSON.parse(lastFetch.init.body);
      assert.equal(sent.model, model);
      assert.equal(sent.audio_url, "https://example.com/source.mp3");
      assert.equal(sent.cover_feature_id, "feature-123");
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) {
      delete process.env.MINIMAX_API_KEY;
    } else {
      process.env.MINIMAX_API_KEY = originalApiKey;
    }
  }
});

test("uses the China endpoint and forwards regional fields", async () => {
  process.env.MINIMAX_REGION = "cn_zh";
  const original = globalThis.fetch;
  globalThis.fetch = async (endpoint, init) => {
    lastFetch = { endpoint, init };
    return { json: async () => ({ base_resp: { status_code: 0 }, data: { status: 1, audio: "" } }) };
  };
  const res = await callHandler({ body: { model: "music-3.0", aigc_watermark: 1, lyrics: "la la" } });
  globalThis.fetch = original;
  delete process.env.MINIMAX_REGION;
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.region, "cn_zh");
  assert.equal(res.body.status, "in_progress");
  assert.equal(lastFetch.endpoint, "https://api.minimaxi.com/v1/music_generation");
  const sent = JSON.parse(lastFetch.init.body);
  assert.equal(sent.aigc_watermark, 1);
  assert.equal(sent.lyrics, "la la");
});

test("reports failure when base_resp.status_code is non-zero", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => ({ json: async () => ({ base_resp: { status_code: 1001 }, data: {} }) });
  const res = await callHandler({ body: { model: "music-3.0" } });
  globalThis.fetch = original;
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.success, false);
  assert.equal(res.body.status_code, 1001);
});

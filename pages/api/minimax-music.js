// Music generation proxy for the MiniMax music_generation API.
//
// The rest of this app generates audio by sending Riffusion stable-diffusion
// spectrogram payloads to a Flask server or Baseten. This route exposes the
// MiniMax music-generation inference endpoint instead, covering both the global
// and China regional endpoints, the current music models, the supported
// request/output/audio formats, and the response status/audio parsing.
//
// Configure with the following environment variables:
//   MINIMAX_API_KEY     Bearer token used to authenticate with MiniMax.
//   MINIMAX_REGION      "global_en" (default) or "cn_zh" to select the endpoint.

// Regional endpoints. The China endpoint lives on a separate host.
const ENDPOINTS = {
  global_en: "https://api.minimax.io/v1/music_generation",
  cn_zh: "https://api.minimaxi.com/v1/music_generation",
};

// Current music-generation models.
const MODELS = ["music-3.0", "music-2.6", "music-3.0-free", "music-2.6-free"];
const DEFAULT_MODEL = "music-3.0";

// Supported output and audio formats.
const OUTPUT_FORMATS = ["url", "hex"];
const STREAM_OUTPUT_FORMATS = ["hex"];
const AUDIO_FORMATS = ["mp3", "wav", "pcm"];

// Fields that are only accepted by a specific regional endpoint.
const REGIONAL_FIELDS = {
  global_en: [],
  cn_zh: ["aigc_watermark"],
};

// Fields accepted by the music_generation request body.
const REQUEST_FIELDS = [
  "model",
  "prompt",
  "lyrics",
  "stream",
  "output_format",
  "audio_setting",
  "lyrics_optimizer",
  "is_instrumental",
  "audio_url",
  "audio_base64",
  "cover_feature_id",
];

function resolveRegion(value) {
  return value === "cn_zh" ? "cn_zh" : "global_en";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const region = resolveRegion(process.env.MINIMAX_REGION);
  const endpoint = ENDPOINTS[region];

  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

  const model = body.model || DEFAULT_MODEL;
  if (!MODELS.includes(model)) {
    return res.status(400).json({ error: "Unsupported model: " + model });
  }

  if (body.output_format && !OUTPUT_FORMATS.includes(body.output_format)) {
    return res
      .status(400)
      .json({ error: "Unsupported output_format: " + body.output_format });
  }

  // Stream mode only supports the hex output format.
  if (body.stream && body.output_format && !STREAM_OUTPUT_FORMATS.includes(body.output_format)) {
    return res
      .status(400)
      .json({ error: "stream output_format must be one of: " + STREAM_OUTPUT_FORMATS.join(", ") });
  }

  // Build the request payload from the supported fields.
  const payload = { model };
  for (const field of REQUEST_FIELDS) {
    if (field === "model") {
      continue;
    }
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  }

  // Append region-specific fields (e.g. aigc_watermark for the China endpoint).
  for (const field of REGIONAL_FIELDS[region]) {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.MINIMAX_API_KEY,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000),
  });

  const data = await response.json();

  // Parse the MiniMax response:
  //   base_resp.status_code == 0  -> success
  //   data.status                 -> 1 = in_progress, 2 = completed
  //   data.audio                  -> the generated audio (url or hex)
  const statusCode = data && data.base_resp ? data.base_resp.status_code : undefined;
  const status = data && data.data ? data.data.status : undefined;
  const audio = data && data.data ? data.data.audio : undefined;

  const success = statusCode === 0;
  const statusText =
    status === 1 ? "in_progress" : status === 2 ? "completed" : "unknown";

  res.status(success ? 200 : 502).json({
    success,
    region,
    model,
    status_code: statusCode,
    status: statusText,
    audio,
    output_formats: OUTPUT_FORMATS,
    audio_formats: AUDIO_FORMATS,
    data,
  });
}

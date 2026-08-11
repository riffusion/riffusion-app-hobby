# Riffusion App

:no_entry: This project is no longer actively maintained.

Riffusion is an app for real-time music generation with stable diffusion.

This repository contains the interactive web app that powers the website.

It is built with Next.js, React, Typescript, three.js, Tailwind, and Vercel.

## Run

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, make sure you have Node v18 or greater installed using `node --version`.

Install packages:

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

The app home is at `pages/index.js`. The page auto-updates as you edit the file. The about page is at `pages/about.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Inference Server

To actually generate model outputs, we need a model backend that responds to inference requests via API. If you have a large GPU that can run stable diffusion in under five seconds, clone and run the instructions in the [inference server](https://github.com/hmartiro/riffusion-inference) to run the Flask app.

You will need to add a `.env.local` file in the root of this repository specifying the URL of the inference server:

```
RIFFUSION_FLASK_URL=http://127.0.0.1:3013/run_inference/
```

## MiniMax Music Generation

Optionally, this app can also generate music through the MiniMax `music_generation` API instead of the Riffusion inference server. The `pages/api/minimax-music.js` route proxies requests to the global (`https://api.minimax.io/v1/music_generation`) or China (`https://api.minimaxi.com/v1/music_generation`) endpoint, supports the `music-3.0`, `music-2.6`, `music-3.0-free`, `music-2.6-free`, `music-cover`, and `music-cover-free` models, forwards the supported request fields (`prompt`, `lyrics`, `stream`, `output_format`, `audio_setting`, `lyrics_optimizer`, `is_instrumental`, `audio_url`, `audio_base64`, `cover_feature_id`), supports the `url`/`hex` output formats and `mp3`/`wav`/`pcm` audio formats, and parses the `base_resp.status_code` success code, `data.status` (`1` = in progress, `2` = completed) and `data.audio` fields from the response.

Add the following to `.env.local`:

```
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_REGION=global_en
```

`MINIMAX_REGION` can be set to `cn_zh` to use the China endpoint, which additionally accepts the `aigc_watermark` field. Unit tests live in `tests/` and can be run with `npm test`.

## Citation

If you build on this work, please cite it as follows:

```
@article{Forsgren_Martiros_2022,
  author = {Forsgren, Seth* and Martiros, Hayk*},
  title = {{Riffusion - Stable diffusion for real-time music generation}},
  url = {https://riffusion.com/about},
  year = {2022}
}
```

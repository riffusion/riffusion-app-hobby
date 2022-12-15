# Riffusion App

Riffusion is an app for real-time music generation with stable diffusion.

Read about it at https://www.riffusion.com/about and try it at https://www.riffusion.com/.

* Web app: https://github.com/hmartiro/riffusion-app
* Inference server: https://github.com/hmartiro/riffusion-inference
* Model checkpoint: https://huggingface.co/riffusion/riffusion-model-v1
* Google Colab notebook: [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1FhH3HlN8Ps_Pr9OR6Qcfbfz7utDvICl0?usp=sharing)


This repository contains the interactive web app that powers the website.

It is built with Next.js, React, Typescript, three.js, Tailwind, and Vercel.

## Run

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Install:

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

This app also has a configuration to run with [Baseten](https://www.baseten.co/) for auto-scaling and load balancing. To use BaseTen, you need an API key.

To configure these backends, add a `.env.local` file:

```
# URL to your flask instance
RIFFUSION_FLASK_URL=http://localhost:3013/run_inference/

# Whether to use baseten as the model backend
NEXT_PUBLIC_RIFFUSION_USE_BASETEN=false

# If using BaseTen, the URL and API key
RIFFUSION_BASETEN_URL=https://app.baseten.co/applications/XXX
RIFFUSION_BASETEN_API_KEY=XXX
```

## Citation

If you build on this work, please cite it as follows:

```
@software{Forsgren_Martiros_2022,
  author = {Forsgren, Seth* and Martiros, Hayk*},
  title = {{Riffusion - Stable diffusion for real-time music generation}},
  url = {https://riffusion.com/about},
  year = {2022}
}
```

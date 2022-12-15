import Image from "next/image";
import Link from "next/link";

import PageHead from "../components/PageHead";
import CaptionedImage from "../components/about/CaptionedImage";

import { BsInfoCircleFill } from "react-icons/bs";

import handDrawnSpectrogramImg from "../public/about/hand_drawn_spectrogram.png";
import fourierTransformImg from "../public/about/fourier_transform.png";
import img2imgExample from "../public/about/img2img_example.png";
import latentSpaceInterpolation from "../public/about/latent_space_interpolation.png";
import spectrogramLabelImg from "../public/about/spectrogram_label.png";
import webAppScreenshot from "../public/about/web_app_screenshot.png";

import ToApp from "../components/about/ToApp";

export default function Home() {
  return (
    <>
      <PageHead />

      <ToApp />

      <main className="bg-white flex flex-row text-black place-content-center">
        <div className="w-3/4 md:w-2/3 lg:w-1/2 text-lg pb-20">
          <h1 className="pt-16 pb-1 text-4xl font-bold">
            <Link href="/" className="no-underline">
              [ RIFFUSION ]
            </Link>
          </h1>
          <h3 className="font-medium italic text-xl pb-6">
            (noun): riff + diffusion
          </h3>
          <div className="relative rounded-xl bg-layer-2 p-2 pr-8 bg-sky-50">
            <div className="flex items-center space-x-2.5 text-sky-700">
              <BsInfoCircleFill className="h-6 w-6 flex-shrink-0" />
              <div>
                <div className="mt-0.5 text-sm font-semibold">
                  <Link href="/" className="no-underline">
                    Riffusion
                  </Link>{" "}
                  was created by{" "}
                  <a
                    className="no-underline text-slate-800"
                    href="https://sethforsgren.com/"
                  >
                    Seth Forsgren
                  </a>{" "}
                  and{" "}
                  <a
                    className="no-underline text-slate-800"
                    href="https://haykmartiros.com/"
                  >
                    Hayk Martiros
                  </a>{" "}
                  as a hobby project.
                </div>
              </div>
            </div>
          </div>
          <p className="text-blue-600 pb-3"></p>
          <p>
            You've heard of{" "}
            <a href="https://en.wikipedia.org/wiki/Stable_Diffusion">
              Stable Diffusion
            </a>
            , the open-source AI model that generates images from text?
          </p>
          <CaptionedImage
            image_url={"/about/astronaut.gif"}
            caption={"photograph of an astronaut riding a horse"}
          />
          <p>
            Well, we fine-tuned the model to generate images of spectrograms,
            like this:
          </p>
          <CaptionedImage
            image_url={"/about/funky_sax.gif"}
            caption={"funk bassline with a jazzy saxophone solo"}
          />
          <p>
            The magic is that this spectrogram can then be converted to an audio
            clip:
          </p>
          <div className="m-5 ml-16">
            <audio controls src="/about/funky_sax.mp3" className="w-1/2">
              Your browser does not support audio.
            </audio>
          </div>
          <p className="text-4xl mb-2">🔥🔥🔥😱</p>
          <p>
            <b>Really? </b> Yup.
          </p>
          <p className="mt-3">
            This is the v1.5 stable diffusion model with no modifications, just
            fine-tuned on images of spectrograms paired with text. Audio
            processing happens downstream of the model.
          </p>
          <p className="mt-3">
            It can generate infinite variations of a prompt by varying the seed.
            All the same web UIs and techniques like img2img, inpainting,
            negative prompts, and interpolation work out of the box.
          </p>
          <h2 className="pt-10 pb-5 text-3xl font-bold">Spectrograms</h2>
          <p>
            An audio{" "}
            <a href="https://en.wikipedia.org/wiki/Spectrogram">spectrogram</a>{" "}
            is a visual way to represent the frequency content of a sound clip.
            The x-axis represents time, and the y-axis represents frequency. The
            color of each pixel gives the amplitude of the audio at the
            frequency and time given by its row and column.
          </p>
          <Image
            className="ml-8 md:ml-16 m-5 w-3/4 md:w-2/3"
            src={spectrogramLabelImg}
            alt={"spectrogram with axes labeled"}
          />
          <p>
            The spectogram can be computed from audio using the{" "}
            <a href="https://en.wikipedia.org/wiki/Short-time_Fourier_transform">
              Short-time Fourier transform
            </a>{" "}
            (STFT), which approximates the audio as a combination of sine waves
            of varying amplitudes and phases.
          </p>
          <Image
            className="ml-16 md:ml-24 m-5 w-3/4 md:w-1/2"
            src={fourierTransformImg}
            alt={"fourier transform explanation"}
          />
          <p>
            The STFT is invertible, so the original audio can be reconstructed
            from a spectrogram. However, the spectrogram images from our model
            only contain the amplitude of the sine waves and not the phases,
            because the phases are chaotic and hard to learn. Instead, we use
            the{" "}
            <a href="https://ieeexplore.ieee.org/document/1164317">
              Griffin-Lim
            </a>{" "}
            algorithm to approximate the phase when reconstructing the audio
            clip.
          </p>
          <p className="mt-3">
            The frequency bins in our spectrogram use the{" "}
            <a href="https://en.wikipedia.org/wiki/Mel_scale">Mel scale</a>,
            which is a perceptual scale of pitches judged by listeners to be
            equal in distance from one another.
          </p>
          <p className="mt-3">
            Below is a hand-drawn image interpreted as a spectrogram and
            converted to audio. Play it back to get an intuitive sense of how
            they work. Note how you can hear the pitches of the two curves on
            the bottom half, and how the four vertical lines at the top make
            beats similar to a hi-hat sound.
          </p>
          <Image
            className="ml-16 md:ml-24 m-5 w-2/3 md:w-2/5 border-2"
            src={handDrawnSpectrogramImg}
            alt={"hand drawn spectrogram"}
          />
          <div className="m-5 ml-24">
            <audio
              controls
              src="/about/hand_drawn.mp3"
              className="w-2/3 md:w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
          <p>
            We use{" "}
            <a href="https://pytorch.org/audio/stable/transforms.html">
              Torchaudio
            </a>
            , which has excellent modules for efficient audio processing on the
            GPU. Check out our audio processing code{" "}
            <a href="https://github.com/hmartiro/riffusion-inference/blob/main/riffusion/audio.py">
              here
            </a>
            .
          </p>
          <h2 className="pt-10 pb-5 text-3xl font-bold">Image-to-Image</h2>
          <p>
            With diffusion models, it is possible to condition their creations
            not only on a text prompt but also on other images. This is
            incredibly useful for modifying sounds while preserving the
            structure of the an original clip you like. You can control how much
            to deviate from the original clip and towards a new prompt using the
            denoising strength parameter.
          </p>
          <p className="mt-3">
            For example, here is that funky sax riff again, followed by a
            modification to crank up the piano:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <CaptionedImage
                image_url={"/about/funky_sax.png"}
                caption={"funk bassline with a jazzy saxophone solo"}
                marginLeft={5}
              />

              <div className="m-4">
                <audio controls src="/about/funky_sax.mp3">
                  Your browser does not support audio.
                </audio>
              </div>
            </div>
            <div className="text-red text-xl">
              <CaptionedImage
                image_url={"/about/funky_sax_to_piano.png"}
                caption={"piano funk"}
                marginLeft={5}
              />

              <div className="m-4">
                <audio controls src="/about/funky_sax_to_piano.mp3">
                  Your browser does not support audio.
                </audio>
              </div>
            </div>
          </div>
          <p>
            The next example adapts a rock and roll solo to an acoustic folk
            fiddle:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <CaptionedImage
                image_url={"/about/rock_and_roll_electric_guitar_solo.png"}
                caption={"rock and roll electric guitar solo"}
                marginLeft={5}
              />

              <div className="m-4">
                <audio
                  controls
                  src="/about/rock_and_roll_electric_guitar_solo.mp3"
                >
                  Your browser does not support audio.
                </audio>
              </div>
            </div>
            <div className="text-red text-xl">
              <CaptionedImage
                image_url={"/about/acoustic_folk_fiddle_solo.png"}
                caption={"acoustic folk fiddle solo"}
                marginLeft={5}
              />

              <div className="m-4">
                <audio controls src="/about/acoustic_folk_fiddle_solo.mp3">
                  Your browser does not support audio.
                </audio>
              </div>
            </div>
          </div>
          <h2 className="pt-10 pb-5 text-3xl font-bold">
            Looping and Interpolation
          </h2>
          <p>
            Generating short clips is a blast, but we really wanted infinite
            AI-generated jams.
          </p>
          <p className="mt-3">
            Let's say we put in a prompt and generate 100 clips with varying
            seeds. We can't concatenate the resulting clips because they differ
            in key, tempo, and downbeat.
          </p>
          <p className="mt-3">
            Our strategy is to pick one initial image and generate variations of
            it by running image-to-image generation with different seeds and
            prompts. This preserves the key properties of the clips. To make
            them loop-able, we also create initial images that are an exact
            number of measures.
          </p>
          <Image
            className="ml-4 md:ml-8 m-5 w-5/6 md:w-4/5"
            src={img2imgExample}
            alt={"img2img generation example"}
          />
          <p className="mt-3">
            However, even with this approach it's still too abrupt to transition
            between clips. Multiple interpretations of the same prompt with the
            same overall structure can still vary greatly in their vibe and
            melodic motifs.
          </p>
          <p className="mt-3">
            To address this, we smoothly interpolate between prompts and seeds
            <em> in the latent space of the model</em>. In diffusion models, the{" "}
            <a href="https://github.com/hmartiro/riffusion-inference/blob/main/riffusion/audio.py">
              latent space
            </a>{" "}
            is a feature vector that embeds the entire possible space of what
            the model can generate. Items which resemble each other are close in
            the latent space, and every numerical value of the latent space
            decodes to a viable output.
          </p>
          <p className="mt-3">
            The key is that it's possible to sample the latent space between a
            prompt with two different seeds, or two different prompts with the
            same seed. Here is an example with the visual model:
          </p>
          <CaptionedImage
            image_url={"/about/happy_cows_interpolation.gif"}
            caption={""}
          />
          <p className="mt-3">
            We can do the same thing with our model, which often produces
            buttery smooth transitions, even between starkly different prompts.
            This is much more interesting than interpolating the raw audio,
            because in the latent space all in-between points still sound like
            plausible clips. The figure below is colorized to show the latent
            space interpolation between two seeds of the same prompt. Playing
            this sequence is much smoother than just playing the two endpoints.
            The interpolated clips are often diverse and have their own riffs
            and motifs come and go.
          </p>
          <Image
            className="ml-2 md:ml-4 m-5 w-11/12"
            src={latentSpaceInterpolation}
            alt={"Latent space interpolation example"}
          />
          {/* TODO(hayk): Move one of these examples to the bottom. */}
          <p className="mt-3">
            Here is one of our favorites, a beautiful 20-step interpolation from
            <b> typing </b> to <b>jazz</b>:
          </p>
          <div className="m-5 ml-16">
            <audio controls src="/about/typing_to_jazz.mp3" className="w-1/2">
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            And another one from <b>church bells </b> to <b>electronic beats</b>
            :
          </p>
          <div className="m-5 ml-16">
            <audio
              controls
              src="/about/church_bells_to_electronic_beats.mp3"
              className="w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            Interpolation of <b>arabic gospel</b>, this time with the same
            prompt between two seeds:
          </p>
          <div className="m-5 ml-16">
            <audio controls src="/about/arabic_gospel.mp3" className="w-1/2">
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            The huggingface{" "}
            <a href="https://github.com/huggingface/diffusers">diffusers</a>{" "}
            library implements a wide range of pipelines including
            image-to-image and prompt interpolation, but we needed an
            implementation for interpolation combined with image-to-image
            conditioning. We implemented this pipeline, along with support for
            masking to limit generation to only parts of an image. Code{" "}
            <a href="https://github.com/hmartiro/riffusion-inference/blob/main/riffusion/riffusion_pipeline.py">
              here
            </a>
            .
          </p>
          <h2 className="pt-10 pb-5 text-3xl font-bold">Interactive Web App</h2>
          <p>
            To put it all together, we made an interactive web app to type in
            prompts and infinitely generate interpolated content in real time,
            while visualizing the spectrogram timeline in 3D.
          </p>
          <p className="mt-3">
            As the user types in new prompts, the audio smoothly transitions to
            the new prompt. If there is no new prompt, the app will interpolate
            between different seeds of the same prompt. Spectrograms are
            visualized as 3D height maps along a timeline with a translucent
            playhead.
          </p>
          <Image
            className="ml-8 md:ml-16 m-5 w-3/4 md:w-2/3"
            src={webAppScreenshot}
            alt={"web app screenshot"}
          />
          <p className="mt-3">
            The app is built using <a href="https://nextjs.org/">Next.js</a>,{" "}
            <a href="https://reactjs.org/">React</a>,{" "}
            <a href="https://www.typescriptlang.org/">Typescript</a>,{" "}
            <a href="https://threejs.org/">three.js</a>,{" "}
            <a href="https://tailwindcss.com/">Tailwind</a>, and{" "}
            <a href="https://vercel.com/">Vercel</a>.
          </p>
          <p className="mt-3">
            The app communicates over an API to run the inference calls on a GPU
            server. We used <a href="https://truss.baseten.co">Truss</a> to
            package the model and test it locally before deploying it to Baseten
            which provided GPU-backed inference, auto-scaling, and
            observability. We used NVIDIA A10Gs in production.
          </p>
          <p className="mt-3">
            If you have a GPU powerful enough to generate stable diffusion
            results in under five seconds, you can run the experience locally
            using our test flask server.
          </p>
          <h2 className="pt-10 pb-5 text-3xl font-bold">Code</h2>
          <ul className="mt-3 ml-10 list-disc">
            <li>
              Web app:{" "}
              <a href="https://github.com/hmartiro/riffusion-app">
                https://github.com/hmartiro/
                riffusion-app
              </a>
            </li>
            <li>
              Inference server:{" "}
              <a href="https://github.com/hmartiro/riffusion-inference">
                https://github.com/hmartiro/
                riffusion-inference
              </a>
            </li>
            <li>
              Model checkpoint:{" "}
              <a href="https://huggingface.co/riffusion/riffusion-model-v1">
                https://huggingface.co/
                riffusion/riffusion-model-v1
              </a>
            </li>
          </ul>

          <h2 className="pt-10 pb-5 text-3xl font-bold">Prompt Guide</h2>
          <p className="mb-2">
            Like other diffusion models, the quality of the results depends on
            the prompt and other settings. This section provides some tips for
            getting good results.
          </p>
          <p className="mb-2">
            <b>Seed image</b> - The app does image-to-image conditioning, and
            the seed image used for conditioning locks in the BPM and overall
            vibe of the prompt. There can still be a large amount of diversity
            with a given seed image, but the effect is present. In the app
            settings, you can change the seed image to explore this effect.
          </p>
          <p className="mb-2">
            <b>Denoising</b> - The higher the denoising, the more creative the
            results but the less they will resemble the seed image. The default
            denoising is 0.75, which does a good job of keeping on beat for most
            prompts. The settings allow raising the denoising, which is often
            fun but can quickly result in chaotic transitions and tempos.
          </p>
          <p className="mb-2">
            <b>Prompt</b> - When providing prompts, get creative! Try your
            favorite artists, instruments like saxophone or violin, modifiers
            like arabic or jamaican, genres like jazz or rock, sounds like
            church bells or rain, or any combination. Many words that are not
            present in the training data still work because the text encoder can
            associate words with similar semantics. The closer a prompt is in
            spirit to the seed image And BPM, the better the results. For
            example, a prompt for a genre that is much faster BPM than the seed
            image will result in poor, generic audio.
          </p>
          <p className="mb-2">
            <b>Prompt Reweighting</b> - We have support for providing weights for tokens in
            a prompt, to emphasize certain words more than others. An example syntax to boost
            a word is (vocals:1.2), which applies a 1.2x multiplier. The shorthand (vocals) is
            supported for a 1.1x boost or [vocals] for a 1.1x reduction.
          </p>
          <p className="mb-2">
            Parameters can also be specified via URL, for example:
            <br />
            <br />
            <a href="https://www.riffusion.com/?&prompt=rainy+day&denoising=0.85&seedImageId=og_beat">
              https://www.riffusion.com/?
              &prompt=rainy+day&
              denoising=0.85&
              seedImageId=og_beat
            </a>
          </p>
          <h2 className="pt-10 pb-5 text-3xl font-bold">Samples</h2>
          <p>Some of our favorite prompts and results.</p>
          <CaptionedImage
            image_url={"/about/mambo_but_from_jamaica.png"}
            caption={"Mambo but from Jamaica"}
            marginLeft={5}
          />
          <div className="m-5 ml-16">
            <audio
              controls
              src="/about/mambo_but_from_jamaica.mp3"
              className="w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            <b>Sunrise DJ Set</b> to <b>hard synth solo</b>:
          </p>
          <div className="m-5 ml-16">
            <audio
              controls
              src="/about/sunrise_dj_set_to_hard_synth.mp3"
              className="w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            <b>Detroit Rap</b> to <b>Jazz</b>:
          </p>
          <div className="m-5 ml-16">
            <audio
              controls
              src="/about/detroit_rap_to_jazz_denoising_0_6_seed_50.mp3"
              className="w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            <b>Cenematic New York City in a Dust Storm</b> to <b>Golden hour vibes</b>:
          </p>
          <div className="m-5 ml-16">
            <audio
              controls
              src="/about/newyourkduststorm_goldenhourmountain.mp3"
              className="w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            <b>Techno beat</b> to <b>Jamaican rap</b>:
          </p>
          <div className="m-5 ml-16">
            <audio
              controls
              src="/about/techno_to_jamaican_rap.mp3"
              className="w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
          <p className="mt-3">
            <b>Fantasy ballad, female voice</b> to <b>teen boy pop star</b>:
          </p>
          <div className="m-5 ml-16">
            <audio
              controls
              src="/about/fantasy_ballad_to_teen_boy_pop_star.mp3"
              className="w-1/2"
            >
              Your browser does not support audio.
            </audio>
          </div>
        </div>
      </main>
    </>
  );
}

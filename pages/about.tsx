import Image from "next/image";

import PageHead from "../components/PageHead";
import CaptionedImage from "../components/about/CaptionedImage";

import handDrawnSpectrogramImg from "../public/about/hand_drawn_spectrogram.png";
import fourierTransformImg from "../public/about/fourier_transform.png";
import spectrogramLabelImg from "../public/about/spectrogram_label.png";

export default function Home() {
  return (
    <>
      <PageHead />

      <main className="bg-white flex flex-row text-black place-content-center">
        <div className="w-3/4 md:w-2/3 lg:w-1/2 text-lg">
          <h1 className="pt-20 pb-1 text-4xl font-bold">[ RIFFUSION ]</h1>
          <h3 className="font-medium italic text-xl pb-10">
            (noun): riff + diffusion
          </h3>
          <p>
            You’ve heard of{" "}
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
            The magic is that this spectrogram can then be converted to audio:
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
            fine-tuned on images of spectrograms. Audio processing happens
            downstream of the model.
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
            className="ml-16 m-5 w-2/3"
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
            className="ml-24 m-5 w-1/2"
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
            className="ml-20 m-5"
            src={handDrawnSpectrogramImg}
            width={300}
            alt={"hand drawn spectrogram"}
          />
          <div className="m-5 ml-16">
            <audio controls src="/about/hand_drawn.mp3" className="w-1/2">
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
            structure of the an original clip you like. You can control how 
            much to deviate from the original clip and towards a new prompt 
            using the denoising strength parameter.
          </p>
          <p className="mt-3">
            For example, here is a modification of that funky sax solo to crank
            up the piano:
          </p>
          <div className="grid grid-cols-2 gap-3">
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
            And here's an example that adapts a rock and roll solo to an
            acoustic folk fiddle:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CaptionedImage
                image_url={"/about/rock_and_roll_electric_guitar_solo.png"}
                caption={"rock and roll electric guitar solo"}
                marginLeft={5}
              />

              <div className="m-4">
                <audio controls src="/about/rock_and_roll_electric_guitar_solo.mp3">
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
          <h2 className="pt-10 pb-5 text-3xl font-bold">Looping and Interpolation</h2>
          <p>
            Generating short clips is a blast, but we really wanted infinite AI-generated jams.
          </p>
          <p className="mt-3">
            Let's say we put in a prompt and generate 100 clips with varying seeds. 
            We can't concatenate the resulting clips because they differ in key, 
            tempo, and downbeat.          
          </p>
          <p className="mt-3">
            Our strategy is to pick one initial image and generate variations of it 
            by running image-to-image generation with different seeds and prompts. 
            This preserves the key properties of the clips. To make them loop-able, 
            we also create initial images that are an exact number of measures.          
          </p>
          <p className="mt-3">
            However, even with this approach it's still too abrupt to transition 
            between clips. Multiple interpretations of the same prompt with the 
            same overall structure can still vary greatly in their vibe and melodic
            motifs.
          </p>
          <p className="mt-3">
            To address this, we smoothly 
            <em> interpolate between prompts and seeds in the {" "} 
            <a href="https://github.com/hmartiro/riffusion-inference/blob/main/riffusion/audio.py">
              latent space 
            </a> {" "}
            of the model
            </em>. In diffusion models, the latent space is a feature vector 
            that embeds the entire possible space of what the model can generate. 
            Items which resemble each other are close in the latent space, and every 
            numerical value of the latent space decodes to a viable output.
          </p>
          <p className="mt-3">
            The key is that we can continuously sample the latent space between a 
            prompt with two different seeds, or two different prompts with the same 
            seed. Here is an example with the visual model:
          </p>
          <CaptionedImage
            image_url={"/about/happy_cows_interpolation.gif"}
            caption={"Interpolation between two seeds for the same prompt"}
          />
          <p className="mt-3">
            We can do the same thing with our model, which often results in buttery 
            smooth transitions,  even between starkly different prompts. This is vastly 
            more interesting than interpolating the raw audio, because in the latent 
            space all in-between points still sound like plausible clips.
          </p>
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
            And another one from <b>church bells </b> to <b>electronic beats</b>:
          </p>
          <div className="m-5 ml-16">
            <audio controls src="/about/church_bells_to_electronic_beats.mp3" className="w-1/2">
              Your browser does not support audio.
            </audio>
          </div>
        </div>
      </main>
    </>
  );
}

export interface PromptInput {
    prompt: string;
    seed?: number;
    denoising?: number;
    guidance?: number;
}

export interface InferenceInput {
    alpha: number;
    num_inference_steps?: number;
    seed_image_id?: number;
    mask_image_id?: string;

    start: PromptInput;
    end: PromptInput;
}

export interface InferenceResult {
    input: InferenceInput;

    counter: number;

    // URL of the image
    image: string;

    // URL of the audio
    audio: string;
}

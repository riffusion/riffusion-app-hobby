export interface PromptInput {
    prompt: string;
    seed?: number;
    denoising?: number;
    guidance?: number;

    // promptsInput is assigned a transitionCounter equal to the result.counter upon first being played
    transitionCounter?: number;
}

export interface InferenceInput {
    alpha: number;
    num_inference_steps?: number;
    seed_image_id?: string;
    mask_image_id?: string;

    start: PromptInput;
    end: PromptInput;
}

export interface InferenceResult {
    input: InferenceInput;

    counter: number;

    // Binary played status (true = played or playing, false = not played)
    played: boolean;

    // URL of the image
    image: string;

    // URL of the audio
    audio: string;

    // Duration of the audio in seconds
    duration_s: number;
}

// High-level state of the interactive app
export enum AppState {
    UNINITIALIZED = "UNINITIALIZED",
    SAME_PROMPT = "SAME_PROMPT",
    TRANSITION = "TRANSITION",
}

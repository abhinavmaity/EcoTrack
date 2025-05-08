'use server';

import { generateEcoRecommendations, type GenerateEcoRecommendationsInput, type GenerateEcoRecommendationsOutput } from '@/ai/flows/generate-eco-recommendations';

interface ActionResult {
  success: boolean;
  data?: GenerateEcoRecommendationsOutput;
  error?: string;
  submittedInput?: GenerateEcoRecommendationsInput;
}

export async function handleUtilitySubmission(input: GenerateEcoRecommendationsInput): Promise<ActionResult> {
  try {
    const recommendationsOutput = await generateEcoRecommendations(input);
    return { success: true, data: recommendationsOutput, submittedInput: input };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred', submittedInput: input };
  }
}

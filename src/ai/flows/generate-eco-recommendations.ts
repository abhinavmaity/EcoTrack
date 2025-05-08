// src/ai/flows/generate-eco-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized recommendations to reduce utility consumption.
 *
 * - generateEcoRecommendations - A function that takes utility usage data and returns tailored recommendations.
 * - GenerateEcoRecommendationsInput - The input type for the generateEcoRecommendations function.
 * - GenerateEcoRecommendationsOutput - The return type for the generateEcoRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEcoRecommendationsInputSchema = z.object({
  electricityUsageKWh: z.number().describe('Daily electricity usage in kWh.'),
  waterConsumptionLiters: z.number().describe('Daily water consumption in liters.'),
  gasUsageCubicMeters: z.number().describe('Daily gas usage in cubic meters.'),
});
export type GenerateEcoRecommendationsInput = z.infer<typeof GenerateEcoRecommendationsInputSchema>;

const ConsumptionCategorySchema = z.enum(['electricity', 'water', 'gas']);

const getBestPractices = ai.defineTool(
  {
    name: 'getBestPractices',
    description: 'Retrieves best practices for reducing consumption of a specific utility.',
    inputSchema: z.object({
      utilityType: ConsumptionCategorySchema.describe('The type of utility (electricity, water, or gas) for which to retrieve best practices.'),
    }),
    outputSchema: z.string().describe('A list of best practices for reducing consumption of the specified utility.'),
  },
  async function (input) {
    // This can call any typescript function.
    // For now return a hardcoded list. In the future this could call a real datastore.
    switch (input.utilityType) {
      case 'electricity':
        return `
        1. Switch off lights when leaving a room.
        2. Use energy-efficient appliances.
        3. Unplug electronics when not in use.
        `;
      case 'water':
        return `
        1. Take shorter showers.
        2. Fix leaky faucets.
        3. Water your lawn less frequently.
        `;
      case 'gas':
        return `
        1. Lower your thermostat.
        2. Insulate your home properly.
        3. Use gas-efficient appliances.
        `;
      default:
        return 'No best practices found for this utility type.';
    }
  }
);


const GenerateEcoRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('Personalized recommendations to reduce utility consumption.'),
});
export type GenerateEcoRecommendationsOutput = z.infer<typeof GenerateEcoRecommendationsOutputSchema>;

export async function generateEcoRecommendations(
  input: GenerateEcoRecommendationsInput
): Promise<GenerateEcoRecommendationsOutput> {
  return generateEcoRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEcoRecommendationsPrompt',
  input: {schema: GenerateEcoRecommendationsInputSchema},
  output: {schema: GenerateEcoRecommendationsOutputSchema},
  tools: [getBestPractices],
  prompt: `You are an AI assistant that provides personalized recommendations for reducing utility consumption.

  Based on the user's daily utility usage data, provide actionable recommendations to help them lower their bills and be more environmentally conscious.

  Consider the following usage data:
  - Electricity: {{electricityUsageKWh}} kWh
  - Water: {{waterConsumptionLiters}} liters
  - Gas: {{gasUsageCubicMeters}} cubic meters

  Use the getBestPractices tool to get the best practices for each utility type, if relevant.  Do not blindly repeat the output of the getBestPractices tool, but incorporate it into your response.

  For example, if water consumption exceeds 500 liters, suggest taking shorter showers and fixing leaks.

  Return a single string containing the recommendations. Focus on providing practical and easy-to-implement tips.
`,
});

const generateEcoRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateEcoRecommendationsFlow',
    inputSchema: GenerateEcoRecommendationsInputSchema,
    outputSchema: GenerateEcoRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


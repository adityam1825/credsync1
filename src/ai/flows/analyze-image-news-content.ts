'use server';
/**
 * @fileOverview Analyzes image-based news content to classify it as true, fake, or misleading.
 *
 * - analyzeImageNewsContent - A function that handles the image analysis process.
 * - AnalyzeImageNewsContentInput - The input type for the analyzeImageNewsContent function.
 * - AnalyzeImageNewsContentOutput - The return type for the analyzeImageNewsContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageNewsContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of news content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageNewsContentInput = z.infer<typeof AnalyzeImageNewsContentInputSchema>;

const AnalyzeImageNewsContentOutputSchema = z.object({
  classification: z.enum(['true', 'fake', 'misleading']).describe('The classification of the news content.'),
  reasoning: z.string().describe('The reasoning behind the classification.'),
  manipulationSigns: z.string().optional().describe('Signs of manipulation if present.'),
});
export type AnalyzeImageNewsContentOutput = z.infer<typeof AnalyzeImageNewsContentOutputSchema>;

export async function analyzeImageNewsContent(
  input: AnalyzeImageNewsContentInput
): Promise<AnalyzeImageNewsContentOutput> {
  return analyzeImageNewsContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageNewsContentPrompt',
  input: {schema: AnalyzeImageNewsContentInputSchema},
  output: {schema: AnalyzeImageNewsContentOutputSchema},
  prompt: `You are an expert in identifying misinformation in news content.

You will analyze the image provided and determine if the news is true, fake, or misleading.
Explain your reasoning for the classification.

Also, identify any signs of manipulation in the image, such as the use of AI-generated content or other deceptive techniques.

Image: {{media url=photoDataUri}}`,
});

const analyzeImageNewsContentFlow = ai.defineFlow(
  {
    name: 'analyzeImageNewsContentFlow',
    inputSchema: AnalyzeImageNewsContentInputSchema,
    outputSchema: AnalyzeImageNewsContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

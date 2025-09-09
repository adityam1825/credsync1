'use server';
/**
 * @fileOverview Analyzes image-based news content to classify it as true, fake, or misleading, with a focus on deepfake and manipulation detection.
 *
 * - analyzeImageNewsContent - A function that handles the image analysis process.
 * - AnalyzeImageNewsContentInput - The input type for the analyzeImageNewsContent function.
 * - AnalyzeImageNewsContentOutput - The return type for the analyzeImageNewsContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeImageNewsContentOutputSchema } from '@/ai/schema';


const AnalyzeImageNewsContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of news content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageNewsContentInput = z.infer<typeof AnalyzeImageNewsContentInputSchema>;

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
  prompt: `You are an expert in digital image forensics, specializing in detecting AI-generated images, deepfakes, and photo manipulations.

Analyze the provided image using forensic techniques (e.g., checking for pixel inconsistency, noise patterns, unnatural lighting, GAN fingerprints).

1.  **Classify** the image as 'real', 'AI-generated', or 'manipulated'.
2.  Provide a **confidence score** (0-100) for your classification.
3.  Give detailed **reasoning** for your analysis.
4.  If manipulated, identify the **tampered regions** with bounding boxes and a description of what was altered.

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

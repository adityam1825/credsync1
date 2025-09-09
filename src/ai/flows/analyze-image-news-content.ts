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

const AnalyzeImageNewsContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of news content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageNewsContentInput = z.infer<typeof AnalyzeImageNewsContentInputSchema>;

const AnalyzeImageNewsContentOutputSchema = z.object({
  classification: z.enum(['real', 'AI-generated', 'manipulated']).describe('The classification of the image content.'),
  confidenceScore: z.number().min(0).max(100).describe('The confidence score for the classification, from 0 to 100.'),
  reasoning: z.string().describe('The reasoning behind the classification, detailing any detected inconsistencies, artifacts, or forensic evidence.'),
  tamperedRegions: z.array(z.object({
    box: z.array(z.number()).length(4).describe('Bounding box of the tampered region in [x_min, y_min, x_max, y_max] format.'),
    description: z.string().describe('Description of the manipulation in this region.'),
  })).optional().describe('A list of regions identified as potentially tampered with.'),
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

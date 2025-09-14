'use server';
/**
 * @fileOverview Analyzes news content from a URL to classify it as true, fake, or misleading.
 *
 * - analyzeUrlNewsContent - A function that analyzes the URL and returns a classification.
 * - AnalyzeUrlNewsContentInput - The input type for the analyzeUrlNewsContent function.
 * - AnalyzeUrlNewsContentOutput - The return type for the analyzeUrlNewsContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeTextNewsContentOutputSchema } from '@/ai/schema';

const AnalyzeUrlNewsContentInputSchema = z.object({
  url: z
    .string()
    .url()
    .describe('The URL of the news article to be analyzed.'),
});
export type AnalyzeUrlNewsContentInput = z.infer<typeof AnalyzeUrlNewsContentInputSchema>;

export type AnalyzeUrlNewsContentOutput = z.infer<typeof AnalyzeTextNewsContentOutputSchema>;

export async function analyzeUrlNewsContent(input: AnalyzeUrlNewsContentInput): Promise<AnalyzeUrlNewsContentOutput> {
  return analyzeUrlNewsContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUrlNewsContentPrompt',
  input: {schema: AnalyzeUrlNewsContentInputSchema},
  output: {schema: AnalyzeTextNewsContentOutputSchema},
  prompt: `You are an expert in identifying misinformation. First, retrieve the main text content from the provided URL. Then, analyze the extracted news content and classify it as true, fake, or misleading. Provide detailed reasoning for your classification and include verified proof links to support your analysis.\n\nNews URL: {{{url}}}`,
});

const analyzeUrlNewsContentFlow = ai.defineFlow(
  {
    name: 'analyzeUrlNewsContentFlow',
    inputSchema: AnalyzeUrlNewsContentInputSchema,
    outputSchema: AnalyzeTextNewsContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Analysis failed to produce an output.');
    }
    return output;
  }
);

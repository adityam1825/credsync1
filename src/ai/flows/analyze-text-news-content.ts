'use server';
/**
 * @fileOverview Analyzes text-based news content to classify it as true, fake, or misleading.
 *
 * - analyzeTextNewsContent - A function that analyzes the text and returns a classification.
 * - AnalyzeTextNewsContentInput - The input type for the analyzeTextNewsContent function.
 * - AnalyzeTextNewsContentOutput - The return type for the analyzeTextNewsContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextNewsContentInputSchema = z.object({
  text: z
    .string()
    .describe('The text content of the news article to be analyzed.'),
});
export type AnalyzeTextNewsContentInput = z.infer<typeof AnalyzeTextNewsContentInputSchema>;

const AnalyzeTextNewsContentOutputSchema = z.object({
  classification: z
    .enum(['true', 'fake', 'misleading'])
    .describe('The classification of the news content.'),
  reasoning: z.string().describe('The detailed reasoning behind the classification.'),
  proofLinks: z.array(z.string()).describe('Verified proof links to support the classification.'),
});
export type AnalyzeTextNewsContentOutput = z.infer<typeof AnalyzeTextNewsContentOutputSchema>;

export async function analyzeTextNewsContent(input: AnalyzeTextNewsContentInput): Promise<AnalyzeTextNewsContentOutput> {
  return analyzeTextNewsContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextNewsContentPrompt',
  input: {schema: AnalyzeTextNewsContentInputSchema},
  output: {schema: AnalyzeTextNewsContentOutputSchema},
  prompt: `You are an expert in identifying misinformation. Analyze the following news content and classify it as true, fake, or misleading. Provide detailed reasoning for your classification and include verified proof links to support your analysis.\n\nNews Content: {{{text}}}`,
});

const analyzeTextNewsContentFlow = ai.defineFlow(
  {
    name: 'analyzeTextNewsContentFlow',
    inputSchema: AnalyzeTextNewsContentInputSchema,
    outputSchema: AnalyzeTextNewsContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

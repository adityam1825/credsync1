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
import { AnalyzeTextNewsContentOutputSchema } from '@/ai/schema';

const AnalyzeTextNewsContentInputSchema = z.object({
  text: z
    .string()
    .describe('The text content of the news article to be analyzed.'),
});
export type AnalyzeTextNewsContentInput = z.infer<typeof AnalyzeTextNewsContentInputSchema>;

export type AnalyzeTextNewsContentOutput = z.infer<typeof AnalyzeTextNewsContentOutputSchema>;

export async function analyzeTextNewsContent(input: AnalyzeTextNewsContentInput): Promise<AnalyzeTextNewsContentOutput> {
  return analyzeTextNewsContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextNewsContentPrompt',
  input: {schema: AnalyzeTextNewsContentInputSchema},
  output: {schema: AnalyzeTextNewsContentOutputSchema},
  prompt: `You are an expert fact-checker and misinformation specialist. Your task is to analyze the following news content with a critical eye.

Follow these steps for your analysis:
1.  **Identify Core Claims**: First, identify the main factual claims being made in the text.
2.  **Assess Neutrality and Bias**: Analyze the language used. Is it neutral and objective, or does it use emotionally charged, biased, or manipulative language? Note any instances of loaded words or opinions presented as facts.
3.  **Cross-Reference (Simulated)**: Based on your existing knowledge, cross-reference the core claims with information from reputable, independent sources. Mention which sources would be relevant for verification.
4.  **Synthesize and Classify**: Based on the steps above, classify the content as 'true', 'fake', or 'misleading'.
5.  **Provide Detailed Reasoning**: Explain your classification clearly. If 'misleading', explain what makes it so (e.g., cherry-picked facts, lack of context, false dichotomy). If 'fake', point out the falsehoods. If 'true', confirm its alignment with verified facts.
6.  **Find Proof Links**: Provide a list of verified, high-authority proof links that support your analysis.

News Content: {{{text}}}`,
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

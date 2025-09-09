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

const AnalyzeUrlNewsContentInputSchema = z.object({
  url: z
    .string()
    .url()
    .describe('The URL of the news article to be analyzed.'),
});
export type AnalyzeUrlNewsContentInput = z.infer<typeof AnalyzeUrlNewsContentInputSchema>;

// Re-using the output schema from the text analyzer
const AnalyzeUrlNewsContentOutputSchema = z.object({
  classification: z
    .enum(['true', 'fake', 'misleading'])
    .describe('The classification of the news content.'),
  reasoning: z.string().describe('The detailed reasoning behind the classification.'),
  proofLinks: z.array(z.string()).describe('Verified proof links to support the classification.'),
});
export type AnalyzeUrlNewsContentOutput = z.infer<typeof AnalyzeUrlNewsContentOutputSchema>;

export async function analyzeUrlNewsContent(input: AnalyzeUrlNewsContentInput): Promise<AnalyzeUrlNewsContentOutput> {
  return analyzeUrlNewsContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUrlNewsContentPrompt',
  input: {schema: AnalyzeUrlNewsContentInputSchema},
  output: {schema: AnalyzeUrlNewsContentOutputSchema},
  prompt: `You are an expert in identifying misinformation. Fetch the content from the provided URL, analyze the news content and classify it as true, fake, or misleading. Provide detailed reasoning for your classification and include verified proof links to support your analysis.\n\nNews URL: {{{url}}}`,
});

const analyzeUrlNewsContentFlow = ai.defineFlow(
  {
    name: 'analyzeUrlNewsContentFlow',
    inputSchema: AnalyzeUrlNewsContentInputSchema,
    outputSchema: AnalyzeUrlNewsContentOutputSchema,
  },
  async input => {
    // A more robust implementation would fetch the URL content here and pass it to the prompt.
    // For this case, we rely on the model's ability to fetch and process URL content.
    const {output} = await prompt(input);
    return output!;
  }
);

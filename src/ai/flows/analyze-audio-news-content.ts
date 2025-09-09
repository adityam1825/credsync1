'use server';
/**
 * @fileOverview Transcribes audio news content and analyzes it for misinformation.
 *
 * - analyzeAudioNewsContent - A function that handles the audio transcription and analysis process.
 * - AnalyzeAudioNewsContentInput - The input type for the analyzeAudioNewsContent function.
 * - AnalyzeAudioNewsContentOutput - The return type for the analyzeAudioNewsContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeTextNewsContent, type AnalyzeTextNewsContentOutput } from './analyze-text-news-content';
import { AnalyzeTextNewsContentOutputSchema } from '@/ai/schema';

const AnalyzeAudioNewsContentInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio recording of news content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeAudioNewsContentInput = z.infer<typeof AnalyzeAudioNewsContentInputSchema>;

const AnalyzeAudioNewsContentOutputSchema = z.object({
    transcription: z.string().describe('The transcribed text from the audio.'),
    analysis: AnalyzeTextNewsContentOutputSchema.describe('The analysis of the transcribed text.'),
});
export type AnalyzeAudioNewsContentOutput = z.infer<typeof AnalyzeAudioNewsContentOutputSchema>;


export async function analyzeAudioNewsContent(
  input: AnalyzeAudioNewsContentInput
): Promise<AnalyzeAudioNewsContentOutput> {
  return analyzeAudioNewsContentFlow(input);
}

const transcriptionPrompt = ai.definePrompt({
  name: 'transcribeAudioPrompt',
  input: {schema: z.object({ audioDataUri: z.string() })},
  output: {schema: z.object({ transcription: z.string() })},
  prompt: `Transcribe the following audio content. The audio contains a news report.

Audio: {{media url=audioDataUri}}`,
});

const analyzeAudioNewsContentFlow = ai.defineFlow(
  {
    name: 'analyzeAudioNewsContentFlow',
    inputSchema: AnalyzeAudioNewsContentInputSchema,
    outputSchema: AnalyzeAudioNewsContentOutputSchema,
  },
  async input => {
    const { output: transcriptionOutput } = await transcriptionPrompt(input);
    if (!transcriptionOutput?.transcription) {
      throw new Error('Failed to transcribe audio.');
    }

    const analysis: AnalyzeTextNewsContentOutput = await analyzeTextNewsContent({ text: transcriptionOutput.transcription });

    return {
      transcription: transcriptionOutput.transcription,
      analysis: analysis,
    };
  }
);

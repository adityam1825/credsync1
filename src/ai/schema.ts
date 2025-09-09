/**
 * @fileOverview Shared Zod schemas for AI flows.
 */
import { z } from 'zod';

export const AnalyzeTextNewsContentOutputSchema = z.object({
  classification: z
    .enum(['true', 'fake', 'misleading'])
    .describe('The classification of the news content.'),
  reasoning: z.string().describe('The detailed reasoning behind the classification.'),
  proofLinks: z.array(z.string()).describe('Verified proof links to support the classification.'),
});

export const AnalyzeImageNewsContentOutputSchema = z.object({
  classification: z.enum(['real', 'AI-generated', 'manipulated']).describe('The classification of the image content.'),
  confidenceScore: z.number().min(0).max(100).describe('The confidence score for the classification, from 0 to 100.'),
  reasoning: z.string().describe('The reasoning behind the classification, detailing any detected inconsistencies, artifacts, or forensic evidence.'),
  tamperedRegions: z.array(z.object({
    box: z.array(z.number()).length(4).describe('Bounding box of the tampered region in [x_min, y_min, x_max, y_max] format.'),
    description: z.string().describe('Description of the manipulation in this region.'),
  })).optional().describe('A list of regions identified as potentially tampered with.'),
});

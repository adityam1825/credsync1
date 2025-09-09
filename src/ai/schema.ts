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

import { config } from 'dotenv';
config();

// Note: Schemas should be imported before flows.
import '@/ai/schema';

import '@/ai/flows/analyze-text-news-content.ts';
import '@/ai/flows/analyze-image-news-content.ts';
import '@/ai/flows/analyze-url-news-content.ts';
import '@/ai/flows/analyze-audio-news-content.ts';

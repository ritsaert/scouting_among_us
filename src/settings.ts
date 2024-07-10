import { z } from 'zod';
import { readFileSync } from 'node:fs';

export const settingsSchema = z.object({
  frontImage: z.string(),
  font: z.string(),
  attendees: z.number(),
  taskCount: z.number(),
  explaination: z.string()
});

export type Settings = z.infer<typeof settingsSchema>;

export const settings: Settings = settingsSchema.parse(JSON.parse(readFileSync('./data/input/settings.json', 'utf-8')));
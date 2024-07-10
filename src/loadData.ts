import { promises as fs } from "node:fs";

export async function loadData() {
  const data = await fs.readFile('./data/input/tasks.csv', 'utf-8');
  return data
    .split('\n')
    .map((line) => line.trim().split(';'))
    .filter((line) => line.length > 1)
    .map((line) => ({ task: line[0], location: line[1], all: line[2]?.toLowerCase() === 'all', used: 0 }));
}
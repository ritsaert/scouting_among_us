import { generateHueShiftedImages } from './hueShift';
import { generatePdf } from './generatePdf';
import { loadData } from './loadData';
import { settings } from './settings';
import { createAssignments } from './assignment';

async function execute() {
  const tasks = await loadData();
  const attendees = createAssignments(tasks, settings.attendees, settings.taskCount);
  await generateHueShiftedImages(settings.frontImage, 'data/intermediate/user_<id>.png', settings.attendees);
  await generatePdf(attendees, settings.explaination, settings.font);
}

// Usage
execute()
  .then(() => console.log('Process completed'))
  .catch((error) => console.error('Error in main process:', error));



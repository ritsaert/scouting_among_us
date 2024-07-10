import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import type { Task } from './assignment';

type Position = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT';

const rectangle = (w: number, h: number, margin: number, pos: Position) => {
  const x = pos === 'TOP_LEFT' || pos === 'BOTTOM_LEFT' ? 0 : w * 0.5;
  const y = pos === 'TOP_LEFT' || pos === 'TOP_RIGHT' ? 0 : h * 0.5;
  return [x + margin, y + margin, x + w * 0.5 -margin, y + h * 0.5 - margin];
}

const drawImage = (doc: typeof PDFDocument, path: string, rect: number[]) =>
  doc.image(path, rect[0], rect[1], {fit: [rect[2] - rect[0], rect[3] - rect[1]], align: 'center', valign: 'center'});  

export function generatePdf(attendees: Task[][], explaination: string, font: string) {
  const doc = new PDFDocument({
    compress: true,
    info: { Title: 'Sample Document' },
    pdfVersion: '1.7',
    size: 'A4'
  });
  doc.pipe(fs.createWriteStream('./data/result.pdf'));

  const w = doc.page.width;
  const h = doc.page.height;
   
  let i = 0;
  for (const tasks of attendees) {
    if (i) doc.addPage();

    console.log(`Generating page ${i} with tasks:`, tasks.map(task => `${task.task}  ${task.location}`).join(', '));

    // Add an image, constrain it to a given size, and center it vertically and horizontally
    drawImage(doc, `./data/intermediate/user_${i}.png`, rectangle(w, h, 10, 'BOTTOM_LEFT'));
    drawImage(doc, './data/input/map.png', rectangle(w, h, 10, 'TOP_LEFT'));
    drawImage(doc, './data/input/background.png', rectangle(w, h, 10, 'BOTTOM_RIGHT'));
    
    doc.font(font).fontSize(20).text(explaination,  w * 0.5 +  20,  20, { width: w * 0.5 - 40, align: 'justify' }).fillColor('red');
    doc.font(font).fontSize(12).text('Ronde',       w * 0.5 +  30, 140, { width: w * 0.5 - 40, align: 'left' });
    doc.font(font).fontSize(12).text('Taak',        w * 0.5 +  80, 140, { width: w * 0.5 - 40, align: 'left' });
    doc.font(font).fontSize(12).text('Locatie',     w * 0.5 + 160, 140, { width: w * 0.5 - 40, align: 'left' }); 
    
    const emitSquares = (doc: typeof PDFDocument, x: number, y: number) => {
      doc.rect(x,      y + 1, 10, 10).stroke('black');
      doc.rect(x + 13, y + 1, 10, 10).stroke('black');
      doc.rect(x + 26, y + 1, 10, 10).stroke('black');
    }

    let j = 0;
    doc.fillColor('black');
    for (const task of tasks) {
      emitSquares(doc, w * 0.5 +  30, 170 + 30 * j);
      doc.font(font).fontSize(12).text(task.task,     w * 0.5 +  80, 170 + 30 * j, { width: w * 0.5 - 40, align: 'left' });
      doc.font(font).fontSize(12).text(task.location, w * 0.5 + 160, 170 + 30 * j, { width: w * 0.5 - 40, align: 'left' });
      j++;
    }
    i++;
  }    
  doc.end();    
}
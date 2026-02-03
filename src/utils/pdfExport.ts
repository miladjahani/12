import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pad, Terrain, calculatePadResults } from './heapCalculations';

export const generatePDF = (pad: Pad, terrain: Terrain, allPads: Pad[], screenshot: string) => {
  const results = calculatePadResults(pad, terrain, allPads);
  const doc = new jsPDF('p', 'mm', 'a4');

  // Title
  doc.setFontSize(22);
  doc.setTextColor(43, 82, 120); // Telegram Blue
  doc.text('Heap Master Pro - Design Report', 105, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Pad: ${pad.name} (Lift ${pad.lift})`, 20, 35);

  // 3D Scene Capture
  if (screenshot) {
    doc.addImage(screenshot, 'PNG', 20, 45, 170, 100);
  }

  // Summary Table
  const summaryData = [
    ['Volume (Prismoidal)', `${results.vol.toLocaleString()} m3`],
    ['Total Mass', `${results.mass.toLocaleString()} Tons`],
    ['Recoverable Copper', `${results.cu.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tons`],
    ['Acid Consumption', `${results.acid.toLocaleString()} Tons`],
    ['Total Flow Rate', `${results.flowRate.toLocaleString(undefined, { minimumFractionDigits: 2 })} m3/hr`],
  ];

  autoTable(doc, {
    startY: 155,
    head: [['Parameter', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [43, 82, 120] }
  });

  // Technical Details
  const techData = [
    ['Dimensions (L x W x H)', `${pad.L} x ${pad.W} x ${pad.H} m`],
    ['Base Area', `${results.baseArea.toLocaleString()} m2`],
    ['Top Area', `${results.topArea.toLocaleString()} m2`],
    ['Top Dimensions', `${results.topL.toFixed(2)} x ${results.topW.toFixed(2)} m`],
    ['Slope Angle', `${pad.slopeDeg} degrees`],
    ['Grade / Recovery', `${pad.grade}% / ${pad.rec}%`],
    ['Material Density', `${pad.dens} t/m3`],
  ];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Technical Detail', 'Value']],
    body: techData,
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94] }
  });

  // Irrigation
  const irrData = [
    ['Emitter Count', `${results.emitCount.toLocaleString()} units`],
    ['Irrigation Rate', `${pad.irrRate} mL/min`],
    ['Lateral Spacing', `${pad.lat} cm`],
    ['Emitter Spacing', `${pad.emit} cm`],
    ['Total Pipe Length', `${results.pipeLen.toFixed(2)} m`],
  ];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Irrigation System', 'Value']],
    body: irrData,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] }
  });

  doc.save(`HeapMaster_${pad.name}.pdf`);
};

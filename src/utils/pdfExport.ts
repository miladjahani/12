import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Pad, CalculationResults } from './types';

// Extend jsPDF with the autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (
  pad: Pad,
  results: CalculationResults,
  canvasDataURL: string
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40);
  doc.text('Heap Master Pro - Pad Report', 14, 22);
  doc.setFontSize(16);
  doc.text(`Report for: ${pad.name}`, 14, 32);
  doc.setDrawColor(0, 80, 200);
  doc.line(14, 34, 196, 34);

  // 3D Image
  doc.addImage(canvasDataURL, 'PNG', 14, 40, 180, 100);

  // Results Table
  const tableData = [
    // Key Metrics
    ['Recoverable Copper', results.cu.toFixed(2), 'tons'],
    ['Fill Volume', results.vol.toLocaleString(), 'm³'],
    ['Acid Consumption', (results.mass * 15 / 1000).toFixed(2), 'tons'],
    ['Total Mass', results.mass.toLocaleString(), 'tons'],
    // Geometry
    ['Base Area', results.baseArea.toLocaleString(), 'm²'],
    ['Top Area', results.topArea.toLocaleString(), 'm²'],
    ['Top Dimensions (L x W)', `${results.topL.toFixed(2)} x ${results.topW.toFixed(2)}`, 'm'],
    // Corner Heights
    ['Corner Height (BL)', results.hBL.toFixed(2), 'm'],
    ['Corner Height (BR)', results.hBR.toFixed(2), 'm'],
    ['Corner Height (FL)', results.hFL.toFixed(2), 'm'],
    ['Corner Height (FR)', results.hFR.toFixed(2), 'm'],
    // Irrigation
    ['Irrigation Flow', results.flow.toFixed(2), 'm³/hr'],
    ['Total Emitters', results.emitCount.toLocaleString(), ''],
  ];

  doc.autoTable({
    startY: 150,
    head: [['Parameter', 'Value', 'Unit']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 196, doc.internal.pageSize.height - 10, { align: 'right' });
  }


  doc.save(`${pad.name}_Report.pdf`);
};
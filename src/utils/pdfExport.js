import jsPDF from 'jspdf';
import 'jspdf-autotable';

const captureCanvasAsImage = () => {
    const canvas = document.querySelector('#canvas-wrapper canvas');
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
};

export const exportToPDF = (pad, stats) => {
    const doc = new jsPDF();
    const canvasImage = captureCanvasAsImage();

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Heap Master Pro Report', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`Pad Report: ${pad.name}`, 105, 30, { align: 'center' });

    // Canvas Image
    if (canvasImage) {
        doc.addImage(canvasImage, 'PNG', 15, 40, 180, 100);
    }

    // Summary Table
    doc.autoTable({
        startY: 150,
        head: [['Parameter', 'Value']],
        body: [
            ['Recoverable Copper', `${stats.cu.toFixed(2)} tons`],
            ['Fill Volume', `${Math.round(stats.vol).toLocaleString()} m³`],
            ['Acid Consumption', `${Math.round(stats.acid).toLocaleString()} tons`],
            ['Total Irrigation Flow', `${stats.flow_m3_hr.toFixed(2)} m³/hr`],
        ],
    });

    // Detailed Specs
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Specification', 'Value']],
        body: [
            ['Total Ore Mass', `${Math.round(stats.mass).toLocaleString()} tons`],
            ['Base Area', `${Math.round(stats.baseArea).toLocaleString()} m²`],
            ['Top Area', `${Math.round(stats.topArea).toLocaleString()} m²`],
            ['Top Dimensions', `${stats.topL.toFixed(2)}m x ${stats.topW.toFixed(2)}m`],
            ['Number of Emitters', `${Math.round(stats.emitCount).toLocaleString()}`],
        ],
    });

    doc.save(`HeapMasterPro_Report_${pad.name}.pdf`);
};

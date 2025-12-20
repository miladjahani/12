import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const exportToPdf = async (canvasElement, stats, pad) => {
    if (!canvasElement || !stats || !pad) {
        console.error("Missing data for PDF export");
        return;
    }

    try {
        // 1. Capture the 3D canvas
        const canvasImage = await html2canvas(canvasElement, {
            useCORS: true,
            backgroundColor: '#111827', // Match the 3D view background
        });
        const imgData = canvasImage.toDataURL('image/png');

        // 2. Create a new PDF document
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // 3. Add Content
        const margin = 15;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pageWidth - margin * 2;
        let yPos = margin;

        // Title
        pdf.setFontSize(22);
        pdf.setTextColor(40, 40, 40);
        pdf.text(`Heap Leach Pad Report: ${pad.name}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // 3D Render Image
        pdf.setFontSize(14);
        pdf.setTextColor(80, 80, 80);
        pdf.text('3D Visualization', margin, yPos);
        yPos += 8;
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', margin, yPos, contentWidth, imgHeight);
        yPos += imgHeight + 15;

        // Key Metrics Table
        pdf.text('Summary of Key Metrics', margin, yPos);

        const tableData = [
            ['Recoverable Copper', `${stats.cu.toFixed(2)} tons`],
            ['Total Fill Volume', `${Math.round(stats.vol).toLocaleString()} m³`],
            ['Total Ore Mass', `${Math.round(stats.mass).toLocaleString()} tons`],
            ['Required Acid', `${Math.round(stats.acid).toLocaleString()} tons`],
            ['Top Surface Area', `${Math.round(stats.topArea).toLocaleString()} m²`],
            ['Irrigation Flow Rate', `${stats.flow_m3_hr.toFixed(2)} m³/hr`],
        ];

        pdf.autoTable({
            startY: yPos + 8,
            head: [['Metric', 'Value']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }, // --primary color
            margin: { left: margin, right: margin }
        });

        // 4. Save the PDF
        pdf.save(`Heap-Master-Report-${pad.name.replace(/ /g, '_')}.pdf`);

    } catch (error) {
        console.error("Failed to generate PDF:", error);
    }
};

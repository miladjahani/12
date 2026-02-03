import json
import sys
from fpdf import FPDF

class HeapReport(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 20)
        self.set_text_color(43, 82, 120)
        self.cell(0, 10, 'Heap Master Pro - Professional Report', ln=True, align='C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def generate_report(data):
    pdf = HeapReport()
    pdf.add_page()

    pad = data.get('pad', {})
    results = data.get('results', {})

    # Pad Overview
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, f"Pad: {pad.get('name')} (Lift {pad.get('lift')})", ln=True)
    pdf.ln(5)

    # Key Results
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_fill_color(240, 240, 240)
    pdf.cell(95, 10, 'Parameter', border=1, fill=True)
    pdf.cell(95, 10, 'Value', border=1, fill=True, ln=True)

    pdf.set_font('helvetica', '', 12)
    results_list = [
        ('Volume', f"{results.get('vol', 0):,.0f} m3"),
        ('Mass', f"{results.get('mass', 0):,.0f} Tons"),
        ('Copper', f"{results.get('cu', 0):,.2f} Tons"),
        ('Acid Consumption', f"{results.get('acid', 0):,.0f} Tons"),
        ('Irrigation Flow', f"{results.get('flowRate', 0):,.2f} m3/hr")
    ]

    for label, val in results_list:
        pdf.cell(95, 10, label, border=1)
        pdf.cell(95, 10, val, border=1, ln=True)

    pdf.ln(10)

    # Technical Specs
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, 'Technical Specifications', ln=True)
    pdf.set_font('helvetica', '', 11)

    specs = [
        f"Dimensions: {pad.get('L')}m x {pad.get('W')}m x {pad.get('H')}m",
        f"Slope Angle: {pad.get('slopeDeg')} degrees",
        f"Density: {pad.get('dens')} t/m3",
        f"Grade: {pad.get('grade')}%",
        f"Recovery: {pad.get('rec')}%",
        f"Irrigation Rate: {pad.get('irrRate')} mL/min",
        f"Emitter Spacing: {pad.get('emit')} cm",
        f"Lateral Spacing: {pad.get('lat')} cm"
    ]

    for spec in specs:
        pdf.cell(0, 8, f"- {spec}", ln=True)

    filename = f"Report_{pad.get('id', 'pad')}.pdf"
    pdf.output(filename)
    print(f"Report generated: {filename}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            data = json.load(f)
        generate_report(data)
    else:
        print("Please provide a JSON data file path.")

import json
from fpdf import FPDF
import sys
import os

class HeapReport(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.cell(0, 10, 'Heap Master Pro - Technical Report', border=True, ln=1, align='C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_report(data_json):
    data = json.loads(data_json)
    pad = data['pad']
    stats = data['stats']

    pdf = HeapReport()
    pdf.add_page()

    # Pad Information
    pdf.set_font('helvetica', 'B', 12)
    pdf.cell(0, 10, f"Pad Details: {pad['name']}", ln=1)

    pdf.set_font('helvetica', '', 10)
    pdf.cell(0, 8, f"Dimensions: {pad['L']}m x {pad['W']}m x {pad['H']}m", ln=1)
    pdf.cell(0, 8, f"Position: X={pad['x']}, Z={pad['z']} | Lift: {pad['lift']}", ln=1)
    pdf.cell(0, 8, f"Slope: {pad['slopeDeg']} degrees", ln=1)

    pdf.ln(5)

    # Results
    pdf.set_font('helvetica', 'B', 12)
    pdf.cell(0, 10, "Calculated Results", ln=1)

    pdf.set_font('helvetica', '', 10)
    results = [
        ("Total Ore Mass", f"{stats['mass']:,.0f} tons"),
        ("Volume (Prismoidal)", f"{stats['vol']:,.0f} m3"),
        ("Recoverable Copper", f"{stats['cu']:,.2f} tons"),
        ("Estimated Acid Consumption", f"{stats['acid']:,.0f} tons"),
        ("Total Irrigation Flow", f"{stats['flow_m3_hr']:,.2f} m3/hr"),
        ("Emitter Count", f"{stats['emitCount']:,} units"),
        ("Total Piping Length", f"{stats['pipeLen']:,.0f} meters")
    ]

    for label, val in results:
        pdf.cell(100, 8, label, border=1)
        pdf.cell(0, 8, val, border=1, ln=1)

    pdf.ln(10)
    pdf.set_font('helvetica', 'I', 8)
    pdf.multi_cell(0, 5, "Note: This report was generated automatically by Heap Master Pro. Calculations are based on the Prismoidal formula and provided metallurgical parameters.")

    output_path = f"report_{pad['id']}.pdf"
    pdf.output(output_path)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            json_data = f.read()
        out = generate_report(json_data)
        print(f"Report generated: {out}")
    else:
        print("Usage: python report_generator.py <data.json>")

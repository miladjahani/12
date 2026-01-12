import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Pad } from '../types';
import { calculatePadResults } from '../utils/calculations';

// Register Vazirmatn font
Font.register({
  family: 'Vazirmatn',
  src: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.0.0/fonts/misc/Vazirmatn-Regular.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Vazirmatn',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a2b3c',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#bdc3c7',
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#ecf0f1',
    padding: 8,
    textAlign: 'right',
  },
  tableColValue: {
    width: "60%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    textAlign: 'right',
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 11,
  }
});

interface PdfReportProps {
  pad: Pad;
  results: ReturnType<typeof calculatePadResults>;
  screenshot: string | null;
}

const PdfReport = ({ pad, results, screenshot }: PdfReportProps) => (
  <Document>
    <Page size="A4" style={styles.page} direction="rtl">
      <Text style={styles.title}>گزارش محاسبات - {pad.name}</Text>

      {/* --- Main Results --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>خلاصه نتایج کلیدی</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.recoverableCu.toFixed(2)} تن</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>مس قابل استحصال</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.volume.toFixed(0)} متر مکعب</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>حجم خاک‌ریزی (Prismoidal)</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.mass.toFixed(0)} تن</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>تناژ کل مواد</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.acidConsumption.toFixed(2)} تن</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>مصرف اسید (15kg/t)</Text></View>
          </View>
        </View>
      </View>

      {/* --- Geometry Details --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>جزئیات هندسی</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.baseArea.toFixed(2)} متر مربع</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>مساحت بستر (Base Area)</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.topArea.toFixed(2)} متر مربع</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>مساحت تاج (Top Area)</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.topL.toFixed(2)} x {results.topW.toFixed(2)} متر</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>ابعاد تاج (Top Dims)</Text></View>
          </View>
        </View>
      </View>

      {/* --- Irrigation Details --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>سیستم آبیاری</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.totalFlowM3h.toFixed(2)} متر مکعب/ساعت</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>دبی کل آبیاری</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColValue}><Text style={styles.tableCell}>{results.numEmitters.toLocaleString('fa-IR')}</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>تعداد کل امیترها</Text></View>
          </View>
        </View>
      </View>

      {/* --- 3D Render Image --- */}
      {screenshot && (
        <View style={styles.section} break>
          <Text style={styles.sectionTitle}>نمای سه‌بعدی</Text>
          <Image src={screenshot} style={{ width: '100%', height: 'auto' }} />
        </View>
      )}

    </Page>
  </Document>
);

export default PdfReport;

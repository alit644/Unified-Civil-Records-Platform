"use client"
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import arabicReshaper from 'arabic-reshaper';

const fixArabic = (text: string) => {
  if (!text || typeof text !== 'string') return "";
  try {
    const reshaped = arabicReshaper.reshape(text);
    return reshaped.split('').reverse().join('');
  } catch (e) {
    return text;
  }
};

Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 700 },
  ],
});

const COLORS = {
  black: "#1a1a1a",
  grayDark: "#666666",
  grayMuted: "#888888",
  grayBorder: "#bbbbbb",
  grayBg: "#eeeeee",
  grayBgLight: "#f9fafb",
  white: "#ffffff"
};

const styles = StyleSheet.create({
  page: { padding: 35, backgroundColor: COLORS.white, fontFamily: 'Cairo' },
  watermark: { position: 'absolute', top: '35%', left: '10%', fontSize: 70, color: '#000000', opacity: 0.03, transform: 'rotate(-30deg)', zIndex: -1, textAlign: 'center', width: '100%' },
  graphicWatermark: { position: 'absolute', top: '30%', left: '25%', width: 300, height: 300, opacity: 0.04, zIndex: -1 },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: COLORS.grayBorder, paddingBottom: 10 },
  headerTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  govInfo: { fontSize: 9, fontWeight: 'bold', textAlign: 'right', lineHeight: 1.5 },
  titleArea: { textAlign: 'center', flex: 1 },
  mainTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black },
  subTitle: { fontSize: 7, marginTop: 2, color: COLORS.grayDark, letterSpacing: 1 },
  logo: { width: 65, height: 65, objectFit: 'contain' },
  docDetailsStrip: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 5, fontSize: 8, color: COLORS.grayDark, borderTopWidth: 1, borderTopColor: COLORS.grayBorder, paddingTop: 5 },
  metaSection: { flexDirection: 'row-reverse', gap: 15, marginBottom: 20 },
  metaGrid: { flex: 1, borderWidth: 1, borderColor: COLORS.grayBorder, flexDirection: 'row-reverse' },
  metaItem: { flex: 1, padding: 8, borderLeftWidth: 1, borderLeftColor: COLORS.grayBorder },
  metaLabel: { fontSize: 7, color: COLORS.grayMuted, marginBottom: 2, textAlign: 'right' },
  metaValue: { fontSize: 10, fontWeight: 'bold', textAlign: 'right' },
  qrBox: { borderWidth: 1, borderColor: COLORS.grayBorder, padding: 4 },
  table: { width: '100%', borderWidth: 1, borderColor: COLORS.grayBorder, marginBottom: 15 },
  tableRow: { flexDirection: 'row-reverse', borderBottomWidth: 1, borderBottomColor: COLORS.grayBorder },
  tableLabel: { width: '30%', padding: 9, backgroundColor: COLORS.grayBgLight, fontSize: 9, fontWeight: 'bold', textAlign: 'right', borderLeftWidth: 1, borderLeftColor: COLORS.grayBorder },
  tableValue: { flex: 1, padding: 9, fontSize: 10, textAlign: 'right', borderLeftWidth: 1, borderLeftColor: COLORS.grayBorder },
  sectionHeader: { fontSize: 10, fontWeight: 'bold', marginBottom: 8, textAlign: 'right', color: COLORS.black },
  footerContainer: { position: 'absolute', bottom: 35, left: 35, right: 35 },
  legalSection: { padding: 8, borderWidth: 1, borderColor: COLORS.grayBorder, fontSize: 8, lineHeight: 1.5, marginBottom: 15, textAlign: 'justify' },
  footerSign: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-end' },
  stampBox: { width: 90, height: 90, borderWidth: 2, borderColor: '#00000010', borderStyle: 'dotted', borderRadius: 45, justifyContent: 'center', alignItems: 'center', transform: 'rotate(12deg)' }
});

export interface GenericDocData {
  documentId: string;
  documentTitle: string;
  documentTitleEN: string;
  citizenNationalId: string;
  registryDetails: string;
  fields: { label: string; value: string }[];
  qrCodeUrl?: string;
}

interface GenericDocumentPDFProps {
  data: GenericDocData;
}

const GenericDocumentPDF = ({ data }: GenericDocumentPDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/emblem.png" style={styles.graphicWatermark} />
        <Text style={styles.watermark}>{fixArabic("السجل المدني السوري")}</Text>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.govInfo}>
              <Text>{fixArabic("الجمهورية العربية السورية")}</Text>
              <Text>{fixArabic("وزارة الداخلية")}</Text>
              <Text>{fixArabic("المديرية العامة للشؤون المدنية")}</Text>
            </View>
            <View style={styles.titleArea}>
              <Text style={styles.mainTitle}>{fixArabic(data.documentTitle)}</Text>
              <Text style={styles.subTitle}>{data.documentTitleEN} • {fixArabic("مستخرج إلكترونياً")}</Text>
            </View>
            <Image src="/emblem.png" style={styles.logo} />
          </View>
          <View style={styles.docDetailsStrip}>
            <Text>{fixArabic("رقم الوثيقة:")} {data.documentId}</Text>
            <Text>{fixArabic("تاريخ الإصدار:")} {new Date().toLocaleDateString('en-GB')}</Text>
            <Text>{fixArabic("صالح لمدة:")} 3 {fixArabic("أشهر من تاريخ الإصدار")}</Text>
          </View>
        </View>

        <View style={styles.metaSection}>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{fixArabic("الرقم الوطني")}</Text>
              <Text style={styles.metaValue}>{data.citizenNationalId}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{fixArabic("مكتب الإصدار")}</Text>
              <Text style={styles.metaValue}>{fixArabic(data.registryDetails)}</Text>
            </View>
          </View>

          {data.qrCodeUrl && (
            <View style={styles.qrBox}>
              <Image src={data.qrCodeUrl} style={{ width: 60, height: 60 }} />
            </View>
          )}
        </View>

        <Text style={styles.sectionHeader}>{fixArabic("المعلومات الأساسية / MAIN INFORMATION")}</Text>
        <View style={styles.table}>
          {data.fields.map((field, index) => (
            <View key={index} style={[styles.tableRow, index === data.fields.length - 1 ? { borderBottomWidth: 0 } : {}]}>
              <View style={styles.tableLabel}><Text>{fixArabic(field.label)}</Text></View>
              <View style={[styles.tableValue, { borderLeftWidth: 0 }]}><Text>{fixArabic(field.value)}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.footerContainer} fixed>
          <View style={styles.legalSection}>
            <Text>
              {fixArabic(`بيان إخلاء مسؤولية قانوني: تُقرّ المديرية بأن بيانات ${data.documentTitle} مستخرجة من المركز الرقمي للبيانات الوطنية وتُعدّ مطابقة للسجلات الرسمية حتى تاريخ إصدار هذه الوثيقة. أيّ تعديل في محتوى هذه الوثيقة يعرّض حامله للملاحقة القانونية.`)}
            </Text>
          </View>

          <View style={styles.footerSign}>
            <View style={{ gap: 4 }}>
              <View style={{ padding: 5, border: '1pt solid #ddd', alignItems: 'center' }}>
                <View style={{ height: 4, width: 80, backgroundColor: '#000', opacity: 0.1, marginBottom: 2 }} />
                <Text style={{ fontSize: 7, fontFamily: 'Helvetica' }}>SC-{data.citizenNationalId}</Text>
              </View>
            </View>

            <View style={styles.stampBox}>
              <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{fixArabic("صدق أصولاً")}</Text>
            </View>

            <View style={{ textAlign: 'left', fontSize: 8, gap: 2 }}>
              <Text style={{ fontWeight: 'bold' }}>{fixArabic("وزارة الداخلية")}</Text>
              <Text style={{ fontSize: 7, color: COLORS.grayDark }}>www.civil.gov.sy</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenericDocumentPDF;

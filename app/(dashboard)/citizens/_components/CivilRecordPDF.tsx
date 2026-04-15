"use client"
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import arabicReshaper from 'arabic-reshaper';

// قاموس ترجمة أنواع الواقعات المدنية
const eventTranslations: Record<string, string> = {
  'BIRTH': 'ولادة',
  'MARRIAGE': 'زواج',
  'DIVORCE': 'طلاق',
  'DEATH': 'وفاة',
  'TRANSFER': 'نقل قيد',
  'CORRECTION': 'تصحيح بيانات'
};

const statusTranslations: Record<string, string> = {
  "SINGLE": "أعزب",
  "MARRIED": "متزوج",
  "WIDOWED": "أرمل",
  "DIVORCED": "مطلق",
  "SEPARATED": "منفصل",
  "UNKNOWN": "غير معروف"
};

const translateEvent = (type: string) => {
  return eventTranslations[type.toUpperCase()] || type;
};

// دالة لمعالجة النصوص العربية: تشكيل الحروف وعكسها برمجياً
const fixArabic = (text: string) => {
  if (!text) return "";
  try {
    const reshaped = arabicReshaper.reshape(text);
    return reshaped.split('').reverse().join('');
  } catch (e) {
    return text;
  }
};

// تسجيل الخط العربي (Cairo)
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
  page: {
    padding: 35,
    backgroundColor: COLORS.white,
    fontFamily: 'Cairo',
  },
  watermark: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    fontSize: 70,
    color: '#000000',
    opacity: 0.03,
    transform: 'rotate(-30deg)',
    zIndex: -1,
    textAlign: 'center',
    width: '100%',
  },
  graphicWatermark: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: 300,
    height: 300,
    opacity: 0.04,
    zIndex: -1,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayBorder,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  govInfo: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: 1.5,
  },
  titleArea: {
    textAlign: 'center',
    flex: 1,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subTitle: {
    fontSize: 7,
    marginTop: 2,
    color: COLORS.grayDark,
    letterSpacing: 1,
  },
  logo: {
    width: 65,
    height: 65,
    objectFit: 'contain',
  },
  docDetailsStrip: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 5,
    fontSize: 8,
    color: COLORS.grayDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayBorder,
    paddingTop: 5,
  },
  metaSection: {
    flexDirection: 'row-reverse',
    gap: 15,
    marginBottom: 20,
  },
  metaGrid: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    flexDirection: 'row-reverse',
  },
  metaItem: {
    flex: 1,
    padding: 8,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.grayBorder,
  },
  metaLabel: {
    fontSize: 7,
    color: COLORS.grayMuted,
    marginBottom: 2,
    textAlign: 'right',
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  qrBox: {
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    padding: 4,
  },
  photoSlot: {
    width: 70,
    height: 85,
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    backgroundColor: COLORS.grayBgLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayBorder,
  },
  tableLabel: {
    width: '20%',
    padding: 7,
    backgroundColor: COLORS.grayBgLight,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'right',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.grayBorder,
  },
  tableValue: {
    flex: 1,
    padding: 7,
    fontSize: 9,
    textAlign: 'right',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.grayBorder,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'right',
    color: COLORS.black,
  },
  historyHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: COLORS.grayBgLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayBorder,
  },
  historyCell: {
    padding: 6,
    fontSize: 8,
    textAlign: 'right',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.grayBorder,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 35,
    left: 35,
    right: 35,
  },
  legalSection: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    fontSize: 8,
    lineHeight: 1.5,
    marginBottom: 15,
    textAlign: 'justify',
  },
  footerSign: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stampBox: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: '#00000010',
    borderStyle: 'dotted',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotate(12deg)',
  }
});

interface CivilRecordPDFProps {
  data: any;
  qrCodeUrl?: string;
}

const CivilRecordPDF = ({ data, qrCodeUrl }: CivilRecordPDFProps) => {
  const p = data?.personalInfo;
  const events = data?.eventsHistory || [];
  const docId = data.documentId;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/emblem.png" style={styles.graphicWatermark} />
        <Text style={styles.watermark}>{fixArabic("السجل المدني السوري")}</Text>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.govInfo}>
              <Text>{fixArabic("الجمهورية العربية السورية")}</Text>
              <Text>{fixArabic("وزارة الداخلية")}</Text>
              <Text>{fixArabic("المديرية العامة للشؤون المدنية")}</Text>
            </View>
            <View style={styles.titleArea}>
              <Text style={styles.mainTitle}>{fixArabic("بيان قيد مدني فردي")}</Text>
              <Text style={styles.subTitle}>INDIVIDUAL CIVIL REGISTRY STATEMENT • {fixArabic("مستخرج إلكترونياً")}</Text>
            </View>
            <Image src="/emblem.png" style={styles.logo} />
          </View>
          <View style={styles.docDetailsStrip}>
            <Text>{fixArabic("رقم الوثيقة:")} {docId}</Text>
            <Text>{fixArabic("تاريخ الإصدار:")} {new Date().toLocaleDateString('en-GB')}</Text>
            <Text>{fixArabic("صالح لمدة:")} 3 {fixArabic("أشهر من تاريخ الإصدار")}</Text>
          </View>
        </View>

        {/* Meta & QR Section */}
        <View style={styles.metaSection}>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{fixArabic("الرقم الوطني")}</Text>
              <Text style={styles.metaValue}>{p?.nationalId}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{fixArabic("رقم الطلب")}</Text>
              <Text style={styles.metaValue}>REQ-{Date.now().toString().slice(-4)}</Text>
            </View>
            <View style={[styles.metaItem, { borderLeftWidth: 0 }]}>
              <Text style={styles.metaLabel}>{fixArabic("مكتب الإصدار")}</Text>
              <Text style={styles.metaValue}>{fixArabic(`أمانة ${p?.registryDetails.split(" ")[1]} المركزية`)}</Text>
            </View>
          </View>

          {qrCodeUrl && (
            <View style={styles.qrBox}>
              <Image src={qrCodeUrl} style={{ width: 60, height: 60 }} />
            </View>
          )}

        </View>

        {/* Section I: Personal Info */}
        <Text style={styles.sectionHeader}>{fixArabic("أولاً: المعلومات الشخصية / PERSONAL INFORMATION")}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableLabel}><Text>{fixArabic("الاسم والكنية")}</Text></View>
            <View style={styles.tableValue}><Text>{fixArabic(p?.fullName)}</Text></View>
            <View style={styles.tableLabel}><Text>{fixArabic("اسم الأب")}</Text></View>
            <View style={[styles.tableValue, { borderLeftWidth: 0 }]}><Text>{fixArabic(p?.fatherName)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableLabel}><Text>{fixArabic("اسم الأم ونسبتها")}</Text></View>
            <View style={styles.tableValue}><Text>{fixArabic(p?.motherName)}</Text></View>
            <View style={styles.tableLabel}><Text>{fixArabic("الجنس")}</Text></View>
            <View style={[styles.tableValue, { borderLeftWidth: 0 }]}><Text>{fixArabic(p?.gender)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableLabel}><Text>{fixArabic("مكان وتاريخ الولادة")}</Text></View>
            <View style={styles.tableValue}><Text>{p?.birthDate + " — " + fixArabic(p?.placeOfBirth)}</Text></View>
            <View style={styles.tableLabel}><Text>{fixArabic("الحالة الاجتماعية")}</Text></View>
            <View style={[styles.tableValue, { borderLeftWidth: 0 }]}><Text>{fixArabic(statusTranslations[p?.maritalStatus.toUpperCase()])}</Text></View>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <View style={styles.tableLabel}><Text>{fixArabic("أمانة القيد - الرقم")}</Text></View>
            <View style={styles.tableValue}><Text>{fixArabic(p?.registryDetails)}</Text></View>
            <View style={styles.tableLabel}><Text>{fixArabic("فئة القيد")}</Text></View>
            <View style={[styles.tableValue, { borderLeftWidth: 0 }]}><Text>{fixArabic("أصلي")}</Text></View>
          </View>
        </View>

        {/* Section II: Events History */}
        <Text style={styles.sectionHeader}>{fixArabic("ثانياً: سجل الواقعات المدنية / CIVIL EVENTS RECORD")}</Text>
        <View style={styles.table}>
          <View style={styles.historyHeader}>
            <View style={[styles.historyCell, { width: '80pt' }]}><Text>{fixArabic("نوع الواقعة")}</Text></View>
            <View style={[styles.historyCell, { width: '80pt' }]}><Text>{fixArabic("التاريخ")}</Text></View>
            <View style={[styles.historyCell, { flex: 1 }]}><Text>{fixArabic("التفاصيل")}</Text></View>
            <View style={[styles.historyCell, { width: '60pt', borderLeftWidth: 0 }]}><Text>{fixArabic("رقم السجل")}</Text></View>
          </View>
          {events.map((ev: any, i: number) => (
            <View key={i} style={[styles.tableRow, { borderBottomWidth: i === events.length - 1 ? 0 : 1 }]}>
              <View style={[styles.historyCell, { width: '80pt', fontWeight: 'bold' }]}><Text>{fixArabic(translateEvent(ev.eventType))}</Text></View>
              <View style={[styles.historyCell, { width: '80pt' }]}><Text>{new Date(ev.eventDate).toLocaleDateString('en-GB')}</Text></View>
              <View style={[styles.historyCell, { flex: 1 }]}><Text>{ev.secondaryCitizen ? fixArabic(`الطرف الآخر: ${ev.secondaryCitizen.firstName} ${ev.secondaryCitizen.lastName}`) : fixArabic(ev.location || "مسجل أصولاً")}</Text></View>
              <View style={[styles.historyCell, { width: '60pt', borderLeftWidth: 0 }]}><Text>{`${i + 1}/${p?.nationalId?.slice(-3)}`}</Text></View>
            </View>
          ))}
          {events.length === 0 && (
            <View style={{ padding: 15, textAlign: 'center' }}>
              <Text style={{ fontSize: 8, color: COLORS.grayMuted }}>{fixArabic("لا توجد واقعات مسجلة إضافية")}</Text>
            </View>
          )}
        </View>

        {/* Legal & Footer - Fixed at bottom */}
        <View style={styles.footerContainer} fixed>
          <View style={styles.legalSection}>
            <Text>
              {fixArabic("بيان إخلاء مسؤولية قانوني: تُقرّ المديرية العامة للشؤون المدنية بأن هذه البيانات مستخرجة من المركز الرقمي للبيانات الوطنية وتُعدّ مطابقة للسجلات الرسمية حتى تاريخ إصدار هذه الوثيقة. أيّ تعديل في محتوى هذه الوثيقة يعرّض حامله للملاحقة الجزائية والقانونية.")}
            </Text>
          </View>

          <View style={styles.footerSign}>
            <View style={{ gap: 4 }}>
              <View style={{ padding: 5, border: '1pt solid #ddd', alignItems: 'center' }}>
                <View style={{ height: 4, width: 80, backgroundColor: '#000', opacity: 0.1, marginBottom: 2 }} />
                <Text style={{ fontSize: 7, fontFamily: 'Helvetica' }}>SC-{p?.nationalId}</Text>
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

export default CivilRecordPDF;

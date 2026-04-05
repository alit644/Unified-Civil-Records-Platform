import DocumentManager from "../../../components/DocumentManager";

const recentDocs = [
  { type: "سند إقامة", citizen: "محمد سامر الشمري", nid: "٩٩٨١٢٣٤٥٦٧", time: "١٠:٣٢", employee: "م. أحمد" },
  { type: "شهادة ميلاد", citizen: "ليان محمد العبادي", nid: "٩٩٨٧٦٥٤٣٢١", time: "١٠:١٥", employee: "سارة الحسن" },
  { type: "قيد عائلي", citizen: "عمر أحمد الشمري", nid: "٩٩٧١١٢٢٣٣٤", time: "٠٩:٤٥", employee: "م. أحمد" },
  { type: "شهادة زواج", citizen: "فاطمة أحمد العبادي", nid: "٩٩٨٧٦٥٤٣٢١", time: "٠٩:٢٠", employee: "نور العلي" },
];

export default function DocumentIssuancePage() {
  return (
    <div className="space-y-6">
      <DocumentManager recentDocs={recentDocs} />
    </div>
  );
}

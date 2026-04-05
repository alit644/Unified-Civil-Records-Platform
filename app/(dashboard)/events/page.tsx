import EventContent from "./_components/EventContent";
import EventStats from "./_components/EventStats";

const events = [
  { id: "CE-2024-001", type: "ولادة", citizen: "ليان محمد العبادي", eventDate: "٢٠/١١/٢٠٢٤", regDate: "٢٠/١١/٢٠٢٤", deadline: "٢٠/١٢/٢٠٢٤", status: "بانتظار التدقيق" },
  { id: "CE-2024-002", type: "زواج", citizen: "عمر أحمد الشمري", eventDate: "١٨/١١/٢٠٢٤", regDate: "١٩/١١/٢٠٢٤", deadline: "١٩/١٢/٢٠٢٤", status: "مقبول" },
  { id: "CE-2024-003", type: "وفاة", citizen: "خالد يوسف المصري", eventDate: "١٧/١١/٢٠٢٤", regDate: "١٨/١١/٢٠٢٤", deadline: "١٨/١٢/٢٠٢٤", status: "مقبول" },
  { id: "CE-2024-004", type: "طلاق", citizen: "هدى سالم الخطيب", eventDate: "١٥/١١/٢٠٢٤", regDate: "١٦/١١/٢٠٢٤", deadline: "٢٢/١١/٢٠٢٤", status: "بانتظار التدقيق", urgent: true },
  { id: "CE-2024-005", type: "ولادة", citizen: "آدم سامر الرفاعي", eventDate: "١٤/١١/٢٠٢٤", regDate: "١٥/١١/٢٠٢٤", deadline: "١٥/١٢/٢٠٢٤", status: "مقبول" },
  { id: "CE-2024-006", type: "زواج", citizen: "رنا حسين الطراونة", eventDate: "١٢/١١/٢٠٢٤", regDate: "١٣/١١/٢٠٢٤", deadline: "١٣/١٢/٢٠٢٤", status: "مرفوض" },
];

export default function CivilEventsPage() {
  return (
    <div className="space-y-6">
      <EventStats />
      <EventContent initialEvents={events} />
    </div>
  );
}


import Link from "next/link";

const actions = [
  { label: "+ تسجيل واقعة جديدة", path: "/events" },
  { label: "+ إضافة مواطن جديد", path: "/citizens" },
  { label: "📄 إصدار سند إقامة", path: "/documents" },
  { label: "📊 تقرير اليوم", path: "/" },
]

const QuickActions = () => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-5">
      <h4 className="font-bold mb-4">إجراءات سريعة</h4>
      <div className="space-y-3">
        {actions.map((a, i) => (
          <Link
            key={i}
            href={a.path}
            className="block w-full text-right px-4 py-3 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
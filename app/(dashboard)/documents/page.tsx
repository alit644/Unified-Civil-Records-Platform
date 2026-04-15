import DocumentManager from "./_components/DocumentManager";
import { MBreadcrumbs } from "@/components/shared/MBreadcrumbs";
import { getRecentDocuments } from "@/lib/services/document.service";

//TODO : handle error
//TODO : handle loading
//TODO : handle empty state
//TODO : handle pagination

export default async function DocumentIssuancePage() {
  const result = await getRecentDocuments();
  const recentDocs = result.data || [];

  return (
    <div className="space-y-6">
      <MBreadcrumbs paths={[{ label: "إصدار الوثائق" }]} />
      <DocumentManager recentDocs={recentDocs} />
    </div>
  );
}

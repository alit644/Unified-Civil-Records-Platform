import DocumentManager from "./_components/DocumentManager";
import { MBreadcrumbs } from "@/components/shared/MBreadcrumbs";
import { getRecentDocuments } from "@/lib/services/document.service";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// TODO: Add error handling for the result (ALL PAGES)

export default async function DocumentIssuancePage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page as string) || 1;
  const result = await getRecentDocuments(page, 10);

  const recentDocs = result.data || [];
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-6">
      <MBreadcrumbs paths={[{ label: "إصدار الوثائق" }]} />

      <DocumentManager recentDocs={recentDocs} totalPages={totalPages} currentPage={page} />
    </div>
  );
}

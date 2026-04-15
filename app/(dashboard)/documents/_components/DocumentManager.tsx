/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Column, DataTable } from "@/components/DataTable";
import { Doc } from "@/types";
import { QuickIssue, CitizenSearchResult } from "./QuickIssue";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import { issueDocumentAction } from "@/actions/document-issue";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { GenericDocData } from "./GenericDocumentPDF";
import PDFModal from "./PDFModal";
import { RecentDoc } from "@/types";
import MPagination from "@/components/shared/MPagination";

interface DocumentManagerProps {
  recentDocs: RecentDoc[];
  totalPages: number;
  currentPage: number;
}

export default function DocumentManager({ recentDocs, totalPages, currentPage }: DocumentManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedDoc, setSelectedDoc] = useState("سند إقامة");
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenSearchResult | null>(null);

  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedDocData, setIssuedDocData] = useState<GenericDocData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIssue = async () => {
    if (!selectedCitizen) return;

    setIsIssuing(true);
    const result = await issueDocumentAction(selectedCitizen.id, selectedDoc);
    setIsIssuing(false);

    if (result.success && result.data) {
      toast.success(result.message);
      setIssuedDocData(result.data);
      setIsModalOpen(true);
    } else {
      toast.error(result.message);
    }
  };

  const columns: Column<Doc>[] = [
    {
      key: "type",
      header: "النوع",
      render: (e) => <StatusBadge value={e.type} category="document_type" className="text-[10px]" />,
    },
    {
      key: "citizen",
      header: "المواطن",
      render: (e) => <span className="font-medium">{e.citizen}</span>,
    },
    {
      key: "nid",
      header: "الرقم الوطني",
      render: (e) => <span className="font-mono text-xs text-muted-foreground">{e.nid}</span>,
    },
    {
      key: "archiveNumber",
      header: "رقم الأرشفة",
      render: (e: any) => <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded border shadow-sm">{e.archiveNumber}</span>,
    },
    {
      key: "time",
      header: "وقت الإصدار",
      render: (e) => <span className="text-muted-foreground">{e.time}</span>,
    },
    {
      key: "employee",
      header: "أصدرها",
      render: (e) => <span className="text-muted-foreground">{e.employee}</span>,
    },

  ];

  return (
    <div className="space-y-6">
      <QuickIssue
        selectedDoc={selectedDoc}
        setSelectedDoc={(d) => setSelectedDoc(d)}
        selectedCitizen={selectedCitizen}
        setSelectedCitizen={setSelectedCitizen}
        onIssue={handleIssue}
        isIssuing={isIssuing}
      />

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b">
          <h4 className="font-bold">أحدث الوثائق الصادرة اليوم</h4>
        </div>
        <DataTable columns={columns} data={recentDocs as any} />
        {totalPages > 1 && (
          <MPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", page.toString());
              router.replace(`${pathname}?${params.toString()}`);
            }}
          />
        )}
      </div>

      <PDFModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        docData={issuedDocData}
      />
    </div>
  );
}

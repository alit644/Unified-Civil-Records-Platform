/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Printer, Download } from "lucide-react";
import { generateDocPdf } from "@/lib/generateDocPdf";
import { Column, DataTable } from "@/components/DataTable";
import { Doc } from "@/types";
import { Button } from "@/components/ui/button";
import { RecentDoc } from "./constants";
import { QuickIssue } from "./QuickIssue";
import { DocumentPreview } from "./DocumentPreview";

interface DocumentManagerProps {
  recentDocs: RecentDoc[];
}

export default function DocumentManager({ recentDocs }: DocumentManagerProps) {
  const [selectedDoc, setSelectedDoc] = useState("سند إقامة");
  const [issued, setIssued] = useState(false);
  const [citizenFound, setCitizenFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await generateDocPdf({
        type: selectedDoc,
        citizenName: "محمد سامر يوسف الشمري",
        nid: "٩٩٨١٢٣٤٥٦٧",
        address: "الجبيهة — شارع الجامعة ٤٥",
        neighborhood: "الجبيهة",
        issueDate: "٢٠/١١/٢٠٢٤",
        employee: "م. أحمد الخالدي",
        refNumber: "DOC-2024-00187",
      });
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadRecentPdf = async (doc: RecentDoc) => {
    try {
      await generateDocPdf({
        type: doc.type,
        citizenName: doc.citizen,
        nid: doc.nid,
        address: "الجبيهة — شارع الجامعة ٤٥",
        neighborhood: "الجبيهة",
        issueDate: "٢٠/١١/٢٠٢٤",
        employee: doc.employee,
        refNumber: `DOC-2024-${Math.floor(Math.random() * 99999).toString().padStart(5, "0")}`,
      });
    } catch (e) {
      console.error("PDF generation error:", e);
    }
  };

  const columns: Column<Doc>[] = [
    {
      key: "type",
      header: "النوع",
      render: (e) => <span className="badge-blue text-[10px]">{e.type}</span>,
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
      key: "time",
      header: "وقت الإصدار",
      render: (e) => <span className="text-muted-foreground">{e.time}</span>,
    },
    {
      key: "employee",
      header: "أصدرها",
      render: (e) => <span className="text-muted-foreground">{e.employee}</span>,
    },
    {
      key: "actions",
      header: "الإجراءات",
      render: (e) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-primary hover:text-primary"
            onClick={() => handleDownloadRecentPdf(e as unknown as RecentDoc)}
          >
            <Download className="w-3 h-3 ml-1" /> PDF
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
            <Printer className="w-3 h-3 ml-1" /> طباعة
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <QuickIssue
        selectedDoc={selectedDoc}
        setSelectedDoc={(d) => {
          setSelectedDoc(d);
          setIssued(false);
        }}
        citizenFound={citizenFound}
        setCitizenFound={setCitizenFound}
        onIssue={() => setIssued(true)}
      />

      {issued && (
        <DocumentPreview
          selectedDoc={selectedDoc}
          downloading={downloading}
          onDownload={handleDownloadPdf}
        />
      )}

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b">
          <h4 className="font-bold">أحدث الوثائق الصادرة اليوم</h4>
        </div>
        <DataTable columns={columns} data={recentDocs as any} />
      </div>
    </div>
  );
}

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DocData {
  type: string;
  citizenName: string;
  nid: string;
  address: string;
  neighborhood: string;
  issueDate: string;
  employee: string;
  refNumber: string;
  // Optional fields per doc type
  birthDate?: string;
  birthPlace?: string;
  gender?: string;
  spouseName?: string;
  marriageDate?: string;
  familyMembers?: string[];
}

/**
 * PDF generation using html2canvas + jsPDF.
 * This approach captures the HTML element as an image, which preserves
 * Arabic text shaping, RTL direction, and custom fonts (Cairo) perfectly.
 */
export async function generateDocPdf(data: DocData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const colors: Record<string, string> = {
    "سند إقامة": "#064e3b",
    "شهادة ميلاد": "#1e40af",
    "شهادة زواج": "#7c2d12",
    "قيد عائلي": "#4a1d6e",
    "قيد فردي": "#374151",
  };

  const accentColor = colors[data.type] || "#064e3b";

  const borderPatterns: Record<string, string> = {
    "سند إقامة": "solid",
    "شهادة ميلاد": "double",
    "شهادة زواج": "ornate",
    "قيد عائلي": "thick",
    "قيد فردي": "simple",
  };

  const borderStyle = borderPatterns[data.type] || "solid";

  let borderCSS = `border: 3px solid ${accentColor};`;
  if (borderStyle === "double") borderCSS = `border: 4px double ${accentColor};`;
  else if (borderStyle === "ornate") borderCSS = `border: 3px solid ${accentColor}; outline: 2px solid ${accentColor}; outline-offset: 4px;`;
  else if (borderStyle === "thick") borderCSS = `border: 5px solid ${accentColor};`;
  else if (borderStyle === "simple") borderCSS = `border: 2px solid ${accentColor};`;

  // Build specific fields per document type
  let specificFields = "";

  if (data.type === "شهادة ميلاد") {
    specificFields = `
      <tr><td class="label">تاريخ الميلاد:</td><td class="value">${data.birthDate || "١٥/٠٣/١٩٩٨"}</td></tr>
      <tr><td class="label">مكان الميلاد:</td><td class="value">${data.birthPlace || "عمّان"}</td></tr>
      <tr><td class="label">الجنس:</td><td class="value">${data.gender || "ذكر"}</td></tr>
    `;
  } else if (data.type === "شهادة زواج") {
    specificFields = `
      <tr><td class="label">اسم الزوج/الزوجة:</td><td class="value">${data.spouseName || "فاطمة أحمد العبادي"}</td></tr>
      <tr><td class="label">تاريخ الزواج:</td><td class="value">${data.marriageDate || "٠١/٠٦/٢٠٢٠"}</td></tr>
    `;
  } else if (data.type === "قيد عائلي") {
    const members = data.familyMembers || ["محمد سامر الشمري (رب الأسرة)", "فاطمة أحمد العبادي (زوجة)", "ليان محمد الشمري (ابنة)", "آدم محمد الشمري (ابن)"];
    specificFields = `
      <tr><td class="label" style="vertical-align:top;">أفراد الأسرة:</td><td class="value">
        <ul style="margin:0;padding-right:16px;list-style:none;">
          ${members.map((m, i) => `<li style="padding:2px 0;">${i + 1}. ${m}</li>`).join("")}
        </ul>
      </td></tr>
    `;
  }

  const iconMap: Record<string, string> = {
    "سند إقامة": "🏠",
    "شهادة ميلاد": "👶",
    "شهادة زواج": "💍",
    "قيد عائلي": "👨‍👩‍👧‍👦",
    "قيد فردي": "📋",
  };

  const html = `
    <div id="pdf-content" style="
      width: 500px;
      padding: 40px;
      font-family: 'Cairo', 'Arial', sans-serif;
      direction: rtl;
      ${borderCSS}
      background: #fff;
      position: relative;
    ">
      <!-- Top accent bar -->
      <div style="
        position: absolute; top: 0; right: 0; left: 0; height: 6px;
        background: ${accentColor};
      "></div>

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 24px; padding-top: 10px;">
        <div style="font-size: 32px; margin-bottom: 8px;">${iconMap[data.type] || "🏛"}</div>
        <div style="font-size: 16px; font-weight: 700; color: ${accentColor};">المملكة الأردنية الهاشمية</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">دائرة الأحوال المدنية والجوازات</div>
        <div style="
          margin-top: 16px; padding: 8px 24px; display: inline-block;
          background: ${accentColor}; color: #fff; border-radius: 4px;
          font-size: 18px; font-weight: 700;
        ">${data.type}</div>
      </div>

      <hr style="border: none; border-top: 1.5px solid ${accentColor}; opacity: 0.3; margin: 16px 0 24px;" />

      <!-- Fields -->
      <table style="width: 100%; border-collapse: collapse;">
        <style>
          .label { color: #6b7280; padding: 10px 0; width: 140px; font-weight: 500; font-size: 13px; }
          .value { color: #0f172a; padding: 10px 0; font-weight: 600; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
        </style>
        <tr><td class="label">الاسم الكامل:</td><td class="value">${data.citizenName}</td></tr>
        <tr><td class="label">الرقم الوطني:</td><td class="value" style="letter-spacing: 1px;">${data.nid}</td></tr>
        <tr><td class="label">العنوان:</td><td class="value">${data.address}</td></tr>
        <tr><td class="label">الحي:</td><td class="value">${data.neighborhood}</td></tr>
        ${specificFields}
        <tr><td class="label">تاريخ الإصدار:</td><td class="value">${data.issueDate}</td></tr>
      </table>

      <hr style="border: none; border-top: 1.5px solid ${accentColor}; opacity: 0.3; margin: 24px 0 16px;" />

      <!-- Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #6b7280;">
        <div style="text-align: right;">
          <div>الموظف المُصدر: ${data.employee}</div>
          <div>الرقم المرجعي: ${data.refNumber}</div>
        </div>
        <div style="
          width: 70px; height: 70px; border: 2px dashed ${accentColor}40;
          border-radius: 4px; display: flex; align-items: center; justify-content: center;
          color: ${accentColor}40; font-size: 11px;
        ">ختم رسمي</div>
      </div>

      <!-- Bottom accent bar -->
      <div style="
        position: absolute; bottom: 0; right: 0; left: 0; height: 4px;
        background: ${accentColor};
      "></div>
    </div>
  `;

  // Create a temporary container
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.right = "0";
  container.style.width = "500px";
  document.body.appendChild(container);

  try {
    const element = container.querySelector("#pdf-content") as HTMLElement;
    
    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      scale: 3, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate dimensions to fit A4
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    doc.save(`${data.type}_${data.nid}_${data.issueDate.replace(/\//g, "-")}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF", err);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * lib/pdfExport.ts
 * Generates a branded PDF report using jsPDF.
 * jsPDF and jspdf-autotable are loaded via dynamic import (client-only).
 */

import type { ValidationResult, FormData } from "./gemini";

export async function generatePDF(
  results: ValidationResult,
  formData: FormData
): Promise<void> {
  // Dynamically import to avoid SSR bundling issues with jsPDF / core-js
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  type AutoTableDoc = typeof doc & { lastAutoTable?: { finalY?: number } };

  const getNextY = (fallback: number) => {
    const finalY = (doc as AutoTableDoc).lastAutoTable?.finalY;
    return typeof finalY === "number" ? finalY + 8 : fallback + 8;
  };

  const navy: [number, number, number] = [44, 62, 125];
  const light: [number, number, number] = [244, 247, 252];
  const dark: [number, number, number] = [26, 31, 54];
  const white: [number, number, number] = [255, 255, 255];

  // ── Header bar ────────────────────────────────────────────
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageW, 28, "F");

  doc.setTextColor(...white);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  // add company logo public\logo-white.webp with height 50 and auto width, positioned at (14, 4)
  const logoImg = new Image();
  logoImg.src = "/logo-white.png";
  await new Promise((resolve) => {
    logoImg.onload = resolve;
  });
  const logoHeight = 13;
  const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
  doc.addImage(logoImg, "png", 14, 8, logoWidth, logoHeight);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("UAE Business Idea Validation Report", pageW - 14, 13, {
    align: "right",
  });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    pageW - 14,
    20,
    { align: "right" }
  );

  let y = 36;

  // ── Idea title & score ────────────────────────────────────
  doc.setFillColor(...light);
  doc.roundedRect(14, y, pageW - 28, 28, 3, 3, "F");

  doc.setTextColor(...navy);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(results.ideaTitle, 20, y + 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...dark);
  doc.text(
    formData.targetEmirate + " | " + formData.category.join(", "),
    20,
    y + 17
  );
  doc.text("Budget: " + formData.budget, 20, y + 23);

  // Score badge — color-coded rectangle
  const scoreCardColor: [number, number, number] =
    results.overallScore >= 70
      ? [34, 197, 94]
      : results.overallScore >= 50
      ? [245, 158, 11]
      : [239, 68, 68];
  const badgeX = pageW - 56;
  const badgeW = 38;
  const badgeH = 26;
  // Outer filled card
  doc.setFillColor(...scoreCardColor);
  doc.roundedRect(badgeX, y + 1, badgeW, badgeH, 4, 4, "F");
  // Subtle inner highlight strip
  doc.setFillColor(255, 255, 255);
  doc.setGState(doc.GState({ opacity: 0.12 }));
  doc.roundedRect(badgeX + 2, y + 2, badgeW - 4, 8, 2, 2, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  // Large score number
  doc.setTextColor(...white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(String(results.overallScore), badgeX + badgeW / 2, y + 16, { align: "center" });
  // /100 sub-label
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("/100", badgeX + badgeW / 2, y + 22.5, { align: "center" });

  y += 36;

  // ── Verdict ───────────────────────────────────────────────
  const verdictColor: [number, number, number] =
    results.overallScore >= 70
      ? [34, 197, 94]
      : results.overallScore >= 50
      ? [245, 158, 11]
      : [239, 68, 68];
  doc.setFillColor(...verdictColor);
  doc.roundedRect(14, y, 60, 8, 2, 2, "F");
  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(results.verdict.toUpperCase(), 44, y + 5.5, { align: "center" });

  y += 14;

  // ── Executive Summary ─────────────────────────────────────
  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...dark);
  const summaryLines = doc.splitTextToSize(
    results.executiveSummary,
    pageW - 28
  );
  doc.text(summaryLines, 14, y);
  y += summaryLines.length * 5 + 6;

  // ── Metrics ───────────────────────────────────────────────
  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Market Metrics", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Market Size", results.metrics.marketSize],
      ["Growth Rate", results.metrics.growthRate],
      ["Target Audience", results.metrics.targetAudience],
      ["Setup Timeline", results.metrics.setupTimeline],
    ],
    theme: "grid",
    headStyles: { fillColor: navy, textColor: white, fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: dark },
    alternateRowStyles: { fillColor: light },
    margin: { left: 14, right: 14 },
  });

  y = getNextY(y);

  // ── Competitors ───────────────────────────────────────────
  if (y > pageH - 60) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Competitor Analysis", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Competitor", "Strength", "Weakness", "Market Gap"]],
    body: results.competitors.map((c) => [
      c.name,
      c.strength + "/100",
      c.weakness,
      c.gap,
    ]),
    theme: "grid",
    headStyles: { fillColor: navy, textColor: white, fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: dark },
    alternateRowStyles: { fillColor: light },
    margin: { left: 14, right: 14 },
    columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 22 } },
  });

  y = getNextY(y);

  // ── License ───────────────────────────────────────────────
  if (y > pageH - 60) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Recommended License", 14, y);
  y += 6;

  doc.setFillColor(...light);
  doc.roundedRect(14, y, pageW - 28, 26, 3, 3, "F");
  doc.setTextColor(...navy);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(results.license.primary, 20, y + 8);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...dark);
  doc.text(
    "Cost: " +
      results.license.estimatedCost +
      "  |  Timeline: " +
      results.license.timeline,
    20,
    y + 15
  );
  doc.text("Alternatives: " + results.license.alternatives.join(", "), 20, y + 21);
  y += 32;

  // ── Opportunities & Red Flags ─────────────────────────────
  if (y > pageH - 80) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Opportunities & Risk Factors", 14, y);
  y += 4;

  const maxLen = Math.max(
    results.opportunities.length,
    results.redFlags.length
  );

  type RiskCell = { content: string; styles: { textColor: [number, number, number] } };
  const riskBody: RiskCell[][] = Array.from({ length: maxLen }, (_, i) => [
    {
      content: results.opportunities[i] ? `+ ${results.opportunities[i]}` : "",
      styles: { textColor: [22, 163, 74] as [number, number, number] },
    },
    {
      content: results.redFlags[i]
        ? `[${results.redFlags[i].severity}] ${results.redFlags[i].issue}`
        : "",
      styles: { textColor: [220, 38, 38] as [number, number, number] },
    },
  ]);

  autoTable(doc, {
    startY: y,
    head: [
      [
        {
          content: "Opportunities",
          styles: { fillColor: [22, 163, 74] as [number, number, number], textColor: white, fontStyle: "bold" },
        },
        {
          content: "Risk Factors",
          styles: { fillColor: [220, 38, 38] as [number, number, number], textColor: white, fontStyle: "bold" },
        },
      ],
    ],
    body: riskBody,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "top",
      lineColor: [220, 230, 245] as [number, number, number],
      lineWidth: 0.3,
    },
    alternateRowStyles: { fillColor: light },
    margin: { left: 14, right: 14 },
    columnStyles: { 0: { cellWidth: "auto" }, 1: { cellWidth: "auto" } },
  });

  y = getNextY(y) + 4;

  // ── Next Steps ────────────────────────────────────────────
  if (y > pageH - 60) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(...navy);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Next Steps", 14, y);
  y += 6;

  results.nextSteps.forEach((step) => {
    if (y > pageH - 30) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(...navy);
    doc.circle(20, y + 3, 5, "F");
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(step.step, 20, y + 4.5, { align: "center" });

    doc.setTextColor(...navy);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(step.title, 28, y + 4);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...dark);
    const desc = doc.splitTextToSize(step.description, pageW - 44);
    doc.text(desc, 28, y + 10);
    y += 18;
  });

  // ── CTA ───────────────────────────────────────────────────
  if (y > pageH - 40) {
    doc.addPage();
    y = 20;
  }
  y += 4;
  doc.setFillColor(...navy);
  doc.roundedRect(14, y, pageW - 28, 22, 3, 3, "F");
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Ready to start? Book a free consultation with Avyanco",
    pageW / 2,
    y + 9,
    { align: "center" }
  );
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "www.avyanco.com  |  +971 58 828 8968  |  info@avyanco.com",
    pageW / 2,
    y + 17,
    { align: "center" }
  );

  // ── Page footers ──────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...navy);
    doc.rect(0, pageH - 10, pageW, 10, "F");
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.text(
      `IdeaProof by Avyanco © ${new Date().getFullYear()}  |  Confidential  |  Page ${i} of ${totalPages}`,
      pageW / 2,
      pageH - 4,
      { align: "center" }
    );
  }

  doc.save(`IdeaProof-${results.ideaTitle.replace(/\s+/g, "-")}.pdf`);
}

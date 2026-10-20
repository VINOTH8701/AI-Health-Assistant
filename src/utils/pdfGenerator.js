import jsPDF from 'jspdf';

export const generateHealthReportPDF = (user, symptomHistory) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper for adding header & footer on pages
  const addHeaderAndFooter = (pageNum, totalPages) => {
    // Header Banner
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, pageWidth, 36, 'F');

    doc.setTextColor(16, 185, 129); // Emerald 500
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AI HEALTH ASSISTANT', 14, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Patient Wellness & AI Symptom Triage Digest', 14, 27);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 14, 27, { align: 'right' });

    // Footer Disclaimer
    doc.setFillColor(241, 245, 249);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('NON-DIAGNOSTIC NOTICE:', 14, pageHeight - 13);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('This document contains AI wellness recommendations and user-submitted symptom history. It is NOT a clinical medical diagnosis.', 52, pageHeight - 13);

    doc.setFontSize(8);
    doc.text(`Page ${pageNum}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  };

  // Page 1 Setup
  addHeaderAndFooter(1, 1);

  // Patient Profile Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Patient Profile & Demographics', 14, 48);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 52, pageWidth - 28, 42, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Name: ${user?.name || 'N/A'}`, 18, 60);
  doc.text(`Email: ${user?.email || 'N/A'}`, 18, 67);
  doc.text(`Age / Sex: ${user?.profile?.age || 'N/A'} yrs / ${user?.profile?.gender || 'N/A'}`, 18, 74);
  doc.text(`Role: ${user?.role || 'Patient'}`, 18, 81);

  doc.text(`Blood Group: ${user?.profile?.bloodGroup || 'N/A'}`, 105, 60);
  doc.text(`Height / Weight: ${user?.profile?.heightCm || 'N/A'} cm / ${user?.profile?.weightKg || 'N/A'} kg`, 105, 67);
  doc.text(`Known Allergies: ${user?.profile?.allergies ? user.profile.allergies.join(', ') : 'None'}`, 105, 74);
  doc.text(`Emergency Contact: ${user?.profile?.emergencyContact?.name || 'N/A'} (${user?.profile?.emergencyContact?.phone || 'N/A'})`, 105, 81);

  // Symptom History Section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('2. Symptom History & AI Triage Records', 14, 104);

  let yPos = 112;

  if (!symptomHistory || symptomHistory.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('No historical symptom records logged.', 14, yPos);
  } else {
    symptomHistory.forEach((item, idx) => {
      // Check for page overflow
      if (yPos > pageHeight - 35) {
        doc.addPage();
        addHeaderAndFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages());
        yPos = 46;
      }

      const cardHeight = 30;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, yPos - 4, pageWidth - 28, cardHeight, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`#${idx + 1} • ${new Date(item.timestamp).toLocaleDateString()} ${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} [${(item.inputMode || 'text').toUpperCase()}]`, 18, yPos + 3);

      // Severity tag
      const sev = item.severityScale || 5;
      if (sev >= 7) {
        doc.setTextColor(220, 38, 38);
      } else if (sev >= 4) {
        doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(16, 185, 129);
      }
      doc.text(`Severity: ${sev}/10`, pageWidth - 20, yPos + 3, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const truncatedInput = item.rawInput.length > 80 ? item.rawInput.slice(0, 80) + '...' : item.rawInput;
      doc.text(`Symptom: "${truncatedInput}"`, 18, yPos + 11);

      doc.setTextColor(71, 85, 105);
      const summaryText = item.aiAnalysis?.summary || 'No summary recorded';
      const truncatedSummary = summaryText.length > 85 ? summaryText.slice(0, 85) + '...' : summaryText;
      doc.text(`AI Wellness Summary: ${truncatedSummary}`, 18, yPos + 18);

      yPos += cardHeight + 6;
    });
  }

  // Save the generated PDF
  const sanitizedName = (user?.name || 'Patient').replace(/\s+/g, '_');
  doc.save(`AI_Health_Report_${sanitizedName}_${Date.now()}.pdf`);
};

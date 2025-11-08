// ✅ Download as PDF
document.getElementById("downloadPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Student Result Report", 70, 20);
  doc.autoTable({ html: "#resultsTable", startY: 30 });
  doc.save("Student_Results.pdf");
});

// ✅ Download as Word Document
document.getElementById("downloadDOCX").addEventListener("click", async () => {
  const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = window.docx;

  const rows = [];
  const headers = Array.from(document.querySelectorAll("#resultsTable thead th")).map(th => th.textContent);
  const dataRows = Array.from(document.querySelectorAll("#resultsTable tbody tr")).map(tr => 
    Array.from(tr.querySelectorAll("td")).map(td => td.textContent)
  );

  rows.push(new TableRow({
    children: headers.map(h => new TableCell({ children: [new Paragraph(h)] })),
  }));

  dataRows.forEach(r => {
    rows.push(new TableRow({
      children: r.map(c => new TableCell({ children: [new Paragraph(c)] })),
    }));
  });

  const table = new Table({ rows });
  const docxFile = new Document({ sections: [{ children: [new Paragraph("Student Result Report"), table] }] });
  const blob = await Packer.toBlob(docxFile);
  saveAs(blob, "Student_Results.docx");
});

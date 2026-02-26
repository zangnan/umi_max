// import DDXai from '../../DDXai/DDXai';

// const Independent: React.FC = () => {
//   return (<>
//     <DDXai />
//   </>);
// };

// export default Independent;

import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PDFGenerator = () => {
  // 示例 JSON 数据
  const jsonData = {
    title: "Sample PDF Report",
    description: "This is a sample PDF document generated using jsPDF in a React application. It includes a table, form data, and a large text description.",
    table: {
      headers: ["Name", "Age", "Email"],
      rows: [
        ["John Doe", 28, "john@example.com"],
        ["Jane Smith", 34, "jane@example.com"],
        ["Sam Green", 45, "sam@example.com"],
      ],
    },
    form: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St, City, Country",
    },
  };

  // 生成 PDF 的函数
  const generatePDF = () => {
    const doc = new jsPDF();

    // 添加标题
    doc.setFontSize(18);
    doc.text(jsonData.title, 14, 22);

    // 添加大段文本
    doc.setFontSize(12);
    const descriptionLines = doc.splitTextToSize(jsonData.description, 180); // 将文本按宽度分割
    doc.text(descriptionLines, 14, 40);

    // 添加表格
    doc.autoTable({
      startY: 60, // 表格起始位置
      head: [jsonData.table.headers], // 表头
      body: jsonData.table.rows, // 表格数据
    });

    // 添加表单数据
    doc.setFontSize(14);
    doc.text("Form Data:", 14, doc.lastAutoTable.finalY + 10); // 在表格下方添加表单标题
    doc.setFontSize(12);
    doc.text(`Name: ${jsonData.form.name}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Email: ${jsonData.form.email}`, 14, doc.lastAutoTable.finalY + 30);
    doc.text(`Address: ${jsonData.form.address}`, 14, doc.lastAutoTable.finalY + 40);

    // 保存 PDF
    doc.save("sample-report.pdf");
  };

  return (
    <div>
      <h1>PDF Generator</h1>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default PDFGenerator;
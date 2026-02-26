import { exportPdf } from '@/services/hts/api';
import myUtil from './index';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
// import { addfont } from './fontnormal';

const pdfUtil: any = {};

// 🎨 全局样式预设
const styles: any = {
  titleBlock: { fill: [218, 218, 218], text: [39, 39, 39] },
  gridCell: { fill: [237, 237, 237], text: [40, 40, 40] },
  tableHeader: { fill: [237, 237, 237], text: [255, 255, 255] },
};

// PDF简历示例数据
const resumeData = {
  basicInfo: {
    name: '陈晓明',
    photo: 'data:image/png;base64,...', // 建议200x200像素
    contact: { phone: '138-1234-5678', email: 'career@example.com', github: 'github.com/username' }
  },
  fields: [
    ['姓名: 王建国', '身份证号: 31000000000000001X', '联系电话: 13812345678' ],
    ['学历: 硕士研究生', '籍贯: 江苏南京', '民族: 汉族'],
    ['性别: 男', '年龄: 28岁', '毕业时间: 2023.06'],
  ],
  educationHeaders: ['时间段', '院校名称', '专业方向', '学术荣誉'],
  education: [
    { time: '2020.09 - 2023.06', degree: '计算机科学硕士', school: '南京大学', major: '计算机科学与技术（人工智能方向）', honors: ['国家奖学金', '优秀毕业生'] },
    { time: '2016.09 - 2020.06', degree: '计算机科学硕士', school: '复旦大学', major: '软件工程', honors: ['全国大学生创新大赛金奖'] },
    { time: '2013.09 - 2016.06', degree: '计算机科学硕士', school: '上海中学', major: '理科实验班', honors: ['校级一等奖学金', 'ACM竞赛金奖'] }
  ],
  experience: [
    { time: '2023.07 - 至今', company: '字节跳动', position: '高级前端工程师', projects: ['抖音国际版架构升级', '跨端组件库开发'] },
    { time: '2021.03 - 2023.06', company: '阿里巴巴', position: '前端开发工程师', projects: ['天猫超市结算系统重构', '蚂蚁金服升级', 'Antd组件5.0研发'] },
  ],
  description: "这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。这是一个PDF文档，基于React应用，jsPDF生成。包含列表、表单数据、长文本。",
}

// 初始化jsPDF
pdfUtil.pdfInit = () => {
  const doc: any = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
    // format: [210, 297] // A4尺寸
  });
  // 🖋️ 注册中文字体
  // doc.addFileToVFS('SourceHanSans.ttf', fontBase64);
  // doc.addFont('SourceHanSans.ttf', 'SourceHanSans', 'normal');
  // doc.setFont('SourceHanSans');
  // 添加字体，注册字体，addfont第3个参数一定是normal,即使你add的字体是bold的,也要设置为normal
  // addfont(doc);
  doc.addFont('bolds', 'b', 'normal');
  doc.setFont('b');
  return doc;
}

// 绘制PDF：标题
pdfUtil.generatePDFTitle = ({doc, title, CoordinateY, hasBg = true}: any) => {
  let yRect = CoordinateY;
  let yText = yRect + (hasBg ? 5.5 : 0);
  // 标题区块
  if (hasBg) { // 含有标题底色
    doc.setFillColor(...styles.titleBlock.fill);
    doc.rect(10, yRect, 190, 8, 'F'); // CoordinateX CoordinateY width height
  }
  doc.setFontSize(9);
  doc.setTextColor(...styles.titleBlock.text);
  doc.text(title, 15, yText);
  // doc.text('教育背景', 115, yPos, {
  //   underline: true,
  //   underlineColor: '#2c3e50'
  // });
}

// 绘制PDF：表单
pdfUtil.generatePDFForm = ({doc, data, CoordinateY}: any) => {
  // 栅格参数
  const gridConfig = {
    startX: 10,
    startY: CoordinateY,
    colWidth: 63.3,  // 190mm / 3列
    rowHeight: 10,
  };
  doc.setTextColor(...styles.gridCell.text);
  // 动态绘制栅格
  data.forEach((row: any, rowIndex: any) => {
    row.forEach((field: any, colIndex: any) => {
      const x: any = gridConfig.startX + colIndex * gridConfig.colWidth;
      const y: any = gridConfig.startY + rowIndex * gridConfig.rowHeight;
      // 单元格背景
      // doc.setFillColor(...styles.gridCell.fill);
      // doc.rect(x, y, gridConfig.colWidth, gridConfig.rowHeight, 'F');
      // 文字排版
      doc.setFontSize(9);
      // doc.setTextColor(...styles.gridCell.text);
      doc.text(field, x + 5, y + 5, {
        // maxWidth: gridConfig.colWidth - 10,
        align: 'left',
      });
    });
  });
}

// 绘制PDF：列表
pdfUtil.generatePDFGrid = ({doc, CoordinateY, head, body, theme, columnStyles, styles}: any) => {
  let atConfig: any = {
    startY: CoordinateY,
    // header: ['时间段', '院校名称', '专业方向', '学术荣誉'],
    // header: [[
    // { content: '时间段', styles: { fontStyle: 'bold', cellWidth: 40 } },
    // { content: '院校名称', styles: { cellWidth: 45 } },
    // { content: '专业方向', styles: { cellWidth: 45 } },
    // { content: '学术荣誉' },
    // ]],
    theme: theme || 'grid',// theme: 'grid' || 'striped' || 'plain',
    body,
    // bodyStyles: { fillColor: 255 }         // 白色背景
    styles: {
      fontSize: 9,
      cellPadding: 2,
      font: 'b',
      valign: 'middle',
      // lineWidth: 0.5,
      // lineColor: [91, 122, 125],
      // fillColor: styles.tableHeader.fill,
      // textColor: styles.tableHeader.text,
      // headStyles: { fillColr: false },
      // bodyStyles: { fillColr: false },
      ...styles,
    },
    headStyles: {
      fillColor: [237, 237, 237],
      textColor: [40, 40, 40],
      fontStyle: 'bold',
      minCellHeight: 8,
      lineWidth: 0.1,
      // lineColor: [40, 40, 40],
      // lineWidth: 2,
    },
    // bodyStyles: StyleDef
    // columnStyles: {
    //   0: { cellWidth: 40, fontStyle: 'bold' },
    //   1: { cellWidth: 45 },
    //   2: { cellWidth: 45, fontStyle: 'bold' },
    //   // 3: { halign: 'justify' }
    // }
  };
  if (head) {
    atConfig.head = [head];
  }
  if (columnStyles) {
    atConfig.columnStyles = columnStyles;
  } else {
    atConfig.columnStyles = {
      0: { minCellHeight: 8 },
    };
  }
  doc.autoTable(atConfig);
}

// 绘制PDF：大段文本
pdfUtil.generatePDFText = ({doc, text, CoordinateY}: any) => {
  doc.setFontSize(9);
  doc.setTextColor(...styles.gridCell.text);
  doc.setLineHeightFactor(2);
  const descriptionLines = doc.splitTextToSize(text, 180); // 将文本按宽度分割
  doc.text(descriptionLines, 15, CoordinateY);
}

// 🎨 PDF生成逻辑
const generateResume = () => {
  const doc = pdfUtil.pdfInit(); // 初始化jsPDF

  // 1 basicInfo 栅格系统
  function renderBasicInfo() {
    pdfUtil.generatePDFTitle({ doc, title: '基本信息', CoordinateY: 20 });
    pdfUtil.generatePDFForm({ doc, data: resumeData.fields, CoordinateY: 30 });
  }

  // 2 education 教育表格
  function renderEducation() {
    let gridData = resumeData.education.map(edu => [
      `${edu.time}`,
      `${edu.school}`,
      `${edu.major}`,
      edu?.honors?.map(h => `🏆 ${h}`).join('\n')
    ]);
    pdfUtil.generatePDFTitle({ doc, title: '教育经历', CoordinateY: 69 });
    pdfUtil.generatePDFGrid({
      doc,
      CoordinateY: 80,
      head: [
        { content: '时间段', styles: { fontStyle: 'bold', cellWidth: 40 } },
        { content: '院校名称', styles: { cellWidth: 45 } },
        { content: '专业方向', styles: { cellWidth: 45 } },
        { content: '学术荣誉' },
      ],
      body: gridData,
    });
  }

  // 3 experience 经历卡片
  function renderExperience() {
    pdfUtil.generatePDFTitle({ doc, title: '工作经验', CoordinateY: 124 });
    resumeData.experience.forEach((exp, idx) => {
      pdfUtil.generatePDFGrid({
        doc,
        CoordinateY: idx === 0 ? 136 : doc.lastAutoTable.finalY + 5,
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
        },
        body: [
          [
            { content: `${exp.company}`, styles: { fontStyle: 'bold', fontSize: 9 }, },
            { content: `${exp.position} ${exp.time}`, styles: { halign: 'left' }, },
          ],
          ...exp.projects.map(p => [`📌`, p])
        ],
      });
    });
  }

  // 4 renderOther 其他
  function renderOther() {
    pdfUtil.generatePDFTitle({ doc, title: '自我介绍', CoordinateY: 208, hasBg: false });
    pdfUtil.generatePDFText({ doc, text: resumeData.description, CoordinateY: 215 }); // 添加大段文本
  }

  // 执行渲染
  renderBasicInfo();
  renderEducation();
  renderExperience();
  renderOther();
  doc.save("modern_resume.pdf");
}

// 前端导出PDF
pdfUtil.exportPDF = () => {
  generateResume();
}

// 后端导出PDF
pdfUtil.doExportPdf = (param: any) => {
  const { getGridParams, setMasker, refUnit } = param;
  const gridParams = getGridParams ? getGridParams() : refUnit?.current?.getGridParams();
  let setMaskerTmp = setMasker ? setMasker: refUnit?.current?.setMasker;
  const unitKey: any = param?.unitKey;
  let params: any = {
    page: 1,
    pageSize: 999999,
    searchModel: gridParams?.searchModel || []
  };
  setMaskerTmp(true);
  exportPdf(unitKey, params).then((response: any) => {
    const { headers = {} } = response;
    myUtil.file.readBlobData(response).then(() => {
      const contentDisposition = headers['content-disposition'] || '';
      let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
      myUtil.file.downloadFile(response, fileName);
    }).catch((error: any) => {
      console.error(error);
    });
    return;
  }).catch(() => {
  }).finally(() => {
    setMaskerTmp(false);
  });
}

export default pdfUtil;
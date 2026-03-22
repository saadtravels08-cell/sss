import React from 'react';
import { RecruitmentData } from '../types';
import { Printer, Download, FileText, FileArchive, FileSpreadsheet, Image as ImageIcon, Phone, Mail, MapPin, Plane } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { fixUnsupportedColors } from '../utils/canvasFix';
import * as XLSX from 'xlsx';

interface TemplateProps {
  data: RecruitmentData;
}

const Watermark = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.06] overflow-hidden">
    <div className="relative rotate-[-12deg]">
      <div className="text-[450px] font-black text-gray-400 leading-none">SI</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Plane className="w-80 h-80 text-gray-400" />
      </div>
    </div>
  </div>
);

const DocumentHeader = () => (
  <div className="relative mb-8">
    <div className="flex justify-between items-start">
      {/* Left Section */}
      <div className="flex-1 pt-2">
        <h1 className="text-[26px] font-black text-[#005580] leading-none mb-2">SATELLITE INTERNATIONAL</h1>
        <div className="bg-[#008080] text-white px-3 py-1.5 inline-block rounded-sm shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-tight whitespace-nowrap">Overseas Employment Promoter's Licence</p>
        </div>
        <p className="text-[12px] font-bold text-[#d93025] mt-2">OP&HRD/5109/SKT/2024</p>
      </div>

      {/* Center Logo */}
      <div className="flex-shrink-0 px-6 pt-1">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-[4px] border-[#003366] rounded-full"></div>
          <div className="z-10 font-black text-3xl text-[#003366] tracking-tighter">SI</div>
          <div className="absolute -top-1 -right-1">
            <div className="text-[#003366] text-2xl">✦</div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 text-right relative pt-1">
        <div className="inline-flex items-stretch rounded-l-full overflow-hidden shadow-sm border border-[#008080]/20">
          <div className="bg-[#ffcc00] w-12 flex items-center"></div>
          <div className="bg-[#008080] text-white pl-4 pr-8 py-2.5">
            <h1 className="text-3xl font-bold font-arabic leading-none">سیٹلائٹ انٹرنیشنل</h1>
          </div>
        </div>
        <div className="mt-2 pr-4">
          <p className="text-[11px] font-bold text-[#005580] font-arabic leading-tight">المكتب الاستقدام التوظيف للعمال من باكستان</p>
          <p className="text-[10px] font-medium text-[#005580] font-arabic mt-1">رقم الرخصة: او-بی وایچ-آر-ڈی/٥١٠٩/سیالکوٹ</p>
        </div>
      </div>
    </div>

    {/* Ref and Date lines */}
    <div className="flex justify-between mt-10 px-2 text-base font-bold text-[#003366]">
      <div className="flex items-end gap-2">
        <span className="pb-1">Ref:</span>
        <div className="border-b-2 border-[#003366] w-56 h-7"></div>
      </div>
      <div className="flex items-end gap-2">
        <span className="pb-1">Date:</span>
        <div className="border-b-2 border-[#003366] w-56 h-7"></div>
      </div>
    </div>
  </div>
);

const DocumentFooter = () => (
  <div className="absolute bottom-[10mm] left-[10mm] right-[10mm] bg-[#005580] text-white py-4 px-10 rounded-xl shadow-lg text-[11px] z-50">
    <div className="flex justify-between items-center">
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-200" />
          <span className="font-bold tracking-wide">0542-450915</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-200" />
          <span className="font-bold tracking-wide">0305-4918338</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-200" />
          <span className="font-bold tracking-wide">satellite5109@gmail.com</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-200" />
        <span className="font-bold tracking-wide">Zafarwal Road Near Byepass, Shakargarh</span>
      </div>
    </div>
  </div>
);

const ActionButtons = ({ elementId, fileName, data }: { elementId: string, fileName: string, data: RecruitmentData }) => {
  const getElement = () => document.getElementById(elementId);

  const handlePrint = () => {
    // Add a small delay to ensure any UI updates are reflected
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePDF = async () => {
    const element = getElement();
    if (!element) return;
    const buttons = element.querySelector('.no-print-capture');
    if (buttons) (buttons as HTMLElement).style.display = 'none';
    
    // Ensure the element is at the top of the viewport for accurate capture
    window.scrollTo(0, 0);
    
    // Force the element to have fixed dimensions for capture to ensure 1:1 match with A4
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    element.style.width = '794px';
    element.style.height = '1123px';
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => fixUnsupportedColors(clonedDoc)
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Restore original styles
      element.style.width = originalWidth;
      element.style.height = originalHeight;
      if (buttons) (buttons as HTMLElement).style.display = 'flex';
    }
  };

  const handlePNG = async () => {
    const element = getElement();
    if (!element) return;
    
    const buttons = element.querySelector('.no-print-capture');
    if (buttons) (buttons as HTMLElement).style.display = 'none';
    
    window.scrollTo(0, 0);
    
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    element.style.width = '794px';
    element.style.height = '1123px';
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => fixUnsupportedColors(clonedDoc)
      });
      
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `${fileName}.png`);
      });
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Error generating PNG. Please try again.');
    } finally {
      element.style.width = originalWidth;
      element.style.height = originalHeight;
      if (buttons) (buttons as HTMLElement).style.display = 'flex';
    }
  };

  const handleZIP = async () => {
    const element = getElement();
    if (!element) return;
    
    const buttons = element.querySelector('.no-print-capture');
    if (buttons) (buttons as HTMLElement).style.display = 'none';
    
    window.scrollTo(0, 0);
    
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    element.style.width = '794px';
    element.style.height = '1123px';
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => fixUnsupportedColors(clonedDoc)
      });
      
      const zip = new JSZip();
      const imgData = canvas.toDataURL('image/png').split(',')[1];
      zip.file(`${fileName}.png`, imgData, { base64: true });
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${fileName}.zip`);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Error generating ZIP. Please try again.');
    } finally {
      element.style.width = originalWidth;
      element.style.height = originalHeight;
      if (buttons) (buttons as HTMLElement).style.display = 'flex';
    }
  };

  const handleWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: fileName.replace(/_/g, ' '), bold: true, size: 32 }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Principal Name: ${data.principalName}`, bold: true }),
            ],
          }),
          new Paragraph({ text: `Visa Number: ${data.visaNumber}` }),
          new Paragraph({ text: `Trade: ${data.trade}` }),
          new Paragraph({ text: `Salary: ${data.salary}` }),
          new Paragraph({ text: `Contract Period: ${data.contractPeriod}` }),
          new Paragraph({ text: `Date: ${data.date}` }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  };

  const handleExcel = () => {
    const wsData = [
      ["Field", "Value"],
      ["Principal Name", data.principalName],
      ["Visa Number", data.visaNumber],
      ["Trade", data.trade],
      ["Salary", data.salary],
      ["Contract Period", data.contractPeriod],
      ["Date", data.date],
      ["Vacancies", data.vacancies],
      ["OEPL No", data.oeplNo],
      ["Proprietor", data.proprietorName],
      ["Service Charges", data.serviceCharges],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recruitment Data");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className="no-print no-print-capture absolute top-4 right-4 flex flex-wrap gap-2 justify-end max-w-[400px] z-50">
      <button 
        onClick={handlePrint} 
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-sm"
      >
        <Printer className="w-4 h-4" />
        Print Now
      </button>
      <button onClick={handlePDF} title="Download PDF" className="bg-white text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all border border-red-100 shadow-sm"><Download className="w-4 h-4" /></button>
      <button onClick={handlePNG} title="Download PNG" className="bg-white text-green-600 p-2 rounded-xl hover:bg-green-50 transition-all border border-green-100 shadow-sm"><ImageIcon className="w-4 h-4" /></button>
      <button onClick={handleZIP} title="Download ZIP" className="bg-white text-yellow-600 p-2 rounded-xl hover:bg-yellow-50 transition-all border border-yellow-100 shadow-sm"><FileArchive className="w-4 h-4" /></button>
      <button onClick={handleWord} title="Download Word" className="bg-white text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-all border border-blue-100 shadow-sm"><FileText className="w-4 h-4" /></button>
      <button onClick={handleExcel} title="Download Excel" className="bg-white text-emerald-600 p-2 rounded-xl hover:bg-emerald-50 transition-all border border-emerald-100 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
    </div>
  );
};

export const DemandForm: React.FC<TemplateProps> = ({ data }) => {
  const renderTemplate = () => {
    switch (data.demandTemplate) {
      case 'modern':
        return (
          <div className="space-y-6 text-[13px] leading-tight">
            <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg mb-4">
              <h2 className="text-2xl font-black text-center tracking-[0.1em]">DEMAND LETTER</h2>
            </div>
            <p className="font-bold italic text-base border-l-4 border-blue-600 pl-4">Reference to lower of attorney of our principal M/s <span className="text-blue-600">{data.principalName || '________________________________________________'}</span></p>
            <p className="text-justify leading-snug">We <span className="font-bold text-blue-600">SATELLITE INTERNATIONAL</span> are authorized to do all such legal acts which are required to be done and made in connection with recruitment of Pakistan Personnel before the Protector of Emigration Government of Pakistan and any other Pakistani agency and Saudi Arabia Embassy to contact for the under mentioned requirement.</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Visa Number</span>
                <span className="text-lg font-black text-gray-900">{data.visaNumber || '__________'}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Dated</span>
                <span className="text-lg font-black text-gray-900">{data.date || '__________'}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Vacancies</span>
                <span className="text-lg font-black text-gray-900">{data.vacancies || '__________'}</span>
              </div>
            </div>
            <div className="p-6 bg-white border-2 border-blue-600 rounded-[1.5rem] flex justify-between items-center shadow-lg shadow-blue-50">
              <div>
                <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">Trade / Profession</span>
                <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{data.trade || '____________________'}</span>
              </div>
              <span className="font-arabic text-4xl text-blue-600">سائق شاحنة ثقيلة</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-900 rounded-2xl text-white">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Salary S.V</span>
                <span className="text-2xl font-black">{data.salary || '__________'}</span>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">Contract Period</span>
                <span className="text-2xl font-black text-blue-900 border-b-2 border-blue-900 inline-block px-2">{data.contractPeriod || 'TWO YEARS'}</span>
              </div>
            </div>
          </div>
        );
      case 'classic':
        return (
          <div className="space-y-6 text-[14px] leading-relaxed">
            <h2 className="text-2xl font-black text-center border-y-4 border-blue-900 py-2 mb-6 text-blue-900 tracking-widest">OFFICIAL DEMAND LETTER</h2>
            <div className="flex justify-between mb-6 font-bold text-blue-800">
              <p>Ref: SI/DL/{new Date().getFullYear()}/001</p>
              <p>Date: {data.date || '__________'}</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-blue-600 uppercase text-[10px]">To,</p>
              <p className="font-black text-lg text-blue-900">M/s. {data.principalName || '________________________________________________'}</p>
              <p className="font-bold text-gray-600">Kingdom of Saudi Arabia</p>
            </div>
            <p className="mt-4 font-black text-center bg-blue-50 py-2 rounded-lg border border-blue-100 text-blue-900 uppercase tracking-wide">Subject: <span className="border-b-2 border-blue-900 px-2">RECRUITMENT OF PAKISTANI MANPOWER</span></p>
            <p className="text-justify mt-4 leading-relaxed">We hereby appoint M/s <span className="font-black text-blue-900">SATELLITE INTERNATIONAL</span> (OEPL NO. 5109/SKT) as our authorized recruitment agent in Pakistan for the following categories of workers:</p>
            <table className="w-full border-collapse border-2 border-blue-900 mt-4 overflow-hidden rounded-xl">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border border-blue-800 p-3 text-left">Category / Trade</th>
                  <th className="border border-blue-800 p-3 text-center">Qty</th>
                  <th className="border border-blue-800 p-3 text-center">Salary</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-blue-100 p-4">
                    <div className="font-arabic text-2xl text-blue-900 mb-1">سائق شاحنة ثقيلة</div>
                    <div className="font-black text-lg uppercase tracking-wider">{data.trade || '[TRADE]'}</div>
                  </td>
                  <td className="border border-blue-100 p-4 text-center font-black text-2xl text-blue-900">{data.vacancies || '1'}</td>
                  <td className="border border-blue-100 p-4 text-center font-black text-2xl text-blue-900">{data.salary || 'SAR 1,200.00'}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 grid grid-cols-2 gap-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex flex-col">
                <span className="font-bold text-blue-600 uppercase text-[10px]">Visa Number</span>
                <span className="font-black text-lg border-b-2 border-blue-800 pb-1">{data.visaNumber || '__________'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-blue-600 uppercase text-[10px]">Contract Period</span>
                <span className="font-black text-lg border-b-2 border-blue-800 pb-1">{data.contractPeriod || 'TWO YEARS'}</span>
              </div>
            </div>
          </div>
        );
      default: // Standard - matching the image exactly
        return (
          <div className="space-y-4 text-[13px] leading-relaxed">
            <h2 className="text-xl font-black text-center border-b-2 border-blue-800 inline-block mx-auto mb-4 tracking-[0.1em] text-blue-800 pb-1">DEMAND LETTER</h2>
            
            <div className="flex items-baseline gap-2">
              <p className="font-medium">Reference to lower of attorney of our principal M/s</p>
              <p className="font-black border-b border-black flex-1 text-center text-[12px] pb-1">{data.principalName || '________________________________________________'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">We</span>
              <div className="flex-1 border-b border-black text-center pb-1">
                <span className="font-black px-4 text-blue-800">SATELLITE INTERNATIONAL</span>
              </div>
            </div>
            
            <p className="text-justify leading-relaxed">
              are authorized to do all such legal acts which are required to be done and made in connection with 
              recruitment of Pakistan Personnel before the Protector of Emigration Government of Pakistan and any 
              other Pakistani agency and Saudi Arabia Embassy to contact for the under mentioned requirement.
            </p>
            
            <div className="flex justify-between items-baseline gap-4 pt-2">
              <div className="flex gap-2 items-baseline">
                <span className="font-medium">Visa No:</span>
                <span className="border-b border-black min-w-[120px] text-center font-black pb-1">{data.visaNumber || '__________'}</span>
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="font-medium">Dated:</span>
                <span className="border-b border-black min-w-[120px] text-center font-black pb-1">{data.date || '__________'}</span>
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="font-medium">Total:</span>
                <span className="border-b border-black min-w-[60px] text-center font-black pb-1">{data.vacancies || 'ONE'}</span>
              </div>
            </div>

            <div className="flex gap-2 items-baseline">
              <span className="font-medium">Trade:</span>
              <div className="flex-1 border-b border-black flex justify-between px-4 pb-1">
                <span className="font-arabic text-lg text-blue-800">سائق شاحنة ثقيلة</span>
                <span className="font-black">{data.trade || '____________________'}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline gap-8">
              <div className="flex gap-2 items-baseline flex-1">
                <span className="font-medium">No. of Vacancies</span>
                <span className="border-b border-black flex-1 text-center font-black pb-1">{data.vacancies || 'ONE'}</span>
              </div>
              <div className="flex gap-2 items-baseline flex-1">
                <span className="font-medium">Salary S.V</span>
                <span className="border-b border-black flex-1 text-center font-black pb-1">{data.salary || 'SAR 1,200.00'}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="font-medium text-[11px]">Contract Period:</p>
              <p className="font-black border-b-2 border-black inline-block min-w-[150px] mt-1 pb-1">{data.contractPeriod || 'TWO YEARS'}</p>
            </div>

            <div className="pt-2 space-y-2">
              <h3 className="font-black border-b-2 border-black inline-block text-[12px] pb-0.5 mb-1">OTHER BENEFITS</h3>
              <div className="grid grid-cols-1 gap-1 font-medium text-[12px]">
                <p>1. Period Of Contract 2 Years</p>
                <p>2. Working Hours 8</p>
                <p>3. Overtime As Per Local Rules</p>
                <p>4. Annual Leave 15</p>
                <p>P</p>
                <p>6. Accommodation Free</p>
                <p>7. Free Medical</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="demand-form" className="max-w-[794px] mx-auto bg-white p-[20mm] pb-[30mm] shadow-lg min-h-[1123px] relative font-serif text-black border-[1px] border-gray-200 overflow-hidden">
      <Watermark />
      <DocumentHeader />
      {renderTemplate()}
      
      <div className="absolute bottom-[40mm] left-[20mm] right-[20mm] flex justify-between items-end">
        <div className="text-center">
          <div className="w-24 h-24 border-2 border-dashed border-blue-200 rounded-full flex items-center justify-center text-[8px] text-blue-200 font-bold uppercase mb-2">Seal & Stamp</div>
        </div>
        <div className="text-center">
          <p className="font-black text-blue-900 uppercase text-base mb-1">{data.proprietorName || 'SADAQAT ALI'}</p>
          <p className="font-bold text-blue-600 text-[10px] tracking-widest uppercase">Proprietor</p>
        </div>
      </div>

      <DocumentFooter />
      <ActionButtons elementId="demand-form" fileName="Demand_Letter" data={data} />
    </div>
  );
};

export const Undertaking1: React.FC<TemplateProps> = ({ data }) => (
  <div id="undertaking-1" className="max-w-[794px] mx-auto bg-white p-[20mm] pb-[30mm] shadow-lg min-h-[1123px] relative font-serif text-black border-[1px] border-gray-200 overflow-hidden">
    <Watermark />
    <DocumentHeader />
    <h2 className="text-2xl font-black text-center mb-6 tracking-[0.3em] text-blue-900">UNDERTAKING</h2>
    
    <div className="space-y-6 text-[14px] leading-relaxed">
      <div className="flex justify-between items-end">
        <div className="flex gap-2 items-end">
          <span className="font-bold text-blue-600 pb-1">NO.</span>
          <span className="border-b-2 border-blue-800 min-w-[180px] h-7"></span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="font-bold text-blue-600 pb-1">Date:</span>
          <span className="border-b-2 border-blue-800 min-w-[150px] text-center font-black h-7 pb-1">{data.date || '__________'}</span>
        </div>
      </div>

      <p className="font-bold text-lg">We M/s. <span className="border-b-2 border-blue-900 text-blue-900 px-1">SATELLITE INTERNATIONAL</span> OEPL NO. <span className="border-b-2 border-blue-900 text-blue-900 px-1">...{data.oeplNo || '5109/SKT'}.........</span></p>
      
      <p className="text-lg">Solemnly affirm that M/S <span className="border-b-2 border-blue-900 font-black text-blue-900 px-2">{data.principalName || '________________________________________________'}</span></p>
      
      <p className="italic text-gray-500 text-sm">Through M/s...........................SATELLITE INTERNATIONAL ..................................................</p>
      
      <div className="flex gap-12 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex gap-3 items-end">
          <span className="font-bold text-blue-600 pb-1">Visa no.</span>
          <span className="border-b-2 border-blue-800 min-w-[180px] font-black text-xl text-center h-8 pb-1.5">{data.visaNumber || '__________'}</span>
        </div>
        <div className="flex gap-3 items-end">
          <span className="font-bold text-blue-600 pb-1">Date</span>
          <span className="border-b-2 border-blue-800 min-w-[150px] font-black text-xl text-center h-8 pb-1.5">{data.date || '__________'}</span>
        </div>
      </div>

      <p className="text-lg leading-relaxed">Have authorized us to recruit <span className="font-black border-b-2 border-blue-900 px-4 text-blue-900 text-xl inline-block">{data.vacancies || 'ONE'}</span> workers and arrange their departure to the employer.</p>
      
      <p className="font-medium text-gray-700">We further confirm and stand guarantee that the employer is in need of Workers in the following categories of workers and shall provide the salary and fringe Benefits as detailed below.</p>

      <table className="w-full border-collapse border-2 border-blue-900 mt-4 overflow-hidden rounded-xl shadow-md">
        <thead>
          <tr className="bg-blue-900 text-white text-xs">
            <th className="border border-blue-800 p-2 text-left w-12">SR #</th>
            <th className="border border-blue-800 p-2 text-left">CATEGORY</th>
            <th className="border border-blue-800 p-2 text-center">No. Required</th>
            <th className="border border-blue-800 p-2 text-center">Salary</th>
            <th className="border border-blue-800 p-2 text-center">CONTRACT Period</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="border border-blue-200 p-3 text-center font-bold">1</td>
            <td className="border border-blue-200 p-3 text-center">
              <div className="font-arabic text-2xl text-blue-900 mb-1">سائق شاحنة ثقيلة</div>
              <div className="font-black text-base uppercase tracking-wider">{data.trade || '[TRADE]'}</div>
            </td>
            <td className="border border-blue-200 p-3 text-center font-black text-xl text-blue-900">{data.vacancies || '1'}</td>
            <td className="border border-blue-200 p-3 text-center font-black text-xl text-blue-900">{data.salary || 'SAR 1,200.00'}</td>
            <td className="border border-blue-200 p-3 text-center font-black text-base uppercase text-blue-900">{data.contractPeriod || 'TWO YEAR\'S'}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 grid grid-cols-2 gap-4 bg-[#f8fbff] p-4 rounded-2xl border border-blue-100">
        <div className="space-y-2">
          <p className="font-black text-blue-900 border-b-2 border-blue-900 inline-block uppercase tracking-widest text-[10px] pb-0.5 mb-2">Other Fringe benefits:</p>
          <div className="space-y-1 text-[11px] font-bold text-gray-700">
            <p className="flex gap-2"><span className="text-blue-600">(a)</span> Accommodation, Medical and local transport are free.</p>
            <p className="flex gap-2"><span className="text-blue-600">(b)</span> Food free OR 25% of basic salary.</p>
            <p className="flex gap-2"><span className="text-blue-600">(c)</span> Air – passage free / provided.</p>
            <p className="flex gap-2"><span className="text-blue-600">(d)</span> Other benefits as per Local Labour Laws.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center p-3 border-2 border-dashed border-blue-200 rounded-xl">
          <p className="font-black text-blue-900 leading-tight text-[11px]">We undertake that the employer shall provide salary and other fringe benefits as enumerated above.</p>
          <p className="text-[9px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">In case of violation we shall be liable for action under emigration laws.</p>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <div className="text-center border-t-2 border-blue-900 pt-2 min-w-[250px] mb-12">
          <p className="font-black text-blue-900 uppercase tracking-widest text-base">SADAQAT ALI</p>
          <p className="font-bold text-blue-600 text-[10px] uppercase mt-0.5">Proprietor Signature & Seal</p>
        </div>
      </div>
    </div>
    <DocumentFooter />
    <ActionButtons elementId="undertaking-1" fileName="Undertaking_1" data={data} />
  </div>
);

export const Undertaking2: React.FC<TemplateProps> = ({ data }) => (
  <div id="undertaking-2" className="max-w-[794px] mx-auto bg-white p-[20mm] pb-[30mm] shadow-lg min-h-[1123px] relative font-serif text-black border-[1px] border-gray-200 overflow-hidden">
    <Watermark />
    <DocumentHeader />
    <h2 className="text-2xl font-black text-center border-b-4 border-blue-900 inline-block mx-auto mb-6 tracking-[0.3em] text-blue-900 uppercase pb-1">UNDERTAKING</h2>
    
    <div className="space-y-6 text-[14px] leading-relaxed">
      <p className="font-bold text-lg">I, <span className="border-b-2 border-blue-900 text-blue-900 font-black px-2">{data.proprietorName || 'SADAQAT ALI'}</span> Proprietor of M/s <span className="border-b-2 border-blue-900 text-blue-900 font-black px-2">SATELLITE INTERNATIONAL</span></p>
      
      <div className="flex gap-3 items-end">
        <span className="font-bold text-blue-600 pb-1">OEP Lic. No.</span>
        <span className="border-b-2 border-blue-800 flex-1 font-black text-xl px-4 text-blue-900 h-8 pb-1.5">{data.oeplNo || 'OP&HRD/5109/SKT/2024'}</span>
        <span className="font-bold pb-1">do hereby undertake that employment</span>
      </div>

      <div className="flex gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex flex-col">
          <span className="font-bold text-[11px] text-blue-600 uppercase mb-1">Visa No.</span>
          <span className="border-b-2 border-blue-800 min-w-[180px] font-black text-xl text-center h-8 pb-1.5">{data.visaNumber || '__________'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[11px] text-blue-600 uppercase mb-1">Dated:</span>
          <span className="border-b-2 border-blue-800 min-w-[150px] font-black text-xl text-center h-8 pb-1.5">{data.date || '__________'}</span>
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-bold text-[11px] text-blue-600 uppercase mb-1">For Workers</span>
          <div className="flex gap-2 items-end">
            <span className="border-b-2 border-blue-800 flex-1 font-black text-xl text-center h-8 pb-1.5">{data.vacancies || '__________'}</span>
            <span className="font-bold text-[11px] pb-1.5">IN RESPECT OF OUR</span>
          </div>
        </div>
      </div>

      <p className="font-bold text-lg italic border-b-2 border-blue-900 inline-block pb-1">Principal/ Employer M/s <span className="font-black text-blue-900 px-2">{data.principalName || '________________________________________________'}</span></p>

      <div className="grid grid-cols-2 gap-4 bg-white p-4 border-2 border-blue-100 rounded-2xl shadow-sm">
        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-[9px] font-bold text-blue-600 uppercase">Telephone No.</p>
              <p className="border-b-2 border-blue-800 font-black text-base">{data.phone || '__________'}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-[9px] font-bold text-blue-600 uppercase">Fax No.</p>
              <p className="border-b-2 border-blue-800 font-black text-base">{data.fax || '__________'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-[9px] font-bold text-blue-600 uppercase">Email Address</p>
              <p className="border-b-2 border-blue-800 font-black text-base">{data.email || '__________'}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-[9px] font-bold text-blue-600 uppercase">Address K.S.A</p>
              <p className="border-b-2 border-blue-800 font-black text-base">{data.address || '____________________'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-justify text-gray-700 font-medium text-xs">
        <p>2. The above mentioned Principal/ Employer has appointed our agency to recruit these persons and complete all the relevant procedure involved in their departure for Kingdom of Saudi Arabia. We further stand guarantee that if the electronic visa and authorization submitted by us are found false/ fake, and agreement is violated by the Principal/ Employer we will be liable for legal action under Emigration Ordinance 1979 and rules made there under.</p>
        <p>3. Due care has been taken to ensure that the workers will work with the same employer. They have been advised to abide by the law of their country of employment. This statement is correct to the best of my knowledge and belief and nothing has been willfully concealed or with mala fide intentions.</p>
      </div>

      <div className="mt-6 p-6 bg-blue-900 rounded-3xl text-center shadow-xl">
        <p className="font-black text-white text-xl tracking-[0.1em]">I WILL BE RECEIVED SERVICES CHARGES RS <span className="text-yellow-400 text-3xl px-4">{data.serviceCharges || '15000'}</span> FROM EMIGRANT.</p>
      </div>

      <div className="mt-12 flex justify-between items-end mb-12">
        <div className="space-y-6">
          <p className="font-black text-blue-900 text-lg italic border-b-2 border-blue-900 pb-1">Yours Sincerely</p>
          <div className="space-y-1">
            <p className="text-gray-400 text-xs">Signature _________________________,</p>
            <p className="font-black text-blue-900 text-xl uppercase">{data.proprietorName || 'SADAQAT ALI'}</p>
            <p className="font-bold text-blue-600 text-[10px] uppercase tracking-widest">Proprietor</p>
          </div>
        </div>
        <div className="w-32 h-32 border-4 border-double border-blue-200 rounded-full flex items-center justify-center text-[8px] text-blue-200 font-bold uppercase text-center p-3">Official Stamp & Seal</div>
      </div>
    </div>
    <DocumentFooter />
    <ActionButtons elementId="undertaking-2" fileName="Undertaking_2" data={data} />
  </div>
);

export const PermissionForm: React.FC<TemplateProps> = ({ data }) => (
  <div id="permission-form" className="max-w-[794px] mx-auto bg-white p-[20mm] pb-[30mm] shadow-lg min-h-[1123px] relative font-serif text-black border-[1px] border-gray-200 overflow-hidden">
    <Watermark />
    <DocumentHeader />
    <h2 className="text-lg font-black text-center mb-6 tracking-[0.1em] text-blue-900 uppercase">APPLICATION UNDER RULE (19) OF EMIGRATION RULES 1979</h2>
    
    <div className="space-y-4 text-[13px] leading-relaxed">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <p className="font-bold text-blue-600 uppercase text-[10px]">To,</p>
          <p className="font-black text-base">The Protector of Emigrants,</p>
          <p className="font-bold text-sm">Government of Pakistan,</p>
          <p className="font-black text-blue-900">SIALKOT.</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-blue-600 uppercase text-[10px]">Date:</p>
          <p className="font-black border-b-2 border-blue-800 min-w-[120px] inline-block">{data.date || '__________'}</p>
        </div>
      </div>

      <div className="bg-blue-900 text-white p-3 rounded-xl shadow-md">
        <p className="font-black text-center tracking-widest uppercase text-xs">Subject: PERMISSION TO RECRUIT/PROCESS PAKISTANI PERSONAL FOR FOREIGN EMPLOYMENT</p>
      </div>

      <p className="font-medium text-gray-700 text-sm">Dear Sir,</p>
      
      <p className="text-justify text-xs">You are requested to kindly grant permission for recruitment/process advised by the under mentioned our principal M/s <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">{data.principalName || '________________________________________________'}</span> against their demand as per details given below:</p>

      <table className="w-full border-collapse border-2 border-blue-900 mt-4 overflow-hidden rounded-xl shadow-lg">
        <thead>
          <tr className="bg-blue-900 text-white text-[10px]">
            <th className="border border-blue-800 p-2 text-left">Category / Trade</th>
            <th className="border border-blue-800 p-2 text-center">No. of posts</th>
            <th className="border border-blue-800 p-2 text-center">PAY AND ALLOWANCE</th>
            <th className="border border-blue-800 p-2 text-center">DURATION OF CONTRACT</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="border border-blue-200 p-3">
              <div className="font-arabic text-2xl text-blue-900 mb-1">سائق شاحنة ثقيلة</div>
              <div className="font-black text-base uppercase tracking-wider">{data.trade || '[TRADE]'}</div>
            </td>
            <td className="border border-blue-200 p-3 text-center font-black text-xl text-blue-900">{data.vacancies || '1'}</td>
            <td className="border border-blue-200 p-3 text-center font-black text-xl text-blue-900">{data.salary || 'SAR 1,200.00'}</td>
            <td className="border border-blue-200 p-3 text-center font-black text-base uppercase text-blue-900">{data.contractPeriod || '2 YEARS'}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="font-bold text-blue-600 uppercase text-[10px] mb-1">OTHER BENEFITS</p>
        <p className="text-[11px] text-gray-700 leading-relaxed">Free Accommodation, Free food Free Medical, All other Facilities Provide According to Saudia, Govt Labour Laws including Local transport, Over time, Bonus, Insurance, Leave etc. Air passage to send from Company/Air passage Include in the salary</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        <div className="space-y-3">
          <p className="font-bold text-sm">Visa No: <span className="text-blue-900 font-black ml-2 border-b-2 border-blue-900 pb-1 underline-offset-4">{data.visaNumber || '__________'}</span></p>
          <p className="font-bold text-sm">Dated: <span className="text-blue-900 font-black ml-2 border-b-2 border-blue-900 pb-1 underline-offset-4">{data.date || '__________'}</span></p>
        </div>
        <div className="text-right">
          <p className="font-black text-blue-900 text-xl uppercase tracking-widest">{data.proprietorName || 'SADAQAT ALI'}</p>
          <p className="font-bold text-blue-600 text-[11px] uppercase">proprietor</p>
        </div>
      </div>

      <div className="mt-6 text-[9px] text-gray-500 italic space-y-0.5 mb-12">
        <p>NOTE: Strike out which in not relevant and authenticate it with Stamp and Signature.</p>
        <p>The permission is valid for 120 days. Please get it revalidated if required immediately of its expiry.</p>
        <p>Lic. OP&HRD/5109/SKT/2024</p>
      </div>
    </div>
    <DocumentFooter />
    <ActionButtons elementId="permission-form" fileName="Permission_Form" data={data} />
  </div>
);

export const DeclarationForm: React.FC<TemplateProps> = ({ data }) => (
  <div id="declaration-form" className="max-w-[794px] mx-auto bg-white p-[20mm] pb-[30mm] shadow-lg min-h-[1123px] relative font-serif text-black border-[1px] border-gray-200 overflow-hidden">
    <Watermark />
    <DocumentHeader />
    <h2 className="text-2xl font-black text-center border-b-4 border-blue-900 inline-block mx-auto mb-6 tracking-[0.2em] text-blue-900 uppercase pb-1">DECLARATION</h2>
    
    <div className="space-y-6 text-[15px] leading-relaxed text-justify">
      <p>I, <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">{data.proprietorName || 'SADAQAT ALI'}</span>, Proprietor of M/s <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">SATELLITE INTERNATIONAL</span>, Overseas Employment Promoters, holding License No. <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">{data.oeplNo || 'OP&HRD/5109/SKT/2024'}</span>, do hereby solemnly declare and affirm as under:</p>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <span className="font-black text-blue-900 min-w-[20px]">1.</span>
          <p>That we have been authorized by our Principal M/s <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">{data.principalName || '________________________________________________'}</span>, K.S.A., to recruit and process Pakistani manpower against Visa No. <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">{data.visaNumber || '__________'}</span> Dated <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">{data.date || '__________'}</span>.</p>
        </div>

        <div className="flex gap-4">
          <span className="font-black text-blue-900 min-w-[20px]">2.</span>
          <p>That the demand is genuine and the employer is a bona fide entity registered in the Kingdom of Saudi Arabia. We have verified the credentials of the employer to the best of our ability.</p>
        </div>

        <div className="flex gap-4">
          <span className="font-black text-blue-900 min-w-[20px]">3.</span>
          <p>That the workers recruited will be provided with the salary, accommodation, medical facilities, and other fringe benefits as mentioned in the Demand Letter and the Foreign Service Agreement.</p>
        </div>

        <div className="flex gap-4">
          <span className="font-black text-blue-900 min-w-[20px]">4.</span>
          <p>That we shall be responsible for any discrepancy or violation of the Emigration Ordinance 1979 and the rules made thereunder. We undertake to resolve any grievances of the workers recruited through our agency.</p>
        </div>

        <div className="flex gap-4">
          <span className="font-black text-blue-900 min-w-[20px]">5.</span>
          <p>That we have not charged any amount in excess of the prescribed service charges from the emigrants. The total service charges received are RS <span className="font-black border-b-2 border-blue-900 text-blue-900 px-2">{data.serviceCharges || '15000'}</span>.</p>
        </div>
      </div>

      <p className="pt-4">Whatever stated above is true and correct to the best of my knowledge and belief, and nothing has been concealed therein.</p>
    </div>

    <div className="absolute bottom-[40mm] left-[20mm] right-[20mm] flex justify-between items-end">
      <div className="text-center">
        <p className="font-bold text-gray-400 mb-8 text-xs">Witness Signature</p>
        <div className="w-40 border-b-2 border-gray-200"></div>
      </div>
      <div className="text-center">
        <p className="font-black text-blue-900 uppercase text-base mb-1">{data.proprietorName || 'SADAQAT ALI'}</p>
        <p className="font-bold text-blue-600 text-[10px] tracking-widest uppercase">Proprietor Signature & Seal</p>
      </div>
    </div>

    <DocumentFooter />
    <ActionButtons elementId="declaration-form" fileName="Declaration_Form" data={data} />
  </div>
);

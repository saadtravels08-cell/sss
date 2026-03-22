import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { InfoForm } from './components/InfoForm';
import { DemandForm, Undertaking1, Undertaking2, PermissionForm, DeclarationForm } from './components/DocumentTemplates';
import { RecruitmentData, Section } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, Download, FileStack, FileArchive, FileText, FileSpreadsheet, Image as ImageIcon, LogIn, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { fixUnsupportedColors } from './utils/canvasFix';
import * as XLSX from 'xlsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('info');
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [data, setData] = useState<RecruitmentData>(() => {
    const saved = localStorage.getItem('recruitmentData');
    const defaultData: RecruitmentData = {
      sponsorName: '',
      visaNumber: '1305295272',
      trade: 'Heavy Truck Driver',
      salary: 'SAR 1,200.00',
      date: '2025-07-15',
      vacancies: 'ONE',
      oeplNo: 'OP&HRD/5109/SKT/2024',
      proprietorName: 'SADAQAT ALI',
      principalName: 'muasasat suidih eabdallah bin jabir alshahri likhadamat alaeasha',
      address: 'K.S.A',
      phone: '',
      fax: '',
      email: '',
      contractPeriod: 'TWO YEAR\'S',
      serviceCharges: '15000',
      pageSize: 'A4',
      demandTemplate: 'standard',
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultData, ...parsed };
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('recruitmentData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Support both 'admin/admin' and the previous 'admin123' for backward compatibility
    if ((username === 'admin' && password === 'admin') || password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
      setShowLoginModal(false);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleQuickLogin = () => {
    setIsLoggedIn(true);
    setLoginError('');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const handlePrintAll = () => {
    const container = document.getElementById('all-forms-print');
    if (!container) return;
    
    document.body.classList.add('is-printing-all');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('is-printing-all');
    }, 100);
  };

  const handleDownloadAll = async () => {
    setIsGeneratingAll(true);
    try {
      const pdf = new jsPDF('p', 'mm', (data.pageSize || 'A4').toLowerCase());
      const container = document.getElementById('all-forms-print');
      if (!container) return;

      // Ensure we are at the top for accurate capture
      window.scrollTo(0, 0);

      container.style.display = 'block';
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.zIndex = '9999';
      container.style.width = '794px'; // Exact A4 width in pixels at 96 DPI
      container.style.backgroundColor = 'white';

      const forms = container.querySelectorAll('.document-template');
      
      for (let i = 0; i < forms.length; i++) {
        const element = forms[i] as HTMLElement;
        
        // Hide individual action buttons within the templates
        const buttons = element.querySelector('.no-print-capture');
        if (buttons) (buttons as HTMLElement).style.display = 'none';

        // Force fixed dimensions for accurate capture
        const originalWidth = element.style.width;
        const originalHeight = element.style.height;
        element.style.width = '794px';
        element.style.height = '1123px';

        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => fixUnsupportedColors(clonedDoc)
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        if (i > 0) pdf.addPage((data.pageSize || 'A4').toLowerCase());
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Restore original styles
        element.style.width = originalWidth;
        element.style.height = originalHeight;
        if (buttons) (buttons as HTMLElement).style.display = 'flex';
      }
      
      pdf.save(`SATELLITE_Recruitment_Forms_${data.principalName || 'Export'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      resetPrintContainer();
      setIsGeneratingAll(false);
    }
  };

  const handleDownloadAllZIP = async () => {
    setIsGeneratingAll(true);
    try {
      const zip = new JSZip();
      const container = document.getElementById('all-forms-print');
      if (!container) return;

      window.scrollTo(0, 0);

      container.style.display = 'block';
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.zIndex = '9999';
      container.style.width = '794px';
      container.style.backgroundColor = 'white';

      const forms = container.querySelectorAll('.document-template');
      const names = ['Demand_Letter', 'Undertaking_1', 'Undertaking_2', 'Permission_Form', 'Declaration_Form'];
      
      for (let i = 0; i < forms.length; i++) {
        const element = forms[i] as HTMLElement;
        
        const buttons = element.querySelector('.no-print-capture');
        if (buttons) (buttons as HTMLElement).style.display = 'none';

        const originalWidth = element.style.width;
        const originalHeight = element.style.height;
        element.style.width = '794px';
        element.style.height = '1123px';

        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => fixUnsupportedColors(clonedDoc)
        });
        const imgData = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`${names[i]}.png`, imgData, { base64: true });

        element.style.width = originalWidth;
        element.style.height = originalHeight;
        if (buttons) (buttons as HTMLElement).style.display = 'flex';
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `SATELLITE_Recruitment_Forms_${data.principalName || 'Export'}.zip`);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Error generating ZIP. Please try again.');
    } finally {
      resetPrintContainer();
      setIsGeneratingAll(false);
    }
  };

  const handleDownloadAllWord = async () => {
    setIsGeneratingAll(true);
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "SATELLITE INTERNATIONAL", bold: true, size: 48, color: "005580" })],
              alignment: "center",
            }),
            new Paragraph({
              children: [new TextRun({ text: "OVERSEAS EMPLOYMENT PROMOTER'S LICENCE", bold: true, size: 24, color: "008080" })],
              alignment: "center",
            }),
            new Paragraph({
              children: [new TextRun({ text: `Licence No. ${data.oeplNo}`, size: 20, color: "D93025" })],
              alignment: "center",
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "DEMAND LETTER", bold: true, size: 36, underline: {} })],
              alignment: "center",
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Reference to lower of attorney of our principal M/s: ${data.principalName}`, bold: true, italics: true })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `We SATELLITE INTERNATIONAL are authorized to do all such legal acts which are required to be done and made in connection with recruitment of Pakistan Personnel before the Protector of Emigration Government of Pakistan and any other Pakistani agency and Saudi Arabia Embassy to contact for the under mentioned requirement.` })],
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Visa No: ${data.visaNumber}`, bold: true }),
                new TextRun({ text: `    Dated: ${data.date}`, bold: true }),
                new TextRun({ text: `    Total: ${data.vacancies}`, bold: true }),
              ],
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `TRADE: ${data.trade}`, bold: true, size: 32 })],
              border: { top: { style: "single", size: 6 }, bottom: { style: "single", size: 6 }, left: { style: "single", size: 6 }, right: { style: "single", size: 6 } },
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `No. of Vacancies: ${data.vacancies}`, bold: true }),
                new TextRun({ text: `    Salary S.V: ${data.salary}`, bold: true }),
              ],
              spacing: { before: 400, after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Contract Period: ${data.contractPeriod}`, bold: true, size: 28 })],
              alignment: "center",
              spacing: { before: 400, after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "OTHER BENEFITS", bold: true, size: 24, underline: {} })],
              spacing: { after: 200 },
            }),
            new Paragraph({ text: "1. Period Of Contract: 2 Years" }),
            new Paragraph({ text: "2. Working Hours: 8" }),
            new Paragraph({ text: "3. Overtime: As Per Local Rules" }),
            new Paragraph({ text: "4. Annual Leave: 15 Days" }),
            new Paragraph({ text: "5. Accommodation: Free" }),
            new Paragraph({ text: "6. Free Medical & Insurance" }),
            new Paragraph({
              children: [new TextRun({ text: data.proprietorName, bold: true, size: 24 })],
              alignment: "right",
              spacing: { before: 800 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "PROPRIETOR", bold: true, size: 18 })],
              alignment: "right",
            }),

            // Page Break for Undertaking
            new Paragraph({ children: [new TextRun({ text: "", break: 1 })] }),
            new Paragraph({
              children: [new TextRun({ text: "UNDERTAKING", bold: true, size: 28, underline: {} })],
              alignment: "center",
            }),
            new Paragraph({ text: "", spacing: { before: 200, after: 200 } }),
            new Paragraph({
              children: [new TextRun({ text: `I, ${data.proprietorName}, proprietor of SATELLITE INTERNATIONAL, hereby undertake that the workers recruited for M/s ${data.principalName} will be provided with all facilities as per Saudi Labor Laws.` })],
            }),

            // Page Break for Permission
            new Paragraph({ children: [new TextRun({ text: "", break: 1 })] }),
            new Paragraph({
              children: [new TextRun({ text: "APPLICATION FOR PERMISSION", bold: true, size: 28, underline: {} })],
              alignment: "center",
            }),
            new Paragraph({ text: "", spacing: { before: 200, after: 200 } }),
            new Paragraph({
              children: [new TextRun({ text: `To: The Protector of Emigrants, SIALKOT.` })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Subject: PERMISSION TO RECRUIT/PROCESS PAKISTANI PERSONAL FOR FOREIGN EMPLOYMENT` })],
            }),

            // Page Break for Declaration
            new Paragraph({ children: [new TextRun({ text: "", break: 1 })] }),
            new Paragraph({
              children: [new TextRun({ text: "DECLARATION", bold: true, size: 28, underline: {} })],
              alignment: "center",
            }),
            new Paragraph({ text: "", spacing: { before: 200, after: 200 } }),
            new Paragraph({
              children: [new TextRun({ text: `I, ${data.proprietorName}, solemnly declare that I have been authorized by the employer M/s ${data.principalName} to recruit the workers.` })],
            }),
          ],
        }],
      });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `SATELLITE_Recruitment_Full_${data.principalName || 'Export'}.docx`);
      } catch (error) {
        console.error('Error generating Word:', error);
      } finally {
        setIsGeneratingAll(false);
      }
    };
  
    const handleDownloadAllExcel = () => {
      const wsData = [
        ["SATELLITE INTERNATIONAL"],
        ["OVERSEAS EMPLOYMENT PROMOTER'S LICENCE"],
        [`Licence No. ${data.oeplNo}`],
        [""],
        ["DEMAND LETTER"],
        [""],
        ["Principal Name", data.principalName],
        ["Visa Number", data.visaNumber],
        ["Dated", data.date],
        ["Total Vacancies", data.vacancies],
        [""],
        ["TRADE", data.trade],
        ["Salary", data.salary],
        ["Contract Period", data.contractPeriod],
        [""],
        ["OTHER BENEFITS"],
        ["1. Contract Period", "2 Years"],
        ["2. Working Hours", "8"],
        ["3. Overtime", "As Per Local Rules"],
        ["4. Annual Leave", "15 Days"],
        ["5. Accommodation", "Free"],
        ["6. Medical & Insurance", "Free"],
        [""],
        ["UNDERTAKING"],
        ["Proprietor", data.proprietorName],
        ["Undertaking", `I, ${data.proprietorName}, proprietor of SATELLITE INTERNATIONAL, hereby undertake...`],
        [""],
        ["DECLARATION"],
        ["Declaration", `I, ${data.proprietorName}, solemnly declare...`],
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Basic styling (merging cells for header)
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
        { s: { r: 25, c: 0 }, e: { r: 25, c: 5 } },
        { s: { r: 29, c: 0 }, e: { r: 29, c: 5 } },
      ];
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Recruitment Data");
      XLSX.writeFile(wb, `SATELLITE_Recruitment_Full_${data.principalName || 'Export'}.xlsx`);
    };

  const resetPrintContainer = () => {
    const container = document.getElementById('all-forms-print');
    if (container) {
      container.style.display = 'none';
      container.style.position = '';
      container.style.left = '';
      container.style.top = '';
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'info':
        return <InfoForm data={data} setData={setData} handlePrintAll={handlePrintAll} />;
      case 'demand':
        return <DemandForm data={data} />;
      case 'undertaking1':
        return <Undertaking1 data={data} />;
      case 'undertaking2':
        return <Undertaking2 data={data} />;
      case 'permission':
        return <PermissionForm data={data} />;
      case 'declaration':
        return <DeclarationForm data={data} />;
      default:
        return <InfoForm data={data} setData={setData} handlePrintAll={handlePrintAll} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Landing Header */}
        <header className="p-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">SI</div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tighter">SATELLITE INTERNATIONAL</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Overseas Employment Promoter's Licence</p>
            </div>
          </div>
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
              Secure Recruitment Management
            </div>
            <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
              <span className="text-blue-600">SATELLITE INTERNATIONAL</span> <br />
              Recruitment Management
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Manage, generate, and export all required recruitment forms with precision and speed. Optimized for A4 printing with official letterhead.
            </p>
            
            <div className="flex gap-4 justify-center pt-8">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center gap-3"
              >
                Get Started
                <LayoutDashboard className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </main>

        {/* Login Modal Overlay */}
        <AnimatePresence>
          {showLoginModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative"
              >
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="w-6 h-6 rotate-180" />
                </button>

                <div className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto shadow-xl shadow-blue-100 mb-4">SI</div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h3>
                    <p className="text-gray-400 font-medium">Enter your credentials to access the portal</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                      <input 
                        type="text" 
                        name="username"
                        placeholder="admin"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        placeholder="••••••••"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                        required
                      />
                    </div>
                    {loginError && <p className="text-red-500 text-xs font-bold ml-1">{loginError}</p>}
                    
                    <div className="flex flex-col gap-3 pt-2">
                      <button 
                        type="submit"
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Access Dashboard
                      </button>
                      
                      <button 
                        type="button"
                        onClick={handleQuickLogin}
                        className="w-full bg-blue-50 text-blue-600 py-3 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100 flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Quick Login (Fast Access)
                      </button>
                    </div>
                  </form>
                  
                  <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    Official Recruitment Portal • SATELLITE INTERNATIONAL © 2026
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 font-sans page-${(data.pageSize || 'A4').toLowerCase()}`}>
      <style>
        {`
          @media print {
            @page {
              size: ${data.pageSize};
              margin: 0;
            }
            .page-break {
              page-break-before: always;
            }
          }
        `}
      </style>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="no-print p-4 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section:</span>
              <span className="text-sm font-semibold text-blue-600 capitalize">{activeSection.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
            
            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page Size:</span>
              <select 
                value={data.pageSize}
                onChange={(e) => setData({...data, pageSize: e.target.value as any})}
                className="text-xs font-bold bg-gray-100 border-none rounded-md px-2 py-1 outline-none"
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-bold transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>

              <div className="h-6 w-px bg-gray-200"></div>

              <button 
                onClick={handlePrintAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all"
                title="Print All Forms"
              >
                <Printer className="w-3.5 h-3.5" />
                Print All
              </button>
              
              <div className="h-6 w-px bg-gray-200"></div>

              <div className="flex gap-1">
                <button 
                  onClick={handleDownloadAll}
                  disabled={isGeneratingAll}
                  className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50"
                  title="Download All PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDownloadAllZIP}
                  disabled={isGeneratingAll}
                  className="p-1.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white transition-all disabled:opacity-50"
                  title="Download All ZIP (PNGs)"
                >
                  <FileArchive className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDownloadAllWord}
                  disabled={isGeneratingAll}
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                  title="Download Data Word"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDownloadAllExcel}
                  disabled={isGeneratingAll}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-50"
                  title="Download Data Excel"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{data.proprietorName || 'Guest User'}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-100">
              {data.proprietorName ? data.proprietorName.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Print-only container for all forms */}
      <div id="all-forms-print" className="bg-white print-only">
        <div className="space-y-0">
          <div className="document-template"><DemandForm data={data} /></div>
          <div className="document-template page-break"><Undertaking1 data={data} /></div>
          <div className="document-template page-break"><Undertaking2 data={data} /></div>
          <div className="document-template page-break"><PermissionForm data={data} /></div>
          <div className="document-template page-break"><DeclarationForm data={data} /></div>
        </div>
      </div>
    </div>
  );
}

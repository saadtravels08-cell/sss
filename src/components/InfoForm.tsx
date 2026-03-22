import React from 'react';
import { RecruitmentData } from '../types';
import { Save, Printer, FileText, ShieldCheck } from 'lucide-react';

interface InfoFormProps {
  data: RecruitmentData;
  setData: (data: RecruitmentData) => void;
  handlePrintAll: () => void;
}

export const InfoForm: React.FC<InfoFormProps> = ({ data, setData, handlePrintAll }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Information & Details</h2>
        <p className="text-gray-500">Enter recruitment details to auto-generate all required documents.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... (rest of the form fields remain the same) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Proprietor Name</label>
            <input
              type="text"
              name="proprietorName"
              value={data.proprietorName}
              onChange={handleChange}
              placeholder="e.g. SADAQAT ALI"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">OEPL No.</label>
            <input
              type="text"
              name="oeplNo"
              value={data.oeplNo}
              onChange={handleChange}
              placeholder="e.g. OP&HRD/5109/SKT/2024"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Principal / Employer Name</label>
            <input
              type="text"
              name="principalName"
              value={data.principalName}
              onChange={handleChange}
              placeholder="Enter principal name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Visa Number</label>
            <input
              type="text"
              name="visaNumber"
              value={data.visaNumber}
              onChange={handleChange}
              placeholder="Enter visa number"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Trade / Profession</label>
            <input
              type="text"
              name="trade"
              value={data.trade}
              onChange={handleChange}
              placeholder="e.g. Heavy Truck Driver"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Basic Salary</label>
            <input
              type="text"
              name="salary"
              value={data.salary}
              onChange={handleChange}
              placeholder="e.g. SAR 1,200.00"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Number of Vacancies</label>
            <input
              type="text"
              name="vacancies"
              value={data.vacancies}
              onChange={handleChange}
              placeholder="e.g. ONE"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Contract Period</label>
            <input
              type="text"
              name="contractPeriod"
              value={data.contractPeriod}
              onChange={handleChange}
              placeholder="e.g. TWO YEAR'S"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Service Charges</label>
            <input
              type="text"
              name="serviceCharges"
              value={data.serviceCharges}
              onChange={handleChange}
              placeholder="e.g. 15000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</label>
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Address</label>
            <input
              type="text"
              name="address"
              value={data.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Phone</label>
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Enter phone"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Fax</label>
            <input
              type="text"
              name="fax"
              value={data.fax}
              onChange={handleChange}
              placeholder="Enter fax"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Demand Letter Template</label>
            <select
              name="demandTemplate"
              value={data.demandTemplate || 'standard'}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="standard">Standard (Official)</option>
              <option value="modern">Modern (Clean)</option>
              <option value="classic">Classic (Traditional)</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 italic">
            <Save className="w-4 h-4" />
            Auto-saving your progress...
          </div>
          <button 
            onClick={handlePrintAll}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-200"
          >
            <Printer className="w-4 h-4" />
            Print All Forms
          </button>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900">Auto-Generation</h3>
          <p className="text-sm text-gray-500 mt-2">All documents are updated in real-time as you type.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900">Compliance Ready</h3>
          <p className="text-sm text-gray-500 mt-2">Templates follow standard recruitment legal guidelines.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Printer className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900">One-Click Print</h3>
          <p className="text-sm text-gray-500 mt-2">Print all certificates and forms with a single click.</p>
        </div>
      </div>
    </div>
  );
};

export interface RecruitmentData {
  sponsorName: string;
  visaNumber: string;
  trade: string;
  salary: string;
  date: string;
  vacancies: string;
  oeplNo: string;
  proprietorName: string;
  principalName: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  contractPeriod: string;
  serviceCharges: string;
  pageSize: 'A4' | 'Letter' | 'Legal';
  demandTemplate?: 'standard' | 'modern' | 'classic';
}

export type Section = 'info' | 'demand' | 'undertaking1' | 'undertaking2' | 'permission' | 'declaration';

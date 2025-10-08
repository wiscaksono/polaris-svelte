export type SpicaResultRes = Array<{
  tanggal: string;
  spica_ke: number;
  rule_name: string;
  deskripsi: string;
  result: 'Passed' | 'Not Passed' | 'Skip';
}>

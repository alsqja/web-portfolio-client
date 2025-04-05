export interface PageLog {
  page: number;
  durationMs: number;
}

export interface ActivityLog {
  visitId: string;
  portfolioId: string;
  pageLogs: PageLog[];
}

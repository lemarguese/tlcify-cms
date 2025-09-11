export interface IAuditLog {
  user: string;
  action: string;
  model: string;
  documentId: string;
  message?: string;
}

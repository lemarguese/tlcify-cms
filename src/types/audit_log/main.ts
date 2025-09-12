export interface IAuditLog {
  user: {
    _id: string;
    email: string;
  };
  action: string;
  model: string;
  documentId: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

import type { ICustomer } from "@/types/customer/main.ts";
import type { UploadFile } from "antd";

export interface IDocument {
  customer: ICustomer;
  url: string;
  type: string;
  metaDescription: string;
}

export interface IDocumentCreate extends Omit<IDocument, 'customer' | 'url'> {
  file?: UploadFile
}

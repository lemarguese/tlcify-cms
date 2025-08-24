import type { ICustomer } from "@/types/customer/main.ts";
import type { UploadFile } from "antd";

export type IDocumentType = 'ddc_license' | 'tlc_license' | 'dl_license' | 'other';

export interface IDocument {
  customer: ICustomer;
  url: string;
  type: IDocumentType;
  metaDescription: string;
}

export interface IDocumentCreate extends Omit<IDocument, 'customer' | 'url'> {
  file?: UploadFile
}

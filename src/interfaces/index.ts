import { AttributeType } from "@/enums";

export interface Product {
  _id: string;
  name: string;
  images?: string[];
  enrichmentStatus?: "not_started" | "pending" | "processing" | "completed";
  [key: string]: any;
}

export interface AttributeDefinition extends BaseAttributeDefinition {
  _id: string;
}

export interface BaseAttributeDefinition {
  name: string;
  label: string;
  type: AttributeType;
  options?: string[];
  unit?: string;
}

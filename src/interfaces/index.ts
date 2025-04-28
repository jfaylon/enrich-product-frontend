import { AttributeType } from "@/enums";

export interface Product {
  _id: string;
  name: string;
  images?: string[];
  enrichmentStatus?: "not_started" | "pending" | "processing" | "completed";
  attributes?: Record<string, string | number | string[] | Measure>;
  [key: string]: unknown;
}

export interface Measure {
  unit: string;
  value: number;
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

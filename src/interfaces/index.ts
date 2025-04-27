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
  type:
    | "short_text"
    | "number"
    | "single_select"
    | "multi_select"
    | "measure"
    | "rich_text";
  options?: string[];
  unit?: string;
}

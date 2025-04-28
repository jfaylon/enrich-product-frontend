export enum AttributeType {
  ShortText = "short_text",
  LongText = "long_text",
  RichText = "rich_text",
  Number = "number",
  SingleSelect = "single_select",
  MultiSelect = "multi_select",
  Measure = "measure",
}

export enum AttributeValue {
  ShortText = "Short Text",
  LongText = "Long Text",
  RichText = "Rich Text",
  Number = "Number",
  SingleSelect = "Single Select",
  MultiSelect = "Multi Select",
  Measure = "Measure",
}

export enum AttributeField {
  Name = "name",
}

export enum EnrichmentStatus {
  NotStarted = "not_started",
  Pending = "pending",
  Processing = "processing",
  Complete = "complete",
}

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

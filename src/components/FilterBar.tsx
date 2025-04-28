import { UI_STRINGS } from "@/constants";
import { AttributeType } from "@/enums";
import { AttributeDefinition } from "@/interfaces";

const FilterBar = ({
  attributes,
  filters,
  onFilterChange,
  onClearFilters,
}: {
  attributes: AttributeDefinition[];
  filters: Record<string, any>;
  onFilterChange: (id: string, value: any) => void;
  onClearFilters: () => void;
}) => {
  const activeFilters = Object.entries(filters).filter(
    ([_, value]) => value !== "" && value.length !== 0
  );

  const handleRemoveFilter = (id: string) => {
    onFilterChange(id, "");
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {attributes.map((attr) => {
        if (attr.type === AttributeType.MultiSelect && attr.options) {
          return (
            <select
              key={attr.name}
              multiple
              value={filters[attr.name] || []}
              onChange={(e) =>
                onFilterChange(
                  attr.name,
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="border p-2 rounded w-48 h-32"
            >
              {attr.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        if (attr.type === AttributeType.ShortText || AttributeType.Number) {
          return (
            <div key={attr.name}>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {attr.label}
              </label>
              <input
                type={attr.type === AttributeType.Number ? "number" : "text"}
                value={filters[attr.name] ?? ""}
                onChange={(e) => onFilterChange(attr.name, e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-900 dark:text-gray-300"
              />
            </div>
          );
        }
        if (attr.type === AttributeType.SingleSelect) {
          return (
            <div key={attr.name}>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {attr.label}
              </label>
              <select
                value={filters[attr.name] ?? ""}
                onChange={(e) => onFilterChange(attr.name, e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-900 dark:text-gray-300"
              >
                <option value="">{UI_STRINGS.labels.select}</option>
                {attr.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        if (attr.type === AttributeType.Measure) {
          return (
            <div key={attr.name}>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {attr.label} ({attr.unit})
              </label>
              <input
                type="number"
                value={filters[attr.name] ?? ""}
                onChange={(e) => onFilterChange(attr.name, e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-900 dark:text-gray-300"
              />
            </div>
          );
        }
        return null;
      })}
      <button
        onClick={onClearFilters}
        disabled={!activeFilters.length}
        className={`text-sm px-4 py-2 border rounded transition-colors
    ${
      activeFilters.length
        ? "text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 cursor-pointer"
        : "text-gray-400 border-gray-200 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed"
    }
  `}
      >
        {UI_STRINGS.buttons.clearFilters}
      </button>
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.map(([key, value]) => (
            <span
              key={key}
              className="flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
            >
              {key}: {Array.isArray(value) ? value.join(", ") : value}
              <button
                onClick={() => handleRemoveFilter(key)}
                className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

import { SortOrder } from "@/enums";
import { AttributeDefinition, Product } from "@/interfaces";

const ProductTable = ({
  products,
  attributes,
  selectedProducts,
  toggleSelection,
  sortField,
  sortOrder,
  onSort,
}: {
  products: Product[];
  attributes: AttributeDefinition[];
  selectedProducts: Set<string>;
  toggleSelection: (id: string) => void;
  sortField: string;
  sortOrder: SortOrder.Asc | SortOrder.Desc;
  onSort: (field: string) => void;
}) => (
  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table className="min-w-full table-auto divide-y divide-gray-300 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer whitespace-normal break-words"></th>
          {attributes.map((attr) => (
            <th
              key={attr.name}
              onClick={() => onSort(attr.name)}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
            >
              {attr.label}{" "}
              {sortField === attr.name ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {products.length === 0 ? (
          <tr>
            <td
              colSpan={attributes.length + 1}
              className="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              No products found.
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <tr
              key={product._id}
              className={`hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                ["pending", "processing"].includes(product.enrichmentStatus!)
                  ? "opacity-70 animate-pulse"
                  : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {["pending", "processing"].includes(
                  product.enrichmentStatus!
                ) ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-4 w-4 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                ) : (
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product._id)}
                    onChange={() => toggleSelection(product._id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                )}
              </td>
              {attributes.map((attr) => (
                <td
                  key={`${product._id}-${attr.name}`}
                  className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-normal break-words"
                >
                  {attr.name === "name" ? (
                    <div className="flex items-center gap-2 flex-col">
                      {product.name}
                      {product.images && (
                        <div className="flex items-center gap-2">
                          {product.images
                            ?.filter((image) => image)
                            .map((image, index) => (
                              <img
                                key={`${product._id}-${attr.name}-image-${index}`}
                                src={image}
                                alt=""
                                className="w-8 h-8 rounded object-cover transform transition-transform duration-300 hover:scale-110"
                              />
                            ))}{" "}
                        </div>
                      )}
                    </div>
                  ) : Array.isArray(product.attributes?.[attr.name]) ? (
                    product.attributes[attr.name]?.join(", ")
                  ) : product.attributes?.[attr.name]?.value >= 0 &&
                    product.attributes[attr.name]?.unit ? (
                    `${product.attributes[attr.name].value} ${
                      product.attributes[attr.name]?.unit
                    }`
                  ) : (
                    (
                      product[attr.name] || product.attributes?.[attr.name]
                    )?.toString() ?? ""
                  )}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default ProductTable;

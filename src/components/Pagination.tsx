import { UI_STRINGS } from "@/constants";

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}) => (
  <div className="flex flex-wrap gap-4 items-center mt-4 justify-between">
    <div className="flex items-center gap-2">
      <span className="text-gray-700 dark:text-gray-300">
        {UI_STRINGS.labels.rowsPerPage}
      </span>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="border rounded p-1 dark:bg-gray-800 dark:text-gray-300"
      >
        {[10, 20, 50, 100].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
    <div className="flex items-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50 ${
          currentPage > 1 ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        {UI_STRINGS.buttons.previous}
      </button>
      <span className="text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50 ${
          currentPage < totalPages ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        {UI_STRINGS.buttons.next}
      </button>
    </div>
  </div>
);

export default Pagination;

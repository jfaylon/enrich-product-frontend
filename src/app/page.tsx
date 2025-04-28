"use client";

import { fetchProducts } from "@/api/backendApi";
import AttributeModal from "@/components/AttributeModal";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import ProductTable from "@/components/ProductTable";
import ProductUploadModal from "@/components/ProductUploadModal";
import {
  showErrorToast,
  showSuccessToast,
  ToastContainer,
} from "@/components/ToastContainer";
import { UI_STRINGS } from "@/constants";
import { SortOrder } from "@/enums";
import {
  AttributeDefinition,
  BaseAttributeDefinition,
  Product,
} from "@/interfaces";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const ProductManagerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<AttributeDefinition[]>([]);
  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder.Asc | SortOrder.Desc>(
    SortOrder.Asc
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [totalPages, setTotalPages] = useState(1);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts({
        page: currentPage,
        limit: itemsPerPage,
        sortField,
        sortOrder,
        ...filters,
      });
      setProducts(response.data.data);
      setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));

      const stillEnriching = response.data.data.some(
        (product: Product) =>
          product.enrichmentStatus !== "completed" &&
          product.enrichmentStatus !== "not_started"
      );
      if (stillEnriching && !pollingIntervalRef.current) {
        startPolling();
      }

      if (!stillEnriching && pollingIntervalRef.current) {
        stopPolling();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (!pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(() => {
        fetchProductsData();
      }, 10000);
    }
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/attributes`
      );
      setAttributes(response.data.attributes);
    } catch (error) {
      console.error("Failed to fetch attributes", error);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleCSVUpload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      showSuccessToast("CSV uploaded successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast(
        "There is an issue with the CSV. Please update the file and try again."
      );
    } finally {
      fetchProductsData();
      setUploadModalOpen(false);
    }
  };

  const handleAddAttribute = async (attr: BaseAttributeDefinition) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/attributes`,
      attr
    );
    showSuccessToast("Attribute Added");
    await fetchAttributes();
  };

  const handleDeleteAttribute = async (id: string) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/attributes/${id}`
    );
    showSuccessToast("Attribute Deleted");
    await fetchAttributes();
  };

  const handleEnrichSelected = async () => {
    const selectedProductIds = Array.from(selectedProducts);
    if (!selectedProductIds.length) {
      return;
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/enrich`,
      {
        productIds: selectedProductIds,
      }
    );
    await fetchProductsData();
    showSuccessToast("Products are sent for enrichment. Please wait.");
    setSelectedProducts(new Set());
  };

  const handleDeleteSelected = async () => {
    const selectedProductIds = Array.from(selectedProducts);
    if (!selectedProductIds.length) {
      return;
    }

    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/`, {
      data: {
        productIds: selectedProductIds,
      },
    });
    await fetchProductsData();
    showSuccessToast("Products are successfully deleted");
    setSelectedProducts(new Set());
  };

  const handleFilterChange = (id: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) =>
        prev === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc
      );
    } else {
      setSortField(field);
      setSortOrder(SortOrder.Asc);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  useEffect(() => {
    if (attributes.length > 0) {
      fetchProductsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, sortField, sortOrder, filters, attributes]);
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setUploadModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          {UI_STRINGS.buttons.uploadCsv}
        </button>
        <button
          onClick={() => setAttributeModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          {UI_STRINGS.buttons.manageAttributes}
        </button>
        <button
          onClick={handleEnrichSelected}
          className={`bg-purple-600 text-white px-4 py-2 rounded ${
            selectedProducts.size > 0 ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          disabled={!selectedProducts.size}
        >
          {UI_STRINGS.buttons.enrichSelected}
        </button>
        <button
          onClick={handleDeleteSelected}
          className={`bg-red-600 text-white px-4 py-2 rounded ${
            selectedProducts.size > 0 ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          disabled={!selectedProducts.size}
        >
          {UI_STRINGS.buttons.deleteSelected}
        </button>
      </div>

      <FilterBar
        attributes={attributes}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : (
        <ProductTable
          products={products}
          attributes={attributes}
          selectedProducts={selectedProducts}
          toggleSelection={toggleSelection}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(count) => {
          setItemsPerPage(count);
          setCurrentPage(1);
        }}
      />

      {uploadModalOpen && (
        <ProductUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleCSVUpload}
        />
      )}
      {attributeModalOpen && (
        <AttributeModal
          onClose={() => setAttributeModalOpen(false)}
          onAdd={handleAddAttribute}
          onDelete={handleDeleteAttribute}
          attributes={attributes}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ProductManagerPage;

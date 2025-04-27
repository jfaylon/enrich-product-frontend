import FileUploadModal from "./FileUploadModal";

const ProductUploadModal = ({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}) => (
  <FileUploadModal
    open={open}
    onClose={onClose}
    onUpload={onUpload}
    title="Upload Product CSV/XLSX"
    templateUrl="/templates/uploadProductsTemplate.csv"
    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  />
);

export default ProductUploadModal;

import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";

const FileUploadModal = ({
  open,
  onClose,
  onUpload,
  title,
  templateUrl,
  accept,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  title: string;
  templateUrl?: string;
  accept: string;
}) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </TransitionChild>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-gray-900 dark:text-gray-100">
              <h2 className="text-lg font-bold">{title}</h2>

              {templateUrl && (
                <a
                  href={templateUrl}
                  download
                  className="text-blue-600 dark:text-blue-400 underline text-sm"
                >
                  Download Example Template
                </a>
              )}

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer bg-white dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-400 transition"
              >
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {file ? file.name : "Click to upload file"}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept={accept}
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-4 py-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!file}
                  onClick={() => file && onUpload(file)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FileUploadModal;

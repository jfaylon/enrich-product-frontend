import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { useState, Fragment } from "react";
import { UI_STRINGS } from "@/constants";
import { AttributeDefinition, BaseAttributeDefinition } from "@/interfaces";

const AttributeModal = ({
  onClose,
  onAdd,
  onDelete,
  attributes,
}: {
  onClose: () => void;
  onAdd: (a: BaseAttributeDefinition) => void;
  onDelete: (id: string) => void;
  attributes: AttributeDefinition[];
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<AttributeDefinition["type"]>("short_text");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState("");
  const [unit, setUnit] = useState("");

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptions((prev) => [...prev, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const handleAddAttribute = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newAttr: BaseAttributeDefinition = {
      name: trimmed.toLowerCase().replace(" ", "-"),
      label: trimmed,
      type,
    };
    if (
      (type === "single_select" || type === "multi_select") &&
      options.length
    ) {
      newAttr.options = options;
    }
    if (type === "measure" && unit.trim()) {
      newAttr.unit = unit.trim();
    }
    onAdd(newAttr);
    setName("");
    setType("short_text");
    setOptions([]);
    setOptionInput("");
    setUnit("");
  };

  return (
    <Transition show as={Fragment}>
      <Dialog open onClose={onClose} className="fixed inset-0 z-50">
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
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Manage Attributes</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={UI_STRINGS.placeholders.attributeName}
                className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full bg-white dark:bg-gray-900"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full bg-white dark:bg-gray-900"
              >
                <option value="short_text">Short Text</option>
                <option value="long_text">Long Text</option>
                <option value="rich_text">Rich Text</option>
                <option value="number">Number</option>
                <option value="single_select">Single Select</option>
                <option value="multi_select">Multi Select</option>
                <option value="measure">Measure</option>
              </select>

              {(type === "single_select" || type === "multi_select") && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      placeholder="Add option"
                      className="border border-gray-300 dark:border-gray-700 rounded p-2 flex-1 bg-white dark:bg-gray-900"
                    />
                    <button
                      onClick={handleAddOption}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 text-gray-800 dark:text-gray-100"
                      >
                        {opt}
                        <button
                          onClick={() =>
                            setOptions((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-red-600 hover:text-red-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {type === "measure" && (
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder={UI_STRINGS.placeholders.unitInput}
                  className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full bg-white dark:bg-gray-900"
                />
              )}

              <button
                onClick={handleAddAttribute}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full cursor-pointer"
              >
                {UI_STRINGS.buttons.addAttribute}
              </button>

              <div className="pt-4 border-t border-gray-300 dark:border-gray-700 space-y-2">
                {attributes
                  .filter((attr) => attr._id)
                  .map((attr) => (
                    <div
                      key={attr.name}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {attr.label} ({attr.type}
                        {attr.options ? `: ${attr.options.join(", ")}` : ""}
                        {attr.unit ? ` [${attr.unit}]` : ""})
                      </span>
                      <button
                        onClick={() => onDelete(attr._id)}
                        className="text-red-600 hover:text-red-400 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AttributeModal;

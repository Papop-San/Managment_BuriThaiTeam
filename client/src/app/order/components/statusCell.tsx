"use client";

import React, { useState } from "react";

type EditableStatusCellProps<T extends string> = {
  value: T;
  options: T[];
  colorMap: Record<T, string>;
  onSave?: (newValue: T) => Promise<void> | void; 
};

export function EditableStatusCell<T extends string>({
  value,
  options,
  colorMap,
  onSave,
}: EditableStatusCellProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<T>(value);

  const handleSave = () => {
    if (onSave) onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="inline-flex items-center gap-2 justify-center w-full">
      {!isEditing ? (
        <>
          <span
            className={`px-3 py-1 rounded-full text-white text-sm ${colorMap[tempValue]}`}
          >
            {tempValue}
          </span>
          <button
            className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </>
      ) : (
        <>
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value as T)}
            className="px-2 py-1 border rounded text-sm"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="ml-1 px-2 py-1 bg-gray-300 rounded text-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

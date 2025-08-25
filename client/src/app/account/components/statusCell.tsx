"use client";

import React, { useState } from "react";

type StatusCellProps<TData extends { status_active: boolean }> = {
  value: boolean;
  onChange: (newValue: boolean) => void;
};

export const StatusCell = <TData extends { status_active: boolean }>({
  value,
  onChange,
}: StatusCellProps<TData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue); // อัปเดตค่าใน parent
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value); // ย้อนกลับค่าเดิม
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium">
      {/* วงกลมสี */}
      <span
        className={`w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0 ${
          tempValue ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>

      {!isEditing ? (
        <>
          <span>{tempValue ? "Active" : "Inactive"}</span>
          <button
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </>
      ) : (
        <>
          <select
            value={tempValue.toString()}
            onChange={(e) => setTempValue(e.target.value === "true")}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="ml-1 px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 text-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

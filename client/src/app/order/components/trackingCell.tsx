"use client";

import React, { useState, useEffect } from "react";

type EditTrackingCellProps = {
  value: string; 
  onSave?: (newValue: string) => Promise<void> | void;
  disabled?: boolean; // เพิ่มเพื่อ disable input
};

export function EditTrackingCell({ value, onSave, disabled }: EditTrackingCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);

  // sync tempValue กับ value จาก props เมื่อ value เปลี่ยน
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = async () => {
    if (tempValue === value) return; 
    if (!onSave) return;

    setLoading(true);
    try {
      await onSave(tempValue);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="inline-flex justify-center items-center gap-2 w-full">
      {!isEditing ? (
        <>
          <span className="text-sm">{value || "-"}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            disabled={disabled || loading}
          >
            Edit
          </button>
        </>
      ) : (
        <>
          <input
            className="px-2 py-1 border rounded text-sm"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Enter tracking"
            disabled={disabled || loading}
          />
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            disabled={disabled || loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 bg-gray-300 rounded text-sm"
            disabled={disabled || loading}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

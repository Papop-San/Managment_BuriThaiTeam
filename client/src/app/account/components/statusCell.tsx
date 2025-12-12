"use client";

import React, { useState } from "react";
import { AccountItem } from "@/types/accounts";

type StatusCellProps = {
  value: boolean;
  row: AccountItem;
};

export const StatusCell: React.FC<StatusCellProps> = ({
  value,
  row,
}) => {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(value);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${row.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ is_active: tempValue }),
        }
      );

      // update UI
      setStatus(tempValue);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setTempValue(status);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium">
      <span
        className={`w-3 h-3 rounded-full border-2 border-gray-300 ${
          status ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>

      {!editing ? (
        <>
          <span>{status ? "Active" : "Inactive"}</span>
          <button
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
            onClick={() => setEditing(true)}
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
            className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="ml-1 px-2 py-1 bg-gray-300 text-black rounded text-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

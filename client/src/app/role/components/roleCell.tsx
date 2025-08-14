"use client";

import React, { useState } from "react";
import { AccountInterface } from "@/app/role/page";

type RoleCellProps = {
  value: "admin" | "client";
  row: AccountInterface;
};

export const RoleCell: React.FC<RoleCellProps> = ({ value, row }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempRole, setTempRole] = useState(value);

  const handleSave = () => {
    row.role = tempRole; 
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempRole(row.role);
    setIsEditing(false);
  };

  const colorMap: Record<string, string> = {
    admin: "bg-blue-500",
    client: "bg-green-500",
  };

  return (
    <div className="inline-flex items-center gap-2 justify-center w-full">
      {!isEditing ? (
        <>
          <span
            className={`px-3 py-1 rounded-full text-white text-sm ${colorMap[tempRole]}`}
          >
            {tempRole}
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
            value={tempRole}
            onChange={(e) =>
              setTempRole(e.target.value as "admin" | "client")
            }
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="admin">admin</option>
            <option value="client">client</option>
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
};
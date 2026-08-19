"use client";

import { useState } from "react";
import { AddEmployeeModal } from "./AddEmployeeModal";

export function AddEmployeeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add Employee
      </button>

      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

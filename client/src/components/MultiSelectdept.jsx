import React, { useState } from "react";

const MultiSelect = ({ register, errors, data, field }) => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (name) => {
    setSelected((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((item) => item !== name)
        : [...prevSelected, name]
    );
  };

  return (
    <div className="mb-4">
      <label htmlFor={field} className="block text-white mb-1">{field}</label>
      <div className="relative w-full max-w-xs">
        <div
          className={`flex items-center justify-between p-3 bg-slate-300 rounded-lg cursor-pointer ${
            selected.length > 0 ? "shadow-lg" : "shadow-md"
          }`}
          onClick={() =>
            document.getElementById(`${field}-options`).classList.toggle("hidden")
          }
        >
          <span className="text-slate-950">
            {selected.length > 0 ? `${selected.length} Selected` : `Select ${field}`}
          </span>
          <span className="text-slate-950">
            <i
              className={`fa-solid ${
                selected.length > 0 ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            />
          </span>
        </div>
        <ul
          id={`${field}-options`}
          className="absolute z-10 bg-white rounded-lg shadow-md max-h-64 overflow-auto mt-2 hidden w-full"
        >
          {data.departments.map((dept) => (
            <li
              key={dept.name}
              className={`flex items-center px-3 py-2 cursor-pointer ${
                selected.includes(dept.name)
                  ? "bg-blue-100"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => toggleSelect(dept.name)}
            >
              <span
                className={`w-4 h-4 mr-2 rounded border ${
                  selected.includes(dept.name)
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-400"
                } flex items-center justify-center`}
              >
                {selected.includes(dept.name) && (
                  <i className="fa-solid fa-check text-white text-xs" />
                )}
              </span>
              <span className="text-slate-950">{dept.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <input
        id={field}
        type="hidden"
        value={selected}
        {...register(field.toLowerCase(), {
          required: `${field} is required`,
        })}
      />
      {errors?.[field.toLowerCase()] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[field.toLowerCase()].message}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;

import React, { useState } from 'react';

const MultiSelectyear = ({ register, errors,data,feild }) => {
  
  const [selected, setSelected] = useState([]);

  const toggleSelect = (dept) => {
    setSelected((prevSelected) =>
      prevSelected.includes(dept)
        ? prevSelected.filter((item) => item !== dept)
        : [...prevSelected, dept]
    );
    console.log(selected)
  };

  return (
    <div className="mb-4">
      <label htmlFor="dept" className="block text-white mb-1">{feild}</label>
      <div className="relative w-full max-w-xs">
        <div
          className={`flex items-center justify-between p-3 bg-slate-300 rounded-lg cursor-pointer ${
            selected.length > 0 ? "shadow-lg" : "shadow-md"
          }`}
          onClick={() => document.getElementById("dept-options").classList.toggle("hidden")}
        >
          <span className="text-slate-950">
            {selected.length > 0 ? `${selected.length} Selected` : `Select ${feild}`}
          </span>
          <span className="text-slate-950">
            <i className={`fa-solid ${selected.length > 0 ? "fa-chevron-up" : "fa-chevron-down"}`} />
          </span>
        </div>
        <ul
          id="dept-options"
          className="absolute z-10 bg-white rounded-lg shadow-md max-h-64 overflow-auto mt-2 hidden w-full"
        >
          {data.map((dept) => (
            <li
              key={dept}
              className={`flex items-center px-3 py-2 cursor-pointer ${
                selected.includes(dept) ? "bg-blue-100" : "hover:bg-gray-200"
              }`}
              onClick={() => toggleSelect(dept)}
            >
              <span
                className={`w-4 h-4 mr-2 rounded border ${
                  selected.includes(dept) ? "bg-blue-500 border-blue-500" : "border-gray-400"
                } flex items-center justify-center`}
              >
                {selected.includes(dept) && (
                  <i className="fa-solid fa-check text-white text-xs" />
                )}
              </span>
              <span className="text-slate-950">{dept}</span>
            </li>
          ))}
        </ul>
      </div>
      <input
        id="dept"
        type="hidden"
        value={selected}
        {...register("dept", { required: "{feild} is required" })}
      />
      {errors?.dept && <p className="text-red-500 text-sm mt-1">{errors.dept.message}</p>}
    </div>
  );
};

export default MultiSelectyear;

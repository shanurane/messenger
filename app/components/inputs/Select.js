"use client";

import ReactSelect from "react-select";

const Select = ({ label, value, onChange, options, disabled }) => {
  return (
    <div className="z-[100] ">
      <label className="text-sm text-gray-900 block font-medium leading-6">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisable={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          className={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Select;

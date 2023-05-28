import React from "react";

const TabButton = ({ selected, onClick, text }) => {
  return (
    <span
      onClick={onClick}
      className={`cursor-pointer p-2 text-sm font-medium ${
        selected && "border-b-2 border-slate-800"
      }`}
    >
      {text}
    </span>
  );
};

export default TabButton;

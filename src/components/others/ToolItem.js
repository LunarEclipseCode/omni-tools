import React from "react";

const ToolItem = ({ onClick, IconComponent, altText, toolName, description }) => (
  <div
    onClick={onClick}
    className="tool-item flex group relative transition-all duration-300 hover:scale-95 overflow-hidden items-center gap-6 rounded-lg shadow-lg hover:shadow-2xl outline-none bg-gray-800/70 hover:bg-gray-600/60 focus:bg-gray-700/70 cursor-pointer p-6 h-32"
  >
    <div className="h-24 w-24 flex items-center justify-center">
      {IconComponent && <IconComponent className="object-cover h-full w-full" />}
      {altText && <span className="sr-only">{altText}</span>}
    </div>
    <div className="flex flex-col flex-1">
      <div className="font-semibold text-white text-base">{toolName}</div>
      <div className="text-gray-300 text-sm">{description}</div>
    </div>
  </div>
);

export default ToolItem;

import React from "react";

export const CustomScrollbar = () => (
  <style>
    {`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #4B5563;
        border-top-right-radius: 0.34rem;
        border-bottom-right-radius: 0.34rem;
      }


      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #9CA3AF;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background-color: #1F2937;
        border-radius: 0.5rem;
        border-top-right-radius: 1.2rem;
        border-bottom-right-radius: 1.2rem;
        background-clip: padding-box; /* Ensure no white space */
      }

      textarea.custom-scrollbar {
        resize: none; /* Disable resizing */
        overflow-y: auto; /* Ensure scrollability */
        overflow-x: auto;
        border: 2px solid #4B5563;
        background-color: #1F2937;
        padding: 1rem;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        border-radius: 0.5rem;
      }
    `}
  </style>
);

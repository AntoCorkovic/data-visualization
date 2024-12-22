"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface DataTableProps {
  onFileUpload: (file: File) => Promise<string | undefined>;
}

const DataTable: React.FC<DataTableProps> = ({ onFileUpload }) => {
  console.log("onFileUpload received in DataTable (type):", typeof onFileUpload);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log("Files dropped in dropzone:", acceptedFiles);
      if (acceptedFiles.length > 0) setSelectedFile(acceptedFiles[0]);
    },
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
  });

  const handleUploadClick = async () => {
    if (!selectedFile) {
      console.warn("No file selected for upload.");
      alert("Please select a file first!");
      return;
    }

    console.log("File selected for upload:", selectedFile);
    console.log("Invoking onFileUpload in DataTable...");
    console.log("onFileUpload before invocation (type):", typeof onFileUpload);

    try {
      const result = await onFileUpload(selectedFile); // Explicitly invoke
      console.log("Upload result from onFileUpload:", result);
      setUploadResult(result || "Upload completed with no result.");
    } catch (err) {
      console.error("Error during file upload:", err);
      setUploadResult("File upload failed.");
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer"
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <p className="text-sm text-green-600">Selected File: {selectedFile.name}</p>
        ) : (
          <p>Drag and drop a file here, or click to select one</p>
        )}
      </div>
      <Button onClick={handleUploadClick} disabled={!selectedFile}>
        Upload File
      </Button>
      {uploadResult && (
        <div className="mt-4">
          <strong>Upload Result:</strong> <span>{uploadResult}</span>
        </div>
      )}
    </div>
  );
};

export { DataTable };

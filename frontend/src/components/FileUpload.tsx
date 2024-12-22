import React, { useState } from "react";

interface FilePreview {
  columns: string[];
  preview: Record<string, any>;
  file_url: string;
}

interface FileUploadProps {
  userId: string;
  onUploadComplete: (data: FilePreview) => void; // Callback when upload is complete
}

const FileUpload: React.FC<FileUploadProps> = ({ userId, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onUploadComplete(result); // Pass preview data back to parent
        setError(null);
      } else {
        setError(result.detail || "An error occurred during upload.");
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default FileUpload;

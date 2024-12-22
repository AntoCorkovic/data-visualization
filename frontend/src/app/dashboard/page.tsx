"use client";

import React, { useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/ui/data-table";
import { supabase } from "@/utils/supabase/client";

export default function DashboardPage() {
  const handleFileUpload = useCallback(async (file: File) => {
    console.log("File received for upload in handleFileUpload:", file);

    try {
      // Target the correct route
      const { data, error } = await supabase.storage
        .from("file-storage")
        .upload(`uploads/${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error.message);
        return "Upload failed.";
      }

      console.log("Uploaded file data:", data);
      return `File uploaded: ${file.name}`;
    } catch (err) {
      console.error("Unexpected error during file upload:", err);
      return "An unexpected error occurred.";
    }
  }, []);

  console.log("handleFileUpload in DashboardPage (type):", typeof handleFileUpload);

  return (
    <div className="flex h-screen">
      <AppSidebar setCurrentView={() => {}} />
      <main className="flex-1 p-6">
        <DataTable onFileUpload={handleFileUpload} /> {/* Explicitly pass the function */}
      </main>
    </div>
  );
}

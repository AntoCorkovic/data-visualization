"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";

export function DataTable() {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<(string | number)[][]>([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
    maxFiles: 1,
  });

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop();

    if (fileExtension === "csv") {
      Papa.parse(selectedFile, {
        complete: (results) => {
          const parsedData = results.data as string[][];
          const withIds = parsedData.slice(1).map((row, index) => [index + 1, ...row]);
          setColumns(["ID", ...parsedData[0]]);
          setData(withIds);
          setShowTable(true);
        },
        skipEmptyLines: true,
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as string[][];
        const withIds = sheet.slice(1).map((row, index) => [index + 1, ...row]);
        setColumns(["ID", ...sheet[0]]);
        setData(withIds);
        setShowTable(true);
      };
      reader.readAsBinaryString(selectedFile);
    } else {
      alert("Unsupported file type! Please upload a CSV or Excel file.");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="space-y-4">
      {!showTable ? (
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
      ) : null}

      {!showTable && selectedFile && (
        <Button onClick={handleFileUpload} className="mt-4">
          Upload File
        </Button>
      )}

      {showTable && (
        <>
          {/* Table with Pagination */}
          <ScrollArea className="w-full rounded-md border overflow-hidden">
            <div className="w-max">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableHead key={index} className="whitespace-nowrap">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length > 0 ? (
                    currentData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <TableCell key={colIndex} className="whitespace-nowrap">
                            {cell || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center">
                        No data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

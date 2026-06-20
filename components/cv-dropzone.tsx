"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { extractTextFromPdf } from "@/lib/pdf-extract";
import { extractTextFromDocx } from "@/lib/docx-extract";
import { stripPii } from "@/lib/strip-pii";

interface CvDropzoneProps {
  onExtracted: (text: string, fileName: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

export function CvDropzone({ onExtracted, onError, disabled }: CvDropzoneProps) {
  const [parsing, setParsing] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        onError("File is too large (max 10 MB). Try a smaller CV.");
        return;
      }

      setParsing(true);
      try {
        let text = "";
        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          text = await extractTextFromPdf(file);
        } else if (
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith(".docx")
        ) {
          text = await extractTextFromDocx(file);
        } else {
          text = await file.text();
        }

        const stripped = stripPii(text);

        if (stripped.trim().length < 50) {
          onError(
            "Could not read enough text from this file. Try a different PDF, Word document, or plain text (.txt) version of your CV."
          );
          return;
        }

        onExtracted(stripped, file.name);
      } catch (err) {
        console.error(err);
        onError("Failed to read your CV. Please try a different file.");
      } finally {
        setParsing(false);
      }
    },
    [onExtracted, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: disabled || parsing,
  });

  return (
    <div
      {...getRootProps()}
      className={[
        "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer",
        "transition-all duration-200 select-none",
        isDragActive
          ? "border-teal bg-teal-light scale-[1.01]"
          : "border-slate-200 bg-white hover:border-teal hover:bg-slate-50",
        disabled || parsing ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <input {...getInputProps()} />

      {parsing ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-teal-light border-t-teal rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Reading your CV…</p>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl" aria-hidden>📄</div>
          <p className="text-teal font-semibold text-lg">Drop it here!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center text-3xl" aria-hidden>
            📄
          </div>
          <div>
            <p className="text-slate-700 font-semibold text-lg">
              Drop your CV file here or{" "}
              <span className="text-teal underline underline-offset-2">click to choose a file</span>
            </p>
            <p className="text-slate-400 text-sm mt-1.5">
              PDF, Word (.docx), or plain text · Your email, phone &amp; links are removed
              before any AI processing · Nothing is ever stored
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

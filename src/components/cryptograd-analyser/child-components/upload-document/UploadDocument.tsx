import React, { useState, useRef } from "react";
import "./UploadDocument.scss";
import upload from "../../../../assets/icons/upload.svg";
import cross from "../../../../assets/icons/cross.svg";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import privacy from "../../../../assets/icons/privacy_tip.png";
import draft from "../../../../assets/icons/draft.png";
import close from "../../../../assets/icons/close_small.png";

interface UploadDocumentProps {
  setMessage: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  source: any; // Adjust as necessary
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  setMessage,
  isOpen,
  onClose,
  source,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [warning, setWarning] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false); // State for drag and drop
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalFileLimit = 50;
  const maxFileSize = 100 * 1024 * 1024; // 100 MB in bytes
  const allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "zip"]; // Allowed file extensions
  const projectId = useSelector((state: any) => state.queryParams.projectId);
  const [uploadedDocumentList, setUploadedDocumentList] =
    React.useState<UploadedDocumentList>({
      message: "",
      data_sources: [],
    });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle file selection and validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    processFiles(files);
  };

  // Process and validate files
  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const warnings: string[] = [];

    for (const file of files) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        selectedFiles.some((selectedFile) => selectedFile.name === file.name)
      ) {
        warnings.push(`The file "${file.name}" is already selected.`);
      } else if (!allowedExtensions.includes(fileExtension || "")) {
        warnings.push(`The file "${file.name}" has an unsupported file type.`);
      } else if (file.size > maxFileSize) {
        warnings.push(`The file "${file.name}" exceeds the 100MB limit.`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length + selectedFiles.length > totalFileLimit) {
      warnings.push(`You can only upload up to ${totalFileLimit} files.`);
    }

    if (warnings.length > 0) {
      setWarning(warnings.join(" "));
      return;
    }

    setWarning("");
    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  // Handle removing selected files
  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    setWarning("");
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("project_id", projectId.toString());
    selectedFiles.forEach((file) => {
      formData.append("hidden_files", file);
    });

    let apiUrl = `${process.env.REACT_APP_BACKEND_SERVICE_URL}projects/upload-files/`;
    if (source === "vertex") {
      apiUrl = `${process.env.REACT_APP_BACKEND_SERVICE_URL}projects/upload-files/`;
    } else if (source === "chatbot") {
      apiUrl = `${process.env.REACT_APP_BACKEND_SERVICE_URL}chatbot/upload-files/`;
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal, // Abort signal for cancellation
      });
      const result = await response.json();

      if (
        result.message ===
        ("Files uploaded and embeddings generated successfully." ||
          "Files uploaded successfully, but some failed to generate embeddings.")
      ) {
        setSelectedFiles([]);
        toast.success("Files uploaded successfully!", { duration: 1000 });
        setMessage("Files uploaded successfully!");
        const chatbotDataListUrl = `${process.env.REACT_APP_BACKEND_SERVICE_URL}chatbot/chatbot-data-list/${projectId}`;
        const dataResponse = await fetch(chatbotDataListUrl, { method: "GET" });
        const dataResult = await dataResponse.json();
        console.log("Chatbot data list:", dataResult);
        setUploadedDocumentList(dataResult);
        console.log("Stored Data", uploadedDocumentList);
        onClose();
      } else {
        setMessage("");
        setWarning("Upload failed. Please try again.");
        toast.error("Upload failed. Please try again.", { duration: 1000 });
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.error("Upload operation was aborted.", { duration: 1000 });
      } else {
        console.error("Error uploading files:", error);
        setWarning("Upload failed. Please try again.");
        toast.error("Upload failed. Please try again.", { duration: 1000 });
      }
    } finally {
      setUploading(false);
    }

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Clear selected files
  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setWarning("");
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (uploading && abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the current file upload
    }
    setWarning("");
    setSelectedFiles([]);
    onClose();
  };

  // Handle drag and drop events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files
      ? Array.from(event.dataTransfer.files)
      : [];
    processFiles(files);
  };

  if (!isOpen) return null;
  interface UploadedDocument {
    file_name: string;
    file_type: string;
  }

  interface UploadedDocumentList {
    message: string;
    data_sources: UploadedDocument[];
  }

  console.log("dataSource", uploadedDocumentList.data_sources);

  return (
    <div className="upload-modal-overlay">
      {/* {Object.keys(uploadedDocumentList).length > 0 ? ( */}
      {uploadedDocumentList.data_sources &&
      uploadedDocumentList.data_sources.length > 0 ? (
        <div className="addMoreWrapper">
          <div className="uploadFilesTitle">Upload Files</div>
          {/* <div className="uploadFilesText">
            Create a folder group the files (optional)
          </div> */}
          <div className="ListWrapper">
            {uploadedDocumentList.data_sources.map((file, index) => (
              <div className="uploadFilesList" key={index}>
                <div className="fileItem">
                  <div className="iconHolder">
                    <img src={draft} alt="draft" />
                  </div>
                  <div className="fileName">{file.file_name}</div>
                  <div className="iconHolder">
                    <img src={close} alt="close" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <input
            type="file"
            multiple
            className="file-input"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
            style={{ display: "none" }}
          />
          <div className="addMoreIcon" onClick={triggerFileInput}>
            <div className="uploadIcon">
              <img src={upload} alt="upload" />
            </div>
            <div className="addMoreText" style={{ marginLeft: "5px" }}>
              Add more
            </div>
          </div>
          <div className="informationBox">
            <div className="informationIcon">
              <img src={privacy} alt="privacy" />
            </div>
            <div className="information">
              These documents will be saved to your vertex instance and only
              accessible to you and your workspace admins. You can delete them
              at any time.
            </div>
          </div>
          {/* <div className="filesInfoWrapper">
      <div className="informationHolder">
        <div className="filesInfoTitle">AI processing time :</div>
        <div className="fileInfo">11 minutes</div>
      </div>
      <div className="informationHolder">
        <div className="filesInfoTitle">Total size :</div>
        <div className="fileInfo">32.5 MB</div>
      </div>
      <div className="informationHolder">
        <div className="filesInfoTitle">Project Usage :</div>
        <div className="fileInfo">98.56 MB/ 1GB</div>
      </div>
      <div className="informationHolder">
        <div className="filesInfoTitle">Total files :</div>
        <div className="fileInfo">121/1000</div>
      </div>
    </div> */}
          <div className="ButtonHolder">
            <button className="cancel-button" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="action-button" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-modal d-flex center-align just-center">
          <div
            className={`upload-wrapper d-flex center-align just-center ${
              isDragOver ? "drag-over" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <Toaster position="top-center" reverseOrder={false} />{" "}
              {/* Toast notifications */}
              <div className="upload-icon">
                <img src={upload} alt="upload" />
              </div>
              <div className="upload-message d-flex flex-dir-col gap-4px">
                <span className="h7">Drop your File here, or browse</span>
                <span className="h7 grey">
                  Support: PDF, Word, Doc, Excel, and Zip
                </span>
                <span className="h7 grey">Up to 50 Files</span>
              </div>
              <input
                type="file"
                multiple
                className="file-input"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                style={{ display: "none" }}
              />
              {warning && <p className="warning-message">{warning}</p>}
              {selectedFiles.length > 0 && (
                <div className="uploaded-files-list">
                  <div className="pb-12">
                    <span className="h7 grey">Selected Files: </span>{" "}
                    <span className="h7-b ">{selectedFiles.length}/50</span>{" "}
                  </div>
                  <div className="file-scroll">
                    {selectedFiles.map((file, index) => (
                      <div
                        className="d-flex just-space file-item-list"
                        key={index}
                      >
                        <span className="h8 grey">{file.name}</span>
                        <button
                          className="remove-file d-flex"
                          onClick={() => handleRemoveFile(file.name)}
                          aria-label={`Remove ${file.name}`}
                          disabled={uploading} // Disable file removal during upload
                        >
                          <img src={cross} alt="" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {uploading && (
                <div className="upload-progress">
                  <p>Uploading...</p>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p>
                    {progress}% •{" "}
                    {Math.ceil((progress / 100) * selectedFiles.length)}/
                    {selectedFiles.length} Files
                  </p>
                </div>
              )}
              <button onClick={triggerFileInput} className="upload-files">
                <span className="h6-b link">
                  {selectedFiles.length > 0 ? "Add More" : "Upload Files"}
                </span>
              </button>
              <div className="d-flex gap-8 just-center">
                <button
                  onClick={handleUpload}
                  className="upload-button"
                  disabled={selectedFiles.length === 0 || uploading}
                >
                  Start Upload
                </button>

                <button
                  onClick={clearSelectedFiles}
                  className="clear-button"
                  disabled={selectedFiles.length === 0 || uploading} // Disable clearing during upload
                >
                  Clear Selected Files
                </button>

                <button onClick={handleCloseModal} className="close-button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocument;

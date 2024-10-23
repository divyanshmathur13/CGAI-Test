import React, { useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select";
interface Document {
  file_name: string;
  file_type: string;
}

interface CustomDropdownProps {
  projectId: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  projectId,
  onSelect,
}) => {
  const theme: Theme = useTheme();
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchDocuments = async () => {
    if (documentList.length === 0) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVICE_URL}chatbot/chatbot-data-list/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDocumentList(data.data_sources || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    }
  };

  const handleSelectOpen = async () => {
    await fetchDocuments();
    if (documentList.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setIsOpen(false);
  };

  const handleFormClick = async () => {
    if (documentList.length === 0) {
      await fetchDocuments();
    }
    if (documentList.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <FormControl
      sx={{ width: 200, display: "flex", alignItems: "center" }}
      onClick={handleFormClick}
    >
      <Select
        value={selectedDocument || ""}
        onChange={handleSelectChange}
        onOpen={handleSelectOpen}
        displayEmpty // Allows showing a placeholder when no value is selected
        renderValue={(selected) =>
          documentList.length === 0
            ? "No documents"
            : selected || `Documents (${documentList.length})`
        } // Conditionally display the placeholder or selected value
        sx={{ textAlign: "center", color: "black" }}
      >
        {documentList.length === 0 ? (
          <MenuItem value="" disabled>
            No documents available
          </MenuItem>
        ) : (
          documentList.map((doc, index) => (
            <MenuItem key={index} value={doc.file_name}>
              {doc.file_name} - {doc.file_type}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default CustomDropdown;

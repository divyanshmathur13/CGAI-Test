import React, { useState, useRef } from "react";
import "./CryptoGradAiSummary.scss";
import "../../styles/common-styles.scss";
import uploadIcon from "../../assets/icons/upload-empty.svg";
import upload from "../../assets/icons/uploadIcon.png";
import privacy from "../../assets/icons/privacy_tip.png";
import draft from "../../assets/icons/draft.png";
import close from "../../assets/icons/close_small.png";
import UploadDocument from "../cryptograd-analyser/child-components/upload-document/UploadDocument";
import { useSelector } from "react-redux";
import reset from "../../assets/icons/reset.svg";
import { PROMPT_API_RESPONSE, summaryApi } from "./constants/mock";
import toast, { Toaster } from "react-hot-toast";
import CustomDropdown from "../DropDown/CustomDropdown";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
function CryptoGradAiSummary() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Using useRef for interval
  const abortControllerRef = useRef<AbortController | null>(null); // Using useRef for AbortController
  const projectId = useSelector((state: any) => state.queryParams.projectId);
  const empID = useSelector((state: any) => state.queryParams.empID);

  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("private");
  const [message, setMessage] = useState("");
  const resetData = async () => {
    try {
      // Perform API call to delete data
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}chatbot/chatbot-data/all-delete/${projectId}/`,
        {
          method: "DELETE",
          headers: {
            "user-agent": "", // Add any additional headers if needed
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (response) {
        toast.success("Data Deleted Successfully ", { duration: 1000 });
      }

      // You can do something with the formattedData here (e.g., update state, etc.)
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.error("Error fetching AI response:", error);
      }
    }
  };

  const handleAskVertex = async () => {
    if (!query.trim()) {
      toast("Please enter your Query first", { duration: 1000 });
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Stop the interval
      intervalRef.current = null; // Clear the interval reference
    }

    setAiGeneratedSummary("");
    setIsLoading(true); // Start loading

    // Create a new AbortController for the current request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const requestBody = {
        project_id: projectId,
        user_query: query,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}chatbot/chat_response/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: abortController.signal, // Pass the abort controller's signal
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chatbot response");
      }

      setIsLoading(false);
      const result = await response.json();
      const fullText = result.bot_response; // Full chatbot response text

      if (!fullText || typeof fullText !== "string") {
        console.error("Invalid text");
        return;
      }

      let currentChar = 0;
      setAiGeneratedSummary(""); // Clear previous content

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Simulate typewriter effect
      intervalRef.current = setInterval(() => {
        if (currentChar < fullText.length) {
          setAiGeneratedSummary(
            (prevSummary) => prevSummary + fullText[currentChar]
          );
          currentChar += 1;
        } else {
          clearInterval(intervalRef.current!); // Stop the interval once the full text is displayed
          intervalRef.current = null; // Set interval to null to indicate it's cleared
        }
      }, 10); // Faster typing speed (10 milliseconds per character)
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("API call was aborted");
      } else {
        console.error("Error fetching chatbot response:", error);
        setAiGeneratedSummary(
          "Error fetching response. Please try again later."
        );
      }
      setIsLoading(false);
    }
  };

  const resetMethod = () => {
    setIsLoading(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Stop the interval
      intervalRef.current = null; // Clear the interval reference
    }

    // Abort the ongoing API call, if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel the fetch request
    }

    setQuery("");
    setSearchedQuery("");
    setAiGeneratedSummary("");
    toast.success("All settings have been refreshed.");
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setShowDropdown(true);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleInputChange = (e: any) => {
    setQuery(e.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handlePromptSelect = (prompt: any) => {
    setQuery(prompt);
    setSearchedQuery("");
    setShowDropdown(false);
  };
  const handleDocumentSelect = (documentName: string) => {
    setQuery(documentName); // Set the query to the selected document name
    toast.success(`Selected document: ${documentName}`); // Optional: Show a success message
  };
  return (
    <div className="div-main d-flex flex-dir-col">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Toast notifications */}
      <div className="div-header d-flex center-align just-space">
        <span className="h7-b">Assistance</span>
        <div className="d-flex gap-8">
          <CustomDropdown
            projectId={projectId}
            onSelect={handleDocumentSelect}
          />
          <div onClick={resetMethod} className="reset-btn">
            <img src={reset} alt="" />
            <span className="h7 grey">Refresh</span>
          </div>
          <div onClick={resetData} className="reset-btn">
            <span className="h7 grey">Reset</span>
          </div>
        </div>
      </div>
      <div className="div-body d-flex">
        <div className="div-left d-flex flex-dir-col">
          <div className="left-up d-flex just-space flex-dir-col">
            <textarea
              className="query-textarea"
              placeholder="Enter your query here"
              value={query}
              onChange={handleInputChange}
            />

            <div>
              <div className="query-actions">
                <div className="d-flex gap-8">
                  <button className="load-prompt" onClick={toggleDropdown}>
                    Load Prompt
                  </button>
                </div>

                <div className="d-flex center-align ">
                  <span className="h7 grey">{query.length}/100000</span>
                </div>
              </div>

              {showDropdown && (
                <div className="prompt-dropdown">
                  <div className="search-prompt">
                    <input
                      type="text"
                      placeholder="Search for a prompt"
                      className="prompt-search"
                      value={searchedQuery}
                      onChange={(e) => setSearchedQuery(e.target.value)}
                    />
                  </div>

                  <div className="category-buttons">
                    <div className="club-btns">
                      <button
                        className={`category-btn ${
                          selectedCategory === "private" ? "active" : ""
                        }`}
                        onClick={() => handleCategorySelect("private")}
                      >
                        Private
                      </button>
                      <button
                        className={`category-btn ${
                          selectedCategory === "team" ? "active" : ""
                        }`}
                        onClick={() => handleCategorySelect("team")}
                      >
                        Team
                      </button>
                      <button
                        className={`category-btn ${
                          selectedCategory === "vertex" ? "active" : ""
                        }`}
                        onClick={() => handleCategorySelect("vertex")}
                      >
                        Vertex
                      </button>
                    </div>
                  </div>

                  <div className="prompt-list">
                    {PROMPT_API_RESPONSE[selectedCategory].map(
                      (prompt: any, index: any) => (
                        <div
                          key={index}
                          className="prompt-item"
                          onClick={() => handlePromptSelect(prompt)}
                        >
                          <span className="h7">{prompt}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="left-down d-flex flex-dir-col just-space">
            <div className="upload-area">
              <div className="upload-icon gap-8" onClick={openUploadModal}>
                <img src={uploadIcon} alt="Upload" />
                <div className="d-flex flex-dir-col gap-4">
                  <span className="h7-b grey">Click Here to Upload Files</span>
                  <span className="h8 grey">
                    Support: PDF, Word, Doc, Excel, and Zip
                  </span>
                  <span className="h8 grey">Up to 50 Files</span>
                </div>
              </div>
              <UploadDocument
              setMessage={setMessage}
                isOpen={isUploadModalOpen}
                onClose={closeUploadModal}
                source="chatbot"
              />
            </div>
            {/* <div className="uploadFilesList">
                <div className="fileItem">
                  <div className="iconHolder">
                    <img src={draft} alt="draft" />
                  </div>
                  <div className="fileName">Demo.pdf</div>
                  <div className="iconHolder">
                    <img src={close} alt="close" />
                  </div>
                </div>
              </div>
            <div className="listButtonWrapper">
              <div className="AddFileButton" >
                Use Internet
                <ToggleOffIcon />
              </div>
              <div className="AddFileButton">
                <AttachFileIcon />
                Add files
              </div>
            </div> */}
            <button className="action-button-ai" onClick={handleAskVertex}>
              <span> Ask Vertex</span>
            </button>
          </div>
        </div>

        <div className="div-right d-flex just-center center-align">
          <textarea
            className="div-textarea"
            readOnly
            placeholder={
              isLoading
                ? "Vertex is generating response..."
                : "Ask Vertex For your Query"
            }
            value={aiGeneratedSummary}
          />
        </div>
      </div>
    </div>
  );
}

export default CryptoGradAiSummary;

import React, { useState, useRef, useEffect } from "react";
import "../cryptograd-analyser/CryptoGradAnalyser.scss";
import "../../styles/common-styles.scss";
import AnalyserHeader from "./child-components/analyser-header/AnalyserHeader";
import DataTable from "./child-components/data-table/DataTable";
import DataSummary from "./child-components/data-summary/DataSummary";
import UploadDocument from "./child-components/upload-document/UploadDocument";
import expand from "../../assets/icons/expand_content.svg";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import draft from "../../assets/icons/draft.png";
import drag_indicator from "../../assets/icons/drag_indicator.png";
function CryptoGradAnalyser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShortAnswer, setIsShortAnswer] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [promptId, setPromptId] = useState<number | null>(null);
  const [aiResponseData, setAiResponseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [summaryText, setSummaryText] = useState(""); // State for summary text
  const [summaryLoading, setSummaryLoading] = useState(false); // State for summary loading
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [showUploadedDocuments, setShowUploadedDocuments] = useState(true);
  const [message, setMessage] = useState("");

  interface DataSource {
    file_name: string;
  }

  const abortControllerRef = useRef<AbortController | null>(null);
  const summaryAbortControllerRef = useRef<AbortController | null>(null);

  const projectId = useSelector((state: any) => state.queryParams.projectId);

  // Define the reset method
  const resetState = () => {
    // Abort any ongoing API calls
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (summaryAbortControllerRef.current) {
      summaryAbortControllerRef.current.abort();
    }

    // Reset state
    setInputValue("");
    setPromptId(null);
    setAiResponseData([]);
    setIsShortAnswer(true);
    setLoading(false);
    setSummaryText(""); // Reset summary text
    setSummaryLoading(false); // Reset summary loading

    // Create new AbortControllers for future requests
    abortControllerRef.current = new AbortController();
    summaryAbortControllerRef.current = new AbortController();

    toast.success("All settings have been refreshed.");
    setShowUploadedDocuments(true);
    fetchFileName();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleAnswer = () => {
    setIsShortAnswer(!isShortAnswer);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Function to handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    const createPromptPayload = {
      project_id: projectId,
      prompt_text: inputValue,
    };
    setShowUploadedDocuments(false);
    // Initialize a new AbortController
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}projects/prompts/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPromptPayload),
          signal: abortControllerRef.current.signal, // Attach the abort signal
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setPromptId(result.id);

      await fetchAiResponse(result.id);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.error("Error creating prompt:", error);
      }
    }
  };

  const fetchAiResponse = async (promptId: number) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}projects/ai-response/${projectId}/?prompt_id=${promptId}`,
        {
          method: "GET",
          headers: {
            "user-agent": "",
          },
          signal: abortControllerRef.current?.signal, // Attach the abort signal
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json(); // Assuming the server returns a JSON error message
          const errorMessage = errorData?.error || "Resource not found";
          toast.error(errorMessage); // Show the error message in the toast
        }
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      const formattedData = result.map((item: any) => {
        const aiResponseData = item.ai_response;
        return {
          Document: item.file_name,
          ...aiResponseData,
        };
      });
      setDataSources(result);
      setAiResponseData(formattedData);
      setLoading(false);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.error("Error fetching AI response:", error);
      }
      setLoading(false);
    }
  };

  // Fetch summary function for DataSummary component
  const fetchSummary = async () => {
    if (!promptId) return;

    // Initialize a new AbortController for summary
    summaryAbortControllerRef.current = new AbortController();
    setSummaryLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}projects/summarize/${projectId}?prompt_id=${promptId}`,
        {
          method: "GET",
          signal: summaryAbortControllerRef.current.signal, // Attach the abort signal
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.summaries && data.summaries.length > 0) {
        setSummaryText(data.summaries[0]);
      } else {
        setSummaryText("No summary available.");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Summary fetch request aborted");
      } else {
        console.error("Error fetching summary:", error);
        setSummaryText("Error fetching summary.");
      }
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchFileName = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}projects/document-list/${projectId}`, // Fixed URL
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setDataSources(data.data_sources || []); // Assuming your API response structure has a field `data_sources`
    } catch (error: any) {
      console.error("Error fetching file names:", error);
      toast.error("Error fetching file names."); // Show an error toast
    }
  };


  useEffect(() => {
    const currentUrl = window.location.href;
    const isOnSpecificUrl = currentUrl.includes("/insight-ai?projectId="); // Check if on the specific URL

    if (message === "Files uploaded successfully!" || isOnSpecificUrl) {
      fetchFileName(); 
    }
  }, [message]);


  return (
    <div className="main-div d-flex flex-dir-col">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Pass the reset function as a prop */}
      <AnalyserHeader onReset={resetState} />

      <div className="action-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Ask Vertex"
            className="search-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress} // Handle "Enter" key press
          />
          <button
            className="search-button"
            disabled={!inputValue.trim()}
            onClick={handleSearch}
          >
            <span>&rarr;</span>
          </button>
        </div>

        <div className="button-container">
          <div className="toggle-container">
            <label className="toggle-label">Use Internet</label>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>

          <button className="action-button" onClick={openModal}>
            <span>+ Add Documents</span>
          </button>

          <UploadDocument
            setMessage={setMessage}
            isOpen={isModalOpen}
            onClose={closeModal}
            source="vertex"
          />
        </div>
      </div>

      <div className="button-bar">
        <div className="dropdown-button">
          <button className="btn dropdown-toggle" onClick={toggleAnswer}>
            <span>{isShortAnswer ? "Short answer" : "Long answer"}</span>
            <div className="d-flex just-center center-align">
              <img src={expand} alt="" />
            </div>
          </button>
        </div>
      </div>
      {dataSources.length > 0 && showUploadedDocuments && (
        <div className="uploadedDocuments">
          <div className="documentTable">
            <table className="documentTable">
              <thead>
                <tr>
                  <th>
                    <div className="square"></div>
                  </th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((file, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> {/* Display index */}
                    <td className="documentList">
                      <div className="iconHolder">
                        <img src={drag_indicator} />
                      </div>
                      <div className="iconHolder">
                        <img src={draft} />
                      </div>
                      {file.file_name}
                    </td>{" "}
                    {/* Display file name */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DataTable data={aiResponseData} loading={loading} />

      <DataSummary
        prompt_id={promptId}
        summaryText={summaryText}
        loading={summaryLoading}
        fetchSummary={fetchSummary}
      />
    </div>
  );
}

export default CryptoGradAnalyser;

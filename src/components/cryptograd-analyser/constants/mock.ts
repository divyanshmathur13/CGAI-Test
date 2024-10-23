
export const uploadFilesPayload = {
    userId: 4,
    hidden_files: [
      '/Users/sahil/Downloads/RILLR19012024.pdf',
    ],
  };
  
  export const uploadFilesResponse = {
    message: "Files uploaded and embeddings generated successfully.",
    data_sources: [
      "RILLR19012024.pdf"
    ],
  };
  


  export const documentListPayload = {
    id: 4,
  };


  export const documentListResponse = {
    message: "Files retrieved successfully.",
    data_sources: [
      {
        file_name: "file1",
        file_type: "pdf",
      },
      {
        file_name: "file2",
        file_type: "doc",
      },
      // Add more files if needed
    ],
  };
  

  export const createPromptPayload = {
    user: 4,
    prompt_text: "GIVE ME the financial analysis of reliance.",
  };
  


  export const createPromptResponse = {
    id: 4,
    user: 4,
    prompt_text: "GIVE ME the financial analysis of reliance.",
    created_at: "2024-10-08T07:10:07.295119Z"
  };
  

  export const aiResponsePayload = {
    prompt_id: 2,
  };
  

  export const aiResponse = [
    {
      document_id: 1,
      file_name: "file1",
      ai_response: {
        "document_id": 25,
        "file_name": "2009-2010.pdf",
        "ai_response": {
          "Current Ratio": "1.12",
          "Debt-Equity Ratio": "Not provided",
          "Debt Service Coverage Ratio": "Not provided",
          "Return on Equity Ratio": "Not provided",
          "Inventory Turnover Ratio": "7.31",
          "Trade Receivables Turnover Ratio": "Not provided",
          "Trade Payables Turnover Ratio": "Not provided",
          "Net Capital Turnover Ratio": "Not provided",
          "Total Revenue": "₹ 6,14,181 crore",
          "Net Cash Outflows": "₹ 3,424 crore",
          "Return on Net Worth": "10.3%"
        },
      trade_log_id: 3,
    },
    },
    {
        document_id: 2,
        file_name: "file2",
        ai_response: {
          "document_id": 25,
          "file_name": "2009-2010.pdf",
          "ai_response": {
            "Current Ratio": "1.12",
            "Debt-Equity Ratio": "Not provided",
            "Debt Service Coverage Ratio": "Not provided",
            "Return on Equity Ratio": "Not provided",
            "Inventory Turnover Ratio": "7.31",
            "Trade Receivables Turnover Ratio": "Not provided",
            "Trade Payables Turnover Ratio": "Not provided",
            "Net Capital Turnover Ratio": "Not provided",
            "Total Revenue": "₹ 6,14,181 crore",
            "Net Cash Outflows": "₹ 3,424 crore",
            "Return on Net Worth": "10.3%"
          },
        trade_log_id: 3,
      },
      }

  ];
  

  export const summaryApi =
  {
    "summaries":["AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing  AI generated Thing AI generated Thing yes "]
  }
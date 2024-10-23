import React from 'react';
import './DataSummary.scss';

const DataSummary = ({
  prompt_id,
  summaryText,
  loading,
  fetchSummary,
}: {
  prompt_id: any;
  summaryText: string;
  loading: boolean;
  fetchSummary: () => void;
}) => {
  return (
    <div className="summary-container">
      <button
        className="summary-button"
        disabled={!prompt_id}
        onClick={fetchSummary}
      >
        Summary
      </button>

      <textarea
        className="summary-textarea"
        readOnly
        value={loading ? 'Fetching summary, please wait...' : summaryText}
        rows={3}
      />
    </div>
  );
};

export default DataSummary;

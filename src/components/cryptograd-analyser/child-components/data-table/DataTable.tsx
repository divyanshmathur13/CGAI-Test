import React from 'react';
import './DataTable.scss';
import '../../../../styles/common-styles.scss';
import emptyState from '../../../../assets/icons/upload-doc-empty.svg';

interface DataTableProps {
  data: any[];
  loading: boolean; // Add loading prop
}

function DataTable({ data, loading }: DataTableProps) {
    return (
        <div className='wrapper-div'>
            <div className="table-container">
                {loading ? ( // Show loader while data is being fetched
                    <div className="loader d-flex just-center center-align height-100">
                        <span>Loading...</span> {/* You can replace this with a spinner/loader icon */}
                    </div>
                ) : data.length === 0 ? ( // Check if the data array is empty
                    <div className="empty-message d-flex just-center center-align">
                        <div className='d-flex flex-dir-col gap-16 just-center'>
                            <div className='d-flex just-center'>
                                <img className='empty-img' src={emptyState} alt="No data available" />
                            </div>
                            <span className='h7 grey'>Upload Documents to see the data in Table.</span>
                        </div>
                    </div>
                ) : (
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>
                                    <span className='h7-b'>S No.</span>
                                </th>
                                {Object.keys(data[0]).map((key, index) => (
                                    <th key={index}>
                                        <span className='h7-b'>{key.replace(/_/g, ' ')}</span> 
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td><span className='h7'>{rowIndex + 1}</span></td>
                                    {Object.keys(row).map((key, colIndex) => (
                                        <td key={colIndex}>
                                            <span className='h7'>{row[key]}</span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default DataTable;

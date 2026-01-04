/**
 * 条款表格组件
 * 用于显示条款中的表格内容，带有特殊样式
 */

import { ReactNode } from 'react';

interface TableColumn {
  header: string;
  accessor: string;
}

interface TableRow {
  [key: string]: ReactNode;
}

interface TermsTableProps {
  columns: TableColumn[];
  rows: TableRow[];
}

export function TermsTable({ columns, rows }: TermsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="terms-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
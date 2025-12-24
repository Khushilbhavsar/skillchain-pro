// Export Service for PDF and Excel generation
// Client-side only, no backend dependencies

import html2pdf from 'html2pdf.js';

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
}

// Export to PDF using html2pdf
export async function exportToPDF(
  data: Record<string, any>[],
  columns: ExportColumn[],
  title: string,
  filename: string
): Promise<void> {
  // Create HTML table
  const tableHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #1e40af; margin-bottom: 20px; font-size: 24px;">${title}</h1>
      <p style="color: #666; margin-bottom: 20px; font-size: 12px;">Generated on ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #1e40af; color: white;">
            ${columns.map((col) => `<th style="padding: 12px 8px; text-align: left; border: 1px solid #ddd;">${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map((row, idx) => `
            <tr style="background-color: ${idx % 2 === 0 ? '#f9fafb' : 'white'};">
              ${columns.map((col) => `<td style="padding: 10px 8px; border: 1px solid #ddd;">${formatValue(row[col.key])}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="color: #999; margin-top: 20px; font-size: 10px;">Total Records: ${data.length}</p>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = tableHtml;

  const opt = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const },
  };

  await html2pdf().set(opt).from(element).save();
}

// Export to Excel (CSV format for simplicity)
export function exportToExcel(
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename: string
): void {
  // Create CSV content
  const headers = columns.map((col) => col.header).join(',');
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = formatValue(row[col.key]);
      // Escape quotes and wrap in quotes if contains comma
      if (value.includes(',') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');

  // Create download link
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper to format values for export
function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// Export analytics chart as image
export async function exportChartToPNG(
  chartElement: HTMLElement,
  filename: string
): Promise<void> {
  const opt = {
    margin: 0,
    filename: `${filename}.png`,
    image: { type: 'png' as const, quality: 1 },
    html2canvas: { scale: 2 },
  };

  await html2pdf().set(opt).from(chartElement).outputImg('dataurlnewwindow');
}

export const exportService = {
  exportToPDF,
  exportToExcel,
  exportChartToPNG,
};

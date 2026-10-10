import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportOptions {
  filename?: string;
  onProgress?: (status: string) => void;
}

export async function exportReportToPdf(
  elementId: string,
  options: PdfExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  const { filename = 'seo-audit-report.pdf', onProgress } = options;

  if (onProgress) onProgress('Preparing document layout and rendering elements...');

  // Ensure scroll is at top so canvas captures from top
  const originalScrollPos = window.scrollY;
  window.scrollTo(0, 0);

  try {
    if (onProgress) onProgress('Capturing high-resolution visual report with html2canvas...');

    // Render DOM to high-res canvas (scale 2 for crisp print typography)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    if (onProgress) onProgress('Building multi-page PDF pages with jsPDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10; // 10mm margin
    const contentWidth = pageWidth - margin * 2;

    // Calculate content height in mm preserving aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const renderedHeight = (imgHeight * contentWidth) / imgWidth;

    const pageContentHeight = pageHeight - margin * 2;
    let heightLeft = renderedHeight;
    let position = margin;
    let pageNumber = 1;

    // First page
    pdf.addImage(
      imgData,
      'JPEG',
      margin,
      position,
      contentWidth,
      renderedHeight,
      undefined,
      'FAST'
    );
    heightLeft -= pageContentHeight;

    // Additional pages if content exceeds A4 height
    while (heightLeft > 0) {
      position = margin - pageNumber * pageContentHeight;
      pdf.addPage();
      pageNumber++;
      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        position,
        contentWidth,
        renderedHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pageContentHeight;
    }

    if (onProgress) onProgress('Finalizing and downloading PDF file...');
    pdf.save(filename);
  } finally {
    window.scrollTo(0, originalScrollPos);
  }
}

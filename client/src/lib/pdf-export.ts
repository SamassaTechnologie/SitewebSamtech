import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DocumentData {
  documentNumber: string;
  clientName: string;
  issueDate: Date;
  dueDate?: Date;
  validUntil?: Date;
  interventionDate?: Date;
  description: string;
  amount: string;
  taxRate?: string;
  paymentMethod?: string;
  technician?: string;
  duration?: string;
  status: string;
  notes?: string;
}

export async function generatePDF(
  documentType: 'invoice' | 'quote' | 'receipt' | 'intervention',
  data: DocumentData,
  htmlContent: string
): Promise<void> {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm';
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    const filename = `${data.documentNumber}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export function createInvoiceHTML(data: DocumentData): string {
  const taxAmount = (parseFloat(data.amount) * (parseFloat(data.taxRate || '0') / 100)).toFixed(2);
  const totalAmount = (parseFloat(data.amount) + parseFloat(taxAmount)).toFixed(2);

  return `
    <div style="font-family: 'Poppins', sans-serif; color: #333;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 3px solid #2E8FB5; padding-bottom: 20px;">
        <div>
          <h1 style="color: #2E8FB5; margin: 0; font-size: 28px;">SAMASSA TECHNOLOGIE</h1>
          <p style="color: #2E8FB5; margin: 5px 0; font-size: 12px;">Tout pour l'Informatique</p>
        </div>
        <div style="text-align: right;">
          <h2 style="color: #2E8FB5; margin: 0; font-size: 24px;">FACTURE</h2>
          <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${data.documentNumber}</p>
        </div>
      </div>

      <!-- Company Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #2E8FB5; margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">DE:</h3>
          <p style="margin: 5px 0; font-size: 12px;">Samassa Technologie</p>
          <p style="margin: 5px 0; font-size: 12px;">Grand Marché de Kayes</p>
          <p style="margin: 5px 0; font-size: 12px;">Kayes, Mali</p>
          <p style="margin: 5px 0; font-size: 12px;">Tél: +223 77 29 19 31</p>
          <p style="margin: 5px 0; font-size: 12px;">Email: samassatechnologie10@gmail.com</p>
        </div>
        <div>
          <h3 style="color: #2E8FB5; margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">VERS:</h3>
          <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">${data.clientName}</p>
        </div>
      </div>

      <!-- Dates -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Date d'Émission:</strong> ${new Date(data.issueDate).toLocaleDateString('fr-FR')}</p>
        </div>
        <div>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Date d'Échéance:</strong> ${data.dueDate ? new Date(data.dueDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
        </div>
      </div>

      <!-- Description -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2E8FB5; margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">DESCRIPTION:</h3>
        <p style="margin: 5px 0; font-size: 12px; white-space: pre-wrap;">${data.description}</p>
      </div>

      <!-- Amount Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background-color: #2E8FB5; color: white;">
          <td style="padding: 10px; font-weight: bold; text-align: left;">Description</td>
          <td style="padding: 10px; font-weight: bold; text-align: right;">Montant</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; font-size: 12px;">Services/Produits</td>
          <td style="padding: 10px; font-size: 12px; text-align: right;">${parseFloat(data.amount).toLocaleString('fr-FR')} CFA</td>
        </tr>
        ${data.taxRate && parseFloat(data.taxRate) > 0 ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; font-size: 12px;">TVA (${data.taxRate}%)</td>
          <td style="padding: 10px; font-size: 12px; text-align: right;">${parseFloat(taxAmount).toLocaleString('fr-FR')} CFA</td>
        </tr>
        ` : ''}
        <tr style="background-color: #2E8FB5; color: white;">
          <td style="padding: 10px; font-weight: bold;">TOTAL</td>
          <td style="padding: 10px; font-weight: bold; text-align: right;">${parseFloat(totalAmount).toLocaleString('fr-FR')} CFA</td>
        </tr>
      </table>

      <!-- Status -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 5px 0; font-size: 12px;"><strong>Statut:</strong> <span style="background-color: #2E8FB5; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">${data.status}</span></p>
      </div>

      <!-- Notes -->
      ${data.notes ? `
      <div style="margin-bottom: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
        <h3 style="color: #2E8FB5; margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">NOTES:</h3>
        <p style="margin: 5px 0; font-size: 11px; white-space: pre-wrap;">${data.notes}</p>
      </div>
      ` : ''}

      <!-- Footer -->
      <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; margin-top: 40px;">
        <p style="margin: 5px 0; font-size: 10px; color: #666;">Merci pour votre confiance!</p>
        <p style="margin: 5px 0; font-size: 10px; color: #666;">Samassa Technologie - Tout pour l'Informatique</p>
      </div>
    </div>
  `;
}

export function createQuoteHTML(data: DocumentData): string {
  const taxAmount = (parseFloat(data.amount) * (parseFloat(data.taxRate || '0') / 100)).toFixed(2);
  const totalAmount = (parseFloat(data.amount) + parseFloat(taxAmount)).toFixed(2);

  return `
    <div style="font-family: 'Poppins', sans-serif; color: #333;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 3px solid #2E8FB5; padding-bottom: 20px;">
        <div>
          <h1 style="color: #2E8FB5; margin: 0; font-size: 28px;">SAMASSA TECHNOLOGIE</h1>
          <p style="color: #2E8FB5; margin: 5px 0; font-size: 12px;">Tout pour l'Informatique</p>
        </div>
        <div style="text-align: right;">
          <h2 style="color: #2E8FB5; margin: 0; font-size: 24px;">DEVIS</h2>
          <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${data.documentNumber}</p>
        </div>
      </div>

      <!-- Company Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #2E8FB5; margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">DE:</h3>
          <p style="margin: 5px 0; font-size: 12px;">Samassa Technologie</p>
          <p style="margin: 5px 0; font-size: 12px;">Grand Marché de Kayes</p>
          <p style="margin: 5px 0; font-size: 12px;">Kayes, Mali</p>
          <p style="margin: 5px 0; font-size: 12px;">Tél: +223 77 29 19 31</p>
          <p style="margin: 5px 0; font-size: 12px;">Email: samassatechnologie10@gmail.com</p>
        </div>
        <div>
          <h3 style="color: #2E8FB5; margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">VERS:</h3>
          <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">${data.clientName}</p>
        </div>
      </div>

      <!-- Dates -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Date d'Émission:</strong> ${new Date(data.issueDate).toLocaleDateString('fr-FR')}</p>
        </div>
        <div>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Valide Jusqu'au:</strong> ${data.validUntil ? new Date(data.validUntil).toLocaleDateString('fr-FR') : 'N/A'}</p>
        </div>
      </div>

      <!-- Description -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2E8FB5; margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">DESCRIPTION:</h3>
        <p style="margin: 5px 0; font-size: 12px; white-space: pre-wrap;">${data.description}</p>
      </div>

      <!-- Amount Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background-color: #2E8FB5; color: white;">
          <td style="padding: 10px; font-weight: bold; text-align: left;">Description</td>
          <td style="padding: 10px; font-weight: bold; text-align: right;">Montant</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; font-size: 12px;">Services/Produits</td>
          <td style="padding: 10px; font-size: 12px; text-align: right;">${parseFloat(data.amount).toLocaleString('fr-FR')} CFA</td>
        </tr>
        ${data.taxRate && parseFloat(data.taxRate) > 0 ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; font-size: 12px;">TVA (${data.taxRate}%)</td>
          <td style="padding: 10px; font-size: 12px; text-align: right;">${parseFloat(taxAmount).toLocaleString('fr-FR')} CFA</td>
        </tr>
        ` : ''}
        <tr style="background-color: #2E8FB5; color: white;">
          <td style="padding: 10px; font-weight: bold;">TOTAL</td>
          <td style="padding: 10px; font-weight: bold; text-align: right;">${parseFloat(totalAmount).toLocaleString('fr-FR')} CFA</td>
        </tr>
      </table>

      <!-- Status -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 5px 0; font-size: 12px;"><strong>Statut:</strong> <span style="background-color: #2E8FB5; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">${data.status}</span></p>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; margin-top: 40px;">
        <p style="margin: 5px 0; font-size: 10px; color: #666;">Merci de votre intérêt!</p>
        <p style="margin: 5px 0; font-size: 10px; color: #666;">Samassa Technologie - Tout pour l'Informatique</p>
      </div>
    </div>
  `;
}

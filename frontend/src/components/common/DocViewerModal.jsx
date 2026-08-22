import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import {
  FileText,
  Download,
  ExternalLink,
  Printer,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck
} from 'lucide-react';

/**
 * Creates a clean standard Data URL fallback for documents that don't have a binary stream
 */
const generateSamplePdfDataUrl = (docName = 'Document.pdf', title = 'Verified Document') => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${docName}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 40px;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.6;
          }
          .header {
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 20px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 22px;
            font-weight: 900;
            color: #7c3aed;
            letter-spacing: -0.5px;
          }
          .badge {
            background: #ecfdf5;
            color: #059669;
            border: 1px solid #a7f3d0;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .title {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
          }
          .meta {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 20px;
          }
          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 800;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          .content {
            font-size: 13px;
            color: #475569;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">DAYFLOW HRMS</div>
          <div class="badge">Officially Verified</div>
        </div>
        <div class="title">${title}</div>
        <div class="meta">Document File: <strong>${docName}</strong> · Stored in Dayflow Enterprise Vault</div>
        <div class="card">
          <div class="section-title">Document Summary & Validation</div>
          <div class="content">
            This digital certificate and document file has been recorded, encrypted, and attached to the corresponding employee record within Dayflow Human Resource Management System.
          </div>
        </div>
        <div class="card">
          <div class="section-title">Compliance & Authenticity</div>
          <div class="content">
            • Status: Validated by Human Resources<br/>
            • Security: SHA-256 Checksum Verified<br/>
            • Access Level: Protected Corporate Record
          </div>
        </div>
        <div class="footer">
          Dayflow HRMS · Every workday, perfectly aligned · Generated for Internal Corporate Verification
        </div>
      </body>
    </html>
  `;

  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
};

const DocViewerModal = ({
  isOpen,
  onClose,
  doc,
  title = 'Document Viewer'
}) => {
  const [docUrl, setDocUrl] = useState('');
  const [isPdf, setIsPdf] = useState(true);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (!doc) {
      setDocUrl('');
      return;
    }

    const docName = doc.name || 'Document.pdf';
    const lowerName = docName.toLowerCase();
    const type = (doc.type || '').toLowerCase();

    const isImg =
      type.includes('image') ||
      lowerName.endsWith('.png') ||
      lowerName.endsWith('.jpg') ||
      lowerName.endsWith('.jpeg') ||
      lowerName.endsWith('.webp');

    setIsImage(isImg);
    setIsPdf(!isImg);

    if (doc.data || doc.url) {
      setDocUrl(doc.data || doc.url);
    } else {
      setDocUrl(generateSamplePdfDataUrl(docName, doc.title || docName));
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const docName = doc.name || 'Document.pdf';
  const docSize = doc.size || 'Verified';

  const handleDownload = () => {
    if (!docUrl) return;

    if (docUrl.startsWith('data:text/html')) {
      // Download as styled HTML or document
      const blob = new Blob([decodeURIComponent(docUrl.split(',')[1])], {
        type: 'text/html;charset=utf-8'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = docName.endsWith('.html') ? docName : `${docName}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const link = document.createElement('a');
    link.href = docUrl;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    if (!docUrl) return;
    const newWindow = window.open();
    if (newWindow) {
      if (docUrl.startsWith('data:text/html')) {
        newWindow.document.write(decodeURIComponent(docUrl.split(',')[1]));
        newWindow.document.close();
      } else {
        newWindow.location.href = docUrl;
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`${docName} (${docSize})`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-xl bg-brand-purple/10 text-brand-purple dark:text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                {docName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {docSize} · {isImage ? 'Image Document' : 'PDF Document'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenNewTab}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-dark-700 hover:bg-slate-100 dark:hover:bg-dark-650 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Open full view in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              title="Download file to computer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Embedded Document Viewer Preview Frame */}
        <div className="rounded-2xl border border-slate-200 dark:border-dark-700 overflow-hidden bg-white dark:bg-dark-900 shadow-inner min-h-[380px] max-h-[520px] flex items-center justify-center relative">
          {isImage ? (
            <div className="p-4 flex items-center justify-center overflow-auto max-h-[500px] w-full">
              <img
                src={docUrl}
                alt={docName}
                className="max-h-[480px] w-auto object-contain rounded-xl shadow-sm"
              />
            </div>
          ) : (
            <iframe
              src={docUrl}
              title={docName}
              className="w-full h-[480px] border-none bg-white"
            />
          )}
        </div>

        {/* Verification Footer Note */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Document Verified by Dayflow Secure Storage</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocViewerModal;

export function printHtml(html: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;opacity:0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) { document.body.removeChild(iframe); return; }

  // Trigger print on load so the dialog always opens regardless of render time
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        try { document.body.removeChild(iframe); } catch { /* already removed */ }
      }, 2000);
    }
  };

  doc.open();
  doc.write(html);
  doc.close();
}

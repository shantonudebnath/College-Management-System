/**
 * Prints HTML content via an invisible iframe.
 * Unlike window.open(), this approach is never blocked by popup blockers
 * because the print dialog is initiated from the same user-gesture context.
 */
export function printHtml(html: string): void {
  const cleanHtml = html.replace(
    /<script\b[^>]*>[\s\S]*?window\.print[\s\S]*?<\/script>/gi,
    ''
  );

  const iframe = document.createElement('iframe');
  iframe.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;opacity:0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) { document.body.removeChild(iframe); return; }

  doc.open();
  doc.write(cleanHtml);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        try { document.body.removeChild(iframe); } catch { /* already removed */ }
      }, 1000);
    }
  }, 700);
}

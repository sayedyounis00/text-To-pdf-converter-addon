// popup.js
(async () => {
  const preview = document.getElementById('preview');
  const loadBtn = document.getElementById('loadBtn');
  const clearBtn = document.getElementById('clearBtn');
  const downloadTxt = document.getElementById('downloadTxt');
  const downloadPdf = document.getElementById('downloadPdf');
  const filenameInput = document.getElementById('filename');


  function safeName(name) {
    return name.replace(/[\\\/:\*\?"<>\|]/g, '').trim() || 'clipboard';
  }

  function removeLeadingDot(name) {
    if (typeof name !== 'string') return name;
    return name.replace(/^\.+/, '');
  }

  const _oldSafeName = safeName;
  function safeName(name) {
    if (name == null) name = '';
    name = String(name);
    name = removeLeadingDot(name);
    return name.replace(/[\\\/:\*\?"<>\|]/g, '').trim() || 'clipboard';
  }


  async function loadClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      preview.value = text || '';
      if (text) {
        const short = text.split(/\r?\n/)[0].slice(0, 40).trim();
        filenameInput.value = safeName(short || 'clipboard');
      } else {
        filenameInput.value = 'clipboard';
      }
    } catch (err) {
      preview.value = '';
      alert('Unable to read clipboard. Make sure you allowed clipboard access to the extension.');
      console.error('clipboard-read-error', err);
    }
  }


  async function downloadAsTxt(filenameBase, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      await browser.downloads.download({
        url,
        filename: `${safeName(filenameBase)}.txt`,
        conflictAction: 'overwrite',
        saveAs: false
      });
    } finally {
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  }

  async function downloadAsPdf(filenameBase, text) {
    const name = `${safeName(filenameBase)}.pdf`;

    const { jsPDF } = window.jspdf || {};
    if (typeof jsPDF === 'function') {

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const usableWidth = pageWidth - margin * 2;
      const lineHeight = 12;
      const fontSize = 12;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(fontSize);

      const lines = doc.splitTextToSize(text || '', usableWidth);
      let cursor = margin;
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / (lineHeight + 2));
      for (let i = 0; i < lines.length; i++) {
        if (i > 0 && i % maxLinesPerPage === 0) {
          doc.addPage();
          cursor = margin;
        }
        doc.text(lines[i], margin, cursor);
        cursor += lineHeight;
      }
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const wrapperHtml = `<!doctype html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${name}</title>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <style>html,body{height:100%;margin:0}iframe,embed,object{width:100%;height:100%;border:none}</style>
        </head>
        <body>
          <div style="position:fixed;left:8px;top:8px;z-index:9999;font-size:12px;color:#666">If Print doesn't appear automatically, press Ctrl/Cmd+P</div>
          <embed id="pdfEmbed" src="${pdfUrl}" type="application/pdf"></embed>
          <script>
            (function(){
              function tryPrint(){
                try {
                  // Calling window.print will print the whole wrapper page which contains the embedded PDF.
                  window.print();
                } catch(e) {
                  // ignore
                }
              }
              // Delay slightly to give the PDF viewer time to load.
              window.addEventListener('load', function(){ setTimeout(tryPrint, 300); });
            })();
          </script>
        </body>
        </html>`;

      const wrapperBlob = new Blob([wrapperHtml], { type: 'text/html' });
      const wrapperUrl = URL.createObjectURL(wrapperBlob);
      try {
        try {
          await browser.tabs.create({ url: wrapperUrl });
        } catch (err) {
          window.open(wrapperUrl, '_blank');
        }
      } finally {
        // Revoke both URLs after a delay to allow the new tab to load the embedded PDF.
        setTimeout(() => {
          try { URL.revokeObjectURL(pdfUrl); } catch(e){}
          try { URL.revokeObjectURL(wrapperUrl); } catch(e){}
        }, 7000);
      }
    } else {
      const html = `
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${name}</title>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <style>
            body{font-family:system-ui,Arial,Helvetica,sans-serif;margin:40px;white-space:pre-wrap;font-size:13px}
            pre{white-space:pre-wrap;word-wrap:break-word}
            .print-note{color:#666;font-size:12px;margin-bottom:8px}
          </style>
        </head>
        <body>
          <div class="print-note">If the Print dialog doesn't appear, use your browser menu → Print (or Ctrl/Cmd+P) and choose "Save as PDF".</div>
          <pre>${escapeHtml(text)}</pre>
          <script>
            // Try to automatically open the print dialog when the tab loads.
            (function(){
              function tryPrint(){
                try {
                  window.print();
                } catch(e) {
                  // ignore
                }
              }
              // Some browsers block immediate print calls; delay slightly to improve success.
              window.addEventListener('load', function(){ setTimeout(tryPrint, 250); });
            })();
          </script>
        </body>
        </html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      try {
        await browser.tabs.create({ url });
      } catch (err) {
        window.open(url, '_blank');
      }
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  }


  function escapeHtml(s = '') {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  if (filenameInput) {
    filenameInput.addEventListener('blur', () => {
      try {
        filenameInput.value = safeName(filenameInput.value || 'clipboard');
      } catch (e) {
      }
    });
  }


  loadBtn.addEventListener('click', loadClipboard);
  clearBtn.addEventListener('click', () => preview.value = '');

  downloadTxt.addEventListener('click', async () => {
    const text = preview.value || '';
    await downloadAsTxt(filenameInput.value || 'clipboard', text);
  });

  downloadPdf.addEventListener('click', async () => {
    const text = preview.value || '';
    await downloadAsPdf(filenameInput.value || 'clipboard', text);
  });


  try { await loadClipboard(); } catch(e){ /* ignore */ }

})();

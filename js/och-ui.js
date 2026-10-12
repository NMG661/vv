/**
 * OptiCraft Heritage — shared UI helpers (SweetAlert2 dialogs + QR downloads).
 *
 * This is the ONLY cross-page script. It exposes uniquely-prefixed globals
 * (ochAlert / ochError / ochDownloadWithQR) so it can be loaded BEFORE any
 * tool script without colliding with the per-page names that every tool
 * re-declares (translations, setLanguage, currentLang, formatBytes,
 * downloadBlob, log, slugify...). Never define those names here.
 *
 * QR transfer strategy (no backend, everything stays client-side):
 * the QR always encodes this page's URL — open the tool on the 3DS and
 * generate the file there. (Embedding the file itself as a data: URL was
 * dropped: even sub-2 KB files produce QRs too dense for the 3DS camera
 * to read.)
 */
(function () {
  const ochIsEs = () => (localStorage.getItem('heritage_lang') || 'en') === 'es';

  function ochFormatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // --- Theme: make SweetAlert2 match the legacy-console look ---
  if (!document.getElementById('och-swal-theme')) {
    const style = document.createElement('style');
    style.id = 'och-swal-theme';
    style.textContent = [
      '.och-swal-popup{font-family:Minecraft,"Courier New",monospace;border:3px solid #1b1b1b;box-shadow:inset 2px 2px #4a4a4a,inset -2px -2px #101010,4px 4px rgba(0,0,0,.7);border-radius:0!important;}',
      '.och-swal-title{font-family:Minecraft,"Courier New",monospace;letter-spacing:1px;}',
      '.och-swal-qr{display:flex;justify-content:center;margin-top:12px;background:#fff;padding:10px;border:2px solid #1b1b1b;width:max-content;margin-left:auto;margin-right:auto;}',
      '.och-swal-qr img,.och-swal-qr canvas{image-rendering:pixelated;display:block;}',
      '.och-swal-file{font-size:13px;color:#ffff55;margin-top:4px;word-break:break-all;}',
      '.och-swal-caption{font-size:12px;color:#cfcfcf;margin-top:12px;line-height:1.6;}',
      '.och-swal-note{font-size:12px;color:#ff8f8f;margin-top:8px;line-height:1.6;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function ochSwalMixin() {
    if (!window.Swal) return null;
    return Swal.mixin({
      background: '#26221f',
      color: '#fff',
      confirmButtonColor: '#2b8444',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'och-swal-popup',
        title: 'och-swal-title'
      }
    });
  }

  /**
   * Themed dialog. Falls back to alert() if SweetAlert2 is missing.
   * ochAlert({ icon: 'info'|'success'|'warning'|'error', title, text?, html? })
   */
  function ochAlert(opts) {
    const Swal2 = ochSwalMixin();
    if (!Swal2) {
      alert([opts.title, opts.text].filter(Boolean).join('\n'));
      return;
    }
    Swal2.fire({
      icon: opts.icon || 'info',
      title: opts.title,
      text: opts.text,
      html: opts.html || undefined
    });
  }

  function ochError(message) {
    ochAlert({ icon: 'error', title: 'Error', text: message });
  }

  function ochEscapeHtml(text) {
    // Entities are built by concatenation so they survive any tooling
    // that normalises literal HTML entities in source files.
    const amp = '&' + 'amp;';
    const lt = '&' + 'lt;';
    const gt = '&' + 'gt;';
    const quot = '&' + 'quot;';
    return String(text)
      .replace(/&/g, amp)
      .replace(/</g, lt)
      .replace(/>/g, gt)
      .replace(/"/g, quot);
  }

  /**
   * Download a blob and show a themed "download started" dialog with a QR
   * code so the file can be picked up on another device (e.g. a 3DS).
   * opts.note — optional extra warning line shown under the caption
   * (used by the 3DS pak convert for the "flip is its own inverse" warning).
   */
  async function ochDownloadWithQR(blob, filename, opts) {
    opts = opts || {};

    // 1. Trigger the actual download (same mechanics as the per-page helpers)
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);

    // 2. QR payload: always this page's URL — the 3DS camera can't read the
    // dense QRs a data: URL produces, even for tiny files.
    const es = ochIsEs();
    const qrText = location.href.split('#')[0];

    const caption = es
      ? 'Escaneá el código para abrir esta herramienta en tu 3DS y generá el archivo ahí mismo.'
      : 'Scan the code to open this tool on your 3DS and generate the file there.';

    // 3. Success dialog with the embedded QR
    const Swal2 = ochSwalMixin();
    if (!Swal2) return; // the download already started; the dialog is a bonus
    Swal2.fire({
      icon: 'success',
      title: es ? '¡Descarga iniciada!' : 'Download started!',
      html:
        `<div class="och-swal-file">${ochEscapeHtml(filename)} (${ochFormatBytes(blob.size)})</div>` +
        `<div class="och-swal-qr" id="och-qr-box"></div>` +
        `<div class="och-swal-caption">${caption}</div>` +
        (opts.note ? `<div class="och-swal-note">${ochEscapeHtml(opts.note)}</div>` : ''),
      width: 420,
      didOpen: (popup) => {
        const box = popup.querySelector('#och-qr-box');
        if (!box) return;
        if (!window.QRCode) {
          box.textContent = es ? 'Librería QR no cargada.' : 'QR library not loaded.';
          return;
        }
        try {
          new QRCode(box, {
            text: qrText,
            width: 232,
            height: 232,
            correctLevel: QRCode.CorrectLevel.L
          });
        } catch (err) {
          box.textContent = 'QR error: ' + err.message;
        }
      }
    });
  }

  window.ochAlert = ochAlert;
  window.ochError = ochError;
  window.ochDownloadWithQR = ochDownloadWithQR;
})();

/**
 * OptiCraft Heritage - 3DS Texture Pack Flipper & OCHPACK Generator
 * Combined web tool for Nintendo 3DS asset conversion.
 */

const PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

const CPU_LUT_SKIP = [
  "assets/misc/grasscolor.png", "assets/misc/foliagecolor.png", "assets/misc/watercolor.png",
  "assets/misc/watercolorx.png", "assets/misc/pinecolor.png", "assets/misc/birchcolor.png",
  "assets/misc/swampgrasscolor.png", "assets/misc/swampfoliagecolor.png", "assets/misc/redstonecolor.png",
  "assets/misc/stemcolor.png", "assets/misc/myceliumparticlecolor.png",
  "misc/grasscolor.png", "misc/foliagecolor.png", "misc/watercolor.png",
  "misc/watercolorx.png", "misc/pinecolor.png", "misc/birchcolor.png",
  "misc/swampgrasscolor.png", "misc/swampfoliagecolor.png", "misc/redstonecolor.png",
  "misc/stemcolor.png", "misc/myceliumparticlecolor.png"
];

const LEGACY_SLIM_SHEETS = [
  "mob/char.png", "mob/cavespider.png", "mob/chicken.png",
  "mob/cow.png", "mob/creeper.png", "mob/enderman.png",
  "mob/enderman_eyes.png", "mob/fire.png",
  "mob/ghast.png", "mob/ghast_fire.png", "mob/lava.png",
  "mob/ozelot.png", "mob/cat_black.png", "mob/cat_red.png",
  "mob/cat_siamese.png", "mob/pig.png",
  "mob/pigman.png", "mob/pigzombie.png", "mob/redcow.png",
  "mob/saddle.png", "mob/sheep.png", "mob/sheep_fur.png",
  "mob/silverfish.png", "mob/skeleton.png",
  "mob/slime.png", "mob/spider.png", "mob/spider_eyes.png",
  "mob/squid.png", "mob/wolf.png", "mob/wolf_angry.png",
  "mob/wolf_collar.png", "mob/wolf_tame.png",
  "mob/zombie.png",
  "armor/chainmail_1.png", "armor/chainmail_2.png",
  "armor/cloth_1.png", "armor/cloth_2.png",
  "armor/diamond_1.png", "armor/diamond_2.png",
  "armor/gold_1.png", "armor/gold_2.png",
  "armor/iron_1.png", "armor/iron_2.png",
  "item/boat.png", "item/book.png", "item/cart.png",
  "item/door.png", "item/sign.png"
];

// --- Multilanguage Dictionary ---
const translations = {
  en: {
    "back-portal": "BACK TO PORTAL",
    "goto-ps2-tool": "PS2 OCHPACK TOOL",
    "goto-pak-tool": "ASSETS.PAK TOOL",
    "goto-skin-tool": "SKIN CONVERTER (3DS)",
    "tool-title": "3DS TEXTURE PACK FLIPPER & OCHPACK",
    "tool-subtitle": "Convert Java Edition texture packs to native 3DS orientation and .ochpack format",
    "info-title": "Convert any Java texture pack (.ZIP) into a 3DS-ready texture pack (.zip or .ochpack).",
    "info-desc": "Automatically flips all PNG textures vertically (Y-axis), crops modern legacy slim entity sheets, preserves CPU color lookup tables, and builds official runtime metadata.",
    "dropzone-text": "Drag & drop your Java texture pack (.ZIP) here, or tap to choose",
    "btn-select-zip": "Select Java .ZIP Pack",
    "preview-heading": "3DS Texture Pack Preview (In-Game Look):",
    "btn-change-icon": "Change icon",
    "label-pack-name": "Pack Name (Display in 3DS):",
    "label-pack-id": "Internal ID (Lowercase, no spaces):",
    "label-pack-author": "Author / Creator:",
    "label-pack-version": "Version:",
    "label-pack-desc1": "Description (Line 1 - max 34 chars):",
    "label-pack-desc2": "Subtitle / Details (Line 2 - max 34 chars):",
    "label-output-name": "Output file name:",
    "chk-crop-slim": "Crop modern square (64x64+) entity sheets to legacy top half",
    "chk-gen-meta": "Generate official mod.info and pack.txt formatted for 3DS runtime",
    "chk-resize-icon": "Ensure pack.png thumbnail is 128x128 pixels",
    "chk-export-ochpack": "Export as .ochpack format (recommended for OptiCraft 3DS)",
    "btn-start-convert": "Convert & Download 3DS Pack",
    "status-ready": "Ready.",
    "log-title": "Activity Log (Console):",
    "btn-copy-log": "Copy",
    "btn-clear-log": "Clear",
    "footer-disclaimer": "Developed by OptiCraft Heritage Developer Community.<br>Not affiliated with Optiprojects."
  },
  es: {
    "back-portal": "VOLVER AL PORTAL",
    "goto-ps2-tool": "HERRAMIENTA PS2 OCHPACK",
    "goto-pak-tool": "HERRAMIENTA ASSETS.PAK",
    "goto-skin-tool": "CONVERTIDOR SKINS (3DS)",
    "tool-title": "CONVERSOR DE TEXTURE PACKS 3DS Y OCHPACK",
    "tool-subtitle": "Convierte Texture Packs de Java Edition a orientación nativa de 3DS y formato .ochpack",
    "info-title": "Convierte cualquier Texture Pack de Java (.ZIP) en uno compatible con 3DS (.zip o .ochpack).",
    "info-desc": "Invierte verticalmente todas las texturas PNG (eje Y), recorta entidades modernas, protege las tablas de color de la CPU y genera metadatos oficiales.",
    "dropzone-text": "Arrastra y suelta tu Texture Pack de Java (.ZIP) aquí, o pulsa para elegirlo",
    "btn-select-zip": "Seleccionar Pack .ZIP de Java",
    "preview-heading": "Vista Previa de Texture Pack (Estilo 3DS):",
    "btn-change-icon": "Cambiar icono",
    "label-pack-name": "Nombre del Pack (Visible en 3DS):",
    "label-pack-id": "ID interno (Minúsculas, sin espacios):",
    "label-pack-author": "Autor / Creador:",
    "label-pack-version": "Versión:",
    "label-pack-desc1": "Descripción (Línea 1 - máx 34 caracteres):",
    "label-pack-desc2": "Subtítulo / Detalles (Línea 2 - máx 34 caracteres):",
    "label-output-name": "Nombre del archivo de salida:",
    "chk-crop-slim": "Recortar texturas de entidades cuadradas modernas (64x64+) a la mitad superior clásica",
    "chk-gen-meta": "Generar mod.info y pack.txt oficiales formateados para el runtime de 3DS",
    "chk-resize-icon": "Asegurar que pack.png tenga 128x128 píxeles",
    "chk-export-ochpack": "Exportar en formato .ochpack (recomendado para OptiCraft 3DS)",
    "btn-start-convert": "Convertir y Descargar Pack 3DS",
    "status-ready": "Listo.",
    "log-title": "Registro de Actividad (Consola):",
    "btn-copy-log": "Copiar",
    "btn-clear-log": "Limpiar",
    "footer-disclaimer": "Desarrollado por OptiCraft Heritage Developer Community.<br>No afiliado a Optiprojects."
  }
};

let currentLang = localStorage.getItem('heritage_lang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('heritage_lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  const t = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      if (key === 'footer-disclaimer') el.innerHTML = t[key];
      else el.textContent = t[key];
    }
  });
}

// --- App State ---
let loadedZipInstance = null;
let customPackPngBlob = null;

// --- DOM Elements ---
const dropzone = document.getElementById('dropzone');
const btnSelectZip = document.getElementById('btnSelectZip');
const zipInput = document.getElementById('zipInput');
const customPackPngInput = document.getElementById('customPackPngInput');

const packThumbnailWrap = document.getElementById('packThumbnailWrap');
const previewPackImg = document.getElementById('previewPackImg');
const previewPackImgFallback = document.getElementById('previewPackImgFallback');
const previewCardName = document.getElementById('previewCardName');
const previewCardDesc1 = document.getElementById('previewCardDesc1');
const previewCardDesc2 = document.getElementById('previewCardDesc2');
const fileCountBadgePill = document.getElementById('fileCountBadgePill');

const inputPackName = document.getElementById('inputPackName');
const inputPackId = document.getElementById('inputPackId');
const inputPackAuthor = document.getElementById('inputPackAuthor');
const inputPackVersion = document.getElementById('inputPackVersion');
const inputPackDesc1 = document.getElementById('inputPackDesc1');
const inputPackDesc2 = document.getElementById('inputPackDesc2');
const outputName = document.getElementById('outputName');

const chkCropSlim = document.getElementById('chkCropSlim');
const chkGenerateMeta = document.getElementById('chkGenerateMeta');
const chkResizePackPng = document.getElementById('chkResizePackPng');
const chkExportOchpack = document.getElementById('chkExportOchpack');
const btnStartConvert = document.getElementById('btnStartConvert');

const progressBarFill = document.getElementById('progressBarFill');
const statusText = document.getElementById('statusText');
const logTerminal = document.getElementById('logTerminal');
const btnCopyLog = document.getElementById('btnCopyLog');
const btnClearLog = document.getElementById('btnClearLog');

function log(msg) {
  const time = new Date().toLocaleTimeString();
  logTerminal.textContent += `[${time}] ${msg}\n`;
  logTerminal.scrollTop = logTerminal.scrollHeight;
}

function setProgress(current, total, status = null) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  progressBarFill.style.width = `${percent}%`;
  if (status) statusText.textContent = `${status} (${percent}%)`;
}

function slugify(text) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '_')
    .replace(/^_+/, '')
    .replace(/_+$/, '');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// --- Live Preview Updating ---
function updateLivePreview() {
  const name = inputPackName.value.trim() || 'Default Texture Pack';
  const d1 = inputPackDesc1.value.trim() || 'Standard Minecraft look & feel';
  const author = inputPackAuthor.value.trim();
  const d2 = inputPackDesc2.value.trim() || (author ? `By ${author}` : 'OptiCraft Heritage');

  previewCardName.textContent = name;
  previewCardDesc1.textContent = d1;
  previewCardDesc2.textContent = d2;

  if (!inputPackId.dataset.custom) {
    inputPackId.value = slugify(name);
  }

  const ext = chkExportOchpack.checked ? '.ochpack' : '.zip';
  if (!outputName.dataset.custom) {
    const slug = slugify(inputPackId.value) || 'pack';
    outputName.value = `${slug}${ext}`;
  }
}

inputPackName.addEventListener('input', updateLivePreview);
inputPackDesc1.addEventListener('input', updateLivePreview);
inputPackDesc2.addEventListener('input', updateLivePreview);
inputPackAuthor.addEventListener('input', updateLivePreview);
chkExportOchpack.addEventListener('change', () => {
  const base = outputName.value.replace(/\.(zip|ochpack)$/i, '');
  const ext = chkExportOchpack.checked ? '.ochpack' : '.zip';
  outputName.value = `${base}${ext}`;
  updateLivePreview();
});

inputPackId.addEventListener('input', () => {
  inputPackId.dataset.custom = "true";
  updateLivePreview();
});
outputName.addEventListener('input', () => { outputName.dataset.custom = "true"; });

// --- Icon Custom Thumbnail ---
packThumbnailWrap.addEventListener('click', () => customPackPngInput.click());

customPackPngInput.addEventListener('change', async (e) => {
  if (e.target.files && e.target.files[0]) {
    await setCustomThumbnail(e.target.files[0]);
  }
});

async function setCustomThumbnail(fileOrBlob) {
  let finalBlob = fileOrBlob;
  if (chkResizePackPng.checked) {
    finalBlob = await resizeImageToMax128(fileOrBlob);
  }
  customPackPngBlob = finalBlob;
  const url = URL.createObjectURL(finalBlob);
  previewPackImg.src = url;
  previewPackImg.style.display = 'block';
  previewPackImgFallback.style.display = 'none';
}

function resizeImageToMax128(fileOrBlob) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      if (w > 128 || h > 128) {
        const ratio = Math.min(128 / w, 128 / h);
        w = Math.round(w * ratio); h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => resolve(blob || fileOrBlob), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(fileOrBlob); };
    img.src = url;
  });
}

function generateDefaultThumbnailBlob(packName) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2a4f78'; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#3a75b0'; ctx.fillRect(0, 0, 128, 36);
    ctx.strokeStyle = '#111'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 124, 124);
    ctx.fillStyle = '#ffff55'; ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText((packName[0] || '3').toUpperCase(), 64, 80);
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

// --- File Handling ---
btnSelectZip.addEventListener('click', () => zipInput.click());
dropzone.addEventListener('click', (e) => { if (e.target !== btnSelectZip) zipInput.click(); });

dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    await loadZip(e.dataTransfer.files[0]);
  }
});

zipInput.addEventListener('change', async (e) => {
  if (e.target.files && e.target.files[0]) {
    await loadZip(e.target.files[0]);
    zipInput.value = '';
  }
});

async function loadZip(file) {
  log(`\n=== ${currentLang === 'es' ? 'CARGANDO PACK' : 'LOADING PACK'} ===`);
  log(`${currentLang === 'es' ? 'Archivo:' : 'File:'} ${file.name} (${formatBytes(file.size)})`);
  setProgress(10, 100, currentLang === 'es' ? 'Leyendo archivo ZIP...' : 'Reading ZIP file...');

  try {
    const zip = await JSZip.loadAsync(file);
    loadedZipInstance = zip;

    const count = Object.keys(zip.files).filter(k => !zip.files[k].dir).length;
    fileCountBadgePill.textContent = `${count} ${currentLang === 'es' ? 'archivos' : 'files'}`;

    // Auto-fill names if empty
    if (!inputPackName.value.trim()) {
      inputPackName.value = file.name.replace(/\.zip$/i, '').replace(/[\(\[\{].*?[\)\]\}]/g, '').trim();
    }

    // Check pack.txt
    if (zip.file("pack.txt")) {
      const text = await zip.file("pack.txt").async("text");
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines[0]) inputPackDesc1.value = lines[0].substring(0, 34);
      if (lines[1]) inputPackDesc2.value = lines[1].substring(0, 34);
    }

    // Check pack.png
    const iconEntry = zip.file("pack.png") || zip.file("icon.png");
    if (iconEntry) {
      const blob = await iconEntry.async("blob");
      await setCustomThumbnail(blob);
    } else if (!customPackPngBlob) {
      const defBlob = await generateDefaultThumbnailBlob(inputPackName.value || 'Pack');
      await setCustomThumbnail(defBlob);
    }

    updateLivePreview();
    btnStartConvert.disabled = false;
    setProgress(100, 100, currentLang === 'es' ? 'Pack cargado correctamente.' : 'Pack loaded successfully.');
    log(`[OK] ${currentLang === 'es' ? 'Pack listo para procesar.' : 'Pack ready for processing.'}`);
  } catch (err) {
    log(`[ERROR] ${err.message}`);
    ochError(err.message);
    setProgress(0, 100, 'Error.');
  }
}

// --- PNG Vertical Flip using Canvas ---
function flipPngImageBlob(blob, cropTopHalf) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      let targetH = h;
      if (cropTopHalf && w === h && w % 64 === 0) {
        targetH = Math.floor(h / 2);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.save();
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, -targetH, w, h);
      ctx.restore();
      canvas.toBlob((outBlob) => resolve(outBlob || blob), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(blob); };
    img.src = url;
  });
}

function isPng(uint8Array) {
  if (uint8Array.length < PNG_SIGNATURE.length) return false;
  for (let i = 0; i < PNG_SIGNATURE.length; i++) {
    if (uint8Array[i] !== PNG_SIGNATURE[i]) return false;
  }
  return true;
}

function normalisePath(p) {
  const lower = p.replace(/\\/g, '/').toLowerCase();
  return lower.startsWith('assets/') ? lower.substring(7) : lower;
}

// --- Conversion & Build Execution ---
btnStartConvert.addEventListener('click', async () => {
  if (!loadedZipInstance) return;

  btnStartConvert.disabled = true;
  log(`\n=== ${currentLang === 'es' ? 'INICIANDO CONVERSIÓN Y EMPAQUETADO 3DS' : 'STARTING 3DS CONVERSION & PACKING'} ===`);
  setProgress(5, 100, currentLang === 'es' ? 'Procesando recursos...' : 'Processing resources...');

  try {
    const outZip = new JSZip();
    const entries = Object.entries(loadedZipInstance.files);
    let total = entries.length;
    let flippedCount = 0;
    const cropSlim = chkCropSlim.checked;

    // 1. Process and flip textures
    for (let i = 0; i < total; i++) {
      const [path, entry] = entries[i];
      if (entry.dir) continue;

      const norm = normalisePath(path);
      // Skip metadata files if we are regenerating them fresh
      if (chkGenerateMeta.checked && (norm === 'mod.info' || norm === 'pack.txt' || norm === 'pack.png' || norm === 'icon.png')) {
        continue;
      }

      const data = await entry.async("uint8array");
      const isCpuLut = CPU_LUT_SKIP.some(l => norm === l || norm.endsWith('/' + l));
      const isSlim = cropSlim && LEGACY_SLIM_SHEETS.some(s => norm === s || norm.endsWith('/' + s));

      if (isPng(data) && !isCpuLut) {
        const blob = new Blob([data], { type: 'image/png' });
        const flippedBlob = await flipPngImageBlob(blob, isSlim);
        const flippedBuffer = await flippedBlob.arrayBuffer();
        outZip.file(path, new Uint8Array(flippedBuffer));
        flippedCount++;
      } else {
        outZip.file(path, data);
      }

      if (i % 20 === 0 || i === total - 1) {
        setProgress(5 + Math.round((i / total) * 75), 100, `${currentLang === 'es' ? 'Convirtiendo' : 'Converting'}: [${i + 1}/${total}]`);
      }
    }

    // 2. Generate Metadata if enabled
    if (chkGenerateMeta.checked) {
      const name = inputPackName.value.trim() || 'Custom Pack 3DS';
      const id = slugify(inputPackId.value.trim() || name) || 'texturepack';
      const author = inputPackAuthor.value.trim() || 'Community';
      const version = inputPackVersion.value.trim() || '1.2.5';
      const desc1 = inputPackDesc1.value.trim() || name;
      const desc2 = inputPackDesc2.value.trim() || (author ? `By ${author}` : 'OptiCraft Heritage');

      const modInfoText = 
`id=${id}
name=${name}
version=${version}
author=${author}
description=${desc1}${desc2 ? ' - ' + desc2 : ''}
type=texturepack
`;
      outZip.file("mod.info", modInfoText);
      log(`[GEN] mod.info (${id})`);

      const packTxtContent = `${desc1.substring(0, 34)}\n${desc2.substring(0, 34)}\n`;
      outZip.file("pack.txt", packTxtContent);
      log(`[GEN] pack.txt`);
    }

    // 3. Add Thumbnail
    if (customPackPngBlob) {
      const iconData = new Uint8Array(await customPackPngBlob.arrayBuffer());
      outZip.file("pack.png", iconData);
      log(`[GEN] pack.png (${formatBytes(iconData.byteLength)})`);
    }

    log(`[ZIP] ${currentLang === 'es' ? 'Generando archivo comprimido...' : 'Generating archive...'}`);
    const finalBlob = await outZip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    }, (meta) => {
      setProgress(85 + Math.round(meta.percent * 0.15), 100, `ZIP: ${meta.percent.toFixed(0)}%`);
    });

    const isOchpack = chkExportOchpack.checked;
    let filename = outputName.value.trim() || (isOchpack ? 'JavaPack-3DS.ochpack' : 'JavaPack-3DS.zip');
    if (isOchpack && !filename.toLowerCase().endsWith('.ochpack')) {
      filename += '.ochpack';
    } else if (!isOchpack && !filename.toLowerCase().endsWith('.zip')) {
      filename += '.zip';
    }

    await ochDownloadWithQR(finalBlob, filename);

    log(`\n[SUCCESS] ${currentLang === 'es' ? '¡Conversión completada!' : 'Conversion completed!'} ${filename} (${formatBytes(finalBlob.size)})`);
    log(`[INFO] ${currentLang === 'es' ? 'Copia el archivo a tu tarjeta SD en: opticraft/.minecraft/texturepacks/' : 'Copy the file to your SD card at: opticraft/.minecraft/texturepacks/'}`);
    setProgress(100, 100, currentLang === 'es' ? '¡Descarga iniciada!' : 'Download started!');

  } catch (err) {
    log(`[ERROR] ${err.message}`);
    ochError(err.message);
    setProgress(0, 100, 'Error.');
  } finally {
    btnStartConvert.disabled = false;
  }
});

// --- Console Log Actions ---
btnCopyLog.addEventListener('click', () => {
  navigator.clipboard.writeText(logTerminal.textContent).then(() => {
    ochAlert({ icon: 'success', title: currentLang === 'es' ? 'Registro copiado al portapapeles.' : 'Log copied to clipboard.' });
  });
});

btnClearLog.addEventListener('click', () => { logTerminal.textContent = ''; });

// --- Language Switcher ---
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

setLanguage(currentLang);
updateLivePreview();
log(currentLang === 'es' ? 'Conversor 3DS con soporte .ochpack listo.' : '3DS Flipper with .ochpack support ready.');
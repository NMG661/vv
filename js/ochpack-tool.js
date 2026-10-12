/**
 * OptiCraft Heritage - OCHPACK Texture Pack Tool (PS2)
 * Complete web builder & inspector for .ochpack archives.
 */

// --- Constants & Exclusions ---
const JUNK_EXTENSIONS = ['.class', '.bak', '.tmp'];
const JUNK_FILENAMES = ['.ds_store', 'thumbs.db', 'desktop.ini', 'session.lock', 'level.dat_old', 'level.dat_mcr'];
const JUNK_FOLDERS = ['__macosx', 'com/jcraft', 'paulscode/sound/codecs', 'paulscode/sound/libraries'];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

function downloadBlob(blob, filename) {
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
}

// --- Multilanguage Dictionary ---
const translations = {
  en: {
    "back-portal": "BACK TO PORTAL",
    "goto-pak-tool": "ASSETS.PAK TOOL",
    "goto-skin-tool": "SKIN CONVERTER (3DS)",
    "tool-title": "OCHPACK TEXTURE PACK CREATOR",
    "tool-subtitle": "Convert, optimize, and build .ochpack texture packs for OptiCraft Heritage (PS2)",
    "tab-create": "📦 Build .ochpack",
    "tab-inspect": "🔍 Inspect & Edit .ochpack",
    "create-info-title": "Convert any Minecraft texture pack (.ZIP or folder) to .ochpack for PS2.",
    "create-info-desc": "Automatically cleans out incompatible Java .class files, sets up mod.info & pack.txt, and verifies PS2 texture resolution.",
    "create-dropzone-text": "Drag & drop your texture pack (.ZIP or folder) here, or tap to choose",
    "btn-select-zip": "Select .ZIP Pack (Mobile & PC)",
    "btn-select-folder": "Select Folder (PC)",
    "ps2-preview-heading": "PS2 Texture Pack Preview (Live In-Game Look):",
    "btn-change-icon": "Change icon",
    "label-pack-name": "Pack Name (Display in PS2):",
    "label-pack-id": "Internal ID (Lowercase, no spaces):",
    "label-pack-author": "Author / Creator:",
    "label-pack-version": "Version:",
    "label-pack-desc1": "Description (Line 1 - max 34 chars):",
    "label-pack-desc2": "Subtitle / Details (Line 2 - max 34 chars):",
    "label-output-name": "Output file name (.ochpack):",
    "chk-clean-classes": "Clean incompatible Java files (.class, paulscode, com/jcraft) and OS junk (.DS_Store, Thumbs.db)",
    "chk-gen-meta": "Generate official mod.info and pack.txt formatted for PS2 runtime",
    "chk-resize-icon": "Ensure pack.png thumbnail is 128x128 pixels (PS2 recommended limit)",
    "chk-strip-wrapper": "Normalize folder structure (remove redundant outer folder wrapper if present)",
    "btn-start-build": "⚡ Build & Download .ochpack",
    "inspect-info-title": "Inspect, tweak, and re-export any existing .ochpack file.",
    "inspect-info-desc": "Load any .ochpack (e.g., DarkCraft.ochpack) to edit metadata, replace thumbnails, search internal textures, or extract everything to .ZIP.",
    "inspect-dropzone-text": "Drag & drop an existing .ochpack file here, or tap to browse",
    "btn-select-inspect": "Browse .ochpack file...",
    "inspect-loaded-badge": "Pack Loaded:",
    "search-inspect-placeholder": "Filter files (e.g., terrain.png, font, gui)...",
    "th-path": "Path / File",
    "th-size": "Size",
    "th-action": "Action",
    "btn-export-zip": "📦 Download All as .ZIP",
    "status-ready": "Ready.",
    "log-title": "Activity Log (Console):",
    "btn-copy-log": "Copy",
    "btn-clear-log": "Clear",
    "footer-disclaimer": "Developed by OptiCraft Heritage Developer Community.<br>Not affiliated with Optiprojects."
  },
  es: {
    "back-portal": "VOLVER AL PORTAL",
    "goto-pak-tool": "GESTOR ASSETS.PAK",
    "goto-skin-tool": "CONVERTIDOR SKINS (3DS)",
    "tool-title": "CREADOR DE TEXTURE PACKS .OCHPACK",
    "tool-subtitle": "Convierte, optimiza y empaqueta Texture Packs para OptiCraft Heritage (PS2)",
    "tab-create": "📦 Armar .ochpack",
    "tab-inspect": "🔍 Inspeccionar y Editar .ochpack",
    "create-info-title": "Convierte cualquier Texture Pack de Minecraft (.ZIP o carpeta) a .ochpack para PS2.",
    "create-info-desc": "Limpia automáticamente archivos .class de Java incompatibles, genera mod.info y pack.txt, y verifica la resolución para PS2.",
    "create-dropzone-text": "Arrastra y suelta tu Texture Pack (.ZIP o carpeta) aquí, o pulsa para elegirlo",
    "btn-select-zip": "Seleccionar Pack .ZIP (Móvil y PC)",
    "btn-select-folder": "Seleccionar Carpeta (PC)",
    "ps2-preview-heading": "Vista Previa de Texture Pack (Estilo PS2):",
    "btn-change-icon": "Cambiar icono",
    "label-pack-name": "Nombre del Pack (Visible en PS2):",
    "label-pack-id": "ID interno (Minúsculas, sin espacios):",
    "label-pack-author": "Autor / Creador:",
    "label-pack-version": "Versión:",
    "label-pack-desc1": "Descripción (Línea 1 - máx 34 caracteres):",
    "label-pack-desc2": "Subtítulo / Detalles (Línea 2 - máx 34 caracteres):",
    "label-output-name": "Nombre del archivo (.ochpack):",
    "chk-clean-classes": "Limpiar archivos innecesarios de Java (.class, paulscode, com/jcraft) y basura (.DS_Store, Thumbs.db)",
    "chk-gen-meta": "Generar mod.info y pack.txt oficiales formateados para el runtime de PS2",
    "chk-resize-icon": "Asegurar que pack.png tenga 128x128 píxeles (Límite recomendado en PS2)",
    "chk-strip-wrapper": "Normalizar carpetas (eliminar subcarpetas raíz envolventes innecesarias)",
    "btn-start-build": "⚡ Armar y Descargar .ochpack",
    "inspect-info-title": "Inspecciona, modifica y re-exporta cualquier archivo .ochpack existente.",
    "inspect-info-desc": "Carga cualquier .ochpack (ej. DarkCraft.ochpack) para editar metadatos, cambiar icono, buscar texturas o exportar a .ZIP.",
    "inspect-dropzone-text": "Arrastra y suelta un archivo .ochpack aquí, o pulsa para buscarlo",
    "btn-select-inspect": "Buscar archivo .ochpack...",
    "inspect-loaded-badge": "Pack Cargado:",
    "search-inspect-placeholder": "Filtrar archivos (ej. terrain.png, font, gui)...",
    "th-path": "Ruta / Archivo",
    "th-size": "Tamaño",
    "th-action": "Acción",
    "btn-export-zip": "📦 Descargar Todo como .ZIP",
    "status-ready": "Listo.",
    "log-title": "Registro de Actividad (Consola):",
    "btn-copy-log": "Copiar",
    "btn-clear-log": "Limpiar",
    "footer-disclaimer": "Desarrollado por OptiCraft Heritage Developer Community.<br>Not affiliated with Optiprojects."
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
      if (key === 'footer-disclaimer') {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (t[key]) {
      el.placeholder = t[key];
    }
  });
}

// --- App State ---
let rawFiles = [];          // Array of { path: string, data: Uint8Array, size: number }
let cleanedFilesCount = 0;
let customPackPngBlob = null;
let detectedTerrainResolution = null; // e.g. 16, 32, 64

// Inspect Tab State
let inspectPakFiles = [];
let inspectFilteredFiles = [];
let inspectZipInstance = null;

// --- DOM Elements ---
const tabs = {
  tabBtnCreate: document.getElementById('tabBtnCreate'),
  tabBtnInspect: document.getElementById('tabBtnInspect'),
  tabCreate: document.getElementById('tabCreate'),
  tabInspect: document.getElementById('tabInspect')
};

const createDropzone = document.getElementById('createDropzone');
const btnSelectZip = document.getElementById('btnSelectZip');
const btnSelectFolder = document.getElementById('btnSelectFolder');
const zipOrFilesInput = document.getElementById('zipOrFilesInput');
const folderInput = document.getElementById('folderInput');
const customPackPngInput = document.getElementById('customPackPngInput');

// Preview Card Elements
const packThumbnailWrap = document.getElementById('packThumbnailWrap');
const previewPackImg = document.getElementById('previewPackImg');
const previewPackImgFallback = document.getElementById('previewPackImgFallback');
const previewCardName = document.getElementById('previewCardName');
const previewCardDesc1 = document.getElementById('previewCardDesc1');
const previewCardDesc2 = document.getElementById('previewCardDesc2');
const pillResolution = document.getElementById('pillResolution');
const pillFileCount = document.getElementById('pillFileCount');
const pillCleanCount = document.getElementById('pillCleanCount');

// Form Inputs
const inputPackName = document.getElementById('inputPackName');
const inputPackId = document.getElementById('inputPackId');
const inputPackAuthor = document.getElementById('inputPackAuthor');
const inputPackVersion = document.getElementById('inputPackVersion');
const inputPackDesc1 = document.getElementById('inputPackDesc1');
const inputPackDesc2 = document.getElementById('inputPackDesc2');
const inputOutputName = document.getElementById('inputOutputName');

// Checkboxes
const chkCleanClass = document.getElementById('chkCleanClass');
const chkGenerateMeta = document.getElementById('chkGenerateMeta');
const chkResizePackPng = document.getElementById('chkResizePackPng');
const chkStripWrapper = document.getElementById('chkStripWrapper');
const btnStartBuild = document.getElementById('btnStartBuild');

// Inspect Elements
const inspectDropzone = document.getElementById('inspectDropzone');
const btnSelectInspect = document.getElementById('btnSelectInspect');
const inspectFileInput = document.getElementById('inspectFileInput');
const inspectDetailsSection = document.getElementById('inspectDetailsSection');
const inspectSummaryBadge = document.getElementById('inspectSummaryBadge');
const inspectMetaType = document.getElementById('inspectMetaType');
const searchInspectFiles = document.getElementById('searchInspectFiles');
const inspectFileListBody = document.getElementById('inspectFileListBody');
const btnExportZip = document.getElementById('btnExportZip');

// Progress & Log
const progressBarFill = document.getElementById('progressBarFill');
const statusText = document.getElementById('statusText');
const logTerminal = document.getElementById('logTerminal');
const btnCopyLog = document.getElementById('btnCopyLog');
const btnClearLog = document.getElementById('btnClearLog');

// --- Logger & Progress ---
function log(msg) {
  const time = new Date().toLocaleTimeString();
  logTerminal.textContent += `[${time}] ${msg}\n`;
  logTerminal.scrollTop = logTerminal.scrollHeight;
}

function setProgress(current, total, status = null) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  progressBarFill.style.width = `${percent}%`;
  if (status) {
    statusText.textContent = `${status} (${percent}%)`;
  }
}

// --- Tabs Management ---
function switchTab(targetTabId) {
  Object.keys(tabs).forEach(k => {
    if (k.startsWith('tabBtn')) {
      const active = (tabs[k].dataset.tab === targetTabId);
      tabs[k].classList.toggle('active', active);
    } else {
      tabs[k].classList.toggle('active', tabs[k].id === targetTabId);
    }
  });
}

tabs.tabBtnCreate.addEventListener('click', () => switchTab('tabCreate'));
tabs.tabBtnInspect.addEventListener('click', () => switchTab('tabInspect'));

// --- PS2 Preview Updating ---
function updateLivePreview() {
  const name = inputPackName.value.trim() || (currentLang === 'es' ? 'Texture Pack Sin Nombre' : 'Default Texture Pack');
  const d1 = inputPackDesc1.value.trim() || (currentLang === 'es' ? 'Apariencia estándar de Minecraft' : 'Standard Minecraft look & feel');
  const author = inputPackAuthor.value.trim();
  const d2 = inputPackDesc2.value.trim() || (author ? `${currentLang === 'es' ? 'Por' : 'By'} ${author}` : 'OptiCraft Heritage');

  previewCardName.textContent = name;
  previewCardDesc1.textContent = d1;
  previewCardDesc2.textContent = d2;

  // Sync ID if not custom typed or if empty
  if (!inputPackId.dataset.custom) {
    inputPackId.value = slugify(name);
  }

  // Sync Output Filename
  if (!inputOutputName.dataset.custom) {
    const slug = slugify(name) || 'pack';
    inputOutputName.value = `${slug}.ochpack`;
  }
}

inputPackName.addEventListener('input', updateLivePreview);
inputPackDesc1.addEventListener('input', updateLivePreview);
inputPackDesc2.addEventListener('input', updateLivePreview);
inputPackAuthor.addEventListener('input', updateLivePreview);
inputPackId.addEventListener('input', () => {
  inputPackId.dataset.custom = "true";
  if (!inputOutputName.dataset.custom) {
    inputOutputName.value = `${slugify(inputPackId.value) || 'pack'}.ochpack`;
  }
});
inputOutputName.addEventListener('input', () => {
  inputOutputName.dataset.custom = "true";
});

// Custom pack.png selection via clicking thumbnail
packThumbnailWrap.addEventListener('click', () => customPackPngInput.click());

customPackPngInput.addEventListener('change', async (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    await setCustomThumbnail(file);
    log(`[ICON] ${currentLang === 'es' ? 'Icono personalizado cargado:' : 'Custom icon loaded:'} ${file.name}`);
  }
});

async function setCustomThumbnail(blobOrFile) {
  // If resize enabled, process via canvas
  let finalBlob = blobOrFile;
  if (chkResizePackPng.checked) {
    finalBlob = await resizeImageToMax128(blobOrFile);
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
      let w = img.width;
      let h = img.height;
      if (w > 128 || h > 128) {
        const ratio = Math.min(128 / w, 128 / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      // Nearest-neighbor to preserve crisp Minecraft pixel art
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        resolve(blob || fileOrBlob);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(fileOrBlob);
    };
    img.src = url;
  });
}

function generateDefaultThumbnailBlob(packName) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Dirt background
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, 0, 128, 128);

    // Grass top layer
    ctx.fillStyle = '#3a832b';
    ctx.fillRect(0, 0, 128, 36);

    // Pixel noise
    ctx.fillStyle = '#4ea83b';
    for (let x = 0; x < 128; x += 8) {
      if ((x / 8) % 2 === 0) ctx.fillRect(x, 28, 8, 12);
    }

    // Border bevel
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 124, 124);

    // Initial letter badge
    ctx.fillStyle = '#ffff55';
    ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const letter = (packName.trim()[0] || 'O').toUpperCase();
    ctx.fillText(letter, 64, 80);

    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

// --- Check if file should be cleaned for PS2 ---
function isJunkForPs2(filePath) {
  const p = filePath.toLowerCase().replace(/\\/g, '/');
  const base = p.split('/').pop();

  if (JUNK_FILENAMES.includes(base)) return true;
  for (const ext of JUNK_EXTENSIONS) {
    if (base.endsWith(ext)) return true;
  }
  for (const f of JUNK_FOLDERS) {
    if (p.includes(f)) return true;
  }
  return false;
}

// --- Analyze terrain.png resolution ---
async function analyzeTerrainResolution(blobOrData) {
  return new Promise((resolve) => {
    const img = new Image();
    const blob = blobOrData instanceof Blob ? blobOrData : new Blob([blobOrData], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.width;
      const h = img.height;
      const blockRes = Math.round(w / 16);
      resolve({ width: w, height: h, blockRes });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function updateResolutionPill(resInfo) {
  if (!resInfo) {
    pillResolution.textContent = 'Res: 16x (Default)';
    pillResolution.className = 'pack-pill res';
    return;
  }

  const r = resInfo.blockRes;
  if (r <= 16) {
    pillResolution.textContent = `Res: ${r}x (${resInfo.width}px · Optimal PS2)`;
    pillResolution.className = 'pack-pill res';
  } else if (r === 32) {
    pillResolution.textContent = `Res: 32x (${resInfo.width}px · PS2 Compatible)`;
    pillResolution.className = 'pack-pill res';
  } else {
    pillResolution.textContent = `Res: ${r}x (${resInfo.width}px · Auto-downscaled in PS2)`;
    pillResolution.className = 'pack-pill res warn';
  }
}

// --- Process Files Loaded for Build ---
async function processRawFiles(filesList, sourceName = '') {
  log(`\n=== ${currentLang === 'es' ? 'ANALIZANDO RECURSOS' : 'ANALYZING RESOURCES'} ===`);
  setProgress(10, 100, currentLang === 'es' ? 'Leyendo estructura de archivos...' : 'Reading file structure...');

  let validFiles = [];
  let junkCount = 0;

  const doClean = chkCleanClass.checked;

  for (const f of filesList) {
    const cleanPath = f.path.replace(/\\/g, '/').replace(/^\/+/, '');
    if (!cleanPath || cleanPath.endsWith('/')) continue; // Skip folders

    if (doClean && isJunkForPs2(cleanPath)) {
      junkCount++;
      continue;
    }

    validFiles.push({
      path: cleanPath,
      data: f.data,
      size: f.data.byteLength || f.size || 0
    });
  }

  // Strip common root folder wrapper if enabled
  if (chkStripWrapper.checked && validFiles.length > 0) {
    const parts0 = validFiles[0].path.split('/');
    if (parts0.length > 1) {
      const candidatePrefix = parts0[0] + '/';
      const allShare = validFiles.every(vf => vf.path.startsWith(candidatePrefix));
      if (allShare) {
        log(`[INFO] ${currentLang === 'es' ? 'Eliminando carpeta raíz envolvente:' : 'Stripping redundant root folder:'} '${candidatePrefix}'`);
        validFiles = validFiles.map(vf => ({
          ...vf,
          path: vf.path.substring(candidatePrefix.length)
        }));
      }
    }
  }

  // Check for pack.txt
  const packTxtFile = validFiles.find(f => f.path.toLowerCase() === 'pack.txt');
  if (packTxtFile) {
    try {
      const text = new TextDecoder().decode(packTxtFile.data);
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines[0]) inputPackDesc1.value = lines[0].substring(0, 34);
      if (lines[1]) inputPackDesc2.value = lines[1].substring(0, 34);
      log(`[AUTO] ${currentLang === 'es' ? 'pack.txt encontrado y procesado.' : 'pack.txt detected and parsed.'}`);
    } catch (e) {
      console.warn("Could not parse pack.txt", e);
    }
  }

  // Check for mod.info / manifest.txt
  const modInfoFile = validFiles.find(f => f.path.toLowerCase() === 'mod.info' || f.path.toLowerCase() === 'manifest.txt');
  if (modInfoFile) {
    try {
      const text = new TextDecoder().decode(modInfoFile.data);
      const lines = text.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) continue;
        const sep = trimmed.indexOf('=') !== -1 ? '=' : ':';
        const parts = trimmed.split(sep);
        if (parts.length >= 2) {
          const k = parts[0].trim().toLowerCase();
          const v = parts.slice(1).join(sep).trim();
          if (k === 'name') inputPackName.value = v;
          if (k === 'id') { inputPackId.value = v; inputPackId.dataset.custom = "true"; }
          if (k === 'author') inputPackAuthor.value = v;
          if (k === 'version') inputPackVersion.value = v;
          if (k === 'description') inputPackDesc1.value = v.substring(0, 34);
        }
      }
      log(`[AUTO] ${currentLang === 'es' ? 'mod.info existente detectado y parseado.' : 'Existing mod.info detected and parsed.'}`);
    } catch (e) {
      console.warn("Could not parse mod.info", e);
    }
  }

  // Auto-name if empty
  if (!inputPackName.value.trim() && sourceName) {
    const cleanBase = sourceName.replace(/\.zip$/i, '').replace(/\.ochpack$/i, '').replace(/[\(\[\{].*?[\)\]\}]/g, '').trim();
    inputPackName.value = cleanBase || 'Custom Pack';
  }

  // Check for pack.png
  const packPngFile = validFiles.find(f => f.path.toLowerCase() === 'pack.png' || f.path.toLowerCase() === 'icon.png');
  if (packPngFile) {
    await setCustomThumbnail(new Blob([packPngFile.data], { type: 'image/png' }));
    log(`[AUTO] ${currentLang === 'es' ? 'Miniatura pack.png encontrada.' : 'Thumbnail pack.png detected.'}`);
  } else if (!customPackPngBlob) {
    // Generate default icon
    const defaultBlob = await generateDefaultThumbnailBlob(inputPackName.value || 'Pack');
    await setCustomThumbnail(defaultBlob);
  }

  // Check terrain.png for resolution
  const terrainFile = validFiles.find(f => f.path.toLowerCase() === 'terrain.png');
  if (terrainFile) {
    const resInfo = await analyzeTerrainResolution(terrainFile.data);
    if (resInfo) {
      updateResolutionPill(resInfo);
      log(`[TEXTURE] terrain.png: ${resInfo.width}x${resInfo.height} (${resInfo.blockRes}x)`);
    }
  } else {
    updateResolutionPill(null);
  }

  // Update pills and state
  rawFiles = validFiles;
  cleanedFilesCount = junkCount;

  pillFileCount.textContent = `${validFiles.length} ${currentLang === 'es' ? 'archivos' : 'files'}`;
  if (junkCount > 0) {
    pillCleanCount.style.display = 'inline-block';
    pillCleanCount.textContent = `${junkCount} ${currentLang === 'es' ? 'limpiados' : 'cleaned'}`;
    log(`[CLEAN] ${currentLang === 'es' ? 'Se excluyeron' : 'Excluded'} ${junkCount} ${currentLang === 'es' ? 'archivos .class/temporales incompatibles con PS2.' : 'incompatible .class/temporary files.'}`);
  } else {
    pillCleanCount.style.display = 'none';
  }

  updateLivePreview();
  setProgress(100, 100, currentLang === 'es' ? 'Recursos listos para empaquetar.' : 'Resources ready to build.');
  log(`[OK] ${validFiles.length} ${currentLang === 'es' ? 'archivos válidos listos para generar el .ochpack.' : 'valid files ready to build .ochpack.'}`);
}

// --- Handle ZIP Input ---
async function handleZipFile(file) {
  log(`${currentLang === 'es' ? 'Cargando archivo:' : 'Loading file:'} ${file.name} (${formatBytes(file.size)})`);
  setProgress(15, 100, currentLang === 'es' ? 'Descomprimiendo archivo...' : 'Decompressing file...');

  try {
    const zip = await JSZip.loadAsync(file);
    const extractedList = [];

    const totalEntries = Object.keys(zip.files).length;
    let i = 0;

    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      i++;
      if (zipEntry.dir) continue;
      const data = await zipEntry.async("uint8array");
      extractedList.push({
        path: relativePath,
        data: data,
        size: data.byteLength
      });
      if (i % 25 === 0) {
        setProgress(15 + Math.round((i / totalEntries) * 60), 100);
      }
    }

    await processRawFiles(extractedList, file.name);

  } catch (err) {
    log(`[ERROR] ${err.message}`);
    alert(`Error: ${err.message}`);
    setProgress(0, 100, currentLang === 'es' ? 'Error al leer el archivo.' : 'Error reading file.');
  }
}

// --- Handle Folder Input (PC) ---
async function handleFolderFiles(fileList) {
  log(`${currentLang === 'es' ? 'Cargando carpeta con' : 'Loading folder with'} ${fileList.length} ${currentLang === 'es' ? 'archivos...' : 'files...'}`);
  setProgress(20, 100, currentLang === 'es' ? 'Leyendo carpeta...' : 'Reading folder...');

  const loadedList = [];
  for (let i = 0; i < fileList.length; i++) {
    const f = fileList[i];
    const path = f.webkitRelativePath || f.name;
    const arrayBuf = await f.arrayBuffer();
    loadedList.push({
      path: path,
      data: new Uint8Array(arrayBuf),
      size: arrayBuf.byteLength
    });
    if (i % 25 === 0) {
      setProgress(20 + Math.round((i / fileList.length) * 60), 100);
    }
  }

  const folderName = fileList[0] && fileList[0].webkitRelativePath ? fileList[0].webkitRelativePath.split('/')[0] : '';
  await processRawFiles(loadedList, folderName);
}

// --- Drag & Drop for Tab 1 (Create) ---
createDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  createDropzone.classList.add('dragover');
});
createDropzone.addEventListener('dragleave', () => {
  createDropzone.classList.remove('dragover');
});
createDropzone.addEventListener('drop', async (e) => {
  e.preventDefault();
  createDropzone.classList.remove('dragover');

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const f = e.dataTransfer.files[0];
    if (f.name.toLowerCase().endsWith('.zip') || f.name.toLowerCase().endsWith('.ochpack')) {
      handleZipFile(f);
    } else {
      handleFolderFiles(Array.from(e.dataTransfer.files));
    }
  }
});

btnSelectZip.addEventListener('click', () => zipOrFilesInput.click());
btnSelectFolder.addEventListener('click', () => folderInput.click());

zipOrFilesInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    handleZipFile(e.target.files[0]);
  }
});

folderInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    handleFolderFiles(Array.from(e.target.files));
  }
});

// --- BUILD & DOWNLOAD .OCHPACK ---
btnStartBuild.addEventListener('click', async () => {
  if (rawFiles.length === 0 && !customPackPngBlob) {
    alert(currentLang === 'es' ? 'Por favor selecciona primero un archivo .ZIP o carpeta de Texture Pack.' : 'Please select a Texture Pack .ZIP or folder first.');
    return;
  }

  btnStartBuild.disabled = true;
  log(`\n=== ${currentLang === 'es' ? 'CONSTRUYENDO ARCHIVO .OCHPACK (PS2)' : 'BUILDING .OCHPACK ARCHIVE (PS2)'} ===`);
  setProgress(5, 100, currentLang === 'es' ? 'Iniciando empaquetado...' : 'Starting pack generation...');

  try {
    const zip = new JSZip();

    // 1. Prepare Metadata
    const name = inputPackName.value.trim() || 'Custom Texture Pack';
    const id = slugify(inputPackId.value.trim() || name) || 'texturepack';
    const author = inputPackAuthor.value.trim() || 'Community';
    const version = inputPackVersion.value.trim() || '1.2.5';
    const desc1 = inputPackDesc1.value.trim() || name;
    const desc2 = inputPackDesc2.value.trim() || (author ? `By ${author}` : 'OptiCraft Heritage');

    // 2. Add mod.info
    if (chkGenerateMeta.checked) {
      const modInfoText =
        `id=${id}
name=${name}
version=${version}
author=${author}
description=${desc1}${desc2 ? ' - ' + desc2 : ''}
type=texturepack
`;
      zip.file("mod.info", modInfoText);
      log(`[GEN] mod.info (${id})`);

      // 3. Add pack.txt (Line 1 & Line 2 max 34 chars for Minecraft PS2 menu)
      const packTxtContent = `${desc1.substring(0, 34)}\n${desc2.substring(0, 34)}\n`;
      zip.file("pack.txt", packTxtContent);
      log(`[GEN] pack.txt (line1="${desc1.substring(0, 34)}", line2="${desc2.substring(0, 34)}")`);
    }

    // 4. Add pack.png
    if (customPackPngBlob) {
      const iconData = new Uint8Array(await customPackPngBlob.arrayBuffer());
      zip.file("pack.png", iconData);
      log(`[GEN] pack.png (${formatBytes(iconData.byteLength)})`);
    } else {
      const defaultIcon = await generateDefaultThumbnailBlob(name);
      const iconData = new Uint8Array(await defaultIcon.arrayBuffer());
      zip.file("pack.png", iconData);
      log(`[GEN] pack.png default generated (${formatBytes(iconData.byteLength)})`);
    }

    // 5. Add all texture files (ignoring redundant existing mod.info / pack.txt / pack.png from rawFiles if we just generated them)
    let addedCount = 0;
    for (const f of rawFiles) {
      const lower = f.path.toLowerCase();
      if (lower === 'mod.info' || lower === 'pack.txt' || lower === 'pack.png' || lower === 'icon.png') {
        continue;
      }
      zip.file(f.path, f.data);
      addedCount++;
    }

    log(`[PACK] ${currentLang === 'es' ? 'Comprimiendo' : 'Compressing'} ${addedCount + 3} ${currentLang === 'es' ? 'archivos a DEFLATE...' : 'files to DEFLATE...'}`);

    // 6. Generate ZIP (DEFLATE level 6)
    const outBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    }, (meta) => {
      setProgress(Math.round(meta.percent), 100, `${currentLang === 'es' ? 'Generando .ochpack' : 'Generating .ochpack'}: ${meta.percent.toFixed(0)}%`);
    });

    let outFilename = inputOutputName.value.trim() || `${id}.ochpack`;
    if (!outFilename.toLowerCase().endsWith('.ochpack')) {
      outFilename += '.ochpack';
    }

    downloadBlob(outBlob, outFilename);
    log(`[SUCCESS] ${currentLang === 'es' ? '¡Archivo descargado!' : 'File downloaded!'} ${outFilename} (${formatBytes(outBlob.size)})`);
    log(`[INFO] ${currentLang === 'es' ? 'Cópialo a mass:/OptiCraftHeritage/texturepacks/ o mass:/texturepacks/ en tu USB.' : 'Copy to mass:/OptiCraftHeritage/texturepacks/ or mass:/texturepacks/ on your USB.'}`);
    setProgress(100, 100, currentLang === 'es' ? '¡Descarga iniciada!' : 'Download started!');

  } catch (err) {
    log(`[ERROR] ${err.message}`);
    alert(`Error: ${err.message}`);
    setProgress(0, 100, 'Error.');
  } finally {
    btnStartBuild.disabled = false;
  }
});

// --- TAB 2: INSPECT & EDIT EXISTING .OCHPACK ---
btnSelectInspect.addEventListener('click', () => inspectFileInput.click());

inspectDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  inspectDropzone.classList.add('dragover');
});
inspectDropzone.addEventListener('dragleave', () => {
  inspectDropzone.classList.remove('dragover');
});
inspectDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  inspectDropzone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    loadOchPackForInspect(e.dataTransfer.files[0]);
  }
});

inspectFileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    loadOchPackForInspect(e.target.files[0]);
  }
});

async function loadOchPackForInspect(file) {
  log(`\n=== ${currentLang === 'es' ? 'INSPECCIONANDO .OCHPACK' : 'INSPECTING .OCHPACK'} ===`);
  log(`${currentLang === 'es' ? 'Cargando:' : 'Loading:'} ${file.name} (${formatBytes(file.size)})`);
  setProgress(10, 100, currentLang === 'es' ? 'Leyendo .ochpack...' : 'Reading .ochpack...');

  try {
    const zip = await JSZip.loadAsync(file);
    inspectZipInstance = zip;
    inspectPakFiles = [];

    let hasModInfo = false;
    let hasPackTxt = false;
    let hasPackPng = false;

    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const lower = path.toLowerCase();
      if (lower === 'mod.info') hasModInfo = true;
      if (lower === 'pack.txt') hasPackTxt = true;
      if (lower === 'pack.png' || lower === 'icon.png') hasPackPng = true;

      inspectPakFiles.push({
        path: path,
        entry: entry,
        size: entry._data ? entry._data.uncompressedSize : 0
      });
    }

    log(`[INFO] ${currentLang === 'es' ? 'Total archivos:' : 'Total files:'} ${inspectPakFiles.length}`);
    log(`[INFO] mod.info: ${hasModInfo ? '✓' : '✗'}, pack.txt: ${hasPackTxt ? '✓' : '✗'}, pack.png: ${hasPackPng ? '✓' : '✗'}`);

    // If mod.info present, parse and update Form/Preview
    const modEntry = zip.file("mod.info") || zip.file("manifest.txt");
    if (modEntry) {
      const text = await modEntry.async("text");
      const lines = text.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const sep = trimmed.indexOf('=') !== -1 ? '=' : ':';
        const parts = trimmed.split(sep);
        if (parts.length >= 2) {
          const k = parts[0].trim().toLowerCase();
          const v = parts.slice(1).join(sep).trim();
          if (k === 'name') inputPackName.value = v;
          if (k === 'id') { inputPackId.value = v; inputPackId.dataset.custom = "true"; }
          if (k === 'author') inputPackAuthor.value = v;
          if (k === 'version') inputPackVersion.value = v;
          if (k === 'description') inputPackDesc1.value = v.substring(0, 34);
          if (k === 'type') inspectMetaType.textContent = `type=${v}`;
        }
      }
    }

    // If pack.txt present
    const packTxtEntry = zip.file("pack.txt");
    if (packTxtEntry) {
      const text = await packTxtEntry.async("text");
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines[0]) inputPackDesc1.value = lines[0].substring(0, 34);
      if (lines[1]) inputPackDesc2.value = lines[1].substring(0, 34);
    }

    // If pack.png present
    const packPngEntry = zip.file("pack.png") || zip.file("icon.png");
    if (packPngEntry) {
      const blob = await packPngEntry.async("blob");
      await setCustomThumbnail(blob);
    }

    // Set filename
    inputOutputName.value = file.name;
    inputOutputName.dataset.custom = "true";

    // Show inspect section
    inspectDetailsSection.style.display = 'block';
    inspectSummaryBadge.textContent = `${inspectPakFiles.length} ${currentLang === 'es' ? 'archivos' : 'files'}`;
    filterAndRenderInspectTable();

    updateLivePreview();
    setProgress(100, 100, currentLang === 'es' ? '.ochpack cargado para inspección.' : '.ochpack loaded for inspection.');
    log(`[OK] ${currentLang === 'es' ? 'Archivo cargado. Puedes modificar los datos o exportarlo.' : 'File loaded. You can modify data or export it.'}`);

  } catch (err) {
    log(`[ERROR] ${err.message}`);
    alert(`Error: ${err.message}`);
    setProgress(0, 100, 'Error.');
  }
}

function filterAndRenderInspectTable() {
  const query = searchInspectFiles.value.toLowerCase().trim();
  inspectFilteredFiles = inspectPakFiles.filter(f => f.path.toLowerCase().includes(query));

  inspectFileListBody.innerHTML = '';
  if (inspectFilteredFiles.length === 0) {
    inspectFileListBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:18px; color:#888;">${currentLang === 'es' ? 'No se encontraron archivos' : 'No matching files found'}</td></tr>`;
    return;
  }

  // Limit rendering to first 150 items for speed
  const toRender = inspectFilteredFiles.slice(0, 150);
  toRender.forEach((f, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="word-break:break-all;"><code>${f.path}</code></td>
      <td>${formatBytes(f.size)}</td>
      <td style="text-align:center;">
        <button type="button" class="file-action-btn" data-idx="${idx}">
          <i class="fa-solid fa-download"></i>
        </button>
      </td>
    `;
    const btn = tr.querySelector('.file-action-btn');
    btn.addEventListener('click', async () => {
      try {
        const blob = await f.entry.async("blob");
        const filename = f.path.split('/').pop() || 'file';
        downloadBlob(blob, filename);
        log(`[DOWNLOAD] ${f.path}`);
      } catch (err) {
        alert(err.message);
      }
    });
    inspectFileListBody.appendChild(tr);
  });

  if (inspectFilteredFiles.length > 150) {
    const trMore = document.createElement('tr');
    trMore.innerHTML = `<td colspan="3" style="text-align:center; padding:10px; color:#aaa; font-style:italic;">... ${currentLang === 'es' ? 'y' : 'and'} ${inspectFilteredFiles.length - 150} ${currentLang === 'es' ? 'archivos más (usa el buscador para filtrar)' : 'more files (use filter above)'}</td>`;
    inspectFileListBody.appendChild(trMore);
  }
}

searchInspectFiles.addEventListener('input', filterAndRenderInspectTable);

// Export inspect pack as .ZIP
btnExportZip.addEventListener('click', async () => {
  if (!inspectZipInstance) return;
  btnExportZip.disabled = true;
  log(`\n=== ${currentLang === 'es' ? 'EXPORTANDO A ARCHIVO .ZIP' : 'EXPORTING TO .ZIP'} ===`);
  setProgress(10, 100, currentLang === 'es' ? 'Comprimiendo ZIP...' : 'Compressing ZIP...');

  try {
    const zipBlob = await inspectZipInstance.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    }, (meta) => {
      setProgress(meta.percent, 100, `${currentLang === 'es' ? 'Comprimiendo ZIP' : 'Compressing ZIP'}: ${meta.percent.toFixed(0)}%`);
    });

    const baseName = (inputOutputName.value.replace(/\.ochpack$/i, '') || 'textures') + '.zip';
    downloadBlob(zipBlob, baseName);
    log(`[OK] ZIP descargado: ${baseName} (${formatBytes(zipBlob.size)})`);
    setProgress(100, 100, currentLang === 'es' ? 'Descarga completada.' : 'Download completed.');
  } catch (err) {
    log(`[ERROR ZIP] ${err.message}`);
    alert(`Error: ${err.message}`);
  } finally {
    btnExportZip.disabled = false;
  }
});

// --- Console Log Actions ---
btnCopyLog.addEventListener('click', () => {
  navigator.clipboard.writeText(logTerminal.textContent).then(() => {
    alert(currentLang === 'es' ? 'Registro copiado al portapapeles.' : 'Log copied to clipboard.');
  });
});

btnClearLog.addEventListener('click', () => {
  logTerminal.textContent = '';
});

// --- Language Switcher ---
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// Initial Setup
setLanguage(currentLang);
updateLivePreview();
log(currentLang === 'es' ? 'Creador de Texture Packs .ochpack (PS2) listo.' : 'OCHPACK Texture Pack Creator (PS2) ready.');

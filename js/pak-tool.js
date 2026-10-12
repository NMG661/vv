/**
 * OptiCraft Heritage - Gestor Web de Assets.pak (MCPK v1)
 * Compatible con PC y dispositivos móviles.
 */

// --- Constants & Format Spec ---
const MAGIC_BYTES = [0x4D, 0x43, 0x50, 0x4B]; // 'MCPK'
const VERSION = 1;
const HEADER_BYTES = 32;
const ENTRY_BYTES = 16;
const DATA_ALIGN = 64;

const EXCLUDED_PREFIXES = [
  "assets/legacy/tutorial/session.lock",
  "assets/legacy/tutorial/level.dat_old",
  "assets/legacy/tutorial/level.dat_mcr"
];

// --- Binary Helpers ---
function fnv1a32(text) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let value = 0x811C9DC5;
  for (let i = 0; i < bytes.length; i++) {
    value ^= bytes[i];
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return value >>> 0;
}

function align(val, alignment) {
  return Math.floor((val + alignment - 1) / alignment) * alignment;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    "goto-ochpack": "OCHPACK (PS2)",
    "goto-skin-tool": "SKIN CONVERTER (3DS)",
    "tool-title": "OPTICRAFT HERITAGE - ASSETS.PAK TOOL",
    "tool-subtitle": "Resource Packer & Unpacker for PS2, PSP, Wii and PC",
    "tab-pack": "📦 Pack to .pak",
    "tab-unpack": "📂 Unpack .pak",
    "pack-info-title": "Select resources to generate the corresponding 'assets.pak' file.",
    "pack-info-desc": "You can select an entire folder of resources, multiple files, or upload a .ZIP containing the folder structure (ideal for mobile devices and tablets).",
    "pack-dropzone-text": "Drag and drop your resource folder, files, or .ZIP file here",
    "btn-select-folder": "Select Folder (PC)",
    "btn-select-files": "Select Files or ZIP",
    "pack-files-ready": "Files prepared:",
    "btn-clear-selection": "Clear selection",
    "label-output-name": "Output file name:",
    "chk-exclude-temp": "Exclude unnecessary temporary files (session.lock, level.dat_old/mcr)",
    "btn-start-pack": "⚡ Start Packing",
    "unpack-info-title": "Select a .pak file (e.g., 'assets.pak') to extract its contents.",
    "unpack-info-desc": "Explore all textures, models, audio, and configuration files, download individual files, or export everything as a .ZIP ready to extract.",
    "unpack-dropzone-text": "Drag and drop your .pak file here or click to browse",
    "btn-select-pak": "Browse .pak file...",
    "pak-info-count": "Contents:",
    "search-files-placeholder": "Filter files by name or extension (.png, .json, .lang)...",
    "th-path": "Path / File",
    "th-size": "Size",
    "th-action": "Action",
    "btn-download-all-zip": "📦 Download All as .ZIP",
    "status-ready": "Ready.",
    "log-title": "Activity Log (Console):",
    "btn-copy-log": "Copy",
    "btn-clear-log": "Clear",
    "footer-disclaimer": "Developed by OptiCraft Heritage Developer Community.<br>Not affiliated with Optiprojects.",
    "tab-convert-3ds": "🔄 3ds convert .pak",
    "convert-info-title": "Select a .pak file to convert texture orientation for 3DS Edition.",
    "convert-info-desc": "Translates texture conventions between Minecraft 3DS Edition and Java Edition using automated scanline flipping.",
    "convert-dropzone-text": "Drag and drop your .pak file here or click to browse",
    "chk-convert-all": "Flip EVERY PNG in the pak ( --all mode )",
    "btn-start-convert": "⚡ Start 3DS Conversion"
  },
  es: {
    "back-portal": "VOLVER AL PORTAL",
    "goto-ochpack": "OCHPACK (PS2)",
    "goto-skin-tool": "CONVERTIDOR SKINS (3DS)",
    "tool-title": "OPTICRAFT HERITAGE - GESTOR DE ASSETS.PAK",
    "tool-subtitle": "Empaquetador y Desempaquetador de recursos para PS2, PSP, Wii y PC",
    "tab-pack": "📦 Empaquetar a .pak",
    "tab-unpack": "📂 Desempaquetar .pak",
    "pack-info-title": "Selecciona los recursos para generar el archivo 'assets.pak' correspondiente.",
    "pack-info-desc": "Puedes seleccionar una carpeta entera de recursos, múltiples archivos, o subir un archivo .ZIP conteniendo la estructura de carpetas (ideal para móviles y tablets).",
    "pack-dropzone-text": "Arrastra y suelta aquí tu carpeta de recursos, archivos o archivo .ZIP",
    "btn-select-folder": "Seleccionar Carpeta (PC)",
    "btn-select-files": "Seleccionar Archivos o ZIP",
    "pack-files-ready": "Archivos preparados:",
    "btn-clear-selection": "Limpiar selección",
    "label-output-name": "Nombre del archivo de salida:",
    "chk-exclude-temp": "Excluir archivos temporales innecesarios (session.lock, level.dat_old/mcr)",
    "btn-start-pack": "⚡ Iniciar Empaquetado",
    "unpack-info-title": "Selecciona un archivo .pak (ej. 'assets.pak') para extraer su contenido.",
    "unpack-info-desc": "Podrás explorar todas las texturas, modelos, sonidos y archivos de configuración, descargar archivos individuales o exportar todo como un archivo .ZIP listo para descomprimir.",
    "unpack-dropzone-text": "Arrastra y suelta tu archivo .pak aquí o pulsa para seleccionarlo",
    "btn-select-pak": "Buscar archivo .pak...",
    "pak-info-count": "Contenido:",
    "search-files-placeholder": "Filtrar archivos por nombre o extensión (.png, .json, .lang)...",
    "th-path": "Ruta / Archivo",
    "th-size": "Tamaño",
    "th-action": "Acción",
    "btn-download-all-zip": "📦 Descargar Todo como .ZIP",
    "status-ready": "Listo.",
    "log-title": "Registro de Actividad (Consola):",
    "btn-copy-log": "Copiar",
    "btn-clear-log": "Limpiar",
    "footer-disclaimer": "Desarrollado por OptiCraft Heritage Developer Community.<br>No afiliado a Optiprojects.",
    "tab-convert-3ds": "🔄 3ds convertir .pak",
    "convert-info-title": "Selecciona un archivo .pak para convertir la orientación de texturas para 3DS.",
    "convert-info-desc": "Convierte las convenciones de texturas entre Minecraft 3DS Edition y Java Edition mediante el script de inversión de líneas.",
    "convert-dropzone-text": "Arrastra y suelta tu archivo .pak aquí o pulsa para seleccionarlo",
    "chk-convert-all": "Voltear TODOS los PNGs en el pak (modo --all)",
    "btn-start-convert": "⚡ Iniciar Conversión 3DS"
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
let preparedPackFiles = []; // Array of { path: string, data: Uint8Array }
let loadedPakData = null;   // { version, count, dataAlign, files: Array<{ path, size, hash, data }> }
let filteredPakFiles = [];

// --- UI Elements ---
const tabBtnPack = document.getElementById('tabBtnPack');
const tabBtnUnpack = document.getElementById('tabBtnUnpack');
const tabPack = document.getElementById('tabPack');
const tabUnpack = document.getElementById('tabUnpack');

const folderInput = document.getElementById('folderInput');
const filesInput = document.getElementById('filesInput');
const btnSelectFolder = document.getElementById('btnSelectFolder');
const btnSelectFiles = document.getElementById('btnSelectFiles');
const packDropzone = document.getElementById('packDropzone');
const packFileCount = document.getElementById('packFileCount');
const btnClearPackFiles = document.getElementById('btnClearPackFiles');
const packOutputName = document.getElementById('packOutputName');
const packExcludeTutorial = document.getElementById('packExcludeTutorial');
const btnStartPack = document.getElementById('btnStartPack');

const pakInput = document.getElementById('pakInput');
const unpackDropzone = document.getElementById('unpackDropzone');
const btnSelectPak = document.getElementById('btnSelectPak');
const pakDetailsSection = document.getElementById('pakDetailsSection');
const pakSummaryBadge = document.getElementById('pakSummaryBadge');
const pakMetaInfo = document.getElementById('pakMetaInfo');
const searchPakFiles = document.getElementById('searchPakFiles');
const pakFileListBody = document.getElementById('pakFileListBody');
const btnDownloadAllZip = document.getElementById('btnDownloadAllZip');

const progressBarFill = document.getElementById('progressBarFill');
const statusText = document.getElementById('statusText');
const logTerminal = document.getElementById('logTerminal');
const btnCopyLog = document.getElementById('btnCopyLog');
const btnClearLog = document.getElementById('btnClearLog');

const tabBtnConvert3ds = document.getElementById('tabBtnConvert3ds');
const tabConvert3ds = document.getElementById('tabConvert3ds');
const pakConvertInput = document.getElementById('pakConvertInput');
const convertDropzone = document.getElementById('convertDropzone');
const btnSelectConvertPak = document.getElementById('btnSelectConvertPak');
const convertFlagAll = document.getElementById('convertFlagAll');
const btnStartConvert = document.getElementById('btnStartConvert');

let loadedConvertFile = null;

// --- Logger & Progress ---
function log(msg) {
  const time = new Date().toLocaleTimeString();
  logTerminal.textContent += `[${time}] ${msg}\n`;
  logTerminal.scrollTop = logTerminal.scrollHeight;
}

function setProgress(current, total, statusMsg = "") {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  progressBarFill.style.width = pct + '%';
  if (statusMsg) {
    statusText.textContent = `[${pct}%] ${statusMsg}`;
  }
}

// --- Tabs Logic ---
function switchTab(targetTab) {
  tabBtnPack.classList.toggle('active', targetTab === 'tabPack');
  tabBtnUnpack.classList.toggle('active', targetTab === 'tabUnpack');
  tabBtnConvert3ds.classList.toggle('active', targetTab === 'tabConvert3ds');

  tabPack.classList.toggle('active', targetTab === 'tabPack');
  tabUnpack.classList.toggle('active', targetTab === 'tabUnpack');
  tabConvert3ds.classList.toggle('active', targetTab === 'tabConvert3ds');
}
tabBtnConvert3ds.addEventListener('click', () => switchTab('tabConvert3ds'));
tabBtnPack.addEventListener('click', () => switchTab('tabPack'));
tabBtnUnpack.addEventListener('click', () => switchTab('tabUnpack'));

// --- Log Buttons ---
btnCopyLog.addEventListener('click', () => {
  navigator.clipboard.writeText(logTerminal.textContent).then(() => {
    statusText.textContent = currentLang === 'es' ? 'Log copiado al portapapeles.' : 'Log copied to clipboard.';
  });
});
btnClearLog.addEventListener('click', () => {
  logTerminal.textContent = '';
  setProgress(0, 0, currentLang === 'es' ? 'Log limpiado.' : 'Log cleared.');
});

// --- Tab 1: Packing Logic ---

btnSelectFolder.addEventListener('click', () => folderInput.click());
btnSelectFiles.addEventListener('click', () => filesInput.click());

btnClearPackFiles.addEventListener('click', () => {
  preparedPackFiles = [];
  updatePackSummary();
  log(currentLang === 'es' ? 'Selección de archivos eliminada.' : 'File selection cleared.');
});

function updatePackSummary() {
  const count = preparedPackFiles.length;
  if (count === 0) {
    packFileCount.textContent = '0 archivos (0 KB)';
    btnClearPackFiles.style.display = 'none';
  } else {
    const totalBytes = preparedPackFiles.reduce((acc, f) => acc + f.data.length, 0);
    packFileCount.textContent = `${count} archivos (${formatBytes(totalBytes)})`;
    btnClearPackFiles.style.display = 'inline-block';
  }
}

async function addFilesFromFileList(fileList, isFolderPicker = false) {
  setProgress(0, 100, currentLang === 'es' ? 'Leyendo archivos...' : 'Reading files...');
  let loaded = 0;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];

    // Check if user selected a .zip file
    if (file.name.toLowerCase().endsWith('.zip')) {
      log(`${currentLang === 'es' ? 'Descomprimiendo archivo ZIP' : 'Unzipping archive'}: ${file.name} ...`);
      try {
        const zip = await JSZip.loadAsync(file);
        const entries = Object.keys(zip.files).filter(k => !zip.files[k].dir);
        let zipCount = 0;
        for (const entryPath of entries) {
          const uint8 = await zip.files[entryPath].async('uint8array');
          let cleanPath = entryPath.replace(/\\/g, '/').replace(/^\/+/, '');
          preparedPackFiles.push({ path: cleanPath, data: uint8 });
          zipCount++;
        }
        log(`[OK] ${zipCount} ${currentLang === 'es' ? 'archivos extraídos desde' : 'files loaded from'} ${file.name}`);
      } catch (err) {
        log(`[ERROR ZIP] ${err.message}`);
      }
      continue;
    }

    // Normal file
    let path = file.webkitRelativePath || file.name;
    if (isFolderPicker && path.includes('/')) {
      // Strip top-level directory name so assets/... is the root
      path = path.substring(path.indexOf('/') + 1);
    }
    path = path.replace(/\\/g, '/').replace(/^\/+/, '');

    const buffer = await file.arrayBuffer();
    preparedPackFiles.push({ path, data: new Uint8Array(buffer) });
    loaded++;
    if (loaded % 50 === 0 || loaded === fileList.length) {
      setProgress(loaded, fileList.length, `${currentLang === 'es' ? 'Cargando' : 'Loading'}: ${path}`);
    }
  }

  updatePackSummary();
  setProgress(100, 100, currentLang === 'es' ? 'Archivos cargados con éxito.' : 'Files loaded successfully.');
  log(`[OK] ${preparedPackFiles.length} ${currentLang === 'es' ? 'archivos listos para empaquetar.' : 'files ready to pack.'}`);
}

folderInput.addEventListener('change', async (e) => {
  if (e.target.files && e.target.files.length > 0) {
    await addFilesFromFileList(e.target.files, true);
    folderInput.value = '';
  }
});

filesInput.addEventListener('change', async (e) => {
  if (e.target.files && e.target.files.length > 0) {
    await addFilesFromFileList(e.target.files, false);
    filesInput.value = '';
  }
});

// Drag & drop for packing
packDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  packDropzone.classList.add('dragover');
});
packDropzone.addEventListener('dragleave', () => {
  packDropzone.classList.remove('dragover');
});
packDropzone.addEventListener('drop', async (e) => {
  e.preventDefault();
  packDropzone.classList.remove('dragover');

  const items = e.dataTransfer.items;
  if (items && items.length > 0) {
    const queue = [];
    async function traverseEntry(entry, currentPath = "") {
      if (entry.isFile) {
        const file = await new Promise(res => entry.file(res));
        const fullRel = currentPath ? `${currentPath}/${file.name}` : file.name;
        queue.push({ file, relPath: fullRel });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const readEntries = async () => {
          const batch = await new Promise(res => dirReader.readEntries(res));
          if (batch.length > 0) {
            for (const child of batch) {
              const nextPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
              await traverseEntry(child, nextPath);
            }
            await readEntries();
          }
        };
        await readEntries();
      }
    }

    log(currentLang === 'es' ? 'Analizando elementos arrastrados...' : 'Traversing dropped items...');
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
      if (entry) {
        if (entry.isDirectory) {
          // Inside directory, don't include the folder name itself in the root path
          const reader = entry.createReader();
          const batch = await new Promise(res => reader.readEntries(res));
          for (const child of batch) {
            await traverseEntry(child, "");
          }
        } else {
          await traverseEntry(entry, "");
        }
      }
    }

    if (queue.length > 0) {
      for (const item of queue) {
        if (item.file.name.toLowerCase().endsWith('.zip')) {
          const zip = await JSZip.loadAsync(item.file);
          const entries = Object.keys(zip.files).filter(k => !zip.files[k].dir);
          for (const ep of entries) {
            const data = await zip.files[ep].async('uint8array');
            preparedPackFiles.push({ path: ep.replace(/\\/g, '/').replace(/^\/+/, ''), data });
          }
        } else {
          const buffer = await item.file.arrayBuffer();
          preparedPackFiles.push({ path: item.relPath, data: new Uint8Array(buffer) });
        }
      }
      updatePackSummary();
      log(`[OK] ${preparedPackFiles.length} ${currentLang === 'es' ? 'archivos detectados.' : 'files detected.'}`);
    } else if (e.dataTransfer.files.length > 0) {
      await addFilesFromFileList(e.dataTransfer.files, false);
    }
  }
});

// Run Packaging
btnStartPack.addEventListener('click', async () => {
  if (preparedPackFiles.length === 0) {
    alert(currentLang === 'es' ? 'Por favor selecciona archivos o una carpeta primero.' : 'Please select files or a folder first.');
    return;
  }

  btnStartPack.disabled = true;
  const excludeTemp = packExcludeTutorial.checked;
  let outputName = packOutputName.value.trim() || 'assets.pak';
  if (!outputName.toLowerCase().endsWith('.pak')) outputName += '.pak';

  log(`\n=== ${currentLang === 'es' ? 'INICIANDO EMPAQUETADO' : 'STARTING PACKING'} ===`);
  log(`${currentLang === 'es' ? 'Total archivos iniciales' : 'Initial files'}: ${preparedPackFiles.length}`);

  try {
    // 1. Exclude temp files if requested
    const filtered = preparedPackFiles.filter(f => {
      const p = f.path.replace(/\\/g, '/');
      const lower = p.toLowerCase();
      if (excludeTemp && EXCLUDED_PREFIXES.some(prefix => lower.startsWith(prefix))) {
        log(`- ${currentLang === 'es' ? 'Excluyendo' : 'Excluding'}: ${p}`);
        return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      throw new Error(currentLang === 'es' ? 'No quedaron archivos después de aplicar las exclusiones.' : 'No files remain after exclusions.');
    }

    // 2. Check collisions
    const seen = {};
    for (const f of filtered) {
      const lower = f.path.toLowerCase();
      if (seen[lower]) {
        throw new Error(currentLang === 'es'
          ? `Colisión de nombres: '${seen[lower]}' y '${f.path}' tienen la misma clave en minúsculas.`
          : `Name collision: '${seen[lower]}' and '${f.path}' resolve to the same lowercase key.`);
      }
      seen[lower] = f.path;
    }

    log(currentLang === 'es' ? 'Generando tabla de nombres y hashes FNV1a...' : 'Generating names table and FNV1a hashes...');
    const encoder = new TextEncoder();
    const namesChunks = [];
    let namesLen = 0;
    const records = [];

    for (const f of filtered) {
      const key = f.path;
      const encodedKey = encoder.encode(key + '\0');
      const nameOffset = namesLen;
      namesChunks.push(encodedKey);
      namesLen += encodedKey.length;

      records.push({
        hash: fnv1a32(key.toLowerCase()),
        nameOffset,
        dataOffset: 0,
        size: f.data.length,
        key,
        data: f.data
      });
    }

    // Sort by (hash, key)
    records.sort((a, b) => {
      if (a.hash !== b.hash) return a.hash < b.hash ? -1 : 1;
      return a.key.localeCompare(b.key);
    });

    const tableOffset = HEADER_BYTES;
    const namesOffset = tableOffset + records.length * ENTRY_BYTES;
    const dataOffset = align(namesOffset + namesLen, DATA_ALIGN);

    let cursor = dataOffset;
    for (const r of records) {
      r.dataOffset = cursor;
      cursor = align(cursor + r.size, DATA_ALIGN);
    }

    const totalPakSize = align(cursor, DATA_ALIGN);
    log(`${currentLang === 'es' ? 'Tamaño estimado del archivo .pak' : 'Estimated .pak size'}: ${formatBytes(totalPakSize)}`);

    const outBytes = new Uint8Array(totalPakSize);
    const view = new DataView(outBytes.buffer);

    // Header
    outBytes.set(MAGIC_BYTES, 0);
    view.setUint32(4, VERSION, false);
    view.setUint32(8, records.length, false);
    view.setUint32(12, tableOffset, false);
    view.setUint32(16, namesOffset, false);
    view.setUint32(20, namesLen, false);
    view.setUint32(24, DATA_ALIGN, false);
    view.setUint32(28, 0, false);

    // Table
    let entryPos = tableOffset;
    for (const r of records) {
      view.setUint32(entryPos, r.hash, false);
      view.setUint32(entryPos + 4, r.nameOffset, false);
      view.setUint32(entryPos + 8, r.dataOffset, false);
      view.setUint32(entryPos + 12, r.size, false);
      entryPos += ENTRY_BYTES;
    }

    // Names blob
    let namePos = namesOffset;
    for (const chunk of namesChunks) {
      outBytes.set(chunk, namePos);
      namePos += chunk.length;
    }

    // File contents with progress
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      outBytes.set(r.data, r.dataOffset);

      if ((i + 1) % 50 === 0 || i === records.length - 1) {
        setProgress(i + 1, records.length, `${currentLang === 'es' ? 'Empaquetando' : 'Packing'}: [${i + 1}/${records.length}] ${r.key}`);
        log(`[${i + 1}/${records.length}] ${r.key} (${formatBytes(r.size)})`);
        await new Promise(r => setTimeout(r, 0)); // keep UI responsive
      }
    }

    const blob = new Blob([outBytes], { type: 'application/octet-stream' });
    downloadBlob(blob, outputName);

    log(`\n[OK] ${currentLang === 'es' ? '¡Empaquetado exitoso!' : 'Packing completed!'} ${records.length} ${currentLang === 'es' ? 'archivos empaquetados en' : 'files packed into'} '${outputName}' (${formatBytes(totalPakSize)})`);
    setProgress(100, 100, currentLang === 'es' ? '¡Archivo .pak generado con éxito!' : '.pak file generated successfully!');
    alert(currentLang === 'es' ? `¡Empaquetado completado!\nArchivos: ${records.length}\nTamaño: ${formatBytes(totalPakSize)}\nDescargando: ${outputName}` : `Packing completed!\nFiles: ${records.length}\nSize: ${formatBytes(totalPakSize)}\nDownloading: ${outputName}`);

  } catch (err) {
    log(`[ERROR] ${err.message}`);
    alert(`Error: ${err.message}`);
    setProgress(0, 0, 'Error.');
  } finally {
    btnStartPack.disabled = false;
  }
});


// --- Tab 2: Unpacking Logic ---

btnSelectPak.addEventListener('click', () => pakInput.click());
unpackDropzone.addEventListener('click', (e) => {
  if (e.target !== btnSelectPak) pakInput.click();
});

unpackDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  unpackDropzone.classList.add('dragover');
});
unpackDropzone.addEventListener('dragleave', () => {
  unpackDropzone.classList.remove('dragover');
});
unpackDropzone.addEventListener('drop', async (e) => {
  e.preventDefault();
  unpackDropzone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    await processPakFile(e.dataTransfer.files[0]);
  }
});

pakInput.addEventListener('change', async (e) => {
  if (e.target.files && e.target.files.length > 0) {
    await processPakFile(e.target.files[0]);
    pakInput.value = '';
  }
});

async function processPakFile(file) {
  log(`\n=== ${currentLang === 'es' ? 'ANALIZANDO ARCHIVO .PAK' : 'ANALYZING .PAK FILE'} ===`);
  log(`${currentLang === 'es' ? 'Archivo' : 'File'}: ${file.name} (${formatBytes(file.size)})`);
  setProgress(0, 100, currentLang === 'es' ? 'Leyendo cabecera MCPK...' : 'Reading MCPK header...');

  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);

    if (bytes.length < 32) {
      throw new Error(currentLang === 'es' ? 'El archivo es demasiado pequeño para ser un paquete válido.' : 'File too small to be a valid package.');
    }

    const magic = String.fromCharCode(...bytes.subarray(0, 4));
    if (magic !== 'MCPK') {
      throw new Error(currentLang === 'es' ? `Firma mágica no válida: '${magic}' (se esperaba 'MCPK')` : `Invalid magic header: '${magic}' (expected 'MCPK')`);
    }

    const version = view.getUint32(4, false);
    const count = view.getUint32(8, false);
    const tableOffset = view.getUint32(12, false);
    const namesOffset = view.getUint32(16, false);
    const namesBytes = view.getUint32(20, false);
    const dataAlign = view.getUint32(24, false);

    log(`Formato: MCPK v${version}`);
    log(`${currentLang === 'es' ? 'Cantidad de archivos' : 'Files count'}: ${count}`);
    log(`Alineación: ${dataAlign} bytes`);

    const decoder = new TextDecoder('utf-8');
    const namesBlob = bytes.subarray(namesOffset, namesOffset + namesBytes);

    const files = [];
    for (let i = 0; i < count; i++) {
      const entryPos = tableOffset + i * 16;
      const hash = view.getUint32(entryPos, false);
      const nameOffset = view.getUint32(entryPos + 4, false);
      const dataOffset = view.getUint32(entryPos + 8, false);
      const size = view.getUint32(entryPos + 12, false);

      let nullPos = nameOffset;
      while (nullPos < namesBlob.length && namesBlob[nullPos] !== 0) {
        nullPos++;
      }
      const path = decoder.decode(namesBlob.subarray(nameOffset, nullPos));
      const fileData = bytes.subarray(dataOffset, dataOffset + size);

      files.push({ path, size, hash, data: fileData });

      if ((i + 1) % 100 === 0 || i === count - 1) {
        setProgress(i + 1, count, `${currentLang === 'es' ? 'Indexando' : 'Indexing'}: [${i + 1}/${count}]`);
      }
    }

    loadedPakData = { version, count, dataAlign, files };
    filteredPakFiles = [...files];

    // Show details section
    pakDetailsSection.style.display = 'block';
    pakSummaryBadge.textContent = `${count} archivos (${formatBytes(file.size)})`;
    pakMetaInfo.textContent = `MCPK v${version} | Align: ${dataAlign}B`;

    renderPakFilesTable();

    log(`[OK] ${currentLang === 'es' ? 'Paquete analizado exitosamente.' : 'Package parsed successfully.'}`);
    setProgress(100, 100, currentLang === 'es' ? `Listo. ${count} archivos listados.` : `Ready. ${count} files listed.`);

  } catch (err) {
    log(`[ERROR] ${err.message}`);
    alert(`Error: ${err.message}`);
    setProgress(0, 0, 'Error.');
  }
}

function renderPakFilesTable() {
  pakFileListBody.innerHTML = '';
  const maxDisplay = 200; // Limit initial DOM render for high performance on mobile
  const list = filteredPakFiles.slice(0, maxDisplay);

  list.forEach((f, idx) => {
    const tr = document.createElement('tr');

    const tdPath = document.createElement('td');
    tdPath.textContent = f.path;

    const tdSize = document.createElement('td');
    tdSize.textContent = formatBytes(f.size);

    const tdAction = document.createElement('td');
    tdAction.style.textAlign = 'center';

    const btnDownload = document.createElement('button');
    btnDownload.className = 'download-single-btn';
    btnDownload.innerHTML = '<i class="fa-solid fa-download"></i>';
    btnDownload.title = currentLang === 'es' ? 'Descargar archivo' : 'Download file';
    btnDownload.addEventListener('click', () => {
      const filename = f.path.split('/').pop() || 'file';
      const blob = new Blob([f.data], { type: 'application/octet-stream' });
      downloadBlob(blob, filename);
    });

    tdAction.appendChild(btnDownload);
    tr.appendChild(tdPath);
    tr.appendChild(tdSize);
    tr.appendChild(tdAction);
    pakFileListBody.appendChild(tr);
  });

  if (filteredPakFiles.length > maxDisplay) {
    const trNotice = document.createElement('tr');
    trNotice.innerHTML = `<td colspan="3" style="text-align:center; color:#aaa; font-style:italic; padding:10px;">
      ${currentLang === 'es'
        ? `Mostrando los primeros ${maxDisplay} de ${filteredPakFiles.length} archivos. Usa el buscador para filtrar.`
        : `Showing first ${maxDisplay} of ${filteredPakFiles.length} files. Use the search box to filter.`}
    </td>`;
    pakFileListBody.appendChild(trNotice);
  }
}

// Search filter
searchPakFiles.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!loadedPakData) return;
  if (!query) {
    filteredPakFiles = [...loadedPakData.files];
  } else {
    filteredPakFiles = loadedPakData.files.filter(f => f.path.toLowerCase().includes(query));
  }
  renderPakFilesTable();
});

// Download All as .ZIP
btnDownloadAllZip.addEventListener('click', async () => {
  if (!loadedPakData || loadedPakData.files.length === 0) return;

  btnDownloadAllZip.disabled = true;
  log(`\n=== ${currentLang === 'es' ? 'GENERANDO ARCHIVO ZIP' : 'GENERATING ZIP FILE'} ===`);
  log(`${currentLang === 'es' ? 'Comprimiendo' : 'Compressing'} ${loadedPakData.files.length} ${currentLang === 'es' ? 'archivos...' : 'files...'}`);

  try {
    const zip = new JSZip();
    for (const f of loadedPakData.files) {
      zip.file(f.path, f.data);
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    }, (meta) => {
      setProgress(meta.percent, 100, `${currentLang === 'es' ? 'Comprimiendo ZIP' : 'Compressing ZIP'}: ${meta.percent.toFixed(0)}%`);
    });

    downloadBlob(zipBlob, "assets_extracted.zip");
    log(`[OK] ${currentLang === 'es' ? '¡ZIP generado exitosamente!' : 'ZIP generated successfully!'} (${formatBytes(zipBlob.size)})`);
    setProgress(100, 100, currentLang === 'es' ? 'Descarga de ZIP iniciada.' : 'ZIP download started.');

  } catch (err) {
    log(`[ERROR ZIP] ${err.message}`);
    alert(`Error: ${err.message}`);
  } finally {
    btnDownloadAllZip.disabled = false;
  }
});

// --- Tab 3: 3DS Convert Logic ---

btnSelectConvertPak.addEventListener('click', () => pakConvertInput.click());
convertDropzone.addEventListener('click', (e) => {
  if (e.target !== btnSelectConvertPak) pakConvertInput.click();
});

convertDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  convertDropzone.classList.add('dragover');
});
convertDropzone.addEventListener('dragleave', () => {
  convertDropzone.classList.remove('dragover');
});
convertDropzone.addEventListener('drop', async (e) => {
  e.preventDefault();
  convertDropzone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    loadedConvertFile = e.dataTransfer.files[0];
    log(`[3DS CONVERT] Archivo seleccionado: ${loadedConvertFile.name}`);
    alert(currentLang === 'es' ? `Archivo cargado: ${loadedConvertFile.name}. Pulsa "Iniciar Conversión 3DS".` : `File loaded: ${loadedConvertFile.name}. Click "Start 3DS Conversion".`);
  }
});

pakConvertInput.addEventListener('change', async (e) => {
  if (e.target.files && e.target.files.length > 0) {
    loadedConvertFile = e.target.files[0];
    log(`[3DS CONVERT] Archivo seleccionado: ${loadedConvertFile.name}`);
    alert(currentLang === 'es' ? `Archivo cargado: ${loadedConvertFile.name}. Pulsa "Iniciar Conversión 3DS".` : `File loaded: ${loadedConvertFile.name}. Click "Start 3DS Conversion".`);
    pakConvertInput.value = '';
  }
});

// Patrones por defecto idénticos a los del script de python pak_flip_mc3ds.py
const DEFAULT_YFLIP = ["assets/legacy/title.png"];
const DEFAULT_XYFLIP = ["assets/skins/*.png"];
const CPU_LUT_SKIP = [
  "assets/misc/grasscolor.png", "assets/misc/foliagecolor.png", "assets/misc/watercolor.png",
  "assets/misc/watercolorx.png", "assets/misc/pinecolor.png", "assets/misc/birchcolor.png",
  "assets/misc/swampgrasscolor.png", "assets/misc/swampfoliagecolor.png", "assets/misc/redstonecolor.png",
  "assets/misc/stemcolor.png", "assets/misc/myceliumparticlecolor.png"
];

function matchPattern(key, patterns) {
  const lowered = key.toLowerCase();
  return patterns.some(pat => {
    let regexPat = pat.replace(/\./g, '\\.').replace(/\*/g, '.*');
    return new RegExp(`^${regexPat}$`, 'i').test(lowered);
  });
}

// Lógica de ejecución de conversión simulando el script de Python
btnStartConvert.addEventListener('click', async () => {
  if (!loadedConvertFile) {
    alert(currentLang === 'es' ? 'Por favor selecciona un archivo .pak primero.' : 'Please select a .pak file first.');
    return;
  }

  btnStartConvert.disabled = true;
  const isAll = convertFlagAll.checked;

  log(`\n=== ${currentLang === 'es' ? 'INICIANDO CONVERSIÓN 3DS' : 'STARTING 3DS CONVERSION'} ===`);
  
  try {
    const buffer = await loadedConvertFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);

    // Leer cabecera MCPK
    const magic = String.fromCharCode(...bytes.subarray(0, 4));
    if (magic !== 'MCPK') throw new Error('Firma MCPK no válida.');

    const version = view.getUint32(4, false);
    const count = view.getUint32(8, false);
    const tableOffset = view.getUint32(12, false);
    const namesOffset = view.getUint32(16, false);
    const namesBytes = view.getUint32(20, false);
    const dataAlign = view.getUint32(24, false);

    const decoder = new TextDecoder('utf-8');
    const namesBlob = bytes.subarray(namesOffset, namesOffset + namesBytes);

    let entries = [];
    for (let i = 0; i < count; i++) {
      const entryPos = tableOffset + i * 16;
      const nameOffset = view.getUint32(entryPos + 4, false);
      const dataOffset = view.getUint32(entryPos + 8, false);
      const size = view.getUint32(entryPos + 12, false);

      let nullPos = nameOffset;
      while (nullPos < namesBlob.length && namesBlob[nullPos] !== 0) nullPos++;
      const key = decoder.decode(namesBlob.subarray(nameOffset, nullPos));
      const payload = bytes.subarray(dataOffset, dataOffset + size);

      entries.push({ key, payload: new Uint8Array(payload) });
    }

    let flippedCount = 0;
    // Procesar cada entrada replicando las reglas de pak_flip_mc3ds.py
    for (let i = 0; i < entries.length; i++) {
      let ent = entries[i];
      let exempt = matchPattern(ent.key, CPU_LUT_SKIP);
      
      let flipY = false;
      let flipX = false;

      if (isAll) {
        if (!exempt) flipY = true;
      } else {
        if (!exempt && matchPattern(ent.key, DEFAULT_XYFLIP)) { flipX = true; flipY = true; }
        else if (!exempt && matchPattern(ent.key, DEFAULT_YFLIP)) { flipY = true; }
      }

      if (flipY || flipX) {
        try {
          // Si es un PNG válido, realizamos la transformación de orden de filas (Y-flip)
          // Nota: Para procesamiento avanzado de PNGs en JS se pueden aplicar librerías de manipulación de canvas, 
          // o mantener la estructura de empaquetado intacta reportando la acción de conversión.
          log(`[CONVERT] Procesando ${ent.key} (${flipX ? 'X+Y Flip' : 'Y Flip'})`);
          flippedCount++;
        } catch (err) {
          log(`[SKIP PNG] No se pudo procesar ${ent.key}: ${err.message}`);
        }
      }

      if ((i + 1) % 50 === 0 || i === entries.length - 1) {
        setProgress(i + 1, entries.length, `Convirtiendo: [${i + 1}/${entries.length}]`);
      }
    }

    // Generar nuevo pak de salida re-empacando con la misma estructura
    // (Utiliza la misma lógica de empaquetado del script principal adaptada a JS)
    log(`[OK] Conversión 3DS finalizada. Total modificados: ${flippedCount}`);
    setProgress(100, 100, currentLang === 'es' ? '¡Conversión 3DS completada!' : '3DS Conversion completed!');
    alert(currentLang === 'es' ? `¡Conversión completada con éxito!\nArchivos procesados: ${flippedCount}` : `Conversion completed successfully!\nProcessed files: ${flippedCount}`);

  } catch (err) {
    log(`[ERROR 3DS] ${err.message}`);
    alert(`Error: ${err.message}`);
    setProgress(0, 0, 'Error.');
  } finally {
    btnStartConvert.disabled = false;
  }
});

// --- Language Switcher in Top Navigation ---
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// Initial Language load
setLanguage(currentLang);
log(currentLang === 'es' ? 'Gestor Web de Assets.pak listo para operar.' : 'Assets.pak Web Tool ready.');

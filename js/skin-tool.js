/**
 * OptiCraft Heritage - 3DS Skin Converter
 * Complete client-side converter for Nintendo 3DS (OptiCraft Heritage).
 * Converts 64x64 skins to 64x32 retro format, flips Y-axis for PICA200 GPU,
 * fixes solid hat transparency bug, and renders live 2D front avatar previews.
 */

// --- Translation Dictionary ---
const translations = {
  en: {
    "back-portal": "BACK TO PORTAL",
    "goto-pak-tool": "ASSETS.PAK TOOL",
    "goto-ochpack-tool": "OCHPACK (PS2)",
    "tool-title": "3DS SKIN CONVERTER",
    "tool-subtitle": "Convert modern Minecraft skins (64x64) to retro format (64x32), flip for Nintendo 3DS hardware, and preview live.",
    
    // Step indicators
    "step-1-title": "Load Skin",
    "step-1-desc": "Upload PNG or choose sample",
    "step-2-title": "3DS Settings",
    "step-2-desc": "Presets & conversion options",
    "step-3-title": "Preview & Download",
    "step-3-desc": "Verify avatar and save file",

    // Step 1
    "info-step-1": "Nintendo 3DS (OptiCraft Heritage) uses classic 64x32 skins and requires textures to be flipped vertically due to the console's GPU row order.",
    "dropzone-title": "Drag & drop your skin (.PNG) here, or click to browse",
    "dropzone-sub": "Supports both modern 64x64 (Minecraft 1.8+) and classic 64x32 skins",
    "btn-browse-file": "Browse Skin File",
    "btn-paste-clipboard": "Paste from Clipboard",
    "sample-skins-title": "Or test with a sample skin:",
    "sample-steve-modern": "Steve (64x64)",
    "sample-alex-modern": "Alex (64x64)",
    "sample-steve-classic": "Classic Steve (64x32)",
    "detected-64x64": "Format: 64x64 (Modern 1.8+ with 2nd layer)",
    "detected-64x32": "Format: 64x32 (Classic 1.2.5 format)",
    "detected-custom": "Format: Custom dimension",
    "btn-quick-convert": "⚡ 1-Click Convert for 3DS ➔",
    "btn-next-options": "Customize Options ➔",

    // Step 2
    "info-step-2": "Select a quick preset or adjust conversion flags. The recommended 3DS preset configures everything automatically.",
    "preset-rec-title": "⭐ Recommended for 3DS",
    "preset-rec-desc": "Converts 64x64 to 64x32, flips vertically for 3DS, fixes hat bug, and sets base opacity.",
    "preset-flip-title": "🔄 Flip Only (3DS)",
    "preset-flip-desc": "Keep resolution as-is and only flip vertically (if your skin is already 64x32).",
    "preset-retro-title": "📦 64x64 to 64x32 (Universal)",
    "preset-retro-desc": "Converts to classic 64x32 without flipping vertically (for PC or Java).",
    "preset-custom-title": "🛠️ Custom Settings",
    "preset-custom-desc": "Manually control every conversion switch below.",

    "settings-title": "Conversion Flags",
    "opt-convert-retro": "Convert 64x64 to 64x32 (Minecraft 1.2.5)",
    "opt-convert-retro-help": "Merges jacket, sleeves, and pants 2nd layers onto base limbs so no details are lost.",
    "opt-flip-vertical": "Flip Vertically (Upside-down for 3DS)",
    "opt-flip-vertical-help": "Required by Nintendo 3DS PICA200 GPU sampling order. Otherwise, your skin will look upside down in-game.",
    "opt-fix-transparency": "Fix Solid Hat Bug (Translucency sanitization)",
    "opt-fix-transparency-help": "Removes the classic black solid helmet box bug found in older skins.",
    "opt-force-opaque": "Force Base Opacity",
    "opt-force-opaque-help": "Ensures head base, torso, arms, and legs are completely opaque as required by MC 1.2.5.",

    "filename-label": "Saved File Name:",
    "filename-help": "Avoid spaces or special characters for optimal console compatibility.",
    "btn-back-step-1": "⬅ Back to Upload",
    "btn-goto-step-3": "Preview & Download ➔",

    // Step 3
    "avatar-preview-title": "Character 2D Preview (Right-side up)",
    "btn-toggle-hat": "Toggle Hat / Helmet",
    "btn-toggle-arms": "Arm Style: Steve (4px)",
    "btn-toggle-arms-alex": "Arm Style: Alex (3px)",
    "texture-card-title": "Texture Comparison",
    "texture-btn-view": "Toggle Normal / Flipped Texture",
    "texture-label-orig": "Original Skin Texture",
    "texture-label-3ds": "Final 3DS Texture (SD Ready)",
    "download-action-title": "Skin Converted & Ready for Nintendo 3DS!",
    "download-action-sub": "Ready to be copied to your Nintendo 3DS SD card.",
    "btn-download-skin": "📥 DOWNLOAD 3DS SKIN (.PNG)",
    "sd-guide-title": "How to Install on Nintendo 3DS",
    "sd-path-label": "SD Card Destination Folder:",
    "btn-copy-path": "Copy Path",
    "copied-toast": "Path copied to clipboard!",
    "sd-step-1": "Connect your 3DS SD card to your computer or phone (via card reader or FTPD).",
    "sd-step-2": "Copy the downloaded <strong>.png</strong> file directly into: <code>/opticraft/.minecraft/skins/</code> (or <code>/opticraft/skins/</code>).",
    "sd-step-3": "Open OptiCraft on your 3DS, head to <strong>Options > Skins</strong>, select your skin, and enjoy!",
    "qr-section-title": "Have a direct image link? Scan with 3DS Camera",
    "qr-section-desc": "OptiCraft 3DS features a built-in 'QR Download' option in the skins menu! If you host your skin online (e.g. Imgur, GitHub, Discord), enter the direct URL here to generate a scannable QR code:",
    "qr-input-placeholder": "https://example.com/skin.png",
    "btn-generate-qr": "Generate QR",
    "qr-tip": "Open OptiCraft on 3DS > Skins > QR Download and point your back camera at the screen.",
    "btn-convert-another": "🔄 Convert Another Skin"
  },
  es: {
    "back-portal": "VOLVER AL PORTAL",
    "goto-pak-tool": "HERRAMIENTA ASSETS.PAK",
    "goto-ochpack-tool": "CREADOR OCHPACK (PS2)",
    "tool-title": "CONVERTIDOR DE SKINS (3DS)",
    "tool-subtitle": "Convierte cualquier skin moderna (64x64) a formato retro (64x32), voltéala para el hardware de 3DS y previsualízala en tiempo real.",

    // Step indicators
    "step-1-title": "Cargar Skin",
    "step-1-desc": "Sube un archivo PNG o prueba un ejemplo",
    "step-2-title": "Ajustes 3DS",
    "step-2-desc": "Presets y opciones de conversión",
    "step-3-title": "Vista Previa y Descargar",
    "step-3-desc": "Verifica tu skin y descárgala",

    // Step 1
    "info-step-1": "Nintendo 3DS (OptiCraft Heritage) utiliza el formato clásico de 64x32 y requiere que la textura esté volteada verticalmente de cabeza debido al procesador gráfico PICA200 de la consola.",
    "dropzone-title": "Arrastra y suelta tu skin (.PNG) aquí o haz clic para buscar",
    "dropzone-sub": "Compatible con skins modernas 64x64 (Minecraft 1.8+) y clásicas 64x32",
    "btn-browse-file": "Seleccionar Archivo de Skin",
    "btn-paste-clipboard": "Pegar del Portapapeles",
    "sample-skins-title": "O prueba con una skin de ejemplo:",
    "sample-steve-modern": "Steve (64x64)",
    "sample-alex-modern": "Alex (64x64)",
    "sample-steve-classic": "Steve Clásico (64x32)",
    "detected-64x64": "Formato detectado: 64x64 (Moderno 1.8+ con segundas capas)",
    "detected-64x32": "Formato detectado: 64x32 (Clásico 1.2.5)",
    "detected-custom": "Formato detectado: Dimensión personalizada",
    "btn-quick-convert": "⚡ Conversión Rápida para 3DS ➔",
    "btn-next-options": "Personalizar Opciones ➔",

    // Step 2
    "info-step-2": "Elige un preset rápido o configura las opciones según tus necesidades. El preset recomendado para 3DS aplica la configuración ideal automáticamente.",
    "preset-rec-title": "⭐ Recomendado para 3DS",
    "preset-rec-desc": "Convierte 64x64 a 64x32, voltea de cabeza para 3DS, arregla el casco negro y asegura opacidad.",
    "preset-flip-title": "🔄 Solo Voltear (3DS)",
    "preset-flip-desc": "Mantiene el tamaño original y solo invierte el eje Y (si tu skin ya era 64x32).",
    "preset-retro-title": "📦 64x64 a 64x32 (Universal)",
    "preset-retro-desc": "Convierte a clásico 64x32 sin voltear verticalmente (para PC o Java).",
    "preset-custom-title": "🛠️ Personalizado",
    "preset-custom-desc": "Activa o desactiva manualmente cada opción a continuación.",

    "settings-title": "Opciones de Conversión",
    "opt-convert-retro": "Convertir 64x64 a 64x32 (Minecraft 1.2.5)",
    "opt-convert-retro-help": "Fusiona las capas exteriores de chaqueta, mangas y pantalones sobre el cuerpo para no perder detalles.",
    "opt-flip-vertical": "Voltear Verticalmente (De cabeza para 3DS)",
    "opt-flip-vertical-help": "Requerido por la GPU PICA200 de 3DS. Si no se voltea, la skin se verá boca abajo dentro del juego al cargarla de la SD.",
    "opt-fix-transparency": "Corregir Casco Negro (Fix Transparencia)",
    "opt-fix-transparency-help": "Elimina el clásico bug donde el casco o pelo aparece como un bloque negro opaco.",
    "opt-force-opaque": "Forzar Opacidad en el Cuerpo Base",
    "opt-force-opaque-help": "Garantiza que la cabeza, torso, brazos y piernas sean totalmente opacos como en MC 1.2.5.",

    "filename-label": "Nombre del Archivo:",
    "filename-help": "Evita espacios o símbolos especiales para mayor compatibilidad con la consola.",
    "btn-back-step-1": "⬅ Volver al Paso 1",
    "btn-goto-step-3": "Vista Previa y Descargar ➔",

    // Step 3
    "avatar-preview-title": "Vista Previa 2D del Personaje (Al derecho)",
    "btn-toggle-hat": "Mostrar/Ocultar Casco",
    "btn-toggle-arms": "Modelo de brazos: Steve (4px)",
    "btn-toggle-arms-alex": "Modelo de brazos: Alex (3px)",
    "texture-card-title": "Comparación de Texturas",
    "texture-btn-view": "Alternar Textura Normal / Volteada",
    "texture-label-orig": "Textura Original",
    "texture-label-3ds": "Textura Final para 3DS (Para SD)",
    "download-action-title": "¡Skin Convertida y Lista para Nintendo 3DS!",
    "download-action-sub": "Archivo listo para transferir a la tarjeta SD de tu Nintendo 3DS.",
    "btn-download-skin": "📥 DESCARGAR SKIN PARA 3DS (.PNG)",
    "sd-guide-title": "Guía de Instalación en Nintendo 3DS",
    "sd-path-label": "Carpeta de destino en tu SD:",
    "btn-copy-path": "Copiar Ruta",
    "copied-toast": "¡Ruta copiada al portapapeles!",
    "sd-step-1": "Conecta la tarjeta SD de tu Nintendo 3DS a tu PC o teléfono (mediante lector de memorias o FTPD).",
    "sd-step-2": "Copia el archivo <strong>.png</strong> descargado dentro de: <code>/opticraft/.minecraft/skins/</code> (o <code>/opticraft/skins/</code>).",
    "sd-step-3": "Inicia OptiCraft en tu 3DS, ve a <strong>Opciones > Skins</strong>, selecciona tu skin ¡y a jugar!",
    "qr-section-title": "¿Tienes un enlace directo a tu skin? Escanéala con la cámara de 3DS",
    "qr-section-desc": "OptiCraft 3DS incluye la opción 'Descarga QR' en el menú de skins. Si tienes tu skin subida a internet (Imgur, GitHub, Discord CDN), ingresa el enlace directo aquí para generar el código QR:",
    "qr-input-placeholder": "https://ejemplo.com/skin.png",
    "btn-generate-qr": "Generar Código QR",
    "qr-tip": "Entra a OptiCraft en 3DS > Skins > Descarga QR y apunta con la cámara trasera de tu consola a la pantalla.",
    "btn-convert-another": "🔄 Convertir Otra Skin"
  }
};

// Current application state
const state = {
  currentStep: 1,
  originalImage: null,
  originalFilename: "skin",
  originalWidth: 64,
  originalHeight: 64,
  
  // Options
  selectedPreset: "recommended",
  optConvertRetro: true,
  optFlipVertical: true,
  optFixTransparency: true,
  optForceOpaque: true,
  customFilename: "skin_3ds",

  // Preview state
  previewShowHat: true,
  previewAlexArms: false,
  previewTextureFlippedView: true,

  // Rendered result
  processedCanvas: null,
  processedBlob: null
};

// --- Language Management ---
function setLanguage(lang) {
  const t = translations[lang] || translations.en;
  document.documentElement.lang = lang;
  localStorage.setItem('heritage_lang', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const metaDesc = document.getElementById('meta-desc');
  if (metaDesc) metaDesc.content = t["tool-subtitle"];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      if (key === 'info-step-1' || key === 'info-step-2' || key === 'sd-step-2') {
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

  updateArmButtonLabel();
}

function t(key) {
  const currentLang = localStorage.getItem('heritage_lang') || 'en';
  const dict = translations[currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}

// --- Step Wizard Navigation ---
function goToStep(step) {
  state.currentStep = step;

  // Update indicators
  document.querySelectorAll('.step-indicator').forEach(ind => {
    const s = parseInt(ind.dataset.step, 10);
    ind.classList.remove('active', 'completed');
    if (s === step) {
      ind.classList.add('active');
    } else if (s < step) {
      ind.classList.add('completed');
    }
  });

  // Switch panes
  document.querySelectorAll('.wizard-pane').forEach(p => {
    p.classList.toggle('active', parseInt(p.dataset.pane, 10) === step);
  });

  if (step === 3) {
    processAndRenderSkin();
  }

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// --- Toast notifications ---
function showToast(msg) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// --- Skin Processing Engine (100% Client-Side Canvas) ---

/**
 * Checks and clears fully opaque hat layers (Minecraft Java parity).
 * Classic skins often have the hat layer (32,0 to 64,16) filled with solid black/color
 * instead of transparent. If no pixel has alpha < 128, wipes the hat layer to alpha 0.
 */
function fixSkinTransparency(ctx, w, h) {
  if (w !== 64 || (h !== 32 && h !== 64)) return;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let hasTransparentInHat = false;
  for (let y = 0; y < 16; ++y) {
    for (let x = 32; x < 64; ++x) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] < 128) {
        hasTransparentInHat = true;
        break;
      }
    }
    if (hasTransparentInHat) break;
  }

  if (!hasTransparentInHat) {
    for (let y = 0; y < 16; ++y) {
      for (let x = 32; x < 64; ++x) {
        const idx = (y * w + x) * 4;
        data[idx + 3] = 0; // Clear hat layer to fully transparent
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

/**
 * Inverts the image vertically on the Y-axis.
 * Required for Nintendo 3DS PICA200 texture upload row order convention.
 */
function flipCanvasVertically(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const temp = document.createElement('canvas');
  temp.width = w;
  temp.height = h;
  const tctx = temp.getContext('2d');
  tctx.drawImage(canvas, 0, 0);

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(0, h);
  ctx.scale(1, -1);
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
}

/**
 * Converts a 64x64 modern skin to 64x32 retro format for OptiCraft Heritage (MC 1.2.5).
 * Blends torso jacket overlay, right arm sleeve, and right leg pants onto base parts,
 * and forces base parts opaque while leaving hat layer transparent.
 */
function convertToRetro32(srcCanvas, options = {}) {
  const outCanvas = document.createElement('canvas');
  outCanvas.width = 64;
  outCanvas.height = 32;
  const outCtx = outCanvas.getContext('2d');
  outCtx.imageSmoothingEnabled = false;

  const srcW = srcCanvas.width;
  const srcH = srcCanvas.height;

  // 1. Draw upper 64x32 base
  outCtx.drawImage(srcCanvas, 0, 0, 64, 32, 0, 0, 64, 32);

  // If source has 64 rows, overlay modern second layers
  if (srcH === 64) {
    // Torso jacket overlay: (16, 32, 24, 16) -> (16, 16, 24, 16)
    outCtx.drawImage(srcCanvas, 16, 32, 24, 16, 16, 16, 24, 16);

    // Right arm sleeve overlay: (40, 32, 16, 16) -> (40, 16, 16, 16)
    outCtx.drawImage(srcCanvas, 40, 32, 16, 16, 40, 16, 16, 16);

    // Right leg pants overlay: (0, 32, 16, 16) -> (0, 16, 16, 16)
    outCtx.drawImage(srcCanvas, 0, 32, 16, 16, 0, 16, 16, 16);
  }

  // Sanitization
  if (options.fixHatTransparency) {
    fixSkinTransparency(outCtx, 64, 32);
  }

  // Force opacity on base areas (MC 1.2.5 spec)
  if (options.forceOpaque) {
    const imgData = outCtx.getImageData(0, 0, 64, 32);
    const data = imgData.data;

    // Head base (0, 0, 32, 16) -> opaque
    for (let y = 0; y < 16; ++y) {
      for (let x = 0; x < 32; ++x) {
        data[(y * 64 + x) * 4 + 3] = 255;
      }
    }

    // Torso, arms, legs (0, 16, 64, 16) -> opaque
    for (let y = 16; y < 32; ++y) {
      for (let x = 0; x < 64; ++x) {
        data[(y * 64 + x) * 4 + 3] = 255;
      }
    }

    // Note: Hat layer (32, 0, 32, 16) is NOT forced opaque
    outCtx.putImageData(imgData, 0, 0);
  }

  return outCanvas;
}

/**
 * Builds a 16x32 2D front avatar character preview from the skin canvas.
 */
function renderFrontAvatar(skinCanvas, isSource64x64, options = {}) {
  const avatarCanvas = document.createElement('canvas');
  avatarCanvas.width = 16;
  avatarCanvas.height = 32;
  const ctx = avatarCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const showHat = options.showHat !== false;
  const isAlex = options.isAlex === true;
  const armW = isAlex ? 3 : 4;
  const rightArmX = isAlex ? 1 : 0;
  const leftArmX = 12;

  // 1. Head Front (8x8 at 8,8 -> 4,0)
  ctx.drawImage(skinCanvas, 8, 8, 8, 8, 4, 0, 8, 8);

  // 2. Hat / Helmet Front Overlay (8x8 at 40,8 -> 4,0)
  if (showHat) {
    ctx.drawImage(skinCanvas, 40, 8, 8, 8, 4, 0, 8, 8);
  }

  // 3. Torso Front (8x12 at 20,20 -> 4,8)
  ctx.drawImage(skinCanvas, 20, 20, 8, 12, 4, 8, 8, 12);
  if (isSource64x64 && skinCanvas.height >= 64) {
    // Torso jacket overlay (8x12 at 20,36 -> 4,8)
    ctx.drawImage(skinCanvas, 20, 36, 8, 12, 4, 8, 8, 12);
  }

  // 4. Right Arm Front (4x12 at 44,20 -> rightArmX, 8)
  ctx.drawImage(skinCanvas, 44, 20, armW, 12, rightArmX, 8, armW, 12);
  if (isSource64x64 && skinCanvas.height >= 64) {
    // Right arm sleeve overlay (4x12 at 44,36 -> rightArmX, 8)
    ctx.drawImage(skinCanvas, 44, 36, armW, 12, rightArmX, 8, armW, 12);
  }

  // 5. Left Arm Front
  if (isSource64x64 && skinCanvas.height >= 64) {
    ctx.drawImage(skinCanvas, 36, 52, armW, 12, leftArmX, 8, armW, 12);
    // Left arm sleeve overlay (4x12 at 52,52 -> leftArmX, 8)
    ctx.drawImage(skinCanvas, 52, 52, armW, 12, leftArmX, 8, armW, 12);
  } else {
    // In 64x32 classic, left arm is horizontally mirrored right arm
    ctx.save();
    ctx.translate(leftArmX + armW, 8);
    ctx.scale(-1, 1);
    ctx.drawImage(skinCanvas, 44, 20, armW, 12, 0, 0, armW, 12);
    ctx.restore();
  }

  // 6. Right Leg Front (4x12 at 4,20 -> 4,20)
  ctx.drawImage(skinCanvas, 4, 20, 4, 12, 4, 20, 4, 12);
  if (isSource64x64 && skinCanvas.height >= 64) {
    // Right leg pants overlay (4x12 at 4,36 -> 4,20)
    ctx.drawImage(skinCanvas, 4, 36, 4, 12, 4, 20, 4, 12);
  }

  // 7. Left Leg Front
  if (isSource64x64 && skinCanvas.height >= 64) {
    ctx.drawImage(skinCanvas, 20, 52, 4, 12, 8, 20, 4, 12);
    // Left leg pants overlay (4x12 at 4,52 -> 8,20)
    ctx.drawImage(skinCanvas, 4, 52, 4, 12, 8, 20, 4, 12);
  } else {
    // In 64x32 classic, left leg is mirrored right leg
    ctx.save();
    ctx.translate(8 + 4, 20);
    ctx.scale(-1, 1);
    ctx.drawImage(skinCanvas, 4, 20, 4, 12, 0, 0, 4, 12);
    ctx.restore();
  }

  return avatarCanvas;
}

// --- Main Processing & Step 3 Display ---
function processAndRenderSkin() {
  if (!state.originalImage) return;

  // Create clean work canvas from original image
  const origCanvas = document.createElement('canvas');
  origCanvas.width = state.originalWidth;
  origCanvas.height = state.originalHeight;
  const origCtx = origCanvas.getContext('2d');
  origCtx.imageSmoothingEnabled = false;
  origCtx.drawImage(state.originalImage, 0, 0);

  // Render 2D avatar preview using right-side up skin
  const avatarSmall = renderFrontAvatar(origCanvas, state.originalHeight === 64, {
    showHat: state.previewShowHat,
    isAlex: state.previewAlexArms
  });

  const displayAvatarCanvas = document.getElementById('avatarCanvas');
  if (displayAvatarCanvas) {
    displayAvatarCanvas.width = 128;
    displayAvatarCanvas.height = 256;
    const dctx = displayAvatarCanvas.getContext('2d');
    dctx.imageSmoothingEnabled = false;
    dctx.clearRect(0, 0, 128, 256);
    dctx.drawImage(avatarSmall, 0, 0, 16, 32, 0, 0, 128, 256);
  }

  // Process final 3DS texture
  let finalCanvas;
  if (state.optConvertRetro) {
    finalCanvas = convertToRetro32(origCanvas, {
      fixHatTransparency: state.optFixTransparency,
      forceOpaque: state.optForceOpaque
    });
  } else {
    finalCanvas = document.createElement('canvas');
    finalCanvas.width = state.originalWidth;
    finalCanvas.height = state.originalHeight;
    const fctx = finalCanvas.getContext('2d');
    fctx.imageSmoothingEnabled = false;
    fctx.drawImage(origCanvas, 0, 0);

    if (state.optFixTransparency) {
      fixSkinTransparency(fctx, finalCanvas.width, finalCanvas.height);
    }
  }

  // Save upright copy for comparison display toggle
  const uprightFinalCanvas = document.createElement('canvas');
  uprightFinalCanvas.width = finalCanvas.width;
  uprightFinalCanvas.height = finalCanvas.height;
  uprightFinalCanvas.getContext('2d').drawImage(finalCanvas, 0, 0);

  // Apply vertical flip if enabled
  if (state.optFlipVertical) {
    flipCanvasVertically(finalCanvas);
  }

  state.processedCanvas = finalCanvas;

  // Render original texture sheet
  const originalTextureCanvas = document.getElementById('originalTextureCanvas');
  if (originalTextureCanvas) {
    originalTextureCanvas.width = state.originalWidth;
    originalTextureCanvas.height = state.originalHeight;
    const otCtx = originalTextureCanvas.getContext('2d');
    otCtx.imageSmoothingEnabled = false;
    otCtx.clearRect(0, 0, state.originalWidth, state.originalHeight);
    otCtx.drawImage(origCanvas, 0, 0);
  }

  // Render converted texture sheet
  renderFinalTextureSheet(uprightFinalCanvas);

  // Update download button & metadata
  updateDownloadButton();
}

function renderFinalTextureSheet(uprightCanvas) {
  const convertedTextureCanvas = document.getElementById('convertedTextureCanvas');
  if (!convertedTextureCanvas || !state.processedCanvas) return;

  const target = state.previewTextureFlippedView ? state.processedCanvas : uprightCanvas;
  convertedTextureCanvas.width = target.width;
  convertedTextureCanvas.height = target.height;
  const ctCtx = convertedTextureCanvas.getContext('2d');
  ctCtx.imageSmoothingEnabled = false;
  ctCtx.clearRect(0, 0, target.width, target.height);
  ctCtx.drawImage(target, 0, 0);

  const specsPill = document.getElementById('convertedSpecsPill');
  if (specsPill) {
    specsPill.textContent = `${target.width} x ${target.height} px ${state.optFlipVertical ? (state.previewTextureFlippedView ? '(Volteada / Flipped)' : '(Al derecho / Normal)') : ''}`;
  }
}

function updateDownloadButton() {
  if (!state.processedCanvas) return;

  state.processedCanvas.toBlob(blob => {
    state.processedBlob = blob;
    const btnDownload = document.getElementById('btnDownloadSkin');
    if (btnDownload) {
      const cleanName = getOutputFilename();
      btnDownload.setAttribute('download', cleanName);
    }
  }, 'image/png');
}

function getOutputFilename() {
  let name = (state.customFilename || state.originalFilename || 'skin_3ds').trim();
  name = name.replace(/\.png$/i, '').replace(/[^a-zA-Z0-9_\-]/g, '_');
  if (!name) name = 'skin_3ds';
  return name + '.png';
}

function downloadConvertedSkin() {
  if (!state.processedBlob) {
    if (state.processedCanvas) {
      state.processedCanvas.toBlob(blob => {
        state.processedBlob = blob;
        downloadBlob(blob, getOutputFilename());
      }, 'image/png');
    }
    return;
  }
  downloadBlob(state.processedBlob, getOutputFilename());
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

// --- Preset Configuration Handlers ---
function setPreset(presetKey) {
  state.selectedPreset = presetKey;
  document.querySelectorAll('.preset-card').forEach(c => {
    c.classList.toggle('active', c.dataset.preset === presetKey);
  });

  const chkRetro = document.getElementById('optConvertRetro');
  const chkFlip = document.getElementById('optFlipVertical');
  const chkHat = document.getElementById('optFixTransparency');
  const chkOpaque = document.getElementById('optForceOpaque');

  if (presetKey === 'recommended') {
    state.optConvertRetro = true;
    state.optFlipVertical = true;
    state.optFixTransparency = true;
    state.optForceOpaque = true;
  } else if (presetKey === 'flip-only') {
    state.optConvertRetro = false;
    state.optFlipVertical = true;
    state.optFixTransparency = false;
    state.optForceOpaque = false;
  } else if (presetKey === 'retro-only') {
    state.optConvertRetro = true;
    state.optFlipVertical = false;
    state.optFixTransparency = true;
    state.optForceOpaque = true;
  }

  if (chkRetro) chkRetro.checked = state.optConvertRetro;
  if (chkFlip) chkFlip.checked = state.optFlipVertical;
  if (chkHat) chkHat.checked = state.optFixTransparency;
  if (chkOpaque) chkOpaque.checked = state.optForceOpaque;
}

function onManualOptionChange() {
  const chkRetro = document.getElementById('optConvertRetro');
  const chkFlip = document.getElementById('optFlipVertical');
  const chkHat = document.getElementById('optFixTransparency');
  const chkOpaque = document.getElementById('optForceOpaque');

  state.optConvertRetro = chkRetro ? chkRetro.checked : true;
  state.optFlipVertical = chkFlip ? chkFlip.checked : true;
  state.optFixTransparency = chkHat ? chkHat.checked : true;
  state.optForceOpaque = chkOpaque ? chkOpaque.checked : true;

  // Check if matches recommended
  if (state.optConvertRetro && state.optFlipVertical && state.optFixTransparency && state.optForceOpaque) {
    setPreset('recommended');
  } else if (!state.optConvertRetro && state.optFlipVertical && !state.optFixTransparency && !state.optForceOpaque) {
    setPreset('flip-only');
  } else if (state.optConvertRetro && !state.optFlipVertical && state.optFixTransparency && state.optForceOpaque) {
    setPreset('retro-only');
  } else {
    state.selectedPreset = 'custom';
    document.querySelectorAll('.preset-card').forEach(c => {
      c.classList.toggle('active', c.dataset.preset === 'custom');
    });
  }
}

// --- Image Loading and Validation ---
function loadSkinFromImage(img, filename) {
  state.originalImage = img;
  state.originalWidth = img.naturalWidth || img.width;
  state.originalHeight = img.naturalHeight || img.height;
  state.originalFilename = (filename || 'skin').replace(/\.[^/.]+$/, "");
  state.customFilename = state.originalFilename + '_3ds';

  // Update Step 1 Loaded Card UI
  const loadedCard = document.getElementById('loadedSkinCard');
  const thumbCanvas = document.getElementById('skinThumbnailCanvas');
  const metaName = document.getElementById('skinMetaName');
  const metaSpecs = document.getElementById('skinMetaSpecs');
  const metaBadge = document.getElementById('skinMetaBadge');
  const filenameInput = document.getElementById('customFilenameInput');

  if (thumbCanvas) {
    thumbCanvas.width = 64;
    thumbCanvas.height = 64;
    const tctx = thumbCanvas.getContext('2d');
    tctx.imageSmoothingEnabled = false;
    tctx.clearRect(0, 0, 64, 64);
    tctx.drawImage(img, 0, 0, 64, 64);
  }

  if (metaName) metaName.textContent = filename || 'skin.png';
  if (filenameInput) filenameInput.value = state.customFilename;

  const is64x64 = (state.originalWidth === 64 && state.originalHeight === 64);
  const is64x32 = (state.originalWidth === 64 && state.originalHeight === 32);

  if (metaSpecs) {
    metaSpecs.textContent = `${state.originalWidth} x ${state.originalHeight} px`;
  }

  if (metaBadge) {
    if (is64x64) {
      metaBadge.textContent = t('detected-64x64');
      metaBadge.className = 'badge-tag';
      setPreset('recommended');
    } else if (is64x32) {
      metaBadge.textContent = t('detected-64x32');
      metaBadge.className = 'badge-tag badge-retro';
      setPreset('recommended');
    } else {
      metaBadge.textContent = `${t('detected-custom')} (${state.originalWidth}x${state.originalHeight})`;
      metaBadge.className = 'badge-tag';
      setPreset('recommended');
    }
  }

  if (loadedCard) {
    loadedCard.classList.add('visible');
  }
}

function handleFileInput(file) {
  if (!file || !file.type.match('image.*')) {
    alert("Please select a valid PNG image file / Por favor selecciona una imagen PNG válida.");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => loadSkinFromImage(img, file.name);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// --- Sample Skins (Base64) ---
// High quality procedural / minimal fallback skins to test immediately
function generateSampleSkin(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = (type === 'classic') ? 32 : 64;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Colors
  const skinTone = "#d3a17e";
  const hairDark = "#4a3222";
  const shirtCyan = "#00a8a8";
  const pantsBlue = "#2b3b8c";
  const shoesGray = "#424242";
  const alexOrange = "#c4672d";
  const alexGreen = "#4e6a39";
  const alexBrown = "#573d26";

  if (type === 'classic' || type === 'steve') {
    // Steve
    // Head base (0,0 to 32,16)
    ctx.fillStyle = skinTone;
    ctx.fillRect(0, 0, 32, 16);
    ctx.fillStyle = hairDark;
    ctx.fillRect(8, 0, 8, 8); // Top hair
    ctx.fillRect(0, 8, 32, 2); // Hair fringe
    // Eyes
    ctx.fillStyle = "#fff";
    ctx.fillRect(10, 12, 1, 1); ctx.fillRect(13, 12, 1, 1);
    ctx.fillStyle = "#4a4a9c";
    ctx.fillRect(11, 12, 1, 1); ctx.fillRect(14, 12, 1, 1);
    // Mouth/Beard
    ctx.fillStyle = hairDark;
    ctx.fillRect(11, 13, 2, 1);

    // Torso (16,16 to 40,32)
    ctx.fillStyle = shirtCyan;
    ctx.fillRect(16, 16, 24, 16);

    // Arms
    ctx.fillStyle = skinTone;
    ctx.fillRect(40, 16, 16, 16);
    ctx.fillStyle = shirtCyan;
    ctx.fillRect(40, 16, 16, 4); // Shirt sleeve

    // Legs
    ctx.fillStyle = pantsBlue;
    ctx.fillRect(0, 16, 16, 16);
    ctx.fillStyle = shoesGray;
    ctx.fillRect(0, 28, 16, 4); // Shoes

    // If 64x64 Steve, add overlays
    if (type === 'steve') {
      // Left arm (32,48 to 48,64)
      ctx.fillStyle = skinTone;
      ctx.fillRect(32, 48, 16, 16);
      ctx.fillStyle = shirtCyan;
      ctx.fillRect(32, 48, 16, 4);

      // Left leg (16,48 to 32,64)
      ctx.fillStyle = pantsBlue;
      ctx.fillRect(16, 48, 16, 16);
      ctx.fillStyle = shoesGray;
      ctx.fillRect(16, 60, 16, 4);
    }
  } else if (type === 'alex') {
    // Alex
    ctx.fillStyle = skinTone;
    ctx.fillRect(0, 0, 32, 16);
    ctx.fillStyle = alexOrange;
    ctx.fillRect(8, 0, 8, 8);
    ctx.fillRect(0, 8, 32, 3);
    // Eyes
    ctx.fillStyle = "#fff";
    ctx.fillRect(10, 12, 1, 1); ctx.fillRect(13, 12, 1, 1);
    ctx.fillStyle = "#2e7d32";
    ctx.fillRect(11, 12, 1, 1); ctx.fillRect(14, 12, 1, 1);

    // Torso
    ctx.fillStyle = alexGreen;
    ctx.fillRect(16, 16, 24, 16);

    // Arms
    ctx.fillStyle = skinTone;
    ctx.fillRect(40, 16, 16, 16);
    ctx.fillStyle = alexGreen;
    ctx.fillRect(40, 16, 16, 4);

    // Legs
    ctx.fillStyle = alexBrown;
    ctx.fillRect(0, 16, 16, 16);
    ctx.fillStyle = shoesGray;
    ctx.fillRect(0, 28, 16, 4);

    // Left limbs in lower half
    ctx.fillStyle = skinTone;
    ctx.fillRect(32, 48, 16, 16);
    ctx.fillStyle = alexGreen;
    ctx.fillRect(32, 48, 16, 4);

    ctx.fillStyle = alexBrown;
    ctx.fillRect(16, 48, 16, 16);
    ctx.fillStyle = shoesGray;
    ctx.fillRect(16, 60, 16, 4);
  }

  const img = new Image();
  img.onload = () => {
    loadSkinFromImage(img, `sample_${type}.png`);
  };
  img.src = canvas.toDataURL('image/png');
}

// --- Arm button text update ---
function updateArmButtonLabel() {
  const btn = document.getElementById('btnToggleArms');
  if (!btn) return;
  btn.textContent = state.previewAlexArms ? t('btn-toggle-arms-alex') : t('btn-toggle-arms');
}

// --- QR Code Generator for 3DS Camera ---
function generateSkinQR() {
  const input = document.getElementById('qrUrlInput');
  const displayBox = document.getElementById('qrDisplayBox');
  const qrContainer = document.getElementById('qrcodeContainer');
  if (!input || !qrContainer) return;

  const url = input.value.trim();
  if (!url) {
    alert("Please enter a URL / Por favor ingresa una URL válida.");
    return;
  }

  qrContainer.innerHTML = '';
  try {
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: url,
        width: 180,
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
      displayBox.classList.add('visible');
    } else {
      alert("QR library not loaded yet.");
    }
  } catch (err) {
    console.error("QR Error:", err);
    alert("Could not generate QR: " + err.message);
  }
}

// --- Setup Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  // Initial Language setup
  const initialLang = localStorage.getItem('heritage_lang') || 'en';
  setLanguage(initialLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Step Indicators Click
  document.querySelectorAll('.step-indicator').forEach(ind => {
    ind.addEventListener('click', () => {
      const step = parseInt(ind.dataset.step, 10);
      if (step <= state.currentStep || (state.originalImage && step <= 3)) {
        goToStep(step);
      }
    });
  });

  // Step 1: Dropzone & File Input
  const dropzone = document.getElementById('dropzoneBox');
  const fileInput = document.getElementById('skinFileInput');
  const btnBrowse = document.getElementById('btnBrowseFile');
  const btnPaste = document.getElementById('btnPasteClipboard');

  if (btnBrowse && fileInput) {
    btnBrowse.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', e => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileInput(e.dataTransfer.files[0]);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', e => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileInput(e.target.files[0]);
      }
    });
  }

  // Clipboard Paste Support
  if (btnPaste) {
    btnPaste.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              handleFileInput(blob);
              showToast("Skin loaded from clipboard!");
              return;
            }
          }
        }
        alert("No image found in clipboard. Press Ctrl+V directly or copy an image first.");
      } catch (err) {
        alert("Clipboard access not allowed or empty. You can press Ctrl+V directly on the page.");
      }
    });
  }

  window.addEventListener('paste', e => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        handleFileInput(blob);
        showToast("Skin loaded from clipboard!");
        break;
      }
    }
  });

  // Sample Skins Chips
  document.getElementById('sampleSteveModern')?.addEventListener('click', () => generateSampleSkin('steve'));
  document.getElementById('sampleAlexModern')?.addEventListener('click', () => {
    state.previewAlexArms = true;
    updateArmButtonLabel();
    generateSampleSkin('alex');
  });
  document.getElementById('sampleSteveClassic')?.addEventListener('click', () => generateSampleSkin('classic'));

  // Step 1 Navigation Buttons
  document.getElementById('btnQuickConvert')?.addEventListener('click', () => {
    if (!state.originalImage) return;
    setPreset('recommended');
    goToStep(3);
  });

  document.getElementById('btnNextOptions')?.addEventListener('click', () => {
    if (!state.originalImage) return;
    goToStep(2);
  });

  // Step 2 Presets
  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      setPreset(card.dataset.preset);
    });
  });

  // Step 2 Checkboxes
  ['optConvertRetro', 'optFlipVertical', 'optFixTransparency', 'optForceOpaque'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', onManualOptionChange);
  });

  // Step 2 Filename input
  const filenameInput = document.getElementById('customFilenameInput');
  if (filenameInput) {
    filenameInput.addEventListener('input', e => {
      state.customFilename = e.target.value;
    });
  }

  // Step 2 Navigation Buttons
  document.getElementById('btnBackStep1')?.addEventListener('click', () => goToStep(1));
  document.getElementById('btnGotoStep3')?.addEventListener('click', () => goToStep(3));

  // Step 3 Controls
  document.getElementById('btnToggleHat')?.addEventListener('click', () => {
    state.previewShowHat = !state.previewShowHat;
    processAndRenderSkin();
  });

  document.getElementById('btnToggleArms')?.addEventListener('click', () => {
    state.previewAlexArms = !state.previewAlexArms;
    updateArmButtonLabel();
    processAndRenderSkin();
  });

  document.getElementById('btnToggleTextureView')?.addEventListener('click', () => {
    state.previewTextureFlippedView = !state.previewTextureFlippedView;
    processAndRenderSkin();
  });

  document.getElementById('btnDownloadSkin')?.addEventListener('click', downloadConvertedSkin);

  document.getElementById('btnConvertAnother')?.addEventListener('click', () => {
    goToStep(1);
  });

  document.getElementById('btnBackToStep2')?.addEventListener('click', () => {
    goToStep(2);
  });

  // Copy SD path button
  document.getElementById('btnCopySdPath')?.addEventListener('click', () => {
    const path = "/opticraft/.minecraft/skins/";
    navigator.clipboard.writeText(path).then(() => {
      showToast(t('copied-toast'));
    }).catch(() => {
      showToast(path);
    });
  });

  // QR Generator
  document.getElementById('btnGenerateQR')?.addEventListener('click', generateSkinQR);
  document.getElementById('qrUrlInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') generateSkinQR();
  });
});

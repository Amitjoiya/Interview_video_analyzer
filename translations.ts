// =====================================================
// APEX-7 MULTI-LANGUAGE TRANSLATION SYSTEM
// Complete UI translations for global accessibility
// =====================================================

export type UILanguage = 
  | 'en' | 'hi' | 'es' | 'fr' | 'de' | 'zh' | 'ja' 
  | 'ar' | 'pt' | 'ru' | 'ko' | 'it' | 'nl' | 'tr' | 'bn';

export interface LanguageOption {
  code: UILanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const UI_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', direction: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', direction: 'ltr' },
];

// Translation keys structure
export interface Translations {
  // Header
  header: {
    title: string;
    tagline: string;
    neuralCore: string;
  };
  
  // Intro Screen
  intro: {
    systemTitle: string;
    tagline: string;
    neuralOnline: string;
    facsAnalysis: string;
    vocalForensics: string;
    deceptionAI: string;
    hirePrediction: string;
    initializing: string;
  };
  
  // Main Screen
  main: {
    masterTitle: string;
    masterSubtitle: string;
    uploadDescription: string;
    facsLabel: string;
    neuralLabel: string;
    vocalLabel: string;
    authenticityLabel: string;
  };
  
  // Upload Section
  upload: {
    dragDrop: string;
    orBrowse: string;
    selectVideo: string;
    supportedFormats: string;
    maxSize: string;
    uploadingText: string;
  };
  
  // Mode Selection
  modeSelect: {
    configureTitle: string;
    configureSubtitle: string;
    selectMode: string;
    selectLanguage: string;
    fileSelected: string;
    startAnalysis: string;
    forceRefresh: string;
    consistentScoring: string;
    freshAnalysis: string;
    chooseDifferent: string;
  };
  
  // Interview Modes
  modes: {
    general: { name: string; description: string };
    tech: { name: string; description: string };
    consulting: { name: string; description: string };
    medical: { name: string; description: string };
    sales: { name: string; description: string };
    legal: { name: string; description: string };
    finance: { name: string; description: string };
    creative: { name: string; description: string };
  };
  
  // Analysis Progress
  analyzing: {
    title: string;
    extractingFrames: string;
    facsAnalysis: string;
    microExpressions: string;
    vocalBiometrics: string;
    bodyLanguage: string;
    psychProfile: string;
    deceptionAnalysis: string;
    hireProbability: string;
    complete: string;
    processingModule: string;
  };
  
  // Results
  results: {
    reanalyze: string;
    analyzeAnother: string;
    consistentEnabled: string;
    overallScore: string;
    hireability: string;
    keyStrengths: string;
    improvements: string;
    detailedAnalysis: string;
    languageDetected: string;
  };
  
  // Error
  error: {
    title: string;
    tryAgain: string;
    goBack: string;
  };
  
  // Common
  common: {
    loading: string;
    analyzing: string;
    success: string;
    error: string;
    close: string;
    save: string;
    cancel: string;
  };
}

// =====================================================
// ENGLISH TRANSLATIONS (Default)
// =====================================================
const en: Translations = {
  header: {
    title: 'APEX-7',
    tagline: 'Interview Analysis System',
    neuralCore: 'Neural Core Online',
  },
  intro: {
    systemTitle: 'APEX-7',
    tagline: 'INTERVIEW ANALYSIS SYSTEM',
    neuralOnline: 'NEURAL CORE ONLINE',
    facsAnalysis: 'FACS Analysis',
    vocalForensics: 'Vocal Forensics',
    deceptionAI: 'Deception AI',
    hirePrediction: 'Hire Prediction',
    initializing: 'INITIALIZING',
  },
  main: {
    masterTitle: 'Master Your Interview',
    masterSubtitle: 'With Predictive AI',
    uploadDescription: 'Upload your practice video for comprehensive psychological analysis, micro-expression detection, and executive-level feedback.',
    facsLabel: 'FACS Analysis',
    neuralLabel: 'Neural Processing',
    vocalLabel: 'Vocal Forensics',
    authenticityLabel: 'Authenticity AI',
  },
  upload: {
    dragDrop: 'Drag and drop your video here',
    orBrowse: 'or browse files',
    selectVideo: 'Select Video',
    supportedFormats: 'Supported formats: MP4, WebM, MOV',
    maxSize: 'Maximum file size: 200MB',
    uploadingText: 'Processing video...',
  },
  modeSelect: {
    configureTitle: 'Customize Your',
    configureSubtitle: 'Interview Analysis',
    selectMode: 'Select Interview Mode',
    selectLanguage: 'Analysis Language (Auto-detected from video)',
    fileSelected: 'File',
    startAnalysis: 'Start APEX-7 Analysis',
    forceRefresh: 'Force new analysis (bypass cache)',
    consistentScoring: 'Consistent scoring enabled - same video = same results',
    freshAnalysis: 'Will generate fresh analysis (may show slight variations)',
    chooseDifferent: 'Choose Different File',
  },
  modes: {
    general: { name: 'General', description: 'Universal interview skills' },
    tech: { name: 'Tech/FAANG', description: 'Software & Engineering roles' },
    consulting: { name: 'Consulting/MBA', description: 'Strategy & Management' },
    medical: { name: 'Medical', description: 'Healthcare & Clinical' },
    sales: { name: 'Sales/BD', description: 'Business Development' },
    legal: { name: 'Legal/Law', description: 'Law & Compliance' },
    finance: { name: 'Finance/IB', description: 'Investment & Banking' },
    creative: { name: 'Creative/Design', description: 'Design & Arts' },
  },
  analyzing: {
    title: 'Analyzing Interview',
    extractingFrames: 'Extracting video frames...',
    facsAnalysis: 'Running FACS analysis...',
    microExpressions: 'Detecting micro-expressions...',
    vocalBiometrics: 'Processing vocal biometrics...',
    bodyLanguage: 'Analyzing body language...',
    psychProfile: 'Computing psychological profile...',
    deceptionAnalysis: 'Running deception analysis...',
    hireProbability: 'Calculating hire probability...',
    complete: 'Analysis complete!',
    processingModule: 'Processing neural module',
  },
  results: {
    reanalyze: 'Re-analyze Video',
    analyzeAnother: 'Analyze Another Video',
    consistentEnabled: 'Deterministic Analysis • Consistent Scoring Enabled',
    overallScore: 'Overall Score',
    hireability: 'Hireability',
    keyStrengths: 'Key Strengths',
    improvements: 'Areas for Improvement',
    detailedAnalysis: 'Detailed Analysis',
    languageDetected: 'Language Detected',
  },
  error: {
    title: 'Analysis Failed',
    tryAgain: 'Try Again',
    goBack: 'Go Back',
  },
  common: {
    loading: 'Loading...',
    analyzing: 'Analyzing...',
    success: 'Success',
    error: 'Error',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
  },
};

// =====================================================
// HINDI TRANSLATIONS
// =====================================================
const hi: Translations = {
  header: {
    title: 'APEX-7',
    tagline: 'इंटरव्यू विश्लेषण सिस्टम',
    neuralCore: 'न्यूरल कोर ऑनलाइन',
  },
  intro: {
    systemTitle: 'APEX-7',
    tagline: 'इंटरव्यू विश्लेषण सिस्टम',
    neuralOnline: 'न्यूरल कोर ऑनलाइन',
    facsAnalysis: 'FACS विश्लेषण',
    vocalForensics: 'वोकल फोरेंसिक्स',
    deceptionAI: 'धोखा पहचान AI',
    hirePrediction: 'नौकरी भविष्यवाणी',
    initializing: 'शुरू हो रहा है',
  },
  main: {
    masterTitle: 'अपना इंटरव्यू',
    masterSubtitle: 'AI के साथ मास्टर करें',
    uploadDescription: 'व्यापक मनोवैज्ञानिक विश्लेषण, माइक्रो-एक्सप्रेशन डिटेक्शन और एक्जीक्यूटिव-लेवल फीडबैक के लिए अपना प्रैक्टिस वीडियो अपलोड करें।',
    facsLabel: 'FACS विश्लेषण',
    neuralLabel: 'न्यूरल प्रोसेसिंग',
    vocalLabel: 'वोकल फोरेंसिक्स',
    authenticityLabel: 'प्रामाणिकता AI',
  },
  upload: {
    dragDrop: 'अपना वीडियो यहां ड्रैग और ड्रॉप करें',
    orBrowse: 'या फाइल्स ब्राउज़ करें',
    selectVideo: 'वीडियो चुनें',
    supportedFormats: 'समर्थित फॉर्मेट: MP4, WebM, MOV',
    maxSize: 'अधिकतम फाइल साइज: 200MB',
    uploadingText: 'वीडियो प्रोसेस हो रहा है...',
  },
  modeSelect: {
    configureTitle: 'अपना कस्टमाइज करें',
    configureSubtitle: 'इंटरव्यू विश्लेषण',
    selectMode: 'इंटरव्यू मोड चुनें',
    selectLanguage: 'विश्लेषण भाषा (वीडियो से ऑटो-डिटेक्ट)',
    fileSelected: 'फाइल',
    startAnalysis: 'APEX-7 विश्लेषण शुरू करें',
    forceRefresh: 'नया विश्लेषण करें (कैश बायपास)',
    consistentScoring: 'एक जैसा स्कोरिंग - एक ही वीडियो = एक ही रिजल्ट',
    freshAnalysis: 'नया विश्लेषण होगा (थोड़ा अंतर हो सकता है)',
    chooseDifferent: 'दूसरी फाइल चुनें',
  },
  modes: {
    general: { name: 'सामान्य', description: 'सार्वभौमिक इंटरव्यू स्किल्स' },
    tech: { name: 'टेक/FAANG', description: 'सॉफ्टवेयर और इंजीनियरिंग' },
    consulting: { name: 'कंसल्टिंग/MBA', description: 'रणनीति और प्रबंधन' },
    medical: { name: 'मेडिकल', description: 'हेल्थकेयर और क्लीनिकल' },
    sales: { name: 'सेल्स/BD', description: 'बिजनेस डेवलपमेंट' },
    legal: { name: 'कानूनी', description: 'कानून और अनुपालन' },
    finance: { name: 'फाइनेंस/IB', description: 'इन्वेस्टमेंट बैंकिंग' },
    creative: { name: 'क्रिएटिव/डिजाइन', description: 'डिजाइन और कला' },
  },
  analyzing: {
    title: 'इंटरव्यू का विश्लेषण',
    extractingFrames: 'वीडियो फ्रेम्स निकाले जा रहे हैं...',
    facsAnalysis: 'FACS विश्लेषण चल रहा है...',
    microExpressions: 'माइक्रो-एक्सप्रेशन पहचाने जा रहे हैं...',
    vocalBiometrics: 'वोकल बायोमेट्रिक्स प्रोसेस हो रहा है...',
    bodyLanguage: 'बॉडी लैंग्वेज का विश्लेषण...',
    psychProfile: 'मनोवैज्ञानिक प्रोफाइल बन रही है...',
    deceptionAnalysis: 'धोखा विश्लेषण चल रहा है...',
    hireProbability: 'नौकरी संभावना गणना...',
    complete: 'विश्लेषण पूरा!',
    processingModule: 'न्यूरल मॉड्यूल प्रोसेसिंग',
  },
  results: {
    reanalyze: 'फिर से विश्लेषण करें',
    analyzeAnother: 'दूसरा वीडियो विश्लेषण करें',
    consistentEnabled: 'डिटर्मिनिस्टिक विश्लेषण • एक जैसा स्कोरिंग सक्षम',
    overallScore: 'कुल स्कोर',
    hireability: 'नौकरी योग्यता',
    keyStrengths: 'मुख्य शक्तियां',
    improvements: 'सुधार के क्षेत्र',
    detailedAnalysis: 'विस्तृत विश्लेषण',
    languageDetected: 'पहचानी गई भाषा',
  },
  error: {
    title: 'विश्लेषण विफल',
    tryAgain: 'फिर से कोशिश करें',
    goBack: 'वापस जाएं',
  },
  common: {
    loading: 'लोड हो रहा है...',
    analyzing: 'विश्लेषण हो रहा है...',
    success: 'सफल',
    error: 'त्रुटि',
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
  },
};

// =====================================================
// SPANISH TRANSLATIONS
// =====================================================
const es: Translations = {
  header: {
    title: 'APEX-7',
    tagline: 'Sistema de Análisis de Entrevistas',
    neuralCore: 'Núcleo Neural Activo',
  },
  intro: {
    systemTitle: 'APEX-7',
    tagline: 'SISTEMA DE ANÁLISIS DE ENTREVISTAS',
    neuralOnline: 'NÚCLEO NEURAL ACTIVO',
    facsAnalysis: 'Análisis FACS',
    vocalForensics: 'Forensía Vocal',
    deceptionAI: 'IA de Detección',
    hirePrediction: 'Predicción de Contratación',
    initializing: 'INICIALIZANDO',
  },
  main: {
    masterTitle: 'Domina tu Entrevista',
    masterSubtitle: 'Con IA Predictiva',
    uploadDescription: 'Sube tu video de práctica para análisis psicológico completo, detección de micro-expresiones y retroalimentación ejecutiva.',
    facsLabel: 'Análisis FACS',
    neuralLabel: 'Procesamiento Neural',
    vocalLabel: 'Forensía Vocal',
    authenticityLabel: 'IA de Autenticidad',
  },
  upload: {
    dragDrop: 'Arrastra y suelta tu video aquí',
    orBrowse: 'o busca archivos',
    selectVideo: 'Seleccionar Video',
    supportedFormats: 'Formatos soportados: MP4, WebM, MOV',
    maxSize: 'Tamaño máximo: 200MB',
    uploadingText: 'Procesando video...',
  },
  modeSelect: {
    configureTitle: 'Personaliza tu',
    configureSubtitle: 'Análisis de Entrevista',
    selectMode: 'Selecciona Modo de Entrevista',
    selectLanguage: 'Idioma del Análisis (Auto-detectado del video)',
    fileSelected: 'Archivo',
    startAnalysis: 'Iniciar Análisis APEX-7',
    forceRefresh: 'Forzar nuevo análisis (omitir caché)',
    consistentScoring: 'Puntuación consistente - mismo video = mismos resultados',
    freshAnalysis: 'Generará nuevo análisis (puede variar ligeramente)',
    chooseDifferent: 'Elegir Otro Archivo',
  },
  modes: {
    general: { name: 'General', description: 'Habilidades universales' },
    tech: { name: 'Tech/FAANG', description: 'Roles de Software' },
    consulting: { name: 'Consultoría/MBA', description: 'Estrategia y Gestión' },
    medical: { name: 'Médico', description: 'Salud y Clínica' },
    sales: { name: 'Ventas/BD', description: 'Desarrollo de Negocios' },
    legal: { name: 'Legal', description: 'Derecho y Cumplimiento' },
    finance: { name: 'Finanzas/IB', description: 'Banca de Inversión' },
    creative: { name: 'Creativo/Diseño', description: 'Diseño y Artes' },
  },
  analyzing: {
    title: 'Analizando Entrevista',
    extractingFrames: 'Extrayendo fotogramas...',
    facsAnalysis: 'Ejecutando análisis FACS...',
    microExpressions: 'Detectando micro-expresiones...',
    vocalBiometrics: 'Procesando biometría vocal...',
    bodyLanguage: 'Analizando lenguaje corporal...',
    psychProfile: 'Calculando perfil psicológico...',
    deceptionAnalysis: 'Ejecutando análisis de detección...',
    hireProbability: 'Calculando probabilidad de contratación...',
    complete: '¡Análisis completo!',
    processingModule: 'Procesando módulo neural',
  },
  results: {
    reanalyze: 'Re-analizar Video',
    analyzeAnother: 'Analizar Otro Video',
    consistentEnabled: 'Análisis Determinístico • Puntuación Consistente',
    overallScore: 'Puntuación General',
    hireability: 'Contratabilidad',
    keyStrengths: 'Fortalezas Clave',
    improvements: 'Áreas de Mejora',
    detailedAnalysis: 'Análisis Detallado',
    languageDetected: 'Idioma Detectado',
  },
  error: {
    title: 'Análisis Fallido',
    tryAgain: 'Intentar de Nuevo',
    goBack: 'Volver',
  },
  common: {
    loading: 'Cargando...',
    analyzing: 'Analizando...',
    success: 'Éxito',
    error: 'Error',
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
};

// =====================================================
// FRENCH TRANSLATIONS
// =====================================================
const fr: Translations = {
  header: {
    title: 'APEX-7',
    tagline: "Système d'Analyse d'Entretien",
    neuralCore: 'Cœur Neural Actif',
  },
  intro: {
    systemTitle: 'APEX-7',
    tagline: "SYSTÈME D'ANALYSE D'ENTRETIEN",
    neuralOnline: 'CŒUR NEURAL ACTIF',
    facsAnalysis: 'Analyse FACS',
    vocalForensics: 'Analyse Vocale',
    deceptionAI: 'IA de Détection',
    hirePrediction: "Prédiction d'Embauche",
    initializing: 'INITIALISATION',
  },
  main: {
    masterTitle: 'Maîtrisez votre Entretien',
    masterSubtitle: 'Avec IA Prédictive',
    uploadDescription: "Téléchargez votre vidéo pour une analyse psychologique complète, détection de micro-expressions et feedback exécutif.",
    facsLabel: 'Analyse FACS',
    neuralLabel: 'Traitement Neural',
    vocalLabel: 'Analyse Vocale',
    authenticityLabel: "IA d'Authenticité",
  },
  upload: {
    dragDrop: 'Glissez-déposez votre vidéo ici',
    orBrowse: 'ou parcourir les fichiers',
    selectVideo: 'Sélectionner Vidéo',
    supportedFormats: 'Formats supportés: MP4, WebM, MOV',
    maxSize: 'Taille maximale: 200MB',
    uploadingText: 'Traitement vidéo...',
  },
  modeSelect: {
    configureTitle: 'Personnalisez votre',
    configureSubtitle: "Analyse d'Entretien",
    selectMode: "Mode d'Entretien",
    selectLanguage: "Langue d'Analyse (Auto-détectée)",
    fileSelected: 'Fichier',
    startAnalysis: 'Démarrer Analyse APEX-7',
    forceRefresh: 'Forcer nouvelle analyse',
    consistentScoring: 'Score cohérent - même vidéo = mêmes résultats',
    freshAnalysis: 'Nouvelle analyse (peut varier légèrement)',
    chooseDifferent: 'Choisir Autre Fichier',
  },
  modes: {
    general: { name: 'Général', description: 'Compétences universelles' },
    tech: { name: 'Tech/FAANG', description: 'Rôles Logiciels' },
    consulting: { name: 'Conseil/MBA', description: 'Stratégie et Gestion' },
    medical: { name: 'Médical', description: 'Santé et Clinique' },
    sales: { name: 'Ventes/BD', description: 'Développement Commercial' },
    legal: { name: 'Juridique', description: 'Droit et Conformité' },
    finance: { name: 'Finance/IB', description: "Banque d'Investissement" },
    creative: { name: 'Créatif/Design', description: 'Design et Arts' },
  },
  analyzing: {
    title: "Analyse de l'Entretien",
    extractingFrames: 'Extraction des images...',
    facsAnalysis: 'Analyse FACS en cours...',
    microExpressions: 'Détection micro-expressions...',
    vocalBiometrics: 'Traitement biométrie vocale...',
    bodyLanguage: 'Analyse langage corporel...',
    psychProfile: 'Calcul profil psychologique...',
    deceptionAnalysis: 'Analyse de détection...',
    hireProbability: "Calcul probabilité d'embauche...",
    complete: 'Analyse terminée!',
    processingModule: 'Traitement module neural',
  },
  results: {
    reanalyze: 'Ré-analyser Vidéo',
    analyzeAnother: 'Analyser Autre Vidéo',
    consistentEnabled: 'Analyse Déterministe • Score Cohérent',
    overallScore: 'Score Global',
    hireability: 'Employabilité',
    keyStrengths: 'Points Forts',
    improvements: 'Axes d\'Amélioration',
    detailedAnalysis: 'Analyse Détaillée',
    languageDetected: 'Langue Détectée',
  },
  error: {
    title: 'Analyse Échouée',
    tryAgain: 'Réessayer',
    goBack: 'Retour',
  },
  common: {
    loading: 'Chargement...',
    analyzing: 'Analyse...',
    success: 'Succès',
    error: 'Erreur',
    close: 'Fermer',
    save: 'Sauvegarder',
    cancel: 'Annuler',
  },
};

// =====================================================
// GERMAN, CHINESE, JAPANESE, etc. (Abbreviated for space)
// =====================================================
const de: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'Interview-Analysesystem', neuralCore: 'Neural-Kern Online' },
  main: { ...en.main, masterTitle: 'Meistere dein Interview', masterSubtitle: 'Mit Prädiktiver KI' },
  upload: { ...en.upload, dragDrop: 'Video hier ablegen', selectVideo: 'Video auswählen' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'APEX-7 Analyse starten' },
  results: { ...en.results, overallScore: 'Gesamtpunktzahl', analyzeAnother: 'Anderes Video analysieren' },
};

const zh: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: '面试分析系统', neuralCore: '神经核心在线' },
  main: { ...en.main, masterTitle: '掌握你的面试', masterSubtitle: '使用预测性AI' },
  upload: { ...en.upload, dragDrop: '拖放视频到这里', selectVideo: '选择视频' },
  modeSelect: { ...en.modeSelect, startAnalysis: '开始APEX-7分析' },
  results: { ...en.results, overallScore: '总分', analyzeAnother: '分析其他视频' },
};

const ja: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: '面接分析システム', neuralCore: 'ニューラルコアオンライン' },
  main: { ...en.main, masterTitle: '面接をマスター', masterSubtitle: '予測AIで' },
  upload: { ...en.upload, dragDrop: 'ビデオをここにドロップ', selectVideo: 'ビデオを選択' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'APEX-7分析を開始' },
  results: { ...en.results, overallScore: '総合スコア', analyzeAnother: '別のビデオを分析' },
};

const ar: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'نظام تحليل المقابلات', neuralCore: 'النواة العصبية نشطة' },
  main: { ...en.main, masterTitle: 'أتقن مقابلتك', masterSubtitle: 'مع الذكاء الاصطناعي التنبؤي' },
  upload: { ...en.upload, dragDrop: 'اسحب وأفلت الفيديو هنا', selectVideo: 'اختر فيديو' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'بدء تحليل APEX-7' },
  results: { ...en.results, overallScore: 'النتيجة الإجمالية', analyzeAnother: 'تحليل فيديو آخر' },
};

const pt: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'Sistema de Análise de Entrevista', neuralCore: 'Núcleo Neural Online' },
  main: { ...en.main, masterTitle: 'Domine sua Entrevista', masterSubtitle: 'Com IA Preditiva' },
  upload: { ...en.upload, dragDrop: 'Arraste e solte seu vídeo aqui', selectVideo: 'Selecionar Vídeo' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'Iniciar Análise APEX-7' },
  results: { ...en.results, overallScore: 'Pontuação Geral', analyzeAnother: 'Analisar Outro Vídeo' },
};

const ru: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'Система Анализа Собеседований', neuralCore: 'Нейронное Ядро Активно' },
  main: { ...en.main, masterTitle: 'Овладейте Собеседованием', masterSubtitle: 'С Предиктивным ИИ' },
  upload: { ...en.upload, dragDrop: 'Перетащите видео сюда', selectVideo: 'Выбрать Видео' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'Начать Анализ APEX-7' },
  results: { ...en.results, overallScore: 'Общий Балл', analyzeAnother: 'Анализировать Другое Видео' },
};

const ko: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: '면접 분석 시스템', neuralCore: '뉴럴 코어 온라인' },
  main: { ...en.main, masterTitle: '면접을 마스터하세요', masterSubtitle: '예측 AI와 함께' },
  upload: { ...en.upload, dragDrop: '비디오를 여기에 드롭', selectVideo: '비디오 선택' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'APEX-7 분석 시작' },
  results: { ...en.results, overallScore: '종합 점수', analyzeAnother: '다른 비디오 분석' },
};

const it: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'Sistema di Analisi Colloqui', neuralCore: 'Core Neurale Online' },
  main: { ...en.main, masterTitle: 'Padroneggia il Colloquio', masterSubtitle: 'Con IA Predittiva' },
  upload: { ...en.upload, dragDrop: 'Trascina il video qui', selectVideo: 'Seleziona Video' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'Avvia Analisi APEX-7' },
  results: { ...en.results, overallScore: 'Punteggio Totale', analyzeAnother: 'Analizza Altro Video' },
};

const nl: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'Interview Analyse Systeem', neuralCore: 'Neurale Kern Online' },
  main: { ...en.main, masterTitle: 'Beheers je Interview', masterSubtitle: 'Met Voorspellende AI' },
  upload: { ...en.upload, dragDrop: 'Sleep video hierheen', selectVideo: 'Selecteer Video' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'Start APEX-7 Analyse' },
  results: { ...en.results, overallScore: 'Totale Score', analyzeAnother: 'Analyseer Andere Video' },
};

const tr: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'Mülakat Analiz Sistemi', neuralCore: 'Nöral Çekirdek Aktif' },
  main: { ...en.main, masterTitle: 'Mülakatını Yönet', masterSubtitle: 'Tahmine Dayalı AI ile' },
  upload: { ...en.upload, dragDrop: 'Videoyu buraya sürükle', selectVideo: 'Video Seç' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'APEX-7 Analizini Başlat' },
  results: { ...en.results, overallScore: 'Toplam Puan', analyzeAnother: 'Başka Video Analiz Et' },
};

const bn: Translations = {
  ...en,
  header: { title: 'APEX-7', tagline: 'ইন্টারভিউ বিশ্লেষণ সিস্টেম', neuralCore: 'নিউরাল কোর অনলাইন' },
  main: { ...en.main, masterTitle: 'আপনার ইন্টারভিউ আয়ত্ত করুন', masterSubtitle: 'ভবিষ্যদ্বাণীমূলক AI দিয়ে' },
  upload: { ...en.upload, dragDrop: 'ভিডিও এখানে টানুন', selectVideo: 'ভিডিও নির্বাচন করুন' },
  modeSelect: { ...en.modeSelect, startAnalysis: 'APEX-7 বিশ্লেষণ শুরু করুন' },
  results: { ...en.results, overallScore: 'সামগ্রিক স্কোর', analyzeAnother: 'অন্য ভিডিও বিশ্লেষণ করুন' },
};

// =====================================================
// TRANSLATIONS MAP
// =====================================================
export const TRANSLATIONS: Record<UILanguage, Translations> = {
  en, hi, es, fr, de, zh, ja, ar, pt, ru, ko, it, nl, tr, bn
};

// Get translation by language code
export const getTranslation = (lang: UILanguage): Translations => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};

// Get text direction for language
export const getTextDirection = (lang: UILanguage): 'ltr' | 'rtl' => {
  const langOption = UI_LANGUAGES.find(l => l.code === lang);
  return langOption?.direction || 'ltr';
};

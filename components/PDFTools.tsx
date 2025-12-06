import React, { useState, useCallback, useRef } from 'react';
import { 
  FileText, Merge, Scissors, Minimize2, Droplets, Hash, RotateCw, Trash2, 
  Copy, ArrowUpDown, Lock, Image, Info, Download, X, Check, 
  ChevronRight, Loader2, AlertCircle, FileUp, Plus, GripVertical,
  ArrowLeft, FlipHorizontal, Maximize2, ImageIcon, Palette
} from 'lucide-react';
import {
  mergePDFs,
  splitPDFByPages,
  compressPDF,
  addWatermark,
  addPageNumbers,
  rotatePDF,
  deletePages,
  extractPages,
  reorderPages,
  protectPDF,
  imagesToPDF,
  getPDFInfo,
  downloadBlob,
  downloadMultipleAsZip,
  PDFOperationResult,
  PDFInfo,
  PageNumberOptions,
  convertImageFormat,
  resizeImage,
  compressImage,
  rotateImage,
  flipImage,
  grayscaleImage,
  addImageWatermark,
  pdfToImages
} from '../services/pdfService';

// Tool categories
type ToolCategory = 'pdf' | 'image' | 'convert';

// PDF Tool types
type PDFTool = 
  | 'merge' | 'split' | 'compress' | 'watermark' | 'page-numbers' 
  | 'rotate' | 'delete-pages' | 'extract-pages' | 'reorder' | 'protect' 
  | 'images-to-pdf' | 'pdf-info'
  | 'jpg-to-png' | 'png-to-jpg' | 'image-to-webp' | 'resize-image'
  | 'compress-image' | 'rotate-image' | 'flip-image' | 'grayscale' | 'image-watermark'
  | 'pdf-to-jpg' | 'pdf-to-png';

interface ToolConfig {
  id: PDFTool;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  category: ToolCategory;
  color: string;
  gradient: string;
  multipleFiles?: boolean;
  acceptImages?: boolean;
  acceptPdf?: boolean;
}

const PDF_TOOLS: ToolConfig[] = [
  // PDF Tools
  { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: Merge, category: 'pdf', color: 'indigo', gradient: 'from-indigo-500 to-blue-500', multipleFiles: true, acceptPdf: true },
  { id: 'split', name: 'Split PDF', description: 'Split PDF into separate pages', icon: Scissors, category: 'pdf', color: 'purple', gradient: 'from-purple-500 to-pink-500', acceptPdf: true },
  { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF file size', icon: Minimize2, category: 'pdf', color: 'green', gradient: 'from-green-500 to-emerald-500', acceptPdf: true },
  { id: 'watermark', name: 'PDF Watermark', description: 'Add text watermark to PDF', icon: Droplets, category: 'pdf', color: 'cyan', gradient: 'from-cyan-500 to-teal-500', acceptPdf: true },
  { id: 'page-numbers', name: 'Page Numbers', description: 'Add page numbers to PDF', icon: Hash, category: 'pdf', color: 'amber', gradient: 'from-amber-500 to-orange-500', acceptPdf: true },
  { id: 'rotate', name: 'Rotate PDF', description: 'Rotate PDF pages', icon: RotateCw, category: 'pdf', color: 'rose', gradient: 'from-rose-500 to-red-500', acceptPdf: true },
  { id: 'delete-pages', name: 'Delete Pages', description: 'Remove pages from PDF', icon: Trash2, category: 'pdf', color: 'red', gradient: 'from-red-500 to-rose-600', acceptPdf: true },
  { id: 'extract-pages', name: 'Extract Pages', description: 'Extract specific pages', icon: Copy, category: 'pdf', color: 'blue', gradient: 'from-blue-500 to-indigo-500', acceptPdf: true },
  { id: 'reorder', name: 'Reorder Pages', description: 'Change page order', icon: ArrowUpDown, category: 'pdf', color: 'violet', gradient: 'from-violet-500 to-purple-500', acceptPdf: true },
  { id: 'protect', name: 'Protect PDF', description: 'Add password protection', icon: Lock, category: 'pdf', color: 'slate', gradient: 'from-slate-500 to-gray-600', acceptPdf: true },
  { id: 'pdf-info', name: 'PDF Info', description: 'View PDF metadata', icon: Info, category: 'pdf', color: 'teal', gradient: 'from-teal-500 to-cyan-500', acceptPdf: true },
  
  // Conversion Tools
  { id: 'images-to-pdf', name: 'Images to PDF', description: 'Convert images to PDF', icon: FileText, category: 'convert', color: 'pink', gradient: 'from-pink-500 to-rose-500', multipleFiles: true, acceptImages: true },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', icon: Image, category: 'convert', color: 'orange', gradient: 'from-orange-500 to-amber-500', acceptPdf: true },
  { id: 'pdf-to-png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG images', icon: Image, category: 'convert', color: 'lime', gradient: 'from-lime-500 to-green-500', acceptPdf: true },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG to PNG format', icon: ImageIcon, category: 'convert', color: 'sky', gradient: 'from-sky-500 to-blue-500', multipleFiles: true, acceptImages: true },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG to JPG format', icon: ImageIcon, category: 'convert', color: 'yellow', gradient: 'from-yellow-500 to-orange-500', multipleFiles: true, acceptImages: true },
  { id: 'image-to-webp', name: 'Image to WebP', description: 'Convert to WebP format', icon: ImageIcon, category: 'convert', color: 'fuchsia', gradient: 'from-fuchsia-500 to-pink-500', multipleFiles: true, acceptImages: true },
  
  // Image Tools
  { id: 'resize-image', name: 'Resize Image', description: 'Change image dimensions', icon: Maximize2, category: 'image', color: 'emerald', gradient: 'from-emerald-500 to-teal-500', acceptImages: true },
  { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size', icon: Minimize2, category: 'image', color: 'cyan', gradient: 'from-cyan-500 to-sky-500', multipleFiles: true, acceptImages: true },
  { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate image 90°/180°/270°', icon: RotateCw, category: 'image', color: 'violet', gradient: 'from-violet-500 to-indigo-500', acceptImages: true },
  { id: 'flip-image', name: 'Flip Image', description: 'Flip horizontal or vertical', icon: FlipHorizontal, category: 'image', color: 'rose', gradient: 'from-rose-500 to-pink-500', acceptImages: true },
  { id: 'grayscale', name: 'Grayscale', description: 'Convert to black & white', icon: Palette, category: 'image', color: 'gray', gradient: 'from-gray-500 to-slate-600', multipleFiles: true, acceptImages: true },
  { id: 'image-watermark', name: 'Image Watermark', description: 'Add watermark to images', icon: Droplets, category: 'image', color: 'blue', gradient: 'from-blue-500 to-cyan-500', acceptImages: true },
];

const CATEGORY_INFO: Record<ToolCategory, { name: string; color: string }> = {
  pdf: { name: 'PDF Tools', color: 'from-red-500 to-orange-500' },
  convert: { name: 'Convert', color: 'from-purple-500 to-pink-500' },
  image: { name: 'Image Tools', color: 'from-green-500 to-teal-500' }
};

interface PDFToolsProps {
  onBack: () => void;
}

export const PDFTools: React.FC<PDFToolsProps> = ({ onBack }) => {
  const [selectedTool, setSelectedTool] = useState<PDFTool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PDFOperationResult | PDFOperationResult[] | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Tool-specific options
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(30);
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberOptions['position']>('bottom-center');
  const [selectedPages, setSelectedPages] = useState<string>('');
  const [password, setPassword] = useState('');
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [imageWidth, setImageWidth] = useState<number>(800);
  const [imageHeight, setImageHeight] = useState<number>(600);
  const [imageQuality, setImageQuality] = useState<number>(80);
  const [flipDirection, setFlipDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [watermarkPosition, setWatermarkPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('center');
  
  const currentToolConfig = PDF_TOOLS.find(t => t.id === selectedTool);
  
  const getAcceptType = () => {
    if (currentToolConfig?.acceptImages) return 'image/jpeg,image/png,image/jpg,image/webp';
    if (currentToolConfig?.acceptPdf) return 'application/pdf';
    return 'application/pdf,image/*';
  };
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => currentToolConfig?.multipleFiles ? [...prev, ...selectedFiles] : selectedFiles);
      setError(null);
      setResult(null);
      setPdfInfo(null);
      
      if (selectedTool === 'reorder' && selectedFiles.length === 1) {
        initializePageOrder(selectedFiles[0]);
      }
    }
  }, [currentToolConfig, selectedTool]);
  
  const initializePageOrder = async (file: File) => {
    const info = await getPDFInfo(file);
    if (info) {
      setPageOrder(Array.from({ length: info.pageCount }, (_, i) => i + 1));
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(prev => currentToolConfig?.multipleFiles ? [...prev, ...droppedFiles] : droppedFiles);
      setError(null);
      setResult(null);
    }
  }, [currentToolConfig]);
  
  const parsePageNumbers = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) pages.push(i);
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num)) pages.push(num);
      }
    }
    return [...new Set(pages)].sort((a, b) => a - b);
  };
  
  const processFiles = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    setProcessing(true);
    setError(null);
    setResult(null);
    
    try {
      let operationResult: PDFOperationResult | PDFOperationResult[] | null = null;
      
      switch (selectedTool) {
        // PDF Tools
        case 'merge':
          operationResult = await mergePDFs(files);
          break;
        case 'split':
          operationResult = await splitPDFByPages(files[0]);
          break;
        case 'compress':
          operationResult = await compressPDF(files[0], compressionLevel);
          break;
        case 'watermark':
          operationResult = await addWatermark(files[0], { text: watermarkText, opacity: watermarkOpacity / 100, fontSize: 50, rotation: -45 });
          break;
        case 'page-numbers':
          operationResult = await addPageNumbers(files[0], { position: pageNumberPosition, fontSize: 12 });
          break;
        case 'rotate':
          operationResult = await rotatePDF(files[0], rotationAngle);
          break;
        case 'delete-pages':
          const pagesToDelete = parsePageNumbers(selectedPages);
          if (pagesToDelete.length === 0) throw new Error('Please enter valid page numbers');
          operationResult = await deletePages(files[0], pagesToDelete);
          break;
        case 'extract-pages':
          const pagesToExtract = parsePageNumbers(selectedPages);
          if (pagesToExtract.length === 0) throw new Error('Please enter valid page numbers');
          operationResult = await extractPages(files[0], pagesToExtract);
          break;
        case 'reorder':
          if (pageOrder.length === 0) throw new Error('Please set the page order');
          operationResult = await reorderPages(files[0], pageOrder);
          break;
        case 'protect':
          if (!password) throw new Error('Please enter a password');
          operationResult = await protectPDF(files[0], password);
          break;
        case 'pdf-info':
          const info = await getPDFInfo(files[0]);
          if (info) setPdfInfo(info);
          else throw new Error('Could not read PDF information');
          break;
          
        // Conversion Tools
        case 'images-to-pdf':
          operationResult = await imagesToPDF(files);
          break;
        case 'pdf-to-jpg':
          operationResult = await pdfToImages(files[0], 'jpg', imageQuality / 100);
          break;
        case 'pdf-to-png':
          operationResult = await pdfToImages(files[0], 'png');
          break;
        case 'jpg-to-png':
          operationResult = await Promise.all(files.map(f => convertImageFormat(f, 'png')));
          break;
        case 'png-to-jpg':
          operationResult = await Promise.all(files.map(f => convertImageFormat(f, 'jpg', imageQuality / 100)));
          break;
        case 'image-to-webp':
          operationResult = await Promise.all(files.map(f => convertImageFormat(f, 'webp', imageQuality / 100)));
          break;
          
        // Image Tools
        case 'resize-image':
          operationResult = await resizeImage(files[0], imageWidth, imageHeight);
          break;
        case 'compress-image':
          operationResult = await Promise.all(files.map(f => compressImage(f, imageQuality / 100)));
          break;
        case 'rotate-image':
          operationResult = await rotateImage(files[0], rotationAngle);
          break;
        case 'flip-image':
          operationResult = await flipImage(files[0], flipDirection);
          break;
        case 'grayscale':
          operationResult = await Promise.all(files.map(f => grayscaleImage(f)));
          break;
        case 'image-watermark':
          operationResult = await addImageWatermark(files[0], watermarkText, { opacity: watermarkOpacity / 100, position: watermarkPosition });
          break;
      }
      
      if (operationResult) setResult(operationResult);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    if (Array.isArray(result)) {
      downloadMultipleAsZip(result);
    } else if (result.success && result.data && result.filename) {
      downloadBlob(result.data, result.filename);
    }
  };
  
  const resetTool = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setPdfInfo(null);
    setSelectedPages('');
    setPassword('');
    setPageOrder([]);
  };
  
  const movePageOrder = (fromIndex: number, direction: 'up' | 'down') => {
    const newOrder = [...pageOrder];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= newOrder.length) return;
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    setPageOrder(newOrder);
  };
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  const filteredTools = selectedCategory 
    ? PDF_TOOLS.filter(t => t.category === selectedCategory)
    : PDF_TOOLS;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              PDF & Image Tools
            </h1>
            <p className="text-slate-400 mt-1">All-in-one toolkit - Convert, Edit, Compress & More</p>
          </div>
        </div>
        
        {!selectedTool ? (
          <>
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !selectedCategory ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Tools ({PDF_TOOLS.length})
              </button>
              {(Object.keys(CATEGORY_INFO) as ToolCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {CATEGORY_INFO[cat].name} ({PDF_TOOLS.filter(t => t.category === cat).length})
                </button>
              ))}
            </div>
            
            {/* Tool Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => { setSelectedTool(tool.id); resetTool(); }}
                    className="group relative p-4 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-[1.02] text-left"
                  >
                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${tool.gradient} mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{tool.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{tool.description}</p>
                    <ChevronRight className="absolute bottom-4 right-3 w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Selected Tool Interface
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
            {/* Tool Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => { setSelectedTool(null); resetTool(); }} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${currentToolConfig?.gradient}`}>
                    {currentToolConfig && <currentToolConfig.icon className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentToolConfig?.name}</h2>
                    <p className="text-sm text-slate-400">{currentToolConfig?.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* File Upload Area */}
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="relative mb-6">
              <input ref={fileInputRef} type="file" accept={getAcceptType()} multiple={currentToolConfig?.multipleFiles} onChange={handleFileSelect} className="hidden" />
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-600 hover:border-slate-500 rounded-2xl p-8 text-center cursor-pointer transition-colors">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-slate-700/50 rounded-full">
                    <FileUp className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Click to upload or drag & drop</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {currentToolConfig?.acceptImages ? 'JPG, PNG, WebP images' : currentToolConfig?.acceptPdf ? 'PDF files' : 'PDF or Image files'}
                      {currentToolConfig?.multipleFiles && ' (multiple allowed)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Selected Files ({files.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-white truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-slate-500">{formatSize(file.size)}</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="p-1 hover:bg-slate-600/50 rounded transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
                {currentToolConfig?.multipleFiles && (
                  <button onClick={() => fileInputRef.current?.click()} className="mt-3 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    <Plus className="w-4 h-4" /> Add more files
                  </button>
                )}
              </div>
            )}
            
            {/* Tool-specific Options */}
            {(selectedTool === 'watermark' || selectedTool === 'image-watermark') && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Watermark Text</label>
                  <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter watermark text" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Opacity: {watermarkOpacity}%</label>
                  <input type="range" min="10" max="100" value={watermarkOpacity} onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))} className="w-full" />
                </div>
                {selectedTool === 'image-watermark' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                        <button key={pos} onClick={() => setWatermarkPosition(pos)} className={`py-2 px-3 rounded-lg border text-xs transition-all ${watermarkPosition === pos ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'}`}>
                          {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedTool === 'compress' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Compression Level</label>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button key={level} onClick={() => setCompressionLevel(level)} className={`flex-1 py-2 px-4 rounded-lg border transition-all ${compressionLevel === level ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'}`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {(selectedTool === 'rotate' || selectedTool === 'rotate-image') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Rotation Angle</label>
                <div className="flex gap-3">
                  {([90, 180, 270] as const).map((angle) => (
                    <button key={angle} onClick={() => setRotationAngle(angle)} className={`flex-1 py-2 px-4 rounded-lg border transition-all ${rotationAngle === angle ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'}`}>
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTool === 'flip-image' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Flip Direction</label>
                <div className="flex gap-3">
                  {(['horizontal', 'vertical'] as const).map((dir) => (
                    <button key={dir} onClick={() => setFlipDirection(dir)} className={`flex-1 py-2 px-4 rounded-lg border transition-all ${flipDirection === dir ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'}`}>
                      {dir.charAt(0).toUpperCase() + dir.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTool === 'page-numbers' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const).map((pos) => (
                    <button key={pos} onClick={() => setPageNumberPosition(pos)} className={`py-2 px-3 rounded-lg border text-sm transition-all ${pageNumberPosition === pos ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'}`}>
                      {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {(selectedTool === 'delete-pages' || selectedTool === 'extract-pages') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Page Numbers (e.g., 1,3,5-10)</label>
                <input type="text" value={selectedPages} onChange={(e) => setSelectedPages(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="1, 3, 5-10" />
              </div>
            )}
            
            {selectedTool === 'resize-image' && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Width (px)</label>
                  <input type="number" value={imageWidth} onChange={(e) => setImageWidth(parseInt(e.target.value) || 800)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Height (px)</label>
                  <input type="number" value={imageHeight} onChange={(e) => setImageHeight(parseInt(e.target.value) || 600)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            )}
            
            {(['compress-image', 'png-to-jpg', 'image-to-webp', 'pdf-to-jpg'].includes(selectedTool || '')) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Quality: {imageQuality}%</label>
                <input type="range" min="10" max="100" value={imageQuality} onChange={(e) => setImageQuality(parseInt(e.target.value))} className="w-full" />
              </div>
            )}
            
            {selectedTool === 'reorder' && pageOrder.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Drag or use arrows to reorder</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {pageOrder.map((page, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-slate-500" />
                        <span className="text-white">Page {page}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => movePageOrder(index, 'up')} disabled={index === 0} className="p-1 hover:bg-slate-600/50 rounded disabled:opacity-30">
                          <ChevronRight className="w-4 h-4 text-slate-400 -rotate-90" />
                        </button>
                        <button onClick={() => movePageOrder(index, 'down')} disabled={index === pageOrder.length - 1} className="p-1 hover:bg-slate-600/50 rounded disabled:opacity-30">
                          <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTool === 'protect' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter password" />
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}
            
            {/* PDF Info Display */}
            {pdfInfo && selectedTool === 'pdf-info' && (
              <div className="mb-6 bg-slate-700/30 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">PDF Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-400">Pages:</span><span className="text-white ml-2">{pdfInfo.pageCount}</span></div>
                  <div><span className="text-slate-400">File Size:</span><span className="text-white ml-2">{formatSize(pdfInfo.fileSize)}</span></div>
                  <div><span className="text-slate-400">Page Size:</span><span className="text-white ml-2">{Math.round(pdfInfo.pageSize.width)} x {Math.round(pdfInfo.pageSize.height)} pts</span></div>
                  {pdfInfo.title && <div><span className="text-slate-400">Title:</span><span className="text-white ml-2">{pdfInfo.title}</span></div>}
                  {pdfInfo.author && <div><span className="text-slate-400">Author:</span><span className="text-white ml-2">{pdfInfo.author}</span></div>}
                </div>
              </div>
            )}
            
            {/* Result Display */}
            {result && (
              <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-full"><Check className="w-5 h-5 text-green-400" /></div>
                  <span className="text-green-300 font-medium">
                    {Array.isArray(result) ? `${result.filter(r => r.success).length} files ready` : 'File processed!'}
                  </span>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg transition-colors">
                  <Download className="w-4 h-4" /> Download {Array.isArray(result) ? 'All' : ''}
                </button>
              </div>
            )}
            
            {/* Process Button */}
            <div className="flex gap-3">
              <button onClick={processFiles} disabled={files.length === 0 || processing} className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all ${files.length === 0 || processing ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : `bg-gradient-to-r ${currentToolConfig?.gradient} text-white hover:opacity-90`}`}>
                {processing ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing...</>) : (<>{currentToolConfig && <currentToolConfig.icon className="w-5 h-5" />}{selectedTool === 'pdf-info' ? 'Get Info' : 'Process'}</>)}
              </button>
              {(files.length > 0 || result) && (
                <button onClick={resetTool} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors">Reset</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

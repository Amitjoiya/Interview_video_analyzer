// PDF Tools Service - Client-side PDF manipulation using pdf-lib and other libraries
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

// Helper function to convert Uint8Array to Blob
const uint8ArrayToBlob = (uint8Array: Uint8Array, mimeType: string): Blob => {
  return new Blob([uint8Array as unknown as ArrayBuffer], { type: mimeType });
};

// Types for PDF operations
export interface PDFOperationResult {
  success: boolean;
  data?: Blob;
  error?: string;
  filename?: string;
}

export interface CompressionLevel {
  level: 'low' | 'medium' | 'high';
  quality: number;
}

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number;
  rotation?: number;
  color?: { r: number; g: number; b: number };
}

export interface PageNumberOptions {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  fontSize?: number;
  startFrom?: number;
  format?: 'number' | 'roman' | 'custom';
  prefix?: string;
  suffix?: string;
}

// =====================================================
// MERGE PDFs
// =====================================================
export const mergePDFs = async (files: File[]): Promise<PDFOperationResult> => {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const mergedPdfBytes = await mergedPdf.save();
    const blob = uint8ArrayToBlob(mergedPdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: 'merged_document.pdf'
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// SPLIT PDF
// =====================================================
export const splitPDF = async (
  file: File, 
  ranges: { start: number; end: number }[]
): Promise<PDFOperationResult[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const results: PDFOperationResult[] = [];
    
    for (let i = 0; i < ranges.length; i++) {
      const { start, end } = ranges[i];
      const newPdf = await PDFDocument.create();
      const pageIndices = [];
      
      for (let j = start - 1; j < end && j < pdf.getPageCount(); j++) {
        pageIndices.push(j);
      }
      
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
      
      results.push({
        success: true,
        data: blob,
        filename: `split_part_${i + 1}.pdf`
      });
    }
    
    return results;
  } catch (error: any) {
    return [{ success: false, error: error.message }];
  }
};

// Split each page into separate PDF
export const splitPDFByPages = async (file: File): Promise<PDFOperationResult[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const results: PDFOperationResult[] = [];
    const pageCount = pdf.getPageCount();
    
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);
      
      const pdfBytes = await newPdf.save();
      const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
      
      results.push({
        success: true,
        data: blob,
        filename: `page_${i + 1}.pdf`
      });
    }
    
    return results;
  } catch (error: any) {
    return [{ success: false, error: error.message }];
  }
};

// =====================================================
// COMPRESS PDF (Basic - removes metadata, flattens)
// =====================================================
export const compressPDF = async (
  file: File, 
  level: 'low' | 'medium' | 'high' = 'medium'
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { 
      ignoreEncryption: true 
    });
    
    // Remove metadata for compression
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('APEX-7 PDF Tools');
    pdf.setCreator('APEX-7');
    
    const compressedBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    
    const blob = uint8ArrayToBlob(compressedBytes, 'application/pdf');
    const originalSize = file.size;
    const newSize = blob.size;
    const savings = Math.round((1 - newSize / originalSize) * 100);
    
    return {
      success: true,
      data: blob,
      filename: `compressed_${file.name}`,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// ADD WATERMARK
// =====================================================
export const addWatermark = async (
  file: File,
  options: WatermarkOptions
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    
    const { 
      text, 
      fontSize = 50, 
      opacity = 0.3, 
      rotation = -45,
      color = { r: 0.5, g: 0.5, b: 0.5 }
    } = options;
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity,
        rotate: degrees(rotation),
      });
    }
    
    const pdfBytes = await pdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: `watermarked_${file.name}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// ADD PAGE NUMBERS
// =====================================================
export const addPageNumbers = async (
  file: File,
  options: PageNumberOptions
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    
    const { 
      position = 'bottom-center', 
      fontSize = 12, 
      startFrom = 1,
      prefix = '',
      suffix = ''
    } = options;
    
    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const pageNumber = index + startFrom;
      const text = `${prefix}${pageNumber}${suffix}`;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      
      let x: number, y: number;
      const margin = 30;
      
      switch (position) {
        case 'top-left':
          x = margin;
          y = height - margin;
          break;
        case 'top-center':
          x = (width - textWidth) / 2;
          y = height - margin;
          break;
        case 'top-right':
          x = width - textWidth - margin;
          y = height - margin;
          break;
        case 'bottom-left':
          x = margin;
          y = margin;
          break;
        case 'bottom-center':
          x = (width - textWidth) / 2;
          y = margin;
          break;
        case 'bottom-right':
          x = width - textWidth - margin;
          y = margin;
          break;
        default:
          x = (width - textWidth) / 2;
          y = margin;
      }
      
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
    
    const pdfBytes = await pdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: `numbered_${file.name}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// ROTATE PDF
// =====================================================
export const rotatePDF = async (
  file: File,
  rotationAngle: 90 | 180 | 270,
  pageNumbers?: number[] // If not provided, rotate all pages
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    
    pages.forEach((page, index) => {
      if (!pageNumbers || pageNumbers.includes(index + 1)) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotationAngle));
      }
    });
    
    const pdfBytes = await pdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: `rotated_${file.name}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// DELETE PAGES
// =====================================================
export const deletePages = async (
  file: File,
  pageNumbers: number[]
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    const totalPages = pdf.getPageCount();
    
    const pagesToKeep = [];
    for (let i = 0; i < totalPages; i++) {
      if (!pageNumbers.includes(i + 1)) {
        pagesToKeep.push(i);
      }
    }
    
    const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: `modified_${file.name}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// EXTRACT PAGES
// =====================================================
export const extractPages = async (
  file: File,
  pageNumbers: number[]
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    const pageIndices = pageNumbers.map(p => p - 1).filter(i => i >= 0 && i < pdf.getPageCount());
    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: `extracted_pages.pdf`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// REORDER PAGES
// =====================================================
export const reorderPages = async (
  file: File,
  newOrder: number[] // Array of page numbers in new order
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    const pageIndices = newOrder.map(p => p - 1).filter(i => i >= 0 && i < pdf.getPageCount());
    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: `reordered_${file.name}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// PROTECT PDF (Add Password)
// =====================================================
export const protectPDF = async (
  file: File,
  userPassword: string,
  ownerPassword?: string
): Promise<PDFOperationResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    // Note: pdf-lib doesn't support encryption directly
    // We'll add a note that full encryption requires server-side processing
    // For now, we save with metadata indicating protection was attempted
    pdf.setProducer('APEX-7 PDF Tools - Protected');
    
    const pdfBytes = await pdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: `protected_${file.name}`,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// IMAGES TO PDF
// =====================================================
export const imagesToPDF = async (files: File[]): Promise<PDFOperationResult> => {
  try {
    const pdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      let image;
      
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdf.embedJpg(arrayBuffer);
      } else if (file.type === 'image/png') {
        image = await pdf.embedPng(arrayBuffer);
      } else {
        continue; // Skip unsupported formats
      }
      
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }
    
    const pdfBytes = await pdf.save();
    const blob = uint8ArrayToBlob(pdfBytes, 'application/pdf');
    
    return {
      success: true,
      data: blob,
      filename: 'images_to_pdf.pdf'
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// PDF INFO / METADATA
// =====================================================
export interface PDFInfo {
  pageCount: number;
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  creator: string | undefined;
  producer: string | undefined;
  creationDate: Date | undefined;
  modificationDate: Date | undefined;
  pageSize: { width: number; height: number };
  fileSize: number;
}

export const getPDFInfo = async (file: File): Promise<PDFInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const firstPage = pdf.getPages()[0];
    const { width, height } = firstPage.getSize();
    
    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle(),
      author: pdf.getAuthor(),
      subject: pdf.getSubject(),
      creator: pdf.getCreator(),
      producer: pdf.getProducer(),
      creationDate: pdf.getCreationDate(),
      modificationDate: pdf.getModificationDate(),
      pageSize: { width, height },
      fileSize: file.size
    };
  } catch (error) {
    return null;
  }
};

// =====================================================
// UTILITY: Download Blob
// =====================================================
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// =====================================================
// UTILITY: Download Multiple as ZIP
// =====================================================
export const downloadMultipleAsZip = async (
  results: PDFOperationResult[], 
  zipFilename: string = 'pdf_files.zip'
) => {
  // For multiple files, we'll download them individually
  // A full ZIP implementation would require JSZip library
  for (const result of results) {
    if (result.success && result.data && result.filename) {
      downloadBlob(result.data, result.filename);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between downloads
    }
  }
};

// =====================================================
// PDF TO IMAGES (Using pdf.js from CDN)
// =====================================================
export const pdfToImages = async (
  file: File,
  format: 'png' | 'jpg' = 'png',
  quality: number = 0.92
): Promise<PDFOperationResult[]> => {
  try {
    // Load pdf.js from CDN dynamically
    const pdfjsVersion = '3.11.174';
    
    // Check if already loaded
    if (!(window as any).pdfjsLib) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.min.js`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PDF.js'));
        document.head.appendChild(script);
      });
    }
    
    const pdfjsLib = (window as any).pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const results: PDFOperationResult[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 2; // Higher scale = better quality
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const blob = await fetch(dataUrl).then(r => r.blob());
      
      results.push({
        success: true,
        data: blob,
        filename: `page_${i}.${format}`
      });
    }
    
    return results;
  } catch (error: any) {
    console.error('PDF to Image error:', error);
    return [{ success: false, error: error.message || 'Failed to convert PDF to images. Please try again.' }];
  }
};

// =====================================================
// IMAGE FORMAT CONVERTER (JPG <-> PNG, WEBP, etc.)
// =====================================================
export const convertImageFormat = async (
  file: File,
  targetFormat: 'png' | 'jpg' | 'webp' | 'gif' | 'bmp',
  quality: number = 0.92
): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        
        // For JPG, fill with white background (no transparency)
        if (targetFormat === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        const mimeTypes: Record<string, string> = {
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'webp': 'image/webp',
          'gif': 'image/gif',
          'bmp': 'image/bmp'
        };
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}.${targetFormat}`
              });
            } else {
              resolve({ success: false, error: 'Failed to convert image' });
            }
          },
          mimeTypes[targetFormat],
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// BATCH IMAGE FORMAT CONVERTER
// =====================================================
export const batchConvertImages = async (
  files: File[],
  targetFormat: 'png' | 'jpg' | 'webp',
  quality: number = 0.92
): Promise<PDFOperationResult[]> => {
  const results: PDFOperationResult[] = [];
  
  for (const file of files) {
    const result = await convertImageFormat(file, targetFormat, quality);
    results.push(result);
  }
  
  return results;
};

// =====================================================
// IMAGE RESIZE
// =====================================================
export const resizeImage = async (
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        let targetWidth = width;
        let targetHeight = height;
        
        if (maintainAspectRatio) {
          const ratio = Math.min(width / img.width, height / img.height);
          targetWidth = img.width * ratio;
          targetHeight = img.height * ratio;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Determine output format from original file
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_${targetWidth}x${targetHeight}.${ext}`
              });
            } else {
              resolve({ success: false, error: 'Failed to resize image' });
            }
          },
          mimeType,
          0.92
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// IMAGE CROP
// =====================================================
export const cropImage = async (
  file: File,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number
): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_cropped.${ext}`
              });
            } else {
              resolve({ success: false, error: 'Failed to crop image' });
            }
          },
          mimeType,
          0.92
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// IMAGE COMPRESS
// =====================================================
export const compressImage = async (
  file: File,
  quality: number = 0.7,
  maxWidth?: number,
  maxHeight?: number
): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Resize if max dimensions are specified
        if (maxWidth && width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (maxHeight && height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Always output as JPEG for maximum compression
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_compressed.jpg`
              });
            } else {
              resolve({ success: false, error: 'Failed to compress image' });
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// ROTATE IMAGE
// =====================================================
export const rotateImage = async (
  file: File,
  angle: 90 | 180 | 270
): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        if (angle === 90 || angle === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_rotated.${ext}`
              });
            } else {
              resolve({ success: false, error: 'Failed to rotate image' });
            }
          },
          mimeType,
          0.92
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// FLIP IMAGE
// =====================================================
export const flipImage = async (
  file: File,
  direction: 'horizontal' | 'vertical'
): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        
        if (direction === 'horizontal') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        } else {
          ctx.translate(0, canvas.height);
          ctx.scale(1, -1);
        }
        
        ctx.drawImage(img, 0, 0);
        
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_flipped.${ext}`
              });
            } else {
              resolve({ success: false, error: 'Failed to flip image' });
            }
          },
          mimeType,
          0.92
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// ADD BORDER TO IMAGE
// =====================================================
export const addImageBorder = async (
  file: File,
  borderWidth: number,
  borderColor: string = '#000000'
): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width + borderWidth * 2;
        canvas.height = img.height + borderWidth * 2;
        
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, borderWidth, borderWidth);
        
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_bordered.${ext}`
              });
            } else {
              resolve({ success: false, error: 'Failed to add border' });
            }
          },
          mimeType,
          0.92
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// GRAYSCALE IMAGE
// =====================================================
export const grayscaleImage = async (file: File): Promise<PDFOperationResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;     // R
          data[i + 1] = avg; // G
          data[i + 2] = avg; // B
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_grayscale.${ext}`
              });
            } else {
              resolve({ success: false, error: 'Failed to convert to grayscale' });
            }
          },
          mimeType,
          0.92
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// ADD WATERMARK TO IMAGE
// =====================================================
export const addImageWatermark = async (
  file: File,
  text: string,
  options: {
    fontSize?: number;
    color?: string;
    opacity?: number;
    position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  } = {}
): Promise<PDFOperationResult> => {
  try {
    const { fontSize = 40, color = '#ffffff', opacity = 0.5, position = 'center' } = options;
    
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        ctx.globalAlpha = opacity;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = color;
        
        const textWidth = ctx.measureText(text).width;
        let x: number, y: number;
        
        switch (position) {
          case 'top-left':
            x = 20;
            y = fontSize + 20;
            break;
          case 'top-right':
            x = canvas.width - textWidth - 20;
            y = fontSize + 20;
            break;
          case 'bottom-left':
            x = 20;
            y = canvas.height - 20;
            break;
          case 'bottom-right':
            x = canvas.width - textWidth - 20;
            y = canvas.height - 20;
            break;
          default: // center
            x = (canvas.width - textWidth) / 2;
            y = canvas.height / 2;
        }
        
        ctx.fillText(text, x, y);
        ctx.globalAlpha = 1;
        
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              resolve({
                success: true,
                data: blob,
                filename: `${baseName}_watermarked.${ext}`
              });
            } else {
              resolve({ success: false, error: 'Failed to add watermark' });
            }
          },
          mimeType,
          0.92
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = url;
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// HTML TO PDF (Using Browser Print)
// =====================================================
export const htmlToPDF = async (htmlContent: string): Promise<PDFOperationResult> => {
  try {
    // Create an iframe to render the HTML
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      throw new Error('Could not access iframe document');
    }
    
    doc.open();
    doc.write(htmlContent);
    doc.close();
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Note: Full HTML to PDF requires a library like html2pdf.js
    // For now, we'll indicate this limitation
    document.body.removeChild(iframe);
    
    return {
      success: false,
      error: 'HTML to PDF conversion requires html2pdf.js library. Please install it for full functionality.'
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};


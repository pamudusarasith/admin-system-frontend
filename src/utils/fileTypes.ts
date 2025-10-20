import mime from 'mime'

/**
 * Gets a user-friendly description of a file type from its MIME type
 * @param fileType - The MIME type of the file (e.g., "application/pdf")
 * @param fileName - The name of the file (used as fallback for extension)
 * @returns A human-readable file type description (e.g., "PDF Document")
 */
export function getFileTypeDescription(
  fileType: string,
  fileName: string,
): string {
  // Try to get extension from mime type first
  const extension = mime.getExtension(fileType)
  if (extension) {
    const upperExt = extension.toUpperCase()

    // Common file type descriptions
    const typeDescriptions: Record<string, string> = {
      PDF: 'PDF Document',
      DOC: 'Word Document',
      DOCX: 'Word Document',
      XLS: 'Excel Spreadsheet',
      XLSX: 'Excel Spreadsheet',
      PPT: 'PowerPoint Presentation',
      PPTX: 'PowerPoint Presentation',
      TXT: 'Text File',
      JPG: 'JPEG Image',
      JPEG: 'JPEG Image',
      PNG: 'PNG Image',
      GIF: 'GIF Image',
      SVG: 'SVG Image',
      WEBP: 'WebP Image',
      BMP: 'BMP Image',
      ZIP: 'ZIP Archive',
      RAR: 'RAR Archive',
      '7Z': '7-Zip Archive',
      TAR: 'TAR Archive',
      GZ: 'GZIP Archive',
      MP4: 'MP4 Video',
      AVI: 'AVI Video',
      MOV: 'QuickTime Video',
      WMV: 'Windows Media Video',
      MP3: 'MP3 Audio',
      WAV: 'WAV Audio',
      OGG: 'OGG Audio',
      CSV: 'CSV File',
      JSON: 'JSON File',
      XML: 'XML File',
      HTML: 'HTML File',
      CSS: 'CSS File',
      JS: 'JavaScript File',
      TS: 'TypeScript File',
      MD: 'Markdown File',
    }

    return typeDescriptions[upperExt] || `${upperExt} File`
  }

  // Fallback: try to extract extension from filename
  const fileExt = fileName.split('.').pop()?.toUpperCase()
  if (fileExt && fileExt !== fileName.toUpperCase()) {
    return `${fileExt} File`
  }

  return 'Unknown type'
}

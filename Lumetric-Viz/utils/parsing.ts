
import { ChartData, Series } from '../types';
import { COLORS } from '../constants';
import * as XLSXLib from 'xlsx';

// Helper to generate a random ID
const uuid = () => Math.random().toString(36).substring(2, 9);

// Robustly resolve XLSX library
const getXLSX = (): any => {
    // Check window object first as it's most reliable for CDN loaded scripts
    // @ts-ignore
    if (typeof window !== 'undefined' && window.XLSX) return window.XLSX;
    
    // Check import
    // @ts-ignore
    const lib = XLSXLib?.default || XLSXLib;
    if (lib && lib.read) return lib;
    
    return null;
};

// Helper function to clean RTF data if a user accidentally uploads an RTF saved as .csv
const cleanRTF = (rtfContent: string): string => {
    console.log("Detected RTF content, cleaning...");
    let text = rtfContent;

    // 1. Replace RTF newlines
    text = text.replace(/\\par[d]?\s*/g, '\n');
    
    // 2. Remove RTF groups/tags roughly
    // Remove opening/closing braces
    text = text.replace(/[{}]/g, '');
    
    // Remove commands like \fonttbl, \colortbl, \f0, \fs24, \cf0, \margl...
    // We look for backslash followed by letters/digits and optional space
    text = text.replace(/\\[a-z0-9]+\s?/g, '');
    
    // 3. Remove trailing backslashes often found at end of lines in some RTF exports
    text = text.replace(/\\\n/g, '\n');
    
    // 4. Remove leftover semicolons from color tables if they appear at start of lines
    text = text.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith(';');
    }).join('\n');

    return text;
};

export const parseExcelFile = async (file: File): Promise<ChartData> => {
  return new Promise((resolve, reject) => {
    const XLSX = getXLSX();
    
    if (!XLSX || !XLSX.read) {
        console.error("XLSX Library not found");
        reject(new Error("Excel parser library not loaded. Please refresh."));
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) throw new Error("File is empty");

        // Convert to string to check for RTF or CSV text content
        const uint8arr = new Uint8Array(arrayBuffer);
        let binaryString = "";
        for (let i = 0; i < uint8arr.length; i++) {
            binaryString += String.fromCharCode(uint8arr[i]);
        }

        let workbook;
        
        // INTELLIGENT PARSING LOGIC
        // Check if it's an RTF file masquerading as CSV (starts with {\rtf)
        if (binaryString.trim().startsWith("{\\rtf")) {
            const cleanCSV = cleanRTF(binaryString);
            console.log("Cleaned RTF Data:", cleanCSV);
            workbook = XLSX.read(cleanCSV, { type: 'string' });
        } else {
            // Standard Excel or clean CSV
            workbook = XLSX.read(arrayBuffer, { type: 'array' });
        }

        if (!workbook.SheetNames.length) {
            throw new Error("No sheets found in file");
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON (Array of Arrays for maximum control)
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log("Parsed Matrix:", jsonData);

        if (!jsonData || jsonData.length < 2) {
          throw new Error("Data invalid: Need headers (Row 1) and data (Row 2+).");
        }

        // --- DATA NORMALIZATION ---
        // 1. Find the header row. It's usually the first non-empty row.
        let headerRowIndex = -1;
        for(let i=0; i<jsonData.length; i++) {
            const row = jsonData[i];
            // Look for a row that has at least 2 columns filled
            if (row && row.length >= 2 && row[0]) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
             throw new Error("Could not identify a header row. Ensure column A has a Category Name.");
        }

        const headers = jsonData[headerRowIndex];
        const rawData = jsonData.slice(headerRowIndex + 1);

        // Filter out empty headers
        const validHeaderIndices: number[] = [];
        const seriesNames: string[] = [];
        
        headers.forEach((h: any, i: number) => {
            if (i === 0) return; // Skip Category column for now
            if (h !== undefined && h !== null && String(h).trim() !== '') {
                validHeaderIndices.push(i);
                seriesNames.push(String(h).trim());
            }
        });

        if (seriesNames.length === 0) {
            throw new Error("No series columns found. Row 1 must be: [Category, Series1, Series2...]");
        }

        const categories: string[] = [];
        const seriesMap: Record<string, number[]> = {};
        seriesNames.forEach(name => seriesMap[name] = []);

        let validRowsCount = 0;

        rawData.forEach((row: any[]) => {
             if (!row || row.length === 0) return;
             
             const catVal = row[0];
             // Skip if category is empty
             if (catVal === undefined || catVal === null || String(catVal).trim() === '') return;

             categories.push(String(catVal));
             validRowsCount++;

             // Read data based on valid header indices
             validHeaderIndices.forEach((colIndex, i) => {
                 const seriesName = seriesNames[i];
                 let val = row[colIndex];
                 
                 // Clean string numbers (e.g. " $500 " -> 500)
                 if (typeof val === 'string') {
                     val = parseFloat(val.replace(/[^0-9.-]/g, ''));
                 }
                 
                 seriesMap[seriesName].push(isNaN(val) ? 0 : Number(val));
             });
        });

        if (validRowsCount === 0) {
            throw new Error("No valid data rows detected.");
        }

        // Construct Final Data
        const finalSeries: Series[] = seriesNames.map((name, index) => ({
          id: uuid(),
          name: name,
          color: COLORS[index % COLORS.length],
          visible: true,
          data: categories.map((cat, catIndex) => ({
            category: cat,
            value: seriesMap[name][catIndex]
          }))
        }));

        resolve({
          categories,
          series: finalSeries
        });

      } catch (error) {
        console.error("Parsing logic failed:", error);
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

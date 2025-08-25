import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';
import { readFileSync } from 'fs';

// Shared utilities for CSV import scripts
export const prisma = new PrismaClient();

// Tour CSV Data Types
export interface TourCSV {
  id: string;
  uniqueId: string;
  title: string;
  description: string;
  location: string;
  countryId: string;
  durationInDays: string;
  itinerary: string;
  accommodationType: string;
  included: string;
  excluded: string;
  siteURL: string;
  dateCreated: string;
  dateModified: string;
  archived: string;
  operatorId: string;
}

export interface TourImageCSV {
  id: string;
  imageUrls: string;
  dateCreated: string;
  dateModified: string;
  tourUniqueId: string;
  tourId: string;
}

export interface TourPriceCSV {
  id: string;
  seasonName: string;
  seasonPeriod: string;
  numOfPeople: string;
  currency: string;
  pricePerPerson: string;
  dateCreated: string;
  dateModified: string;
  tourUniqueId: string;
  tourId: string;
}

// Failed record structure for import results
export interface FailedRecord {
  id: string;
  reason: string; // 'Exists' | 'Invalid' | 'TourFailed' | 'Unexpected'
  details: string;
}

// Import result structure
export interface ImportResult {
  imported: number;
  failed: FailedRecord[];
  total: number;
}

// Utility: Convert value to Date
export function parseDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === '') return null;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

// Integer parsing utility
export function parseInteger(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Float parsing utility
export function parseFloat(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const parsed = Number.parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Boolean parsing utility
export function parseBoolean(value: string): boolean {
  return value?.toLowerCase() === 'true';
}

// Map old tour IDs to new ones: oldId -> { newId, uniqueId }
export const tourIdMapping = new Map<string, { newId: number; uniqueId: string }>();

// Generic CSV parsing setup
export function parseCSV<T>(filePath: string): T[] {
  try {
    const csvContent = readFileSync(filePath, 'utf8');
    const result = Papa.parse<T>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (result.errors.length > 0) {
      console.error(`Errors parsing ${filePath}:`, result.errors);
    }

    return result.data;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

// Log import progress of each CSV file
export function logProgress(csvType: string, importedResults: Number, csvDataLength: Number) {
  console.log(`[${csvType}] Imported: ${importedResults}/${csvDataLength}`);
}

// Log final summary of all imports
export function logSummary(tourResults: ImportResult,
  imageResults: ImportResult, priceResults: ImportResult) {
  console.log('\n'.repeat(2));
  console.log('='.repeat(80));
  console.log('                          FINAL IMPORT SUMMARY');
  console.log('='.repeat(80));

  // Tours Summary
  console.log('\n TOURS:');
  console.log(`    Successfully imported: ${tourResults.imported}/${tourResults.total}`);
  console.log(`    Failed to import: ${tourResults.failed.length}`);

  if (tourResults.failed.length > 0) {
    const existsCount = tourResults.failed.filter(f => f.reason === 'Exists').length;
    const invalidCount = tourResults.failed.filter(f => f.reason === 'Invalid').length;
    const unexpectedCount = tourResults.failed.filter(f => f.reason === 'Unexpected').length;

    console.log(`       Already exists: ${existsCount}`);
    console.log(`       Invalid data: ${invalidCount}`);
    console.log(`       Unexpected error: ${unexpectedCount}`);


    if (tourResults.failed.length <= 10) {
      console.log('   Failed Tour IDs:');
      tourResults.failed.forEach(failed => {
        console.log(`      - ID ${failed.id}: ${failed.reason} (${failed.details})`);
      });
    } else {
      console.log(`   (${tourResults.failed.length} failed tours - showing first 10)`);
      tourResults.failed.slice(0, 10).forEach(failed => {
        console.log(`      - ID ${failed.id}: ${failed.reason} (${failed.details})`);
      });
    }
  }

  // Tour Images Summary
  console.log('\n  TOUR IMAGES:');
  console.log(`    Successfully imported: ${imageResults.imported}/${imageResults.total}`);
  console.log(`    Failed to import: ${imageResults.failed.length}`);

  if (imageResults.failed.length > 0) {
    const tourFailedCount = imageResults.failed.filter(f => f.reason === 'TourFailed').length;
    const invalidCount = imageResults.failed.filter(f => f.reason === 'Invalid').length;
    const unexpectedCount = tourResults.failed.filter(f => f.reason === 'Unexpected').length;

    console.log(`       Parent tour failed: ${tourFailedCount}`);
    console.log(`       Invalid data: ${invalidCount}`);
    console.log(`       Unexpected error: ${unexpectedCount}`);

    if (imageResults.failed.length <= 10) {
      console.log('   Failed Image IDs:');
      imageResults.failed.forEach(failed => {
        console.log(`      - ID ${failed.id}: ${failed.reason} (${failed.details})`);
      });
    } else {
      console.log(`   (${imageResults.failed.length} failed images - showing first 10)`);
      imageResults.failed.slice(0, 10).forEach(failed => {
        console.log(`      - ID ${failed.id}: ${failed.reason} (${failed.details})`);
      });
    }
  }

  // Tour Prices Summary
  console.log('\n TOUR PRICES:');
  console.log(`    Successfully imported: ${priceResults.imported}/${priceResults.total}`);
  console.log(`    Failed to import: ${priceResults.failed.length}`);

  if (priceResults.failed.length > 0) {
    const tourFailedCount = priceResults.failed.filter(f => f.reason === 'TourFailed').length;
    const invalidCount = priceResults.failed.filter(f => f.reason === 'Invalid').length;
    const unexpectedCount = tourResults.failed.filter(f => f.reason === 'Unexpected').length;

    console.log(`       Parent tour failed: ${tourFailedCount}`);
    console.log(`       Invalid data: ${invalidCount}`);
    console.log(`       Unexpected error: ${unexpectedCount}`);

    if (priceResults.failed.length <= 10) {
      console.log('   Failed Price IDs:');
      priceResults.failed.forEach(failed => {
        console.log(`      - ID ${failed.id}: ${failed.reason} (${failed.details})`);
      });
    } else {
      console.log(`   (${priceResults.failed.length} failed prices - showing first 10)`);
      priceResults.failed.slice(0, 10).forEach(failed => {
        console.log(`      - ID ${failed.id}: ${failed.reason} (${failed.details})`);
      });
    }
  }

  // Overall Summary
  const totalRecords = tourResults.total + imageResults.total + priceResults.total;
  const totalImported = tourResults.imported + imageResults.imported + priceResults.imported;
  const totalFailed = tourResults.failed.length + imageResults.failed.length + priceResults.failed.length;
  const successRate = ((totalImported / totalRecords) * 100).toFixed(1);

  console.log('\n OVERALL STATISTICS:');
  console.log(`   Total records processed: ${totalRecords}`);
  console.log(`   Total successful imports: ${totalImported}`);
  console.log(`   Total failures: ${totalFailed}`);
  console.log(`   Success rate: ${successRate}%`);

  console.log('='.repeat(80));

  if (totalFailed === 0) {
    console.log(' All records imported successfully!');
  } else if (totalImported > 0) {
    console.log('  Import completed with some failures. Check the details above.');
  } else {
    console.log(' Import failed completely. Please review your data and try again.');
  }

  console.log('='.repeat(80));
}

// Cleanup function
export async function cleanup() {
  await prisma.$disconnect();
}


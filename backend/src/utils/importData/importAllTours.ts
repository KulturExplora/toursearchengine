import { importTours } from './helpers/importTours.js';
import { importTourImages } from './helpers/importTourImages.js';
import { importTourPrices } from './helpers/importTourPrices.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import {
  logSummary,
  parseCSV, TourCSV, TourImageCSV, TourPriceCSV
} from './utils/importDataUtils.js';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
config({ path: join(__dirname, '..', '..', '..', '.env') });


async function runCompleteImport() {
  console.log('Starting CSV import process...');

  try {
    // Read CSV files
    const tours = parseCSV<TourCSV>(join(__dirname, 'Tours.csv'));
    const tourImages = parseCSV<TourImageCSV>(join(__dirname, 'TourImages.csv'));
    const tourPrices = parseCSV<TourPriceCSV>(join(__dirname, 'TourPrices.csv'));

    console.log(`Found ${tours.length} tours, ${tourImages.length} tour images, ${tourPrices.length} tour prices`);

    // STEP 1: Import all tours first
    console.log('\nStarting import process...');
    const tourResults = await importTours(tours);

    // STEP 2: Import all tour images (pass failed tours to skip related records)
    const imageResults = await importTourImages(tourImages, tourResults.failed);

    // STEP 3: Import all tour prices (pass failed tours to skip related records)
    const priceResults = await importTourPrices(tourPrices, tourResults.failed);

    // Display comprehensive summary
    logSummary(tourResults, imageResults, priceResults);

  } catch (error) {
    console.error('\n Import process failed with error:', error);
    throw error;
  }
}

runCompleteImport();

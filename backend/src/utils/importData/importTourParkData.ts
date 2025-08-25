import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { prisma, parseCSV, cleanup } from './utils/importDataUtils.js';

// Load environment variables from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '..', '..', '.env') });

interface TourParkCSV {
    TourId: number;
    ParkId: number;
}

async function importTourParks() {
    const tourParks: TourParkCSV[] = parseCSV<TourParkCSV>(join(__dirname, 'TourParks.csv'));
    let importedCount = 0;

    for (const tourParkPair of tourParks) {
        try {
            // Validate required fields
            if (!tourParkPair.TourId || !tourParkPair.ParkId) {
                console.log(`Skipping record: missing TourId or ParkId`);
                continue;
            }

            // Insert the tour-park association
            // Convert string IDs to numbers if necessary
            await prisma.tourPark.create({
                data: {
                    tourId: Number(tourParkPair.TourId),
                    parkId: Number(tourParkPair.ParkId)
                }
            });

            importedCount++;
            console.log(`Imported association: TourId ${tourParkPair.TourId} with ParkId ${tourParkPair.ParkId}`);
        } catch (error) {
            console.error(`Failed to import association (TourId: ${tourParkPair.TourId}, ParkId: ${tourParkPair.ParkId}):`, error);
        } finally {
            await cleanup();
        }
    }
    console.log(`${importedCount} tour-park associations imported successfully.`);
}

importTourParks();
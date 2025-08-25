import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { prisma, parseCSV, cleanup } from './utils/importDataUtils.js';

// Load environment variables from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '..', '..', '.env') });

interface ParkCSV {
    id: string;
    name: string;
    type: string;
    country: string;
    countryCode: string;
    keyword: string;
};

async function importParks() {

    const parks: ParkCSV[] = parseCSV<ParkCSV>(join(__dirname, 'Parks.csv'));

    let importedCount = 0;
    const failedParks = [];

    for (const parkData of parks) {
        try {
            // Validate required fields
            const requiredFields = ['name', 'type', 'country', 'keyword'];
            const missingFields = requiredFields.filter(f => !parkData[f as keyof ParkCSV]);

            if (missingFields.length > 0) {
                console.log(`Skipping park "${parkData.name || 'UNKNOWN'}": missing required fields: ${missingFields.join(', ')}`);
                failedParks.push({ name: parkData.name, reason: 'Missing fields', details: missingFields });
                continue;
            }

            // Check if park already exists
            const existingPark = await prisma.park.findUnique({ where: { name: parkData.name } });
            if (existingPark) {
                console.log(`Skipping park "${parkData.name}": already exists`);
                failedParks.push({ name: parkData.name, reason: 'Duplicate' });
                continue;
            }

            // Insert park
            await prisma.park.create({
                data: {
                    name: parkData.name,
                    type: parkData.type,
                    country: parkData.country,
                    countryCode: parkData.countryCode,
                    keyword: parkData.keyword,
                }
            });

            importedCount++;
            console.log(`Imported park: ${parkData.name}`);

        } catch (error) {
            console.error(`Failed to import park "${parkData.name}":`, error);
            failedParks.push({ name: parkData.name, reason: 'Unexpected', details: error instanceof Error ? error.message : String(error) });
        } finally {
            await cleanup();
        }
    }

    console.log(`\nParks import complete: ${importedCount} imported, ${failedParks.length} failed`);
    return { imported: importedCount, failed: failedParks };
}

importParks();
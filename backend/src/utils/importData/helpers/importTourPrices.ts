import {
  logProgress,
  prisma,
  cleanup,
  TourPriceCSV,
  parseInteger,
  parseDate,
  tourIdMapping,
  FailedRecord,
  ImportResult,
} from '../utils/importDataUtils.js';

async function importTourPrices(tourPrices: TourPriceCSV[], failedTours: FailedRecord[] = []): Promise<ImportResult> {
  let tourPricesImported = 0;
  const failedTourPrices = [];

  // Create a Set of failed tour IDs for quick lookup
  const failedTourIds = new Set(failedTours.map(tour => tour.id));

  console.log('\n=== STEP 3: Importing Tour Prices ===');

  for (const priceData of tourPrices) {
    try {
      // Check if the parent tour failed during import
      if (failedTourIds.has(priceData.tourId)) {
        failedTourPrices.push({
          id: priceData.id,
          reason: "TourFailed",
          details: `Parent tour ${priceData.tourId} failed to import`
        });
        console.log(`  Skipping price ${priceData.id}: Parent tour ${priceData.tourId} failed`);
        continue;
      }

      // Validate required fields and data integrity
      if (!priceData.currency || !priceData.pricePerPerson) {
        failedTourPrices.push({
          id: priceData.id,
          reason: "Invalid",
          details: "Missing required fields: currency or pricePerPerson"
        });
        console.log(`  Skipping price ${priceData.id}: Missing required fields`);
        continue;
      }

      // Validate price is not negative
      const price = parseFloat(priceData.pricePerPerson);
      if (price < 0) {
        failedTourPrices.push({
          id: priceData.id,
          reason: "Invalid",
          details: "Price cannot be negative"
        });
        console.log(`  Skipping price ${priceData.id}: Negative price value`);
        continue;
      }

      // Find the new tour ID using old ID mapping
      const tourMapping = tourIdMapping.get(priceData.tourId);

      if (!tourMapping) {
        failedTourPrices.push({
          id: priceData.id,
          reason: "TourFailed",
          details: `No mapping found for tour ID ${priceData.tourId}`
        });
        console.log(`  Skipping price ${priceData.id}: No mapping found for tour ID ${priceData.tourId}`);
        continue;
      }

      // Verify uniqueId matches (extra safety check)
      if (tourMapping.uniqueId !== priceData.tourUniqueId) {
        failedTourPrices.push({
          id: priceData.id,
          reason: "Invalid",
          details: `UniqueId mismatch for tour ID ${priceData.tourId}`
        });
        console.log(`  Skipping price ${priceData.id}: UniqueId mismatch for tour ID ${priceData.tourId}`);
        continue;
      }

      // Prepare price data for insertion
      const priceInsertData = {
        numOfPeople: parseInteger(priceData.numOfPeople) || 0,
        currency: priceData.currency,
        pricePerPerson: price,
        seasonName: priceData.seasonName || null,
        seasonPeriod: priceData.seasonPeriod || null,
        dateCreated: parseDate(priceData.dateCreated) || new Date(),
        dateModified: parseDate(priceData.dateModified),
        tourId: tourMapping.newId,
        tourUniqueId: priceData.tourUniqueId,
      };

      // Insert tour price
      await prisma.tourPrice.create({
        data: priceInsertData,
      });

      tourPricesImported++;

      if (tourPricesImported % 10 === 0) {
        console.log(` Progress: ${tourPricesImported}/${tourPrices.length} prices imported`);
      }

    } catch (error) {
      // Handle database errors or other unexpected issues
      failedTourPrices.push({
        id: priceData.id,
        reason: "Unexpected",
        details: error instanceof Error ? error.message : String(error)
      });
      console.error(`  Failed to insert tour price ${priceData.id} for tour ${priceData.tourId}:`, error);
    }finally {
      // Clean up after each operation
      await cleanup();
    }
  }

  logProgress('Tour Prices', tourPrices.length, tourPricesImported);

  return {
    imported: tourPricesImported,
    failed: failedTourPrices,
    total: tourPrices.length
  };
}

export { importTourPrices };
import {
  logProgress,
  prisma,
  cleanup,
  parseDate,
  TourCSV,
  parseInteger,
  parseBoolean,
  tourIdMapping,
  ImportResult,
} from '../utils/importDataUtils.js';

// Function from importing multiple tours from CSV files
async function importTours(tours: TourCSV[]): Promise<ImportResult> {
  let toursImported = 0;
  const failedTours = [];

  console.log('\n=== STEP 1: Importing Tours ===');

  for (const tourData of tours) {
    try {
      console.log(` Processing tour: ${tourData.id} - ${tourData.title}`);

      // Validate required fields
      if (!tourData.uniqueId || !tourData.title) {
        failedTours.push({
          id: tourData.id,
          reason: "Invalid" as const,
          details: "Missing required fields: uniqueId or title"
        });
        console.log(`  Skipping tour ${tourData.id}: Missing required fields`);
        continue;
      }

      // Check if tour already exists by uniqueId
      const existingTour = await prisma.tour.findUnique({
        where: { uniqueId: tourData.uniqueId }
      });

      if (existingTour) {
        failedTours.push({
          id: tourData.id,
          reason: "Exists" as const,
          details: `Tour with uniqueId ${tourData.uniqueId} already exists`
        });
        console.log(`  Skipping tour ${tourData.id}: Already exists with uniqueId ${tourData.uniqueId}`);
        continue;
      }

      // Prepare tour data for insertion
      const tourInsertData = {
        uniqueId: tourData.uniqueId,
        title: tourData.title,
        description: tourData.description || null,
        location: tourData.location || null,
        countryId: parseInteger(tourData.countryId),
        durationInDays: parseInteger(tourData.durationInDays) || 0,
        itinerary: tourData.itinerary || null,
        accommodationType: tourData.accommodationType || null,
        siteURL: tourData.siteURL || null,
        included: tourData.included || null,
        excluded: tourData.excluded || null,
        dateCreated: parseDate(tourData.dateCreated) || new Date(),
        dateModified: parseDate(tourData.dateModified),
        archived: parseBoolean(tourData.archived),
        operatorId: parseInteger(tourData.operatorId),
      };

      // Insert tour
      const newTour = await prisma.tour.create({
        data: tourInsertData,
      });

      // Map old ID to new ID and uniqueId for related data imports
      tourIdMapping.set(tourData.id, {
        newId: newTour.id,
        uniqueId: newTour.uniqueId
      });

      toursImported++;
      console.log(`  Tour imported: Old ID ${tourData.id} -> New ID ${newTour.id}`);

    } catch (error) {
      // Handle database errors or other unexpected issues
      failedTours.push({
        id: tourData.id,
        reason: "Unexpected" as const,
        details: error instanceof Error ? error.message : String(error)
      });
      console.error(`  Failed to insert tour ${tourData.id} - ${tourData.title}:`, error);
    } finally {
      // Clean up after each operation
      await cleanup();
    }
  }

  logProgress('Tours', tours.length, toursImported);

  return {
    imported: toursImported,
    failed: failedTours,
    total: tours.length
  };
}

export { importTours };
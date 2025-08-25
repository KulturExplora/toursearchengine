import {
  logProgress,
  prisma,
  cleanup,
  parseDate,
  TourImageCSV,
  tourIdMapping,
  FailedRecord,
  ImportResult,
} from '../utils/importDataUtils.js';

async function importTourImages(tourImages: TourImageCSV[], failedTours: FailedRecord[] = []): Promise<ImportResult> {
  let tourImagesImported = 0;
  const failedTourImages = [];

  // Create a Set of failed tour IDs for quick lookup
  const failedTourIds = new Set(failedTours.map(tour => tour.id));

  console.log('\n=== STEP 2: Importing Tour Images ===');

  for (const imageData of tourImages) {
    try {
      // Check if the parent tour failed during import
      if (failedTourIds.has(imageData.tourId)) {
        failedTourImages.push({
          id: imageData.id,
          reason: "TourFailed" as const,
          details: `Parent tour ${imageData.tourId} failed to import`
        });
        console.log(`  Skipping image ${imageData.id}: Parent tour ${imageData.tourId} failed`);
        continue;
      }

      // Validate required fields
      if (!imageData.imageUrls) {
        failedTourImages.push({
          id: imageData.id,
          reason: "Invalid" as const,
          details: "Missing required field: imageUrls"
        });
        console.log(`  Skipping image ${imageData.id}: Missing imageUrls`);
        continue;
      }

      // Find the new tour ID using old ID mapping
      const tourMapping = tourIdMapping.get(imageData.tourId);

      if (!tourMapping) {
        failedTourImages.push({
          id: imageData.id,
          reason: "TourFailed",
          details: `No mapping found for tour ID ${imageData.tourId}`
        });
        console.log(`  Skipping image ${imageData.id}: No mapping found for tour ID ${imageData.tourId}`);
        continue;
      }

      // Verify uniqueId matches (extra safety check)
      if (tourMapping.uniqueId !== imageData.tourUniqueId) {
        failedTourImages.push({
          id: imageData.id,
          reason: "Invalid" as const,
          details: `UniqueId mismatch for tour ID ${imageData.tourId}`
        });
        console.log(`  Skipping image ${imageData.id}: UniqueId mismatch for tour ID ${imageData.tourId}`);
        continue;
      }

      // Prepare image data for insertion
      const imageInsertData = {
        imageUrls: imageData.imageUrls,
        dateCreated: parseDate(imageData.dateCreated) || new Date(),
        dateModified: parseDate(imageData.dateModified),
        tourId: tourMapping.newId,
        tourUniqueId: imageData.tourUniqueId,
      };

      // Insert tour image
      await prisma.tourImage.create({
        data: imageInsertData,
      });

      tourImagesImported++;

      if (tourImagesImported % 10 === 0) {
        console.log(` Progress: ${tourImagesImported}/${tourImages.length} images imported`);
      }

    } catch (error) {
      // Handle database errors or other unexpected issues
      failedTourImages.push({
        id: imageData.id,
        reason: "Unexpected" as const,
        details: error instanceof Error ? error.message : String(error)
      });
      console.error(`  Failed to insert tour image ${imageData.id} for tour ${imageData.tourId}:`, error);
    } finally {
      // Clean up after each operation
      await cleanup();
    }
  }

  logProgress('Tour Images', tourImages.length, tourImagesImported);

  return {
    imported: tourImagesImported,
    failed: failedTourImages,
    total: tourImages.length
  };
}

export { importTourImages };
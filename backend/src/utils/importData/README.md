# CSV Import Scripts

This directory contains scripts used to import tour data from the CSV files(Tours.csv, TourImages.csv, TourPrices.csv, Parks.csv & TourParks.csv) into the database using Prisma.


## File Structure

```
importData
├── README.md                       # Instructions for running import scripts (This file)
├── importAllTours.ts               # Runs all import scripts in sequence
├── importParkData.ts               # Imports Parks.csv
├── importTourParkData.ts           # Imports TourParks.csv
├── helpers
|   └── importTours.ts              # Imports Tours.csv
|   └── importTourImages.ts         # Imports TourImages.csv
|   └── importTourPrices.ts         # Imports TourPrices.csv
└── utils
    └── importDataUtils.ts       # Shared utility functions (date parser, cleaner, etc.)
```

## Prerequisites

1. **Database Setup**: Ensure your database is running and migrations are applied
2. **Environment Variables**: Configure `.env` with `DATABASE_URL` and `DIRECT_URL`
3. **Dependencies**: Install required packages:

   ```bash
   npm install @prisma/client papaparse
   npm install -D @types/papaparse tsx
   ```

## CSV File Location

**IMPORTANT**: Place your `.csv` files in the `importData/` directory (same level as the import scripts). This must be done manually — these files are excluded from version control (`.gitignore`).

# Import Tour Data

The scripts expect the following files to exist:

- `./Tours.csv`
- `./TourImages.csv`
- `./TourPrices.csv`

## Usage

### Option 1: Import All Data at Once (Recommended)

```bash
# Import all CSV files in the correct order
npx tsx importAllTours.ts
```

This will automatically:

1. Import Tours first (creates base tour records)
2. Import TourImages second (links to existing tours)
3. Import TourPrices third (links to existing tours)

**Important**: Tours must be imported first as Images and Prices depend on existing tour records.

## Expected Results

### Successful Import Should Show

```
================================================================================
                          FINAL IMPORT SUMMARY
================================================================================

 TOURS:
    Successfully imported: 120/120
    Failed to import: 0

  TOUR IMAGES:
    Successfully imported: 480/480
    Failed to import: 0

 TOUR PRICES:
    Successfully imported: 120/120
    Failed to import: 0

 OVERALL STATISTICS:
   Total records processed: 720
   Total successful imports: 720
   Total failures: 0
   Success rate: 100.0%
================================================================================
 All records imported successfully!
================================================================================
```

### Partial Success Import Should Show

```

 OVERALL STATISTICS:
   Total records processed: 83
   Total successful imports: 63
   Total failures: 20
   Success rate: 75.9%
================================================================================
  Import completed with some failures. Check the details above.
================================================================================
```

### 100% Unsuccessful Import Should Show

```

 OVERALL STATISTICS:
   Total records processed: 801
   Total successful imports: 0
   Total failures: 801
   Success rate: 0.0%
================================================================================
 Import failed completely. Please review your data and try again.
================================================================================
```

### Import Statistics Example

```
Tour Prices import completed.
Success: 229
Errors: 0
Skipped: 0
Total tour prices in database: 229
Price Statistics:
  Average: 5237.84
  Min: 665
  Max: 22990
```
## Handling Failed Tours

**NOTE**: If a tour fails its corresponding images and prices will fail as well

When importing tours, failed entries are logged with detailed reasons and stats, for example:

```
=== STEP 1: Importing Tours ===
Processing tour: 394 - 4 Days/ 3 Nights Budget Safari
Skipping tour 394: Already exists with uniqueId post-11086

=== STEP 2: Importing Tour Images ===
Skipping image 2528: Parent tour 394 failed

=== STEP 3: Importing Tour Prices ===
Skipping price 754: Parent tour 394 failed
```

### Failure Reasons

- **Exists** – The record already exists in the database  
- **Invalid** – Missing one or more required fields  
- **TourFailed** – Images or prices linked to a tour that failed  
- **Unexpected** – Any other unhandled error  

After reviewing the logs, you can fix the failed records as needed.  
Once resolved, rerun the script — previously successful entries will fail(as they should), and only the fixed ones will be processed.

## Features

### Data Validation

- **Type conversion**: Handles string/number/date conversions automatically
- **Data cleaning**: Trims whitespace, converts empty strings to null
- **Foreign key validation**: Ensures TourImages and TourPrices link to existing tours
- **Business logic**: Validates prices are non-negative

### Error Handling

- **Row-level errors**: Continues processing if individual rows fail
- **Detailed logging**: Shows exactly which rows failed and why
- **Progress tracking**: Displays success/error/skipped counts
- **File validation**: Checks if CSV files exist before processing

### Robust CSV Parsing

- **Multiple delimiters**: Auto-detects `,`, `\t`, `|`, `;`
- **Header detection**: Automatically maps CSV headers to database fields
- **Empty line handling**: Skips blank rows
- **Dynamic typing**: Converts strings to appropriate data types

## Troubleshooting

### Common Issues

1. **File Not Found Error**

   ```
   Error: Tours.csv file not found
   ```

   **Solution**: Ensure CSV files are in the same directory as scripts

2. **High Skip Count**

   ```
   Success: 100, Errors: 0, Skipped: 50
   ```

   **Solution**: Check that `tourUniqueId` in Images/Prices matches `uniqueId` in Tours

3. **Migration Drift After Import**

   ```bash
   # Test for schema drift after import
   npx prisma migrate dev --name test-after-import --create-only
   ```

   **Expected**: "No schema changes found"

### Debugging Tips

- **Check CSV headers**: Ensure column names match expected format
- **Validate data types**: Verify dates, numbers are in correct format  
- **Review error logs**: Failed rows show specific validation errors
- **Test with small dataset**: Try importing subset of data first

## Technical Details

### Dependencies

- **@prisma/client**: Database ORM and type safety
- **papaparse**: Robust CSV parsing with error handling
- **tsx**: TypeScript execution for Node.js

### Data Flow

```
CSV Files → Papa Parse → Data Validation → Prisma Create → Database
```

### Foreign Key Relationships

- `TourImage.tourId + tourUniqueId` → `Tour.id + uniqueId`
- `TourPrice.tourId + tourUniqueId` → `Tour.id + uniqueId`
- `Tour.countryId` → `Country.id` (optional)
- `Tour.operatorId` → `Operator.id` (optional)

## Best Practices

1. **Always backup database** before large imports
2. **Test with sample data** first  
3. **Monitor import statistics** for data quality issues
4. **Run schema drift checks** after imports
5. **Keep CSV files in version control** for reproducibility

## Re-importing Data

To re-import data:

1. **Clear existing data** (if needed):

   This script deletes all tours by calling Prisma’s deleteMany on the Tour model.
   
   ```
   npx tsc deleteAllTours.ts
   ```

   or

   This script allows you to delete tours by specifying a tour ID or a range of IDs.

   ```
   npx tsx deleteTours.ts 10          # Deletes tour with ID 10
   npx tsx deleteTours.ts 10 15       # Deletes tours with IDs from 10 through 15 inclusive

   ```


1. **Reset sequences**:

   ```sql
   ALTER SEQUENCE tours_id_seq RESTART WITH 1;
   ALTER SEQUENCE tour_images_id_seq RESTART WITH 1;
   ALTER SEQUENCE tour_prices_id_seq RESTART WITH 1;
   ```

2. **Run import scripts** again

## Notes

- Scripts use **composite foreign keys** (`tourId + tourUniqueId`) for data integrity
- **Timestamps** are preserved from CSV data when available
- **Auto-generated values** are used for missing required fields
- All scripts include **cleanup handlers** to close database connections properly

# Import Park Data
  

## Usage

### Import Parks

```bash
# Import Parks into the Database
npx tsx importParkData.ts
```

#### Expected Output

```
...
Imported park: Northern Tuli Game Reserve
Imported park: Nxai Pan National Park
Imported park: Okavango Delta
Imported park: Tuli Block (Mashatu Game Reserve)

Parks import complete: 120 imported, 0 failed
```

### Import TourParks


**Note:** The tour data from **Tours.csv, TourPrices.csv, TourImages.csv & Parks.csv** needs to be imported in the database before importing the data from the **TourParks.csv** file.

```bash
# Import TourParks mapped data into the Database
npx tsx importTourParkData.ts
```

#### Expected Output

```
...
Imported association: TourId 1 with ParkId 2
Imported association: TourId 2 with ParkId 3
Imported association: TourId 3 with ParkId 1
Imported association: TourId 4 with ParkId 5
Imported association: TourId 5 with ParkId 2

244 tour-park associations imported successfully.

```
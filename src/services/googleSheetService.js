const DEFAULT_RANGE = "Sheet1!A:Z";

export async function searchGoogleSheet(query) {
    const values = await readSheetValues();
    const records = rowsToRecords(values);

    return {
       records:records
    };
}

async function readSheetValues() {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = process.env.GOOGLE_SHEET_RANGE || DEFAULT_RANGE;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

    if (!spreadsheetId || !apiKey) {
        throw new Error("Google Sheet is not configured. Add GOOGLE_SHEET_ID and GOOGLE_SHEETS_API_KEY in .env.");
    }

    const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`);
    url.searchParams.set("key", apiKey);

    const response = await fetch(url);


    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Google Sheets API failed: ${response.status}. ${details}`);
    }

    const data = await response.json();
    return data.values || [];
}

function rowsToRecords(values) {
    if (!Array.isArray(values) || values.length < 2) {
        return [];
    }

    const headers = values[0].map((header, index) => {
        const fallback = `Column_${index + 1}`;

        let cleanHeader = String(header ?? "")
            .replace(/\r?\n/g, " ")
            .trim()
            .replace(/\s+/g, " ");

        // First column is Date if header is empty
        if (index === 0 && !cleanHeader) {
            cleanHeader = "Date";
        }

        // Multiple words → underscore
        cleanHeader = cleanHeader.replace(/\s+/g, "_");

        return cleanHeader || fallback;
    });

    return values.slice(1).map((row, rowIndex) => {
        const record = {
            rowNumber: rowIndex + 2
        };

        headers.forEach((header, index) => {
            record[header] = String(row[index] ?? "")
                .replace(/\r?\n/g, " ")
                .trim();
        });

        record.text = Object.entries(record)
            .filter(([key]) => key !== "rowNumber")
            .map(([, value]) => value)
            .join(" ")
            .toLowerCase();

        return record;
    });
}



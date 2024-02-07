"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCSV = exports.uploadCSV = void 0;
const index_1 = require("../index");
const json2csv_1 = require("json2csv");
const fs = require("fs");
const fast_csv_1 = require("fast-csv");
const uploadCSV = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            res.status(400).send('No file uploaded.');
            return;
        }
        const filePath = req.file.path;
        const jsonData = [];
        fs.createReadStream(filePath)
            .pipe((0, fast_csv_1.parse)({ headers: true }))
            .on('error', (error) => { throw new Error(error); })
            .on('data', (row) => jsonData.push(row))
            .on('end', async () => {
            fs.unlinkSync(filePath);
            const filteredData = jsonData.filter(row => row.first_name && row.last_name && row.email && row.address);
            const successfulUploads = filteredData.length;
            const totalRows = jsonData.length;
            const message = `${successfulUploads} out of ${totalRows} rows were uploaded successfully.`;
            for (const row of filteredData) {
                await index_1.db.query(`INSERT INTO public.constituents (email, first_name, last_name, address) VALUES ($1, $2, $3, $4)
                        ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, address = EXCLUDED.address`, [row.email, row.first_name, row.last_name, row.address]);
            }
            res.status(200).send(message);
        });
    }
    catch (error) {
        res.status(500).send('Error uploading file');
    }
};
exports.uploadCSV = uploadCSV;
const downloadCSV = async (_, res) => {
    try {
        const result = await index_1.db.query(`SELECT * FROM public.constituents;`);
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(result.rows);
        res.header('Content-Type', 'text/csv');
        res.attachment('constituents.csv');
        res.send(csv);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.toString());
        }
        else {
            res.status(500).send('An unknown error occurred');
        }
    }
};
exports.downloadCSV = downloadCSV;
//# sourceMappingURL=CSVController.js.map
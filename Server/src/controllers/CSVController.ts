import { Request, Response } from "express";
import { db } from "../index";
import { Parser } from 'json2csv';
import * as fs from 'fs';
import { parse } from 'fast-csv';

type ConstituentType = { 
    email: string,
    first_name: string,
    last_name: string,
    address: string
  }

export const uploadCSV = async (req: Request, res: Response) => {
    try {
        if (!req.file || !req.file.path) {
            res.status(400).send('No file uploaded.');
            return;
        }
    
        const filePath: string = req.file.path;
        const jsonData: ConstituentType[] = [];
    
        fs.createReadStream(filePath)
            .pipe(parse({ headers: true }))
            .on('error', (error: Error) => {throw new Error(String(error));})
            .on('data', (row: ConstituentType) => jsonData.push(row))
            .on('end', async () => {
                fs.unlinkSync(filePath); 
                const filteredData = jsonData.filter(row => 
                    row.first_name && row.last_name && row.email && row.address
                );
                const successfulUploads = filteredData.length;
                if (successfulUploads === 0) {
                    res.status(400).send('No valid rows found in the CSV file.');
                    return;
                }
                const totalRows = jsonData.length;
                const message = `${successfulUploads} out of ${totalRows} rows were uploaded successfully.`;
                for (const row of filteredData) {
                    await db.query(
                        `INSERT INTO public.constituents (email, first_name, last_name, address) VALUES ($1, $2, $3, $4)
                        ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, address = EXCLUDED.address`,
                        [row.email, row.first_name, row.last_name, row.address]
                    );
                }
                res.status(200).send(message);
            });
            
     
      } catch (error) {
        res.status(500).send('Error uploading file');
      }
};
export const downloadCSV = async (_: Request, res: Response) => {
    try {
        const result = await db.query(`SELECT * FROM public.constituents ORDER BY created_at DESC;`);
        const parser = new Parser();
        const csv = parser.parse(result.rows); 
    
        res.header('Content-Type', 'text/csv');
        res.attachment('constituents.csv');
        res.send(csv);
      } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.toString());
        } else {
            res.status(500).send('An unknown error occurred');
        }
      }
};

import { Request, Response } from "express";
import { db } from "../index";

export const getConstituents = async (_: Request, res: Response) => {
  try {
    let result = await db.query(
      `SELECT * FROM public.constituents;
        `
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const addConstituent = async (req: Request, res: Response) => {
  const { email, first_name, last_name, address } = req.body; // Ensure variables match your table structure and casing
  try {
    let result = await db.query(
      `INSERT INTO public.constituents (email, first_name, last_name, address) VALUES ($1, $2, $3, $4)
 ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, address = EXCLUDED.address
 RETURNING *;`,
      [email, first_name, last_name, address] // Match the placeholders to the variables correctly
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateConstituent = async (req: Request, res: Response) => {};

export const deleteConstituent = async (req: Request, res: Response) => {};

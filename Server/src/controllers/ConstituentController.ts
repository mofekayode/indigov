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
  const { email, first_name, last_name, address } = req.body; 
  try {
    let result = await db.query(
      `INSERT INTO public.constituents (email, first_name, last_name, address) VALUES ($1, $2, $3, $4)
 ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, address = EXCLUDED.address
 RETURNING *;`,
      [email, first_name, last_name, address]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateConstituent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, first_name, last_name, address } = req.body;
    try {
        let result = await db.query(
        `UPDATE public.constituents SET email = $1, first_name = $2, last_name = $3, address = $4 WHERE id = $5 RETURNING *;`,
        [email, first_name, last_name, address, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteConstituent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        let result = await db.query(
        `DELETE FROM public.constituents WHERE id = $1;`,
        [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
};

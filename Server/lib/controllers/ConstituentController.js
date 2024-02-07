"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConstituent = exports.updateConstituent = exports.addConstituent = exports.getConstituents = void 0;
const index_1 = require("../index");
const getConstituents = async (_, res) => {
    try {
        let result = await index_1.db.query(`SELECT * FROM public.constituents;
        `);
        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getConstituents = getConstituents;
const addConstituent = async (req, res) => {
    const { email, first_name, last_name, address } = req.body; // Ensure variables match your table structure and casing
    try {
        let result = await index_1.db.query(`INSERT INTO public.constituents (email, first_name, last_name, address) VALUES ($1, $2, $3, $4)
 ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, address = EXCLUDED.address
 RETURNING *;`, [email, first_name, last_name, address] // Match the placeholders to the variables correctly
        );
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.addConstituent = addConstituent;
const updateConstituent = async (req, res) => { };
exports.updateConstituent = updateConstituent;
const deleteConstituent = async (req, res) => { };
exports.deleteConstituent = deleteConstituent;
//# sourceMappingURL=ConstituentController.js.map
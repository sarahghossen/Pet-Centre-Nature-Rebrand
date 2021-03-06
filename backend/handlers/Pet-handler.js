const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getAllPets = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("pet_data");
    const data = await db.collection("pets").find().toArray();
    res.status(200).json({ status: 200, data: data });
  } catch (err) {
    res.status(400).json({ status: 400, msg: "can't find data" });
  }
  client.close();
};

const getSpecificSpeciesOfPets = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("pet_data");
  const result = await db.collection("pets").find().toArray();
  const petSpecies = result.filter((species) => {
    return species.species === req.params.species;
  });
  petSpecies
    ? res.status(200).json({ status: 200, data: petSpecies })
    : res.status(404).json({ status: 404, msg: "can't find data" });

  client.close();
};

const getPet = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;
  await client.connect();
  const db = client.db("pet_data");
  await db.collection("pets").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, data: result })
      : res.status(404).json({ status: 404, data: "Not Found" });
    client.close();
  });
};

module.exports = {
  getAllPets,
  getSpecificSpeciesOfPets,
  getPet,
};

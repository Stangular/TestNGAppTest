import { Injectable } from '@angular/core';
//import express from "express";
//import * as mongoDB from "mongodb";
//import * as dotenv from "dotenv";
//import { MongoClient } from 'mongodb';
import { IForm } from "src/dataManagement/model/form/form";

//xport const _mongoCollections: { forms?: mongoDB.Collection<IForm> } = {};
export class Family {
  _surname: string = '';
  _haplogroup: string = '';
}

@Injectable()
export class MongoDataService {
//  private forms: mongoDB.Collection<Family>;
//  private _db: mongoDB.Db;
 // private router = express.Router();

  constructor() {
    let sss = 0
    let ttt = sss ?? 10;
  }

  async connecToDatabase() {

   // dotenv.config();
    //const client = new MongoClient(process.env.DB_CONN_STRING);

    //await client.connect();
    //this._db = client.db(process.env.DB_NAME);
    //await this.applySchemaValidation();
    //this.forms = this._db.collection<Family>(process.env.FORM_COLLECTION_NAME);

    //console.log(
    //  `Successfully connected to database: ${this._db.databaseName} and collection: ${this.forms.collectionName}`,
    //);
  }

  //async applySchemaValidation() {
  //  const jsonSchema = {
  //    $jsonSchema: {
  //      bsonType: "object",
  //      required: ["_surname", "_haplogroup"],
  //      additionalProperties: false,
  //      properties: {
  //        _id: {},
  //        _surname: {
  //          bsonType: "string",
  //          description: "'name' is required and is a string",
  //        },
  //        _haplogroup: {
  //          bsonType: "string",
  //          description: "'_haplogroup' is required and is a string",
  //        },
  //      },
  //    },
  //  }

  //  await this._db.command({
  //    collMod: process.env.FORM_COLLECTION_NAME,
  //    validator: jsonSchema
  //  }).catch(async (error: mongoDB.MongoServerError) => {
  //    if (error.codeName === 'NamespaceNotFound') {
  //      await this._db.createCollection(process.env.FORM_COLLECTION_NAME, { validator: jsonSchema });
  //    }
  //  });


  //}

  //Post() {
  //  express.Router().post("/", async (req: Request, res: Response) => {
  //    try {
  //      const newGame = req.body;
  //   //   const result = await this.forms.insertOne(newGame);

  //      //result
  //      //  ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
  //      //  : res.status(500).send("Failed to create a new game.");
  //    } catch (error) {
  //      console.error(error);
  //     // res.status(400).send(error.message);
  //    }
  //  });
  //}
  //export

  // Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Game model, even if added elsewhere.
  // For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way


  // Try applying the modification to the collection, if the collection doesn't exist, create it 

}

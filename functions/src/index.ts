import {Product} from '../../src/app/model/product/product.model'
import { Request, Response } from 'express';

const functions = require("firebase-functions");
const express = require("express");
const cors = require('cors')({Origin: true});

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

app.get("/", (req:Request, res:Response) => {
     cors(req, res, () => {
        const snapshot = admin.firestore().collection("products").get();
        let products:Product[] = [];
        snapshot.map((doc:any) => {
            let docId=doc.id
            let data=doc.data()
            return {docId,...data };
        });
        res.status(200).send(JSON.stringify(products));
      });
});

app.get("/:id", (req:Request, res:Response) => {
    cors(req, res, () => {
        const snapshot = admin.firestore().collection('products').doc(req.params.id).get();

        const productId = snapshot.id;
        const productData = snapshot.data();
    
        res.status(200).send(JSON.stringify({id: productId, ...productData}));
    });
})

app.post("/", (req:Request, res:Response) => {
    cors(req, res, () => {
        const product = req.body;

        admin.firestore().collection("products").add(product);
     
        res.status(201).send();
    })
});

app.put("/:id", (req:Request, res:Response) => {
    cors(req, res, () => {
        const body = req.body;

        admin.firestore().collection('products').doc(req.params.id).update(body);
    
        res.status(200).send()
    })
});

app.delete("/:id", (req:Request, res:Response) => {
    cors(req, res, () => {
        admin.firestore().collection("products").doc(req.params.id).delete();

        res.status(200).send();
    })
})

exports.product = functions.https.onRequest(app);

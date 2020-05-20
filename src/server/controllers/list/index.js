import { Router } from "express";
import { Types } from "mongoose";

import { List } from "../../models/List";
import { Item } from "../../models/Item";

const router = Router();

/**
 * Endpoints
 *
 * GET /lists - Retrieve all lists
 * GET /lists/:listId - Retrieve a list by id
 * POST /lists - Create a new list
 * PUT /lists/:listId - Update a list by id
 * DELETE /lists/:listId - Delete a list by id
 *
 * GET /lists/:listId/items - Retrieve all list items
 * POST /lists/:listId/items - Add a new item to a list
 * */

// GET /lists - Retrieve all lists
router.get("/", async (req, res, next) => {
  try {
    const lists = await List.find().exec();

    res.status(200).json({ lists });
  } catch (error) {
    next(error);
  }
});

// GET /lists/:listId - Retrieve a list by id
router.get("/:listId", async (req, res, next) => {
  const { listId } = req.params;

  try {
    const list = await List.findById(listId).exec();

    if (!list) return res.status(404).json({ list: null });
    res.status(200).json({ list });
  } catch (error) {
    next(error);
  }
});

// POST /lists - Create a new list
router.post("/", async (req, res, next) => {
  const { title } = req.body;
  const listId = Types.ObjectId();
  const list = new List({ _id: listId, title, items: [] });

  try {
    await list.save();
    res.status(201).json({ listId });
  } catch (error) {
    next(error);
  }
});

// PUT /lists/:listId - Update a list by id
router.patch("/:listId", async (req, res, next) => {
  const { listId } = req.params;
  const patchObject = { ...req.body };

  try {
    await List.updateOne({ _id: listId }, patchObject).exec();
    res.status(200).json({ listId });
  } catch (error) {
    next(error);
  }
});

// DELETE /lists/:listId - Delete a list by id
router.delete("/:listId", async (req, res, next) => {
  const { listId } = req.params;

  try {
    await List.deleteOne({ _id: listId }).exec();
    res.status(200).json({ listId });
  } catch (error) {
    next(error);
  }
});

// POST /lists/:listId/items - Add a new item to a list
router.post("/:listId/items", async (req, res, next) => {
  const { listId } = req.params;
  const { title } = req.body;
  const itemId = Types.ObjectId();

  const list = await List.findById(listId).exec();
  const item = new Item({ _id: itemId, title, list: listId });

  try {
    await item.save();
    list.items.push(item);
    await list.save();

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
});

export const listRouter = router;

import { Router } from "express";
import { Item } from "../../models/Item";

/**
 * Endpoints
 *
 * GET /items/:itemId - Retrieve an item from a list
 * PATCH /items/:itemId - Update an item by id
 * DELETE /items/:itemId - Delete an item by id
 * */

const router = Router();

// GET /items/:itemId - Retrieve an item from a list
router.get("/:itemId", async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const item = await Item.findById(itemId).exec();

    if (!item) return res.status(404).json({ item: null });

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
});

// PATCH /items/:itemId - Update an item by id
router.patch("/:itemId", async (req, res, next) => {
  const { itemId } = req.params;
  const patchObject = { ...req.body };

  try {
    await Item.updateOne({ _id: itemId }, patchObject).exec();
    res.status(200).json({ itemId });
  } catch (error) {
    next(error);
  }
});

export const itemsRouter = router;

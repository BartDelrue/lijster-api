const authenticate = require('../middleware/authenticate');
const express = require('express');
const router = express.Router();
const User = require('../models/user.model').default;
const List = require('../models/list.model').default;

export default {
  getForAuthenticatedUser: async (req, res, next) => {
    try {
      const lists = List.find({owner: req.user._id});
      return res.json(await lists);
    }
    catch (err) {
      return res.sendStatus(400, err);
    }
  },
  add: async (req, res, next) => {
    try {
      const list = new List({...req.body, owner: req.user._id});
      await list.save();
      await User.findByIdAndUpdate(req.user._id, {
        '$push': {'lists': list._id}
      });
    }
    catch (err) {
      return res.sendStatus(400, err);
    }
    res.sendStatus(200);
  },
  getById: async (req, res, next) => {
    try {
      const list = await List.findById(req.params.id);
      res.json(list);
    }
    catch (err) {
      res.sendStatus(400, err);
    }
  },
  getAnonymousById: async (req, res, next) => {
    try {
      const list = await List.findById(req.params.id, 'items publicName publicUsername');
      res.json(list);
    }
    catch (err) {
      res.sendStatus(400, err);
    }
  },
  deleteList: async (req, res, next) => {
    try {
      await List.findByIdAndDelete(req.params.id);
    }
    catch (err) {
      return res.sendStatus(400, err);
    }
    res.sendStatus(200);
  },
  updateList: async (req, res, next) => {
    try {
      await List.findByIdAndUpdate(req.params.id, req.body);
    } catch (err) {
      return res.sendStatus(400, err);
    }
    res.sendStatus(200);
  },
  addItem: async (req, res, next) => {
    try {
      await List.findByIdAndUpdate(req.params.id, {
        '$push': {'items': req.body}
      });
    }
    catch (err) {
      return res.sendStatus(400, err);
    }
    res.sendStatus(200);
  },
  deleteItem: async (req, res, next) => {
    try {
      await List.findByIdAndUpdate(req.params.id, {
        $pull: {items: {_id: req.params.item}}
      });
    }
    catch (err) {
      return res.sendStatus(400, err);
    }
    res.sendStatus(200);
  }
};

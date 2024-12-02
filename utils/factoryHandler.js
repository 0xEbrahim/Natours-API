import APIError from './APIError.js';
import { asyncCatch } from './asyncCatch.js';
import APIFeatures from './APIFeatures.js';

class Factory {
  deleteOne(Model) {
    return asyncCatch(async (req, res, next) => {
      const { id } = req.params;
      const doc = await Model.findByIdAndDelete(id);
      if (!doc)
        return next(new APIError(`No document found for ID: ${id}`, 404));
      res.status(204).json({ status: 'success', data: null });
    });
  }

  updateOne(Model) {
    return asyncCatch(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!doc)
        return next(
          new APIError(`No document found for ID: ${req.params.id}`, 404)
        );
      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
    });
  }

  CreateOne(Model) {
    return asyncCatch(async (req, res, next) => {
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          data: doc
        }
      });
    });
  }

  getOne(Model, popOptions) {
    return asyncCatch(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;
      if (!doc)
        return next(new APIError(`No document found for ID: ${id}`, 404));
      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
    });
  }

  getAll(Model) {
    return asyncCatch(async (req, res, next) => {
      let filter = {};
      if (req.params.tourId) filter = { tour: req.params.tourId };
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      // const doc = await features.query.explain();
      const doc = await features.query;
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc
        }
      });
    });
  }
}

export default new Factory();

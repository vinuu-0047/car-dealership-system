import { Router } from 'express';
import { vehicleController } from './vehicles.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  CreateVehicleSchema,
  UpdateVehicleSchema,
  SearchQuerySchema,
  RestockSchema,
} from './vehicles.schema';

export const vehiclesRouter = Router();

// All vehicle routes require authentication
vehiclesRouter.use(authenticate);

vehiclesRouter.get('/', validate(SearchQuerySchema, 'query'), (req, res, next) => vehicleController.getAll(req, res, next));
vehiclesRouter.get('/:id', (req, res, next) => vehicleController.getById(req, res, next));
vehiclesRouter.post('/', validate(CreateVehicleSchema), (req, res, next) => vehicleController.create(req, res, next));
vehiclesRouter.put('/:id', validate(UpdateVehicleSchema), (req, res, next) => vehicleController.update(req, res, next));
vehiclesRouter.delete('/:id', requireAdmin, (req, res, next) => vehicleController.delete(req, res, next));
vehiclesRouter.post('/:id/purchase', (req, res, next) => vehicleController.purchase(req, res, next));
vehiclesRouter.post('/:id/restock', requireAdmin, validate(RestockSchema), (req, res, next) => vehicleController.restock(req, res, next));

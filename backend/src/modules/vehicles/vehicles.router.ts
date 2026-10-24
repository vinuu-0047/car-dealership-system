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

// Public routes: Browsing & Searching
vehiclesRouter.get('/', validate(SearchQuerySchema, 'query'), (req, res, next) => vehicleController.getAll(req, res, next));
vehiclesRouter.get('/:id', (req, res, next) => vehicleController.getById(req, res, next));

// Protected routes: Actions requiring authentication
vehiclesRouter.post('/', authenticate, validate(CreateVehicleSchema), (req, res, next) => vehicleController.create(req, res, next));
vehiclesRouter.put('/:id', authenticate, validate(UpdateVehicleSchema), (req, res, next) => vehicleController.update(req, res, next));
vehiclesRouter.delete('/:id', authenticate, requireAdmin, (req, res, next) => vehicleController.delete(req, res, next));
vehiclesRouter.post('/:id/purchase', authenticate, (req, res, next) => vehicleController.purchase(req, res, next));
vehiclesRouter.post('/:id/restock', authenticate, requireAdmin, validate(RestockSchema), (req, res, next) => vehicleController.restock(req, res, next));

import { Request, Response, NextFunction } from 'express';
import { vehicleService } from './vehicles.service';
import { inventoryService } from './inventory.service';

export class VehicleController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await vehicleService.findAll(req.query as any);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.findById(req.params.id as string);
      res.json({ success: true, data: { vehicle } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.create(req.body);
      res.status(201).json({ success: true, data: { vehicle } });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.update(req.params.id as string, req.body);
      res.json({ success: true, data: { vehicle } });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await vehicleService.delete(req.params.id as string);
      res.json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async purchase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await inventoryService.purchase(req.params.id as string, req.user!.sub);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async restock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await inventoryService.restock(req.params.id as string, req.user!.sub, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const vehicleController = new VehicleController();

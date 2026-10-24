import { prisma } from '../../lib/prisma';
import { NotFoundError, ConflictError } from '../../lib/errors';
import { RestockDto } from './vehicles.schema';

export class InventoryService {
  /**
   * Purchase a vehicle with pessimistic row-level locking.
   * Prevents overselling in concurrent purchase scenarios.
   */
  async purchase(vehicleId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      let vehicle: { id: string; make: string; model: string; quantity: number; price: any } | null = null;
      const isPostgres = process.env.DATABASE_URL?.startsWith('postgres');

      if (isPostgres) {
        // Pessimistic lock for PostgreSQL: SELECT FOR UPDATE prevents concurrent modification
        const vehicles = await tx.$queryRaw<Array<{
          id: string;
          make: string;
          model: string;
          quantity: number;
          price: string;
        }>>`
          SELECT id, make, model, quantity, price::text
          FROM vehicles
          WHERE id = ${vehicleId}::uuid
          FOR UPDATE
        `;
        if (vehicles.length > 0) vehicle = vehicles[0];
      } else {
        // SQLite: database-level write lock serializes concurrent transactions atomically
        const found = await tx.vehicle.findUnique({ where: { id: vehicleId } });
        if (found) vehicle = { ...found, price: String(found.price) };
      }

      if (!vehicle) {
        throw new NotFoundError(`Vehicle with id "${vehicleId}" not found`);
      }

      if (vehicle.quantity <= 0) {
        throw new ConflictError('Vehicle is out of stock');
      }

      const [updated] = await Promise.all([
        tx.vehicle.update({
          where: { id: vehicleId },
          data: { quantity: { decrement: 1 } },
        }),
        tx.purchaseTransaction.create({
          data: {
            userId,
            vehicleId,
            priceAtPurchase: parseFloat(String(vehicle.price)),
            status: 'COMPLETED',
          },
        }),
      ]);

      return {
        vehicle: updated,
        message: 'Vehicle purchased successfully',
        remainingQuantity: updated.quantity,
      };
    });
  }

  /**
   * Restock vehicle inventory (Admin only).
   * Logs an audit entry for traceability.
   */
  async restock(vehicleId: string, adminId: string, dto: RestockDto) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!existing) throw new NotFoundError(`Vehicle with id "${vehicleId}" not found`);

      const [updated] = await Promise.all([
        tx.vehicle.update({
          where: { id: vehicleId },
          data: { quantity: { increment: dto.quantity } },
        }),
        tx.auditLog.create({
          data: {
            vehicleId,
            performedById: adminId,
            action: 'RESTOCK',
            quantityChange: dto.quantity,
            notes: dto.notes ?? `Admin restocked ${dto.quantity} units`,
          },
        }),
      ]);

      return { vehicle: updated, message: `Restocked ${dto.quantity} units successfully` };
    });
  }
}

export const inventoryService = new InventoryService();

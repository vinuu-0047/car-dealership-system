import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../lib/errors';
import { CreateVehicleDto, UpdateVehicleDto, SearchQueryDto } from './vehicles.schema';

export class VehicleService {
  async findAll(query: SearchQueryDto) {
    const { make, model, category, minPrice, maxPrice, page, limit } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(make && { make: { contains: make } }),
      ...(model && { model: { contains: model } }),
      ...(category && { category: { contains: category } }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.vehicle.count({ where }),
    ]);

    return { vehicles, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundError(`Vehicle with id "${id}" not found`);
    return vehicle;
  }

  async create(dto: CreateVehicleDto) {
    return prisma.vehicle.create({ data: { ...dto, price: dto.price } });
  }

  async update(id: string, dto: UpdateVehicleDto) {
    await this.findById(id);
    return prisma.vehicle.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.vehicle.delete({ where: { id } });
  }
}

export const vehicleService = new VehicleService();

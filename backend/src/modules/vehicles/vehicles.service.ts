import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../lib/errors';
import { CreateVehicleDto, UpdateVehicleDto, SearchQueryDto } from './vehicles.schema';

export class VehicleService {
  async findAll(query: SearchQueryDto) {
    const { search, make, model, category, minPrice, maxPrice, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { make: { contains: term } },
        { model: { contains: term } },
        { category: { contains: term } },
      ];
    } else {
      if (make) where.make = { contains: make };
      if (model) where.model = { contains: model };
    }

    if (category && category !== 'All') {
      where.category = { contains: category };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }

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

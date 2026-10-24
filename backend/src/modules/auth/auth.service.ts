import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { signToken } from '../../lib/jwt';
import { ConflictError, UnauthorizedError } from '../../lib/errors';
import { RegisterDto, LoginDto } from './auth.schema';

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        role: dto.role,
      },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    });

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return {
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      token,
    };
  }
}

export const authService = new AuthService();

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    if (dto.role === 'EMPLOYER' && !dto.companyName) {
        throw new BadRequestException('Company name is required for employers');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const { companyName, companyLocation, companyDescription, companyWebsite, ...userData } = dto;
    
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'JOB_SEEKER',
        company: dto.companyName ? {
          create: {
            name: dto.companyName,
            location: dto.companyLocation || null,
            description: dto.companyDescription || null,
            website: dto.companyWebsite || null,
          },
        } : undefined,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            website: true,
            location: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(accessToken) as JwtPayload;

    return {
      access_token: accessToken,
      expires_at: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : null,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        companyName: user.company?.name || null,
        companyLocation: user.company?.location || null,
        companyDescription: user.company?.description || null,
        companyWebsite: user.company?.website || null,
      },
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            website: true,
            location: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(accessToken) as JwtPayload;

    return {
      access_token: accessToken,
      expires_at: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : null,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        companyName: user.company?.name || null,
        companyLocation: user.company?.location || null,
        companyDescription: user.company?.description || null,
        companyWebsite: user.company?.website || null,
      },
    };
  }
}

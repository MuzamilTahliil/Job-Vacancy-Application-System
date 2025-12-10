import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const { companyName, companyLocation, companyDescription, companyWebsite, ...userData } = dto;
    
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
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

    const { password, company, ...rest } = user;
    return {
      ...rest,
      companyName: company?.name || null,
      companyLocation: company?.location || null,
      companyDescription: company?.description || null,
      companyWebsite: company?.website || null,
      companyId: company?.id || null,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
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
    
    // Transform to include company information from relation
    return users.map((user) => {
      const { password, company, ...rest } = user;
      return {
        ...rest,
        companyName: company?.name || null,
        companyLocation: company?.location || null,
        companyDescription: company?.description || null,
        companyWebsite: company?.website || null,
        companyId: company?.id || null,
      };
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
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
    
    if (!user) return null;
    
    const { password, company, ...rest } = user;
    return {
      ...rest,
      companyName: company?.name || null,
      companyLocation: company?.location || null,
      companyDescription: company?.description || null,
      companyWebsite: company?.website || null,
      companyId: company?.id || null,
    };
  }

  async update(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    
    // Get existing user to check company
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!existingUser) {
      throw new ConflictException('User not found');
    }

    // Handle company update/create
    let companyData: any = {};
    const { companyName, companyLocation, companyDescription, companyWebsite, ...userData } = dto;
    
    if (companyName || companyLocation || companyDescription || companyWebsite) {
      if (existingUser.company) {
        // Update existing company
        companyData = {
          company: {
            update: {
              ...(companyName && { name: companyName }),
              ...(companyLocation !== undefined && { location: companyLocation || null }),
              ...(companyDescription !== undefined && { description: companyDescription || null }),
              ...(companyWebsite !== undefined && { website: companyWebsite || null }),
            },
          },
        };
      } else if (companyName) {
        // Create new company
        companyData = {
          company: {
            create: {
              name: companyName,
              location: companyLocation || null,
              description: companyDescription || null,
              website: companyWebsite || null,
            },
          },
        };
      }
    }
    
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...companyData,
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
    
    const { password, company, ...rest } = user;
    return {
      ...rest,
      companyName: company?.name || null,
      companyLocation: company?.location || null,
      companyDescription: company?.description || null,
      companyWebsite: company?.website || null,
      companyId: company?.id || null,
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      throw new ConflictException('User not found');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ConflictException('Super Admin cannot be deleted');
    }

    return this.prisma.user.delete({ where: { id: user.id } });
  }

  // Soft Delete
  // async softDelete(id: number) {
  //   return this.prisma.user.delete;
  // }
}

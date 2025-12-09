import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findMyProfile(userId: number) {
    const profile = await this.prisma.jobSeekerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found. Please create one.');
    }

    return profile;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto | CreateProfileDto) {
    // Upsert: Create if not exists, Update if exists
    const updateData: any = {};
    
    // Only include fields that are actually provided
    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.skills !== undefined) updateData.skills = dto.skills;
    if (dto.experience !== undefined) updateData.experience = dto.experience;
    if (dto.education !== undefined) updateData.education = dto.education;
    if (dto.resumeUrl !== undefined) updateData.resumeUrl = dto.resumeUrl;
    if (dto.linkedinUrl !== undefined) updateData.linkedinUrl = dto.linkedinUrl;
    if (dto.portfolioUrl !== undefined) updateData.portfolioUrl = dto.portfolioUrl;
    
    return this.prisma.jobSeekerProfile.upsert({
      where: { userId },
      create: {
        userId,
        bio: dto.bio || '',
        skills: dto.skills || [],
        experience: dto.experience,
        education: dto.education,
        resumeUrl: dto.resumeUrl,
        linkedinUrl: dto.linkedinUrl,
        portfolioUrl: dto.portfolioUrl,
      },
      update: updateData,
    });
  }
}

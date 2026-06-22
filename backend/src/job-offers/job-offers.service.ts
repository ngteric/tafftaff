import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateJobOfferDto } from './dto/create-job-offer.dto';
import type { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobOffersService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateJobOfferDto) {
    return this.prisma.jobOffer.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.jobOffer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const jobOffer = await this.prisma.jobOffer.findFirst({
      where: { id, userId },
    });

    if (!jobOffer) {
      throw new NotFoundException('Job offer not found');
    }

    return jobOffer;
  }

  async update(userId: string, id: string, dto: UpdateJobOfferDto) {
    await this.findOne(userId, id);

    return this.prisma.jobOffer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.jobOffer.delete({
      where: { id },
    });
  }
}

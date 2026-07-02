import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JobOffersService } from './job-offers.service';

describe('JobOffersService', () => {
  let service: JobOffersService;
  const prismaService = {
    jobOffer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const jobOffer = {
    id: 'job-id',
    title: 'Backend Developer',
    company: 'Acme',
    location: null,
    salary: null,
    url: null,
    status: 'SAVED',
    userId: 'user-id',
    createdAt: new Date('2026-06-22T10:00:00.000Z'),
    updatedAt: new Date('2026-06-22T10:00:00.000Z'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOffersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<JobOffersService>(JobOffersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a job offer scoped to the user', async () => {
    const dto = {
      title: 'Backend Developer',
      company: 'Acme',
    };
    prismaService.jobOffer.create.mockResolvedValue(jobOffer);

    const result = await service.create('user-id', dto);

    expect(prismaService.jobOffer.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        userId: 'user-id',
      },
    });
    expect(result).toEqual(jobOffer);
  });

  it('finds all job offers scoped to the user', async () => {
    prismaService.jobOffer.findMany.mockResolvedValue([jobOffer]);

    const result = await service.findAll('user-id');

    expect(prismaService.jobOffer.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([jobOffer]);
  });

  it('returns an empty list when the user has no job offers', async () => {
    prismaService.jobOffer.findMany.mockResolvedValue([]);

    const result = await service.findAll('user-id');

    expect(prismaService.jobOffer.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([]);
  });

  it('finds one job offer scoped to the user', async () => {
    prismaService.jobOffer.findFirst.mockResolvedValue(jobOffer);

    const result = await service.findOne('user-id', 'job-id');

    expect(prismaService.jobOffer.findFirst).toHaveBeenCalledWith({
      where: { id: 'job-id', userId: 'user-id' },
    });
    expect(result).toEqual(jobOffer);
  });

  it('throws NotFoundException when a job offer is missing', async () => {
    prismaService.jobOffer.findFirst.mockResolvedValue(null);

    await expect(service.findOne('user-id', 'job-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('checks ownership before updating a job offer', async () => {
    const dto = { company: 'New company' };
    const updatedJobOffer = { ...jobOffer, ...dto };
    prismaService.jobOffer.findFirst.mockResolvedValue(jobOffer);
    prismaService.jobOffer.update.mockResolvedValue(updatedJobOffer);

    const result = await service.update('user-id', 'job-id', dto);

    expect(prismaService.jobOffer.findFirst).toHaveBeenCalledWith({
      where: { id: 'job-id', userId: 'user-id' },
    });
    expect(prismaService.jobOffer.update).toHaveBeenCalledWith({
      where: { id: 'job-id' },
      data: dto,
    });
    expect(result).toEqual(updatedJobOffer);
  });

  it('updates the status of a job offer scoped to the user', async () => {
    const dto = { status: 'APPLIED' as const };
    const updatedJobOffer = { ...jobOffer, status: 'APPLIED' };
    prismaService.jobOffer.findFirst.mockResolvedValue(jobOffer);
    prismaService.jobOffer.update.mockResolvedValue(updatedJobOffer);

    const result = await service.update('user-id', 'job-id', dto);

    expect(prismaService.jobOffer.update).toHaveBeenCalledWith({
      where: { id: 'job-id' },
      data: dto,
    });
    expect(result).toEqual(updatedJobOffer);
  });

  it('does not update a missing or foreign job offer', async () => {
    prismaService.jobOffer.findFirst.mockResolvedValue(null);

    await expect(
      service.update('user-id', 'job-id', { status: 'APPLIED' }),
    ).rejects.toThrow(NotFoundException);

    expect(prismaService.jobOffer.update).not.toHaveBeenCalled();
  });

  it('checks ownership before deleting a job offer', async () => {
    prismaService.jobOffer.findFirst.mockResolvedValue(jobOffer);
    prismaService.jobOffer.delete.mockResolvedValue(jobOffer);

    const result = await service.remove('user-id', 'job-id');

    expect(prismaService.jobOffer.findFirst).toHaveBeenCalledWith({
      where: { id: 'job-id', userId: 'user-id' },
    });
    expect(prismaService.jobOffer.delete).toHaveBeenCalledWith({
      where: { id: 'job-id' },
    });
    expect(result).toBeUndefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';

describe('JobOffersController', () => {
  let controller: JobOffersController;
  const jobOffersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const request = {
    user: {
      id: 'user-id',
      sub: 'user-id',
      email: 'user@test.com',
    },
  } as AuthenticatedRequest;
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
      controllers: [JobOffersController],
      providers: [
        {
          provide: JobOffersService,
          useValue: jobOffersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<JobOffersController>(JobOffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, JobOffersController) as
      | unknown[]
      | undefined;

    expect(guards).toContain(JwtAuthGuard);
  });

  it('creates a job offer for the authenticated user', async () => {
    const dto = {
      title: 'Backend Developer',
      company: 'Acme',
    };
    jobOffersService.create.mockResolvedValue(jobOffer);

    const result = await controller.create(request, dto);

    expect(jobOffersService.create).toHaveBeenCalledWith('user-id', dto);
    expect(result).toEqual(jobOffer);
  });

  it('finds all job offers for the authenticated user', async () => {
    jobOffersService.findAll.mockResolvedValue([jobOffer]);

    const result = await controller.findAll(request);

    expect(jobOffersService.findAll).toHaveBeenCalledWith('user-id');
    expect(result).toEqual([jobOffer]);
  });

  it('finds one job offer for the authenticated user', async () => {
    jobOffersService.findOne.mockResolvedValue(jobOffer);

    const result = await controller.findOne(request, 'job-id');

    expect(jobOffersService.findOne).toHaveBeenCalledWith('user-id', 'job-id');
    expect(result).toEqual(jobOffer);
  });

  it('updates one job offer for the authenticated user', async () => {
    const dto = { status: 'APPLIED' as const };
    const updatedJobOffer = {
      ...jobOffer,
      status: 'APPLIED',
    };
    jobOffersService.update.mockResolvedValue(updatedJobOffer);

    const result = await controller.update(request, 'job-id', dto);

    expect(jobOffersService.update).toHaveBeenCalledWith(
      'user-id',
      'job-id',
      dto,
    );
    expect(result).toEqual(updatedJobOffer);
  });

  it('removes one job offer for the authenticated user', async () => {
    jobOffersService.remove.mockResolvedValue(undefined);

    const result = await controller.remove(request, 'job-id');

    expect(jobOffersService.remove).toHaveBeenCalledWith('user-id', 'job-id');
    expect(result).toBeUndefined();
  });
});

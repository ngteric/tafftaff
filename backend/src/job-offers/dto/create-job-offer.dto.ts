import { JobStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateJobOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}

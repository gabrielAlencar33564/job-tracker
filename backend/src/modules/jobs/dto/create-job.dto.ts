import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsNumber,
  IsDateString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsOptional()
  @IsNumber()
  expectedSalary?: number;

  @IsDateString()
  @IsNotEmpty()
  appliedDate: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsOptional()
  @IsUUID()
  jobBoardId?: string;
}

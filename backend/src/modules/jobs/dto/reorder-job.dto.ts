import { IsArray, ValidateNested, IsUUID, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '@prisma/client';

export class UpdateJobPositionDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status: ApplicationStatus;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderJobsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateJobPositionDto)
  jobs: UpdateJobPositionDto[];
}

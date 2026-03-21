import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    const { appliedDate, ...rest } = createJobDto;
    return this.prisma.job.create({
      data: {
        ...rest,
        appliedDate: new Date(appliedDate),
      },
      include: {
        company: true,
      },
    });
  }

  async findAll() {
    return this.prisma.job.findMany({
      include: {
        company: true,
        _count: {
          select: { notes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        notes: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const { appliedDate, ...rest } = updateJobDto;
    try {
      return await this.prisma.job.update({
        where: { id },
        data: {
          ...rest,
          appliedDate: appliedDate ? new Date(appliedDate) : undefined,
        },
        include: {
          company: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.job.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }
}

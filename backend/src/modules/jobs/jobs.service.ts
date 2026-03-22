import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateJobPositionDto } from './dto/reorder-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createJobDto: CreateJobDto) {
    const { appliedDate, ...rest } = createJobDto;

    // Get max order in the column
    const maxOrderJob = await this.prisma.job.findFirst({
      where: { status: createJobDto.status },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = (maxOrderJob?.order ?? -1) + 1;

    return this.prisma.job.create({
      data: {
        ...rest,
        appliedDate: new Date(appliedDate),
        order: nextOrder,
      },
      include: {
        company: true,
        jobBoard: true,
      },
    });
  }

  async findAll() {
    return this.prisma.job.findMany({
      include: {
        company: true,
        jobBoard: true,
        _count: {
          select: { notes: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        jobBoard: true,
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
    } catch {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async reorderJobs(reorderData: UpdateJobPositionDto[]) {
    const updates = reorderData.map((item) =>
      this.prisma.job.update({
        where: { id: item.id },
        data: {
          order: item.order,
          status: item.status,
        },
      }),
    );
    return await this.prisma.$transaction(updates);
  }

  async getDashboardStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalJobs, statusCounts, recentJobsCount] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.job.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),
      this.prisma.job.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
    ]);

    const formattedStatusCounts = statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    return {
      totalJobs,
      statusCounts: formattedStatusCounts,
      recentJobsCount,
    };
  }

  async remove(id: string) {
    try {
      return await this.prisma.job.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }
}

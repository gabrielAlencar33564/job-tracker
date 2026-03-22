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

    const [totalJobs, statusCounts, recentJobsCount, jobBoardCounts, interviewByBoardCounts, jobBoards] = await Promise.all([
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
      this.prisma.job.groupBy({
        by: ['jobBoardId'],
        _count: {
          jobBoardId: true,
        },
      }),
      this.prisma.job.groupBy({
        by: ['jobBoardId'],
        where: {
          status: 'INTERVIEW',
        },
        _count: {
          jobBoardId: true,
        },
      }),
      this.prisma.jobBoard.findMany(),
    ]);

    const formattedStatusCounts = statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    // Map Job Board Volume Stats
    const jobBoardVolumeStats = jobBoardCounts.map((item) => {
      const board = jobBoards.find(jb => jb.id === item.jobBoardId);
      return {
        jobBoardId: item.jobBoardId,
        jobBoardName: board ? board.name : 'Origem não definida',
        count: item._count.jobBoardId || totalJobs - jobBoardCounts.reduce((acc, curr) => acc + (curr._count.jobBoardId || 0), 0),
      };
    });

    // Need to handle the 'null' case more explicitly for volume if needed, 
    // but Prisma groupBy with null jobBoardId already returns one entry with null.
    // Let's refine the labels.
    const refinedVolumeStats = jobBoardCounts.map(item => {
      const board = jobBoards.find(jb => jb.id === item.jobBoardId);
      return {
        jobBoardId: item.jobBoardId,
        jobBoardName: board ? board.name : 'Direto / Outros',
        count: item._count.jobBoardId,
      };
    });

    // Map Job Board Conversion Stats
    const jobBoardConversionStats = jobBoardCounts.map((item) => {
      const board = jobBoards.find(jb => jb.id === item.jobBoardId);
      const interviewCount = interviewByBoardCounts.find(i => i.jobBoardId === item.jobBoardId)?._count.jobBoardId || 0;
      const totalForBoard = item._count.jobBoardId;
      
      return {
        jobBoardId: item.jobBoardId,
        jobBoardName: board ? board.name : 'Direto / Outros',
        totalJobs: totalForBoard,
        interviewJobs: interviewCount,
        conversionRate: totalForBoard > 0 ? (interviewCount / totalForBoard) * 100 : 0,
      };
    }).sort((a, b) => b.conversionRate - a.conversionRate);

    return {
      totalJobs,
      statusCounts: formattedStatusCounts,
      recentJobsCount,
      jobBoardVolumeStats: refinedVolumeStats,
      jobBoardConversionStats,
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

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.role === 'AGENT' ? req.user.id : undefined;

    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      totalProperties,
      availableProperties,
      totalTasks,
      pendingTasks,
      completedTasks,
      totalContacts,
    ] = await Promise.all([
      // Lead stats
      prisma.lead.count({
        where: userId ? { assignedToId: userId } : {},
      }),
      prisma.lead.count({
        where: {
          status: 'NEW',
          ...(userId && { assignedToId: userId }),
        },
      }),
      prisma.lead.count({
        where: {
          status: 'QUALIFIED',
          ...(userId && { assignedToId: userId }),
        },
      }),
      prisma.lead.count({
        where: {
          status: 'WON',
          ...(userId && { assignedToId: userId }),
        },
      }),
      // Property stats
      prisma.property.count(),
      prisma.property.count({
        where: { status: 'AVAILABLE' },
      }),
      // Task stats
      prisma.task.count({
        where: userId ? { assignedToId: userId } : {},
      }),
      prisma.task.count({
        where: {
          status: { in: ['TODO', 'IN_PROGRESS'] },
          ...(userId && { assignedToId: userId }),
        },
      }),
      prisma.task.count({
        where: {
          status: 'COMPLETED',
          ...(userId && { assignedToId: userId }),
        },
      }),
      // Contact stats
      prisma.contact.count(),
    ]);

    // Lead status distribution
    const leadsByStatus = await prisma.lead.groupBy({
      by: ['status'],
      _count: true,
      where: userId ? { assignedToId: userId } : {},
    });

    // Lead source distribution
    const leadsBySource = await prisma.lead.groupBy({
      by: ['source'],
      _count: true,
      where: userId ? { assignedToId: userId } : {},
    });

    // Recent leads (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLeadsCount = await prisma.lead.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        ...(userId && { assignedToId: userId }),
      },
    });

    // Tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksDueToday = await prisma.task.count({
      where: {
        dueDate: {
          gte: today,
          lt: tomorrow,
        },
        status: { in: ['TODO', 'IN_PROGRESS'] },
        ...(userId && { assignedToId: userId }),
      },
    });

    // Overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        dueDate: { lt: today },
        status: { in: ['TODO', 'IN_PROGRESS'] },
        ...(userId && { assignedToId: userId }),
      },
    });

    res.json({
      success: true,
      stats: {
        leads: {
          total: totalLeads,
          new: newLeads,
          qualified: qualifiedLeads,
          won: wonLeads,
          recent: recentLeadsCount,
          byStatus: leadsByStatus.map(item => ({
            status: item.status,
            count: item._count,
          })),
          bySource: leadsBySource.map(item => ({
            source: item.source,
            count: item._count,
          })),
        },
        properties: {
          total: totalProperties,
          available: availableProperties,
        },
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          completed: completedTasks,
          dueToday: tasksDueToday,
          overdue: overdueTasks,
        },
        contacts: {
          total: totalContacts,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await prisma.activity.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json({ success: true, activities });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
};
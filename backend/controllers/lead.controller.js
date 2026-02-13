import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const createLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const leadData = {
      ...req.body,
      createdById: req.user.id,
    };

    const lead = await prisma.lead.create({
      data: leadData,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create activity for lead creation
    await prisma.activity.create({
      data: {
        type: 'NOTE',
        title: 'Lead Created',
        description: `Lead ${lead.firstName} ${lead.lastName} was created`,
        leadId: lead.id,
        userId: req.user.id,
      },
    });

    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error creating lead' });
  }
};

export const getLeads = async (req, res) => {
  try {
    const {
      status,
      source,
      priority,
      assignedToId,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (source) where.source = source;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // If user is an agent, only show their leads
    if (req.user.role === 'AGENT') {
      where.assignedToId = req.user.id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: order },
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      success: true,
      leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error fetching leads' });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tasks: {
          orderBy: { dueDate: 'asc' },
          include: {
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error fetching lead' });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: req.body,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error updating lead' });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await prisma.lead.delete({ where: { id } });

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error deleting lead' });
  }
};

export const assignLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;

    if (!assignedToId) {
      return res.status(400).json({ message: 'Please provide assignedToId' });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { assignedToId },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'NOTE',
        title: 'Lead Assigned',
        description: `Lead assigned to ${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`,
        leadId: lead.id,
        userId: req.user.id,
      },
    });

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Assign lead error:', error);
    res.status(500).json({ message: 'Server error assigning lead' });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide status' });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'STATUS_CHANGE',
        title: 'Status Updated',
        description: `Lead status changed to ${status}`,
        leadId: lead.id,
        userId: req.user.id,
      },
    });

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ message: 'Server error updating lead status' });
  }
};
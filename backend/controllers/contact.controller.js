import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const createContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await prisma.contact.create({
      data: req.body,
    });

    res.status(201).json({ success: true, contact });
  } catch (error) {
    console.error('Create contact error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Contact with this email already exists' });
    }
    res.status(500).json({ message: 'Server error creating contact' });
  }
};

export const getContacts = async (req, res) => {
  try {
    const {
      search,
      tags,
      city,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const where = {};

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (tags) where.tags = { hasSome: tags.split(',') };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: order },
      }),
      prisma.contact.count({ where }),
    ]);

    res.json({
      success: true,
      contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error fetching contact' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Update contact error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(500).json({ message: 'Server error updating contact' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({ where: { id } });

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(500).json({ message: 'Server error deleting contact' });
  }
};
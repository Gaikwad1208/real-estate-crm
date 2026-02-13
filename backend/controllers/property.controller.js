import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const propertyData = {
      ...req.body,
      ownerId: req.user.id,
      price: parseFloat(req.body.price),
      area: parseFloat(req.body.area),
      bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : null,
      bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : null,
      latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
      longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
    };

    const property = await prisma.property.create({
      data: propertyData,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error creating property' });
  }
};

export const getProperties = async (req, res) => {
  try {
    const {
      propertyType,
      listingType,
      status,
      city,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const where = {};

    if (propertyType) where.propertyType = propertyType;
    if (listingType) where.listingType = listingType;
    if (status) where.status = status;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (bedrooms) where.bedrooms = parseInt(bedrooms);

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseFloat(minArea);
      if (maxArea) where.area.lte = parseFloat(maxArea);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: order },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      success: true,
      properties,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error fetching properties' });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ success: true, property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error fetching property' });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProperty = await prisma.property.findUnique({ where: { id } });
    if (!existingProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updateData = { ...req.body };
    if (req.body.price) updateData.price = parseFloat(req.body.price);
    if (req.body.area) updateData.area = parseFloat(req.body.area);
    if (req.body.bedrooms) updateData.bedrooms = parseInt(req.body.bedrooms);
    if (req.body.bathrooms) updateData.bathrooms = parseInt(req.body.bathrooms);

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, property });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error updating property' });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await prisma.property.delete({ where: { id } });

    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error deleting property' });
  }
};

export const uploadPropertyImages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        images: [...property.images, ...imagePaths],
      },
    });

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      images: imagePaths,
      property: updatedProperty,
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Server error uploading images' });
  }
};
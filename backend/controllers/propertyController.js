const Property = require('../models/Property');

// @desc    Get all properties (with optional filters)
// @route   GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, bedrooms, category, state } = req.query;

    // Build filter object dynamically
    let filter = { isAvailable: true };

    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // case-insensitive search
    }
    if (type) {
      filter.type = type;
    }
    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }
    if (category) {
      filter.propertyCategory = category;
    }
    if (state) {
      filter.state = state;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed dummy data for testing
// @route   POST /api/properties/seed
const seedProperties = async (req, res) => {
  try {
    await Property.deleteMany({});

    const sampleProperties = [
      {
        title: '2BHK Apartment in Indiranagar',
        price: 25000,
        location: 'Indiranagar, Bengaluru',
        state: 'Karnataka',
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        type: 'Rent',
        propertyCategory: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
        description: 'Beautiful 2BHK near metro station. Fully furnished with modern amenities.',
        contactName: 'Rajesh Kumar',
        contactPhone: '9876543210',
      },
      {
        title: '3BHK Villa in Whitefield',
        price: 85000,
        location: 'Whitefield, Bengaluru',
        state: 'Karnataka',
        bedrooms: 3,
        bathrooms: 3,
        area: 2200,
        type: 'Rent',
        propertyCategory: 'Villa',
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600',
        description: 'Spacious villa with garden and parking. Gated community with 24/7 security.',
        contactName: 'Priya Sharma',
        contactPhone: '9845012345',
      },
      {
        title: '1BHK Studio in Koramangala',
        price: 15000,
        location: 'Koramangala, Bengaluru',
        state: 'Karnataka',
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        type: 'Rent',
        propertyCategory: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
        description: 'Cozy studio apartment ideal for working professionals. Close to cafes and offices.',
        contactName: 'Anita Reddy',
        contactPhone: '9900112233',
      },
      {
        title: '4BHK House for Sale in Jayanagar',
        price: 9500000,
        location: 'Jayanagar, Bengaluru',
        state: 'Karnataka',
        bedrooms: 4,
        bathrooms: 4,
        area: 3000,
        type: 'Sale',
        propertyCategory: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
        description: 'Independent house on 30x40 site. North-facing, vastu compliant, prime location.',
        contactName: 'Suresh Nair',
        contactPhone: '9712345678',
      },
      {
        title: '2BHK Apartment in HSR Layout',
        price: 6800000,
        location: 'HSR Layout, Bengaluru',
        state: 'Karnataka',
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        type: 'Sale',
        propertyCategory: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
        description: 'Ready to move 2BHK in a prime location. Car parking included.',
        contactName: 'Meena Iyer',
        contactPhone: '9988776655',
      },
      {
        title: 'Commercial Space in MG Road',
        price: 120000,
        location: 'MG Road, Bengaluru',
        state: 'Karnataka',
        bedrooms: 0,
        bathrooms: 2,
        area: 1800,
        type: 'Rent',
        propertyCategory: 'Commercial',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
        description: 'Prime commercial office space in the heart of the city. High footfall area.',
        contactName: 'Vikram Singh',
        contactPhone: '9001122334',
      },
    ];

    const inserted = await Property.insertMany(sampleProperties);
    res.status(201).json({
      success: true,
      message: `${inserted.length} properties seeded successfully`,
      data: inserted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  seedProperties,
};

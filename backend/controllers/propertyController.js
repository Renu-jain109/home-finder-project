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

// @desc    Get properties by owner ID
// @route   GET /api/properties/my
const getMyProperties = async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return res.status(400).json({ success: false, message: 'ownerId is required' });
    }

    const properties = await Property.find({ ownerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
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
  getMyProperties,
};

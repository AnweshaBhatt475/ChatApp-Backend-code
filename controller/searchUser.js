const UserModel = require('../models/UserModel');

async function searchUser(request, response) {
  try {
    const { search } = request.body;

    const query = search && search.trim() !== ''
      ? {
          $or: [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
          ],
        }
      : {}; // If search is empty, fetch all users

    const users = await UserModel.find(query)
      .select('-password')
      .limit(10); // optional: limit results

    return response.status(200).json({
      message: 'Users fetched successfully',
      data: users,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || 'Internal server error',
      error: true,
    });
  }
}

module.exports = searchUser;
const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async store(request, response) {

    const { username } = request.body;

    const existDev = await Dev.findOne({ user: username });

    if (existDev) {
      return response.json(existDev);
    }

    const accountGitHub = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = accountGitHub.data;

    const newDev = await Dev.create({
      name: name,
      user: username,
      bio: bio,
      avatar: avatar
    });

    return response.json(newDev);
  },

  async index(request, response) {

    const { user } = request.headers;

    const loggerdDev = await Dev.findById(user);

    const devList = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggerdDev.likes } },
        { _id: { $nin: loggerdDev.dislikes } },
      ],
    });

    return response.json(devList);
  }
};
const Dev = require("../models/Dev");

module.exports = {
  async store(request, response) {

    const loggedDev = await Dev.findById(request.headers.user);

    const targetDev = await Dev.findById(request.params.devId);

    if (!targetDev) {
      return response.status(400).json({ error: "dev not exists" });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      console.log("Deu match");
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return response.json(loggedDev);
  }
};
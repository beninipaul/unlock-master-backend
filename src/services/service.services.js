const Service = require("../models/Service");

const addService = async (service) => {
  const savedService = new Service(service);
  return await savedService.save();
};

const getService = async () => {
  return await Service.find();
};

const getSpecificService = async (serviceId) => {
  return await Service.findById(serviceId);
};

const updateService = async (serviceId, service) => {
  return await Service.findByIdAndUpdate(serviceId, service, {
    new: true,
    nModified: true,
  });
};

module.exports = { addService, getService, getSpecificService, updateService };

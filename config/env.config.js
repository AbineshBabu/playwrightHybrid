const config = module.exports = {};


config.test = {
  baseUrl: 'https://testing.qaautomationlabs.com',
  services:{
    "service1":"https://restful-booker.herokuapp.com",
    "service2":"https://api.restful-api.dev/"
  }
};

config.accp = {
  baseUrl: 'https://accp.iris.ing.net/assisted',
   services:{
    "service1":"https://restful-booker.herokuapp.com",
    "service2":"https://restful-api.dev/"
  }
};

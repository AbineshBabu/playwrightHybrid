const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { testContext }=require('../helper/testContext')
const { ApiClient } = require('../helper/apiClient');
const { PostAuthPayload } = require('../payloads/post/postAuthPayload');
const { GetBookingIDsPayload } = require('../payloads/get/getBookingIdsPayload');
const { PostBookingPayload } = require('../payloads/post/postBookingPayload');
const { PutBookingPayload } = require('../payloads/put/putBookingPayload');
const { PatchBookingPayload } = require('../payloads/patch/patchBookingPayload');
const { logger } = require('../../utility/logger');


const postAuthPayload = new PostAuthPayload();
const getBookingIDsPayload =  new GetBookingIDsPayload();
const putBookingPayload = new PutBookingPayload();
const patchBookingPayload = new PatchBookingPayload();

let response;
let apiClient;

Given('I set service to {string}', async function (service) {
    
    testContext.set('serviceName',service);
    logger.info("default is "+testContext.get('serviceName'));
});

 
Given('user send a GET request to {string} endpoint', async function (endpoint) {
    apiClient = new ApiClient();

    response = await apiClient.get(endpoint);
    testContext.set('response',response);
});

Given('user send a GET request to {string} endpoint with path parameter as {string}', async function (endpoint,pathParameter) {
    apiClient = new ApiClient();
    response = await apiClient.get(`${endpoint}/${pathParameter}`);
    testContext.set('response',response);
});

Given('user send a POST request to {string} endpoint', async function (endpoint) {
    const postBookingPayload = new PostBookingPayload();

    apiClient = new ApiClient();
    if(endpoint == "/auth"){
        response = await apiClient.post(endpoint, postAuthPayload.build());
    }
    else if(endpoint == "/booking"){
        response = await apiClient.post(endpoint, postBookingPayload.build());
    }

    testContext.set('response',response);
});

Then('user send a POST request to {string} endpoint further', async function (endpoint) {
    apiClient = new ApiClient();
    if(endpoint == "/auth"){
        response = await apiClient.post(endpoint, postAuthPayload.build());
    }
    else if(endpoint == "/booking"){
        response = await apiClient.post(endpoint, postBookingPayload.build());
    }
    testContext.set('response',response);
});

Given('user send a PUT request to {string}', async function (endpoint) {
    // console.log("put testing");
    logger.info("sending PUT request to "+endpoint);

    testContext.set('firstname',putBookingPayload.getfirstname());

    apiClient = new ApiClient();
    response = await apiClient.put(endpoint, putPayload.build());
});



Then('user send a DELETE request to {string} endpoint with path parameter as {string}', async function (endpoint,bookingId) {

    apiClient = new ApiClient();
    response = await apiClient.delete(`${endpoint}/${bookingId}`, {
      Cookie: `token=${token}`,
      Accept: '*/*',
    });
});

Then('user send a DELETE request to {string} endpoint with path parameter of recent creation', async function (endpoint) {
    
    logger.info("sending DELETE request to "+endpoint);

    apiClient = new ApiClient();
    response = await apiClient.delete(`${endpoint}/${testContext.get('bookingid')}`, {
      Cookie: `token=${testContext.get('token')}`,
      Accept: '*/*',
    });

    testContext.set('response',response);
});

 

Then('user send a PUT request to {string} endpoint with path parameter as {string}', async function (endpoint,bookingId) {
    // console.log("put testing");
    
    logger.info("sending PUT request to "+endpoint);
    testContext.set('firstname',putBookingPayload.getfirstname());

    apiClient = new ApiClient();
    response = await apiClient.put(`${endpoint}/${bookingId}`, putBookingPayload.build() ,{
      Cookie: `token=${token}`,
      Accept: '*/*',
    });
});

Then('user send a PUT request to {string} endpoint with path parameter of recent creation', async function (endpoint) {    
    logger.info("sending PUT request to "+endpoint);
    testContext.set('firstname',putBookingPayload.getfirstname());

    apiClient = new ApiClient();
    response = await apiClient.put(`${endpoint}/${testContext.get('bookingid')}`, putBookingPayload.build() ,{
      Cookie: `token=${testContext.get('token')}`,
      Accept: '*/*',
    });

    testContext.set('response',response);
});



Then('user send a PATCH request to {string} endpoint with path parameter as {string}', async function (endpoint,bookingId) {
    // console.log("patch testing");
    
    logger.info("sending PATCH request to "+endpoint);

    patchBookingPayload.setfirstname("John").setlastname("win");
    testContext.set('firstname',patchBookingPayload.getfirstname());

    apiClient = new ApiClient();
    response = await apiClient.patch(`${endpoint}/${bookingId}`, patchBookingPayload.build(["firstname","lastname"]) ,{
      Cookie: `token=${token}`,
      Accept: '*/*',
    });
});

Then('user send a PATCH request to {string} endpoint with path parameter of recent creation', async function (endpoint) {
    
    logger.info("sending PATCH request to "+endpoint);

    patchBookingPayload.setfirstname("John").setlastname("win");
    testContext.set('firstname',patchBookingPayload.getfirstname());

    apiClient = new ApiClient();
    response = await apiClient.patch(`${endpoint}/${testContext.get('bookingid')}`, patchBookingPayload.build(["firstname","lastname"]) ,{
      Cookie: `token=${testContext.get('token')}`,
      Accept: '*/*',
    });

    testContext.set('response',response);
});

Then('the response status should be {string}', async function (statusCode) {
    expect(response.status()).toBe(parseInt(statusCode));
});


Then('the response should contain {string} for GET booking request', async function (value) {

    const json=await (testContext.get('response')).json();

    getBookingIDsPayload.setBookings(json);

    const hasProperty = json.some(obj => obj.hasOwnProperty(value));
    expect(hasProperty).toBe(true);
});

Then('the response should contain {string} for GET booking request by id', async function (value) {
    const json = await (testContext.get('response')).json();

    
    expect(json).toHaveProperty(value);
});


Then('the response should contain {string} for POST auth request', async function (value) {
    const json = await (testContext.get('response')).json();
    postAuthPayload.setToken(json.token)
    
    const token=postAuthPayload.getToken();
    testContext.set('token',token)

    expect(json).toHaveProperty(value);
});



Then('the response should contain {string} for POST booking request', async function (value) {
    const json = await (testContext.get('response')).json();
    const postBookingPayload=new PostBookingPayload();

    postBookingPayload.updateFromResponse(json);

    testContext.set('bookingid',postBookingPayload.getBookingID());

    expect(json).toHaveProperty(value);
});



Then('the response should contain {string} for DELETE booking request', async function (value) {
    const text = await (testContext.get('response')).text();

    expect(text.includes(value)).toBe(true);
});



Then('the response should contain ṭhe updated {string} for PUT booking request', async function (value) {
    const json = await (testContext.get('response')).json();
    putBookingPayload.updateFromResponse(json);
    console.log(JSON.stringify(json))
    expect(json).toHaveProperty(value);
    expect(putBookingPayload.getfirstname()).toBe(testContext.get('firstname'));
});

Then('the response should contain ṭhe updated {string} for PATCH booking request', async function (value) {
    const json = await (testContext.get('response')).json();
    patchBookingPayload.updateFromResponse(json);
    expect(json).toHaveProperty(value);

    expect(patchBookingPayload.getfirstname()).toBe(testContext.get('firstname'));
});

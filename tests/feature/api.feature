Feature: API Testing for CRUD operations

  @api @P1
  Scenario: Verify GET booking request
    Given I set service to "service1"
    When user send a GET request to "/booking" endpoint
    When the response status should be "200"
    Then the response should contain "bookingid" for GET booking request

  @api
  Scenario: Verify GET booking request by id
    Given I set service to "service1"
    When user send a GET request to "/booking" endpoint with path parameter as "85"
    When the response status should be "200"
    Then the response should contain "firstname" for GET booking request by id

  @api
  Scenario: Verify POST auth request
    Given I set service to "service1"
    When user send a POST request to "/auth" endpoint
    When the response status should be "200"
    Then the response should contain "token" for POST auth request

  @api
  Scenario: Verify POST booking request
    Given I set service to "service1"
    When user send a POST request to "/booking" endpoint
    When the response status should be "200"
    Then the response should contain "bookingid" for POST booking request

  @api @P1
  Scenario: Verify PUT booking request
    Given I set service to "service1"
    When user send a POST request to "/booking" endpoint
    Then the response status should be "200"
    Then the response should contain "bookingid" for POST booking request
    Then user send a POST request to "/auth" endpoint further
    Then the response status should be "200"
    Then the response should contain "token" for POST auth request
    Then user send a PUT request to "/booking" endpoint with path parameter of recent creation
    Then the response status should be "200"
    Then the response should contain ṭhe updated "firstname" for PUT booking request

  @api @P1
  Scenario: Verify PATCH booking request
    Given I set service to "service1"
    When user send a POST request to "/booking" endpoint
    Then the response status should be "200"
    Then the response should contain "bookingid" for POST booking request
    Then user send a POST request to "/auth" endpoint further
    Then the response status should be "200"
    Then the response should contain "token" for POST auth request
    Then user send a PATCH request to "/booking" endpoint with path parameter of recent creation
    Then the response status should be "200"
    Then the response should contain ṭhe updated "firstname" for PATCH booking request

  @api @P1
  Scenario: Verify DELETE booking request
    Given I set service to "service1"
    When user send a POST request to "/booking" endpoint
    Then the response status should be "200"
    Then the response should contain "bookingid" for POST booking request
    Then user send a POST request to "/auth" endpoint further
    Then the response status should be "200"
    Then the response should contain "token" for POST auth request
    Then user send a DELETE request to "/booking" endpoint with path parameter of recent creation
    Then the response status should be "201"
    Then the response should contain "Created" for DELETE booking request
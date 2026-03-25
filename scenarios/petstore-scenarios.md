# PetStore API Behavioral Checks – Test Map

## Feature Description

PetStore API provides functionality to manage pets in a store. These checks verify that pets can be added, retrieved, updated, and deleted correctly.

---

## Test Scenarios

### pst-001 - should add a new pet to the store

**Steps:**

1. Define a new pet with a unique ID, name (e.g., "Buddy"), and other attributes.
2. Send a POST request to the `pet` endpoint with the pet payload.
3. Verify the response status is 200 OK.
4. Verify the response body contains the correct pet name.

---

### pst-002 - should find pet by id

**Steps:**

1. Use an existing pet ID (e.g., from a previously created pet).
2. Send a GET request to the `pet/{petId}` endpoint.
3. Verify the response status is 200 OK.
4. Verify the response body contains the correct pet ID.

---

### pst-003 - should update pet status

**Steps:**

1. Use an existing pet object and update its status (e.g., to "pending").
2. Send a PUT request to the `pet` endpoint with the updated pet payload.
3. Verify the response status is 200 OK.
4. Verify the response body contains the updated status.

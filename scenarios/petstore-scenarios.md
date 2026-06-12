# PetStore API Behavioral Checks – Test Map

## Feature Description

The PetStore API manages pets, store orders, and users. These checks verify each domain
behaves correctly across create / read / update / delete and auth flows. Every test creates
the data it needs and reads it back within the same test (the public sandbox does not persist
reliably), polling with `toPass()` for eventual consistency.

---

## Pet — `tests/api/petstore.test.ts`

### pst-001 - create an available pet then read it back
1. Build a pet payload with status `available`.
2. POST `/v2/pet`; expect 200, and the echoed name + status to match.
3. GET `/v2/pet/{id}` (polled); expect 200 and the id + name to match.

### pst-002 - create a pending pet then read it back
1. As pst-001 but with status `pending`.

### pst-003 - update a created pet's name and status
1. Create a pet and read it back.
2. PUT `/v2/pet` with a new name and status `sold`; expect the echoed values to match.
3. GET `/v2/pet/{id}` (polled); expect the name to reflect the update.

### pst-004 - delete a created pet then confirm it is gone
1. Create a pet and read it back.
2. DELETE `/v2/pet/{id}`; expect 200.
3. GET `/v2/pet/{id}`; expect 404.

### pst-005-{available|pending|sold} - findByStatus returns only matching pets
1. Seed a pet with the target status.
2. GET `/v2/pet/findByStatus?status=...`; expect 200 and an array.
3. Soft-assert that no returned pet carries a different status.

---

## Store — `tests/api/store.test.ts`

### sto-001 - place an order then read it back
1. Build an order payload with status `placed`.
2. POST `/v2/store/order`; expect 200 and echoed status + complete flag.
3. GET `/v2/store/order/{id}` (polled); expect 200 and the id to match.

### sto-002 - place an approved order then read it back
1. As sto-001 but with status `approved`.

### sto-003 - place an order then delete it
1. Place an order and read it back.
2. DELETE `/v2/store/order/{id}`; expect 200.
3. GET `/v2/store/order/{id}`; expect 404.

### sto-004 - inventory returns a status to count map
1. GET `/v2/store/inventory`; expect 200.
2. Expect at least one bucket and every count to be an integer.

---

## User — `tests/api/user.test.ts`

### usr-001 - create a user then read it back
1. Build a user payload with a unique username.
2. POST `/v2/user`; expect 200 and envelope `code` 200.
3. GET `/v2/user/{username}` (polled); expect 200 and the username to match.

### usr-002 - update a created user then read it back
1. Create a user and read it back.
2. PUT `/v2/user/{username}` with a new email.
3. GET `/v2/user/{username}` (polled); expect the email to reflect the update.

### usr-003 - delete a created user then confirm it is gone
1. Create a user and read it back.
2. DELETE `/v2/user/{username}`; expect 200.
3. GET `/v2/user/{username}`; expect 404.

### usr-004 - create a user then log in and out
1. Create a user.
2. GET `/v2/user/login` (polled); expect 200 and a "logged in" message.
3. GET `/v2/user/logout`; expect 200.

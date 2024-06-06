# Tests for Assignment 1

## Installation
- Clone this repository
- cd into the repository and run
  ```bash
  npm install
  ```

## Before you run the tests
ensure the following 3 things:
  - your assignment is running on port 4000
  - your router matches `/api/rounds`
  - the first element of the rounds array matches
    ```json
    {
      "id": 1,
      "course": "emerald links",
      "username": "steve",
      "scores": [6, 4, 3, 5, 5, 6, 3, 5, 5, 4, 5, 5, 6, 4, 3, 4, 4, 3]
    }
    ```
## Running the tests
run the following command to start the tests. There should be 16 tests run
```bash
npm run test
```

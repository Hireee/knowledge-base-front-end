# mocllect_backend

`mocllect_backend` is a backend service for the mocllect application, built with TypeScript and Express. This project includes various dependencies for handling authentication, file uploads, database interactions, and more.

## Getting Started

To get started with the backend, follow these steps:

### Prerequisites

- Node.js (version 14.x or later)
- TypeScript

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/mocllect_backend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd mocllect_backend
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Project

You can run the project in different modes:

- **Development Mode:**

    ```bash
    npm run dev
    ```

- **Local Mode:**

    ```bash
    npm run local
    ```

- **Build and Start:**

    ```bash
    npm start
    ```

### Scripts

- `build`: Compiles the TypeScript code to JavaScript.
- `dev`: Compiles the TypeScript code and starts the server with `nodemon` for development.
- `local`: Alias for `dev`, for local development.
- `start`: Builds the project and starts the server.
- `test`: Placeholder script for running tests.

### Dependencies

The project includes a variety of dependencies:

- **Express and Middleware**: `express`, `body-parser`, `compression`, `cors`, `morgan`, `express-fileupload`, `multer`
- **Authentication**: `bcrypt`, `bcryptjs`, `jsonwebtoken`, `passport`
- **Database**: `sequelize`, `sequelize-cli`, `mysql2`
- **Utility Libraries**: `axios`, `lodash`, `uuid`, `joi`, `node-cron`, `node-input-validator`, `node-scp`, `path`
- **TypeScript Development**: `typescript`, `ts-node`, `nodemon`, `rimraf`

### Development

For development, the project uses:

- **TypeScript**: For static typing and transpiling.
- **Nodemon**: For automatic server restarts during development.
- **Rimraf**: For cross-platform file deletion.

### Contributing

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with a clear description of your changes.

### License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify the README to fit the specific needs and details of this project!

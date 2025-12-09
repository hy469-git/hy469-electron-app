# Electron MQTT & Socket Template

This project is a template designed to demonstrate how to use MQTT and WebSockets within an Electron renderer process. It serves as a starting point for understanding real-time communication in desktop applications.

## Installation

1.  Open a terminal in the project root directory.
2.  Install the dependencies:

    ```bash
    npm install
    ```

## Configuration

The project configuration is located in `config.json` in the root directory. You can modify this file to change how the application connects to services and where it loads the frontend from.

### `config.json` Settings

-   **`frontend_ip`**: The URL or file path of the frontend application to load in the Electron window.
    -   **Simple HTML/JS**: If you are using a simple HTML file (like the one provided in `_instructor_resources`), use the `file://` protocol with the absolute path.
        -   Example: `file:///C:/Users/YourName/Desktop/project/_instructor_resources/index.html`
    -   **Frameworks (Angular/React/Vue)**: If you are developing your frontend with a framework that runs a local development server, use the `http://` URL.
        -   Example: `http://localhost:4200` (Angular) or `http://localhost:3000` (React).
-   **`socket_url`**: The URL of the Socket.io server.
    -   Default: `http://localhost:3301`
-   **`mqtt_broker`**: The URL of the MQTT broker.
    -   Default: `mqtt://test.mosquitto.org` (Public test broker)
-   **`mqtt_topic`**: The MQTT topic to subscribe/publish to.
    -   Default: `pc2`
-   **`enable_socket`**: Set to `true` to enable Socket.io connection.
-   **`enable_mqtt`**: Set to `true` to enable MQTT connection.

## Running the Project

To start the Electron application:

```bash
npm start
```

This command will launch the Electron window and load the content specified in `frontend_ip`.

## Instructor Resources

The `_instructor_resources` folder contains example files to help you test connectivity and understand the basic setup.

### Testing Connectivity

A script `test_connectivity.js` is provided to verify that your MQTT and Socket connections are working independently of Electron.

To run the test script:

1.  Open a terminal.
2.  Navigate to the instructor resources folder:
    ```bash
    cd _instructor_resources
    ```
3.  Run the script:
    ```bash
    node test_connectivity.js
    ```

### Example Frontend

The `index.html` file in `_instructor_resources` is a basic example of a frontend that can be loaded into Electron. It demonstrates how to include the necessary scripts and handle basic UI. You can use this as a reference or a starting point if you are not using a frontend framework.

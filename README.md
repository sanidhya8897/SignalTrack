SignalTrack is a lightweight and user-friendly web application designed to help users view and analyze their system error logs efficiently. The primary objective of this project is to provide a simple interface for users to log in, fetch, and review backend error data without requiring technical expertise or complex tools.

When a user opens the website, they are greeted with a clean and minimal login interface containing a text field for entering the User ID, a login button, and a message area for displaying validation or error messages. The frontend ensures that the User ID is provided before sending a login request to the backend API. Upon successful login, the system hides the login form, stores the user’s ID in local storage, and displays a personalized welcome message. If the login fails, an appropriate error message appears, prompting the user to re-enter valid details.

Once authenticated, users can access the query section, where they can click the “View My Errors” button to fetch their recorded errors from the backend. The system sends a GET request containing the user’s ID to retrieve a list of errors in JSON format. Each error entry includes an ID, timestamp, service name, error type, and stack trace. The data is then displayed neatly in a tabular format for easy review. If there are no errors found, the interface communicates this clearly to the user.

Additionally, SignalTrack features a simple session management system using browser local storage and a “Logout” button that clears stored data, returning the user to the login screen.

Built with HTML, CSS, and JavaScript for the frontend and powered by a lightweight backend API, SignalTrack delivers an efficient and intuitive experience for monitoring and managing error data.

# meet-pet

Readme for this project

## Django cheat sheet

As with every python project/lib, you need to create venv and install dependencied located in requirements.txt file.
After that django requires you to create database, simply run `./manage.py migrate`. Then you are good to go, run
`./manage.py runserver` to start Django server!.

### `./manage.py makemigrations`
This creates migrations needed to be applied to the database. They are located in mock_api/api/migrations folder.
This is required to do after changing/adding models to mock_api/api/models.py file.

### `./manage.py migrate`
Applies migrations which are not yet in database.

### `./manage.py createsuperuser`
Creates super user credentials for accessing admin page, located at http://localhost:8000 .

### `./manage.py runserver`
Runs the development server.

### Api documentation
Documentation for existing api calls is be located at http://localhost:8000/api . This is the same path to which
api calls will be directed (Django differentiates between web browser and javascript calls, and serves according representations).
This documentation can be accessed with credentials normally used in app (same db), and interactive portion of it
should yield same results as if called from JS.

**Note: Because documentation uses cookie based auth and frontend uses token you will encountr strange behaviour when logged in
both ways at the same time (calls from frontend will yield errors). Logout from admin/documentation page before trying out frontend
actions, or simply use admin/documentation in private/incognito mode, as this will keep cookie in separate instance of web browser.**


## Available Scripts for frontend

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

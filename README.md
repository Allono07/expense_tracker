# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

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

## Deploying to Vercel

This project builds with Create React App and can be deployed to Vercel easily.

Quick steps (Dashboard)
- Push your repository to GitHub/GitLab/Bitbucket.
- Go to https://vercel.com, sign in, and click "New Project" -> Import your repo.
- Vercel usually detects Create React App and sets the build command to `npm run build` and the output directory to `build`.

Managing environment variables (Client-side)
- In Vercel, go to your Project -> Settings -> Environment Variables.
- Add a variable named `REACT_APP_GOOGLE_CLIENT_ID` with your Google OAuth client ID. Set it for the environments you need (Preview / Production).
- After adding or changing env vars, trigger a new deployment (Vercel will redeploy automatically when you push or you can trigger a redeploy from the dashboard).

Managing environment variables (CLI)
- Install the Vercel CLI: `npm i -g vercel`
- Login: `vercel login`
- Link a project (from your repo directory): `vercel link`
- Add an environment variable:

	vercel env add REACT_APP_GOOGLE_CLIENT_ID production

	The CLI will prompt you for the value and the target environment (development, preview, production).

Google OAuth production setup
- In the Google Cloud Console (APIs & Services -> Credentials), add your Vercel deployment URL to the "Authorized JavaScript origins" and any redirect URIs used in your OAuth flow (for example: `https://your-project-name.vercel.app`).

Notes
- Because Create React App inlines `REACT_APP_*` env vars at build time, make sure the variable is set in Vercel before the build runs. If you add it after a deployment, trigger a redeploy.
- Do not commit your `.env` file to source control; use Vercel Dashboard or CLI to manage production secrets.
# expense_tracker

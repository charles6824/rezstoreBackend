# Rezstore web App
An E-Commerce app made with React frontend and Node Js backend

# Getting Started
Follow these steps to get it running on your browser

* Create an env file containing your database Uri and JWT Secret. It should be in this format: `MONGO_URI2 = mongodb://127.0.0.1:27017/rezStore` and `JWT_SECRET = abctrjbn4789nnfjkkb`
* Open your command prompt, navigate to the frontend folder and run `npm install`. This will install all react packages used.
* Navigate to the root folder and run `npm install`. It will install the ones used for the whole project. (Backend especially).
* After the above steps, it is important you run `npm run data:import` to import some data that will be sent to the database for usage. The data includes users and products.
* Run `npm run dev` to run both the frontend and backend at the same time.
* If you want to run it differently, run `npm run server` for the backend and `npm run client` for the frontend.

Note: Running this must be on the root folder.

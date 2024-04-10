import { db } from "../database/firebaseConnect.js";

export async function authenticate(req, res, next) {
    try {
      const authheader = req.headers['authorization'];
      if (!authheader) {
        let err = new Error('You are not authenticated! No header present');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        throw err;
      }
      const decodedCreds = Buffer.from(authheader.split(' ')[1],'base64').toString();
      const [code, pass] = decodedCreds.split(':');
      const docReq = await db.collection("quizzes").doc(code).get();
      const data = docReq.data();
      if (data == null) {
        let err = new Error("No such document");
        console.log("no such document");
        err.status = 400;
        throw err;
      }
      if (pass == data.password) {
        req.quizData = data; // Attach the authenticated data to the request object
        next(); // Call next to move to the next middleware or route handler
      } else {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        throw err;
      }
    } catch(err) {
      console.log(err);
      res.status(err.status).send({ message: "Authentication Error", error: err.message });
    }
  }

  export async function admin(req, res, next) {
    try {
      const authheader = req.headers['authorization'];
      if (!authheader) {
        let err = new Error('You are not authenticated! No header present');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        throw err;
      }
      const decodedCreds = Buffer.from(authheader.split(' ')[1],'base64').toString();
      const [user, pass] = decodedCreds.split(':');
      if (user == process.env.ADMIN_USER && pass == process.env.ADMIN_PASS) {
        next()
      } else {
        console.log(user, pass)
        let err = new Error('Invalid Credentials');
        err.status = 401;
        throw err;
      }
    } catch (err) {
      console.log(err)
    }
  }
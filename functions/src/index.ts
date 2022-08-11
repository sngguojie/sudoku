import * as functions from 'firebase-functions';
import { generateSolvedPuzzle, generateUnsolvedTruePuzzle } from '@melvynsng/sudoku-utils'
import * as corsModule from 'cors'
const cors = corsModule(({ origin: true }))

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const generatePuzzle = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const puzzle = generateUnsolvedTruePuzzle(generateSolvedPuzzle())
    response.send({ data: puzzle });
  })
  // response.header("Access-Control-Allow-Origin", "*");
  // response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // const puzzle = generateUnsolvedTruePuzzle(generateSolvedPuzzle())
  // response.send(puzzle);
});
import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import data from "../data/questions.json";

const Status = Object.freeze({
  LOADING: "loading",
  ERROR: "error",
  READY: "ready",
  ACTIVE: "active",
  FINISHED: "finished",
});

const initialState = {
  questions: [],
  status: Status.LOADING,
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload.questions, status: Status.READY };

    // case "dataFailed":
    //   console.log("Error fetching data");
    //   return { ...state, status: Status.ERROR };

    case "start":
      return { ...state, status: Status.ACTIVE };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption ? state.points + question.points : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: Status.FINISHED,
        highscore: state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: Status.READY };

    default:
      throw new Error("Action unknown");
  }
}

/**
 *
 * Main App
 *
 */
export default function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  // useEffect(function () {
  //   fetch("http://localhost:8000/questions")
  //     .then((res) => res.json())
  //     .then((data) => dispatch({ type: "dataReceived", payload: data }))
  //     .catch((err) => dispatch({ type: "dataFailed" }));
  // }, []);

  // Dispatching directly from the JSON file
  useEffect(() => {
    dispatch({ type: "dataReceived", payload: data });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === Status.LOADING && <Loader />}
        {status === Status.ERROR && <Error />}
        {status === Status.READY && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === Status.ACTIVE && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === Status.FINISHED && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

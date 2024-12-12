import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // On Mount
  useEffect(
    function () {
      const id = setInterval(() => dispatch({ type: "tick" }), 1000);

      // Cleanup
      return () => clearInterval(id);
    },
    [dispatch]
  );

  return (
    <div className="timer">
      <span className={secondsRemaining < 30 ? "time_runningout" : ""}>
        {minutes < 10 && "0"}
        {minutes}:{seconds < 10 && "0"}
        {seconds}
      </span>
    </div>
  );
}

export default Timer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

//Refactored but, without the CSS. I think the logic is most important which is indeed working. Have to get a move on so didn't fiddle with factoring in the CSS.

const JokeList = ({ numJokesToGet }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const fetchJokes = async () => {
      try {
          const seenJokes = new Set();
          let newJokes = [];

          while (newJokes.length < numJokesToGet) {
              const res = await axios.get("https://icanhazdadjoke.com", {
                  headers: { Accept: "application/json" }
              });
              const joke = res.data;

              if (!seenJokes.has(joke.id)) {
                  seenJokes.add(joke.id);
                  newJokes.push({ ...joke, votes: 0 });
              } else {
                  console.log("Duplicate joke found!");
              }
          }

          setJokes(prevJokes => [...prevJokes, ...newJokes]);
          setLoading(false);
      } catch (err) {
          console.error(err);
          setLoading(false);
      }
  };

  useEffect(() => {
      if (hasMounted) {
          fetchJokes();
      } else {
          setHasMounted(true);
      }
  }, [hasMounted, numJokesToGet]);

  const handleClick = () => {
      setLoading(true);
      setJokes([]);
      fetchJokes();
  };

  const vote = (id, delta) => {
      setJokes(prevJokes =>
          prevJokes.map(joke =>
              joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
          )
      );
  };

  return (
      <div>
          <button onClick={handleClick} disabled={isLoading}>
              {isLoading ? "Loading..." : "Get New Jokes"}
          </button>

          {jokes.map(joke => (
              <Joke
                  key={joke.id}
                  id={joke.id}
                  votes={joke.votes}
                  text={joke.joke}
                  vote={vote}
              />
          ))}
      </div>
  );
};

JokeList.defaultProps = {
  numJokesToGet: 5
};

export default JokeList;

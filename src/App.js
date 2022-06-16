import React, { useEffect, useState } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
  const [tasks, setTasks] = useState([]);

  const transformTasks = (tasksObj) => {
    const loadedTasks = [];

    for (const taskKey in tasksObj) {
      loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
    }

    setTasks(loadedTasks);
  };

  const {
    isLoading,
    error,
    sendRequest: fetchTasks,
  } = useHttp(
    {
      url: 'https://rcg-star-wars-http-default-rtdb.europe-west1.firebasedatabase.app/tasks.json',
    },
    transformTasks
  );

  // const { isLoading, error, sendRequest } = httpData;

  // fetchTask as a dependency creates an infinite loop right now:

  // fetchTasks() is called.
  // sendRequest function will be executed in custom hook.
  // sendRequest will set some states.
  // When the states are set, the App component (where the custom hook is used)
  // will be re-rendered.

  // Because when you use a custom hook, which uses a state,
  // and you use that state in a component,
  // that component will implicitly use that state set up in the custom hook

  // i.e the state configured in the custom hook,
  // is attached to the component where you use the custom hook

  // And then App component will call the custom hook again
  // sendRequest function will be re-created
  // new function object will be returned (sendRequest -> fetchTasks)
  // Then, useEffect will run again

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;

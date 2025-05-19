import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, editTask, deleteTask, toggleCompletion }) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <Task 
          key={index} 
          index={index} 
          task={task} 
          editTask={editTask} 
          deleteTask={deleteTask} 
          toggleCompletion={toggleCompletion} 
        />
      ))}
    </ul>
  );
};

export default TaskList;
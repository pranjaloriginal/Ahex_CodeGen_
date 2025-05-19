import React, { useState } from 'react';

const Task = ({ task, index, editTask, deleteTask, toggleCompletion }) => {
  const [isEditing, setEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleEdit = () => {
    editTask(index, newText);
    setEditing(false);
  };

  return (
    <li style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
      {isEditing ? (
        <span>
          <input 
            type="text" 
            value={newText} 
            onChange={(e) => setNewText(e.target.value)} 
          />
          <button onClick={handleEdit}>Save</button>
        </span>
      ) : (
        <span>
          {task.text}
          <button onClick={() => setEditing(true)}>Edit</button>
        </span>
      )}
      <button onClick={() => deleteTask(index)}>Delete</button>
      <button onClick={() => toggleCompletion(index)}>
        {task.completed ? 'Undo' : 'Complete'}
      </button>
    </li>
  );
};

export default Task;
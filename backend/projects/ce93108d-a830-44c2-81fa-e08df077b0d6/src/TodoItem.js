import React, { useState } from 'react';

const TodoItem = ({ todo, updateTodo, deleteTodo, toggleComplete }) => {
    const [isEditing, setEditing] = useState(false);
    const [input, setInput] = useState(todo.text);

    const handleUpdate = () => {
        updateTodo({ ...todo, text: input });
        setEditing(false);
    };

    return (
        <li>
            <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => toggleComplete(todo.id)} 
                aria-label={`Mark ${todo.text} as completed`} 
            />
            {isEditing ? (
                <>
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                    />
                    <button onClick={handleUpdate}>Update</button>
                </>
            ) : (
                <span style={{ textDecoration: todo.completed ? 'line-through' : '' }}>{todo.text}</span>
            )}
            <button onClick={() => setEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
    );
};

export default TodoItem;
import React from 'react';

const TodoItem = ({ todo, toggleTodo, deleteTodo }) => {
    return (
        <li>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={toggleTodo}
                aria-label={`Mark ${todo.text} as completed`}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
            <button onClick={deleteTodo} aria-label={`Delete ${todo.text}`}>Delete</button>
        </li>
    );
};

export default TodoItem;
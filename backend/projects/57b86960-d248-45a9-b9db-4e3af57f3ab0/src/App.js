import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        setTodos(storedTodos);
    }, []);

    const addTodo = () => {
        if (!input) return;
        const newTodos = [...todos, { text: input, completed: false }];
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
        setInput('');
    };

    const toggleTodo = index => {
        const newTodos = todos.map((todo, i) => i === index ? { ...todo, completed: !todo.completed } : todo);
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    const deleteTodo = index => {
        const newTodos = todos.filter((_, i) => i !== index);
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                aria-label="New todo item"
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        <span onClick={() => toggleTodo(index)}>{todo.text}</span>
                        <button onClick={() => deleteTodo(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
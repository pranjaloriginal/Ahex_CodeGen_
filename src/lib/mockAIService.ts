
// This file simulates a Python LangGraph + OpenAI integration

interface AIResponse {
  message: string;
  code?: string;
}

// Mock delay function to simulate API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sample code snippets
const codeSnippets: Record<string, string> = {
  "hello": `<div class="hello-world">
  <h1>Hello, World!</h1>
  <p>This is a simple greeting component.</p>
</div>`,
  "button": `<button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded">
  Click Me
</button>`,
  "counter": `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Counter: {count}</h2>
      <div className="flex space-x-4">
        <button 
          onClick={() => setCount(count - 1)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Decrease
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Increase
        </button>
      </div>
    </div>
  );
}`,
  "langgraph": `from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END

# Define the state
class AgentState(TypedDict):
    messages: list[BaseMessage]
    next: str

# Define the LLM node
def llm_node(state):
    messages = state["messages"]
    llm = ChatOpenAI(model="gpt-4o-mini")
    response = llm.invoke(messages)
    return {"messages": messages + [response], "next": "router"}

# Define routing logic
def router(state):
    messages = state["messages"]
    last_message = messages[-1]
    if "generate code" in last_message.content.lower():
        return "code_generator"
    elif "finished" in last_message.content.lower():
        return END
    else:
        return "llm"

# Define code generator
def code_generator(state):
    messages = state["messages"]
    llm = ChatOpenAI(model="gpt-4o-mini")
    code_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a code generation assistant. Generate clean, efficient code."),
        ("user", "Generate code for: {query}")
    ])
    chain = code_prompt | llm
    query = messages[-2].content  # Get the user's request
    response = chain.invoke({"query": query})
    return {"messages": messages + [response], "next": END}

# Create the graph
workflow = StateGraph(AgentState)
workflow.add_node("llm", llm_node)
workflow.add_node("code_generator", code_generator)

# Add conditional edges
workflow.add_conditional_edges("router", router)
workflow.add_edge("llm", "router")
workflow.add_edge("code_generator", END)

# Set entry point
workflow.set_entry_point("llm")
app = workflow.compile()`,
  "todo": `import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">Todo App</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-purple-500"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button 
          onClick={addTodo}
          className="bg-purple-500 text-white px-4 py-2 rounded-r hover:bg-purple-600"
        >
          Add
        </button>
      </div>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-3 h-4 w-4 text-purple-500"
              />
              <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                {todo.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {todos.filter(t => t.completed).length} of {todos.length} tasks completed
        </div>
      )}
    </div>
  );
}`
};

// This function simulates the AI response generation
export async function generateAIResponse(prompt: string): Promise<AIResponse> {
  console.log("Generating AI response for:", prompt);
  
  // Simulate processing delay
  await delay(Math.random() * 1500 + 1000);
  
  // Simple keyword matching to simulate AI understanding
  const promptLower = prompt.toLowerCase();
  
  // Generate code if code-related keywords are present
  if (promptLower.includes('button') || promptLower.includes('click')) {
    return {
      message: "Here's a simple button component with hover effects using Tailwind CSS:",
      code: codeSnippets.button
    };
  } else if (promptLower.includes('counter') || promptLower.includes('increment')) {
    return {
      message: "I've created a counter component with increment and decrement functionality:",
      code: codeSnippets.counter
    };
  } else if (promptLower.includes('todo') || promptLower.includes('task list')) {
    return {
      message: "I've generated a ToDo application with add, complete, and delete functionality. Each task can be marked as complete or deleted:",
      code: codeSnippets.todo
    };
  } else if (promptLower.includes('langgraph') || promptLower.includes('python') || promptLower.includes('agent')) {
    return {
      message: "Here's a Python example using LangGraph with OpenAI integration to create an AI agent workflow:",
      code: codeSnippets.langgraph
    };
  } else if (promptLower.includes('hello')) {
    return {
      message: "Here's a simple Hello World component:",
      code: codeSnippets.hello
    };
  } else {
    return {
      message: "I'm your AI coding assistant powered by LangGraph and OpenAI. I can help you create code, design UI components, build features, and more. Try asking me to create something specific like 'Create a counter component' or 'Build a todo list app'."
    };
  }
}

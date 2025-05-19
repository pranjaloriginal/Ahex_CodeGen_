



# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import re
# from dotenv import load_dotenv
# from langchain_core.messages import AIMessage, HumanMessage
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_openai import ChatOpenAI
# from langgraph.graph import StateGraph, END
# from typing import TypedDict, List, Dict, Any

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Define the state
# class AgentState(TypedDict):
#     messages: List[Dict[str, str]]
#     next: str

# # Define the LLM node
# def llm_node(state):
#     print("LLM Node called")
#     messages = state["messages"]
#     print(f"LLM Node state: {len(messages)} messages")  # Debug log without full content for privacy
    
#     # Check if OpenAI API key is available
#     openai_api_key = os.getenv("OPENAI_API_KEY")
#     if not openai_api_key:
#         print("Warning: OPENAI_API_KEY not found in environment variables")
#         return {"messages": messages + [{"role": "ai", "content": "Error: OpenAI API key is missing. Please check your .env file."}], "next": END}
    
#     try:
#         # If request is about generating a project, use a specific system message
#         is_project_request = any("project" in msg.get("content", "").lower() and "github" in msg.get("content", "").lower() 
#                               for msg in messages if msg.get("role") == "user")
        
#         model = "gpt-4o-mini" if os.getenv("OPENAI_API_KEY") else "gpt-4o-mini"
        
#         # Create system message based on request type
#         system_message = None
#         if is_project_request:
#             system_message = HumanMessage(content="""You are a helpful coding assistant that generates complete project structures. 
#             When asked to create a project:
#             1. Generate a full project with multiple files and proper directory structure
#             2. Include a README.md with setup instructions
#             3. Format each file as ```filename.ext\ncode content\n```
#             4. Make sure the files are properly structured as they would be in a real project
#             5. Include package.json or requirements.txt as appropriate
#             6. Use modern best practices for the requested language/framework
#             """)
        
#         # Convert to LangChain message format
#         lc_messages = []
#         if system_message:
#             lc_messages.append(system_message)
            
#         for msg in messages:
#             if msg["role"] == "user":
#                 lc_messages.append(HumanMessage(content=msg["content"]))
#             else:
#                 lc_messages.append(AIMessage(content=msg["content"]))
        
#         llm = ChatOpenAI(model=model)
#         response = llm.invoke(lc_messages)
        
#         # Update messages with the AI response
#         updated_messages = messages + [{"role": "ai", "content": response.content}]
#         print("LLM Node completed successfully")
#         return {"messages": updated_messages, "next": "router"}
#     except Exception as e:
#         print(f"LLM Error: {str(e)}")
#         # Return an error message to the client
#         return {"messages": messages + [{"role": "ai", "content": f"An error occurred: {str(e)}"}], "next": END}

# # Define routing logic
# def router(state):
#     messages = state.get("messages", [])
#     if not messages:
#         return {"messages": messages, "next": END}

#     last_message = messages[-1]
#     content = last_message.get("content", "").lower()
#     role = last_message.get("role", "")

#     print(f"Router Processing: {role} message")  # Debug log

#     if role != "ai":
#         return {"messages": messages, "next": "llm"}

#     if "generate code" in content or "project" in content:
#         return {"messages": messages, "next": "code_generator"}

#     # Always return a dict with both messages and next
#     return {"messages": messages, "next": END}

# # Define code generator
# def code_generator(state):
#     messages = state["messages"]
#     print("Code Generator called")
#     print(f"Code Generator state: {len(messages)} messages")  # Debug log without full content
    
#     try:
#         # Check if this is a project generation request
#         is_project_request = any("project" in msg.get("content", "").lower() and "github" in msg.get("content", "").lower() 
#                               for msg in messages if msg.get("role") == "user")
        
#         model = "gpt-4o-mini" if os.getenv("OPENAI_API_KEY") else "gpt-4o-mini"
#         llm = ChatOpenAI(model=model)
        
#         # Find the last user message
#         user_messages = [m for m in messages if m["role"] == "user"]
#         if not user_messages:
#             return {"messages": messages, "next": END}
        
#         last_user_message = user_messages[-1]["content"]
        
#         # Choose prompt based on whether this is a project request
#         if is_project_request:
#             code_prompt = ChatPromptTemplate.from_messages([
#                 ("system", """You are a project generator that creates complete, working project structures ready for GitHub.
#                 Generate a full project with proper directory structure for the requested technology.
                
#                 Format your response with a brief explanation followed by all files needed, each wrapped in code blocks:
                
#                 ```filename.ext
#                 file content goes here
#                 ```
                
#                 Include:
#                 - A README.md with project description and setup instructions
#                 - All necessary configuration files (package.json, tsconfig.json, etc.)
#                 - Main source files with complete implementations
#                 - Proper directory structure as would be used in a professional project
                
#                 Make sure the project is complete and can be run after downloading."""),
#                 ("user", f"Generate a project for: {last_user_message}")
#             ])
#         else:
#             code_prompt = ChatPromptTemplate.from_messages([
#                 ("system", "You are a code generation assistant. Generate clean, efficient code based on the request. Format your response with ```language\ncode\n``` for code blocks."),
#                 ("user", f"Generate code for: {last_user_message}")
#             ])
        
#         chain = code_prompt | llm
#         response = chain.invoke({})
        
#         # Extract code from the response
#         code = response.content
        
#         # Update the response in messages
#         ai_response = messages[-1]["content"]
#         updated_response = f"{ai_response}\n\nHere's the code:\n{code}"
        
#         updated_messages = messages[:-1] + [{"role": "ai", "content": updated_response}]
#         print("Code Generator completed successfully")
        
#         return {"messages": updated_messages, "next": END}
#     except Exception as e:
#         print(f"Code Generator Error: {str(e)}")
#         return {"messages": messages + [{"role": "ai", "content": f"Error generating code: {str(e)}"}], "next": END}

# # Create the graph
# workflow = StateGraph(AgentState)

# # Add nodes
# workflow.add_node("llm", llm_node)
# workflow.add_node("code_generator", code_generator)
# workflow.add_node("router", router)

# # Add conditional edges
# workflow.add_conditional_edges(
#     "router",
#     lambda x: x["next"],  # Use a lambda that returns the "next" string value
#     {
#         "llm": "llm",
#         "code_generator": "code_generator",
#         END: END 
#     }
# )
# workflow.add_edge("llm", "router")
# workflow.add_edge("code_generator", END)

# # Set entry point
# workflow.set_entry_point("router")

# # Compile the graph
# app_graph = workflow.compile()

# @app.route('/api/chat', methods=['POST'])
# def chat():
#     try:
#         print("Chat API called")
#         data = request.json
        
#         # Get messages from the request
#         if 'message' in data and not data.get('messages'):
#             # Handle single message format
#             user_message = data['message']
#             all_messages = [{"role": "user", "content": user_message}]
#         else:
#             # Handle messages array format
#             all_messages = data.get('messages', [])
#             if 'message' in data:
#                 all_messages.append({"role": "user", "content": data['message']})
        
#         print(f"Processing message request with {len(all_messages)} messages")
        
#         # Run the graph
#         result = app_graph.invoke({"messages": all_messages})
        
#         # Extract the latest AI message
#         ai_message = result["messages"][-1]
        
#         # Check if code was generated
#         code = None
#         content = ai_message["content"]
        
#         # Simple code extraction - look for code blocks in markdown
#         if "```" in content:
#             parts = content.split("```")
#             for i in range(1, len(parts), 2):
#                 if i < len(parts):
#                     # This could be a code block
#                     code_block = parts[i].strip()
#                     if code_block and "\n" in code_block:
#                         # Extract the code without the language identifier
#                         code_lines = code_block.split("\n", 1)
#                         if len(code_lines) > 1:
#                             code = code_lines[1].strip()
#                             break
        
#         response = {
#             "message": ai_message["content"],
#             "code": code
#         }
        
#         return jsonify(response)
#     except Exception as e:
#         print(f"Chat API Error: {str(e)}")
#         import traceback
#         traceback.print_exc()
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({'status': 'ok', 'message': 'Python LangGraph backend is running'})

# if __name__ == '__main__':
#     print("Starting Python LangGraph backend...")
#     print(f"OpenAI API Key is {'set' if os.getenv('OPENAI_API_KEY') else 'NOT SET'}")
#     app.run(debug=True, port=5000)


# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import os
# import uuid
# import json
# import re
# from dotenv import load_dotenv
# from typing import Dict, List, Any

# # Import LangChain and LangGraph components
# from langgraph.graph import StateGraph, END
# from langchain_openai import ChatOpenAI
# from langchain.schema import HumanMessage, SystemMessage
# from pydantic import BaseModel

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Define project storage paths
# PROJECTS_DIR = os.path.join(os.path.dirname(__file__), "projects")
# if not os.path.exists(PROJECTS_DIR):
#     os.makedirs(PROJECTS_DIR)

# # Define agent state models
# class ExtractorState(BaseModel):
#     input: str
#     response: str = None

# class PlannerState(BaseModel):
#     requirements: str
#     tasks: str = None

# class CodegenState(BaseModel):
#     tasks: str
#     code: Dict[str, str] = {} 

# class UpdaterState(BaseModel):
#     requirements: str
#     file_map: str
#     instruction: str
#     original_code: str = ""
#     updated_files: Dict[str, str] = {}

# # Agent functions
# def extract_requirements(state: ExtractorState) -> ExtractorState:
#     llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    
#     system_message = "Extract clear, actionable software requirements from the following text."
#     messages = [
#         SystemMessage(content=system_message),
#         HumanMessage(content=state.input)
#     ]
#     print(f"Extractor state: {state.input}")  # Debug log
#     response = llm.invoke(messages)
#     print(f"Extractor response: {response.content}")  # Debug log
#     return ExtractorState(input=state.input, response=response.content)

# def plan_tasks(state: PlannerState) -> PlannerState:
#     llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    
#     system_message = "Break down these requirements into implementation tasks."
#     messages = [
#         SystemMessage(content=system_message),
#         HumanMessage(content=state.requirements)
#     ]
    
#     response = llm.invoke(messages)
#     print(f"Planner response: {response.content}")  # Debug log
#     return PlannerState(requirements=state.requirements, tasks=response.content)

# def generate_code(state: CodegenState) -> CodegenState:
#     try:
#         llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
        
#         system_message = """
#         Generate code files for the following tasks. 
#         Return the result as a valid JSON object mapping filenames to code, like:
#         {
#             "main.py": "code here...",
#             "utils.py": "code here..."
#         }
#         """
        
#         messages = [
#             SystemMessage(content=system_message),
#             HumanMessage(content=state.tasks)
#         ]
        
#         response = llm.invoke(messages)
        
#         cleaned_content = response.content.strip()
#         print(f"Codegen response: {cleaned_content}")  # Debug log
        
#         # Remove code fences if present
#         if cleaned_content.startswith("```"):
#             cleaned_content = re.sub(r"^```[a-zA-Z]*\n", "", cleaned_content)
#             cleaned_content = re.sub(r"\n```$", "", cleaned_content)
        
#         try:
#             parsed_files = json.loads(cleaned_content)
#         except json.JSONDecodeError as e:
#             print(f"JSON decoding failed: {e}")
#             parsed_files = {}

#         return CodegenState(tasks=state.tasks, code=parsed_files)

#     except Exception as e:
#         print(f"Exception in generate_code: {e}")
#         return CodegenState(tasks=state.tasks, code={})

# def update_code(state: UpdaterState) -> UpdaterState:
#     llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))

#     system_message = """
#     Update the following codebase according to the user instruction.
#     Return ONLY the updated files as a valid JSON object mapping filename to updated code.
#     Example:
#     {
#         "main.py": "updated code...",
#         "utils.py": "updated code..."
#     }
#     Include only the files that were changed.
#     """

#     messages = [
#         SystemMessage(content=system_message),
#         HumanMessage(content=f"Requirements:\n{state.requirements}\n"
#                              f"Current files:\n{state.file_map}\n"
#                              f"Original code:\n{state.original_code}\n"
#                              f"Instruction:\n{state.instruction}")
#     ]

#     response = llm.invoke(messages)
#     print(f"Updater response: {response.content}")  # Debug log
#     cleaned_content = response.content.strip()

#     # Remove code fences if present
#     if cleaned_content.startswith("```"):
#         cleaned_content = re.sub(r"^```[a-zA-Z]*\n", "", cleaned_content)
#         cleaned_content = re.sub(r"\n```$", "", cleaned_content)

#     try:
#         parsed_files = json.loads(cleaned_content)
#     except json.JSONDecodeError as e:
#         print(f"JSON decoding failed: {e}")
#         parsed_files = {}

#     return UpdaterState(
#         requirements=state.requirements,
#         file_map=state.file_map,
#         instruction=state.instruction,
#         original_code=state.original_code,
#         updated_files=parsed_files
#     )

# # Create agent graphs
# def create_extractor_agent():
#     workflow = StateGraph(ExtractorState)
#     workflow.add_node("extractor", extract_requirements)
#     workflow.set_entry_point("extractor")
#     workflow.add_edge("extractor", END)
#     return workflow.compile()

# def create_planner_agent():
#     workflow = StateGraph(PlannerState)
#     workflow.add_node("planner", plan_tasks)
#     workflow.set_entry_point("planner")
#     workflow.add_edge("planner", END)
#     return workflow.compile()

# def create_codegen_agent():
#     workflow = StateGraph(CodegenState)
#     workflow.add_node("codegen", generate_code)
#     workflow.set_entry_point("codegen")
#     workflow.add_edge("codegen", END)
#     return workflow.compile()

# def create_updater_agent():
#     workflow = StateGraph(UpdaterState)
#     workflow.add_node("updater", update_code)
#     workflow.set_entry_point("updater")
#     workflow.add_edge("updater", END)
#     return workflow.compile()

# # Initialize agents
# extractor_agent = create_extractor_agent()
# planner_agent = create_planner_agent()
# codegen_agent = create_codegen_agent()
# updater_agent = create_updater_agent()

# # Helper functions
# def get_session_dir(session_id):
#     return os.path.join(PROJECTS_DIR, session_id)

# def write_file(session_id, filepath, content):
#     session_dir = get_session_dir(session_id)
#     if not os.path.exists(session_dir):
#         os.makedirs(session_dir)
        
#     # Ensure directory exists for the file
#     file_dir = os.path.dirname(os.path.join(session_dir, filepath))
#     if file_dir and not os.path.exists(file_dir):
#         os.makedirs(file_dir)
        
#     with open(os.path.join(session_dir, filepath), 'w', encoding='utf-8') as f:
#         f.write(content)

# def read_file(session_id, filepath):
#     try:
#         with open(os.path.join(get_session_dir(session_id), filepath), 'r', encoding='utf-8') as f:
#             return f.read()
#     except Exception as e:
#         print(f"Error reading file {filepath}: {e}")
#         return ""

# def get_project_file_paths(session_id):
#     session_dir = get_session_dir(session_id)
#     if not os.path.exists(session_dir):
#         return []
    
#     file_paths = []
#     for root, _, files in os.walk(session_dir):
#         for file in files:
#             if file != "session.json":  # Exclude session metadata
#                 rel_path = os.path.relpath(os.path.join(root, file), session_dir)
#                 file_paths.append(rel_path)
#     return file_paths

# def save_session(session_id, data):
#     session_dir = get_session_dir(session_id)
#     if not os.path.exists(session_dir):
#         os.makedirs(session_dir)
        
#     with open(os.path.join(session_dir, "session.json"), 'w', encoding='utf-8') as f:
#         json.dump(data, f, indent=2)

# def load_session(session_id):
#     try:
#         with open(os.path.join(get_session_dir(session_id), "session.json"), 'r', encoding='utf-8') as f:
#             return json.load(f)
#     except:
#         return None

# def push_to_github(session_id, repo_name, github_username):
#     # Mock GitHub push for now
#     return f"https://github.com/{github_username}/{repo_name}"

# # API endpoints
# @app.post("/start_session")
# def start_session():
#     try:
#         input_text = request.form.get("input_text")
#         session_id = str(uuid.uuid4())
#         print("input text:", input_text)

#         print("Extracting requirements...")
#         extract_result = extractor_agent.invoke({"input": input_text})
#         requirements = extract_result["response"]

#         print("Planning tasks...")
#         plan_result = planner_agent.invoke({"requirements": requirements})
#         tasks = plan_result["tasks"]

#         print("Generating code...")
#         code_result = codegen_agent.invoke({"tasks": tasks})
#         generated_files = code_result["code"]

#         for filepath, code in generated_files.items():
#             write_file(session_id, filepath, code)

#         session_data = {
#             "requirements": requirements,
#             "tasks": tasks,
#             "file_map": list(generated_files.keys()),
#             "history": [{"user": input_text, "assistant": "initial code generated"}]
#         }
#         save_session(session_id, session_data)
        
#         return jsonify({
#             "sessionId": session_id,
#             "fileMap": session_data["file_map"],
#             "requirements": requirements,
#             "tasks": tasks
#         })

#     except Exception as e:
#         print(f"Error in /start_session: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.post("/update_code")
# def update_code_endpoint():
#     try:
#         session_id = request.form.get("session_id")
#         user_instruction = request.form.get("user_instruction")
        
#         session_data = load_session(session_id)
#         if not session_data:
#             return jsonify({"error": "Session not found"}), 404
            
#         original_code = ""
#         for filepath in session_data["file_map"]:
#             content = read_file(session_id, filepath)
#             original_code += f"\n### File: {filepath}\n{content}\n"

#         update_result_dict = updater_agent.invoke({
#             "requirements": session_data.get("requirements", ""),
#             "file_map": "\n".join(session_data["file_map"]),
#             "instruction": user_instruction,
#             "original_code": original_code
#         })

#         # Wrap result into model
#         update_result = UpdaterState(**update_result_dict)
#         updated_files = update_result.updated_files
        
#         if not updated_files:
#             return jsonify({"error": "No updated files returned from updater agent"}), 500

#         for filepath, code in updated_files.items():
#             write_file(session_id, filepath, code)

#         for f in updated_files.keys():
#             if f not in session_data["file_map"]:
#                 session_data["file_map"].append(f)

#         session_data["history"].append({"user": user_instruction, "assistant": "Updated files"})
#         save_session(session_id, session_data)

#         return jsonify({"updatedFiles": list(updated_files.keys())})

#     except Exception as e:
#         print(f"Error in /update_code: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.get("/get_file/<session_id>/<path:filepath>")
# def get_file(session_id, filepath):
#     try:
#         content = read_file(session_id, filepath)
#         return jsonify({"filepath": filepath, "content": content})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.get("/list_files/<session_id>")
# def list_files(session_id):
#     session_data = load_session(session_id)
#     if not session_data:
#         return jsonify({"files": []})
#     return jsonify({"files": session_data.get("file_map", [])})

# @app.post("/push_to_github")
# def push_to_github_api():
#     try:
#         session_id = request.form.get("session_id")
#         repo_name = request.form.get("repo_name")
#         github_username = request.form.get("github_username")
        
#         repo_url = push_to_github(session_id, repo_name, github_username)
#         return jsonify({"repo_url": repo_url})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.get("/api/health")
# def health_check():
#     return jsonify({'status': 'ok', 'message': 'Python LangGraph backend is running'})

# if __name__ == '__main__':
#     print("Starting Python LangGraph backend...")
#     print(f"OpenAI API Key is {'set' if os.getenv('OPENAI_API_KEY') else 'NOT SET'}")
#     app.run(debug=True, port=5000)



# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import os
# import uuid
# import json
# import re
# from dotenv import load_dotenv
# from typing import Dict, List, Any, Optional


# # Import LangChain and LangGraph components
# from langgraph.graph import StateGraph, END
# from langchain_openai import ChatOpenAI
# from pydantic import BaseModel, Field

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Define project storage paths
# PROJECTS_DIR = os.path.join(os.path.dirname(__file__), "projects")
# if not os.path.exists(PROJECTS_DIR):
#     os.makedirs(PROJECTS_DIR)

# # Define agent state models
# class ExtractorState(BaseModel):
#     input: str
#     response: Optional[str] = Field(default=None)

# class PlannerState(BaseModel):
#     requirements: str
#     tasks: Optional[str] = Field(default=None)

# class CodegenState(BaseModel):
#     tasks: str
#     code: Dict[str, str] = Field(default_factory=dict)

# class UpdaterState(BaseModel):
#     requirements: str
#     file_map: str
#     instruction: str
#     original_code: str = Field(default="")
#     updated_files: Dict[str, str] = Field(default_factory=dict)

# # Agent functions
# def extract_requirements(state: ExtractorState) -> dict:
#     llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    
#     system_message = "Extract clear, actionable software requirements from the following text."
#     response = llm.invoke([
#         {"role": "system", "content": system_message},
#         {"role": "user", "content": state.input}
#     ])
#     print(f"Extractor state: {state.input}")  # Debug log
#     print(f"Extractor response: {response.content}")  # Debug log
#     # Return a dict instead of ExtractorState
#     return {"input": state.input, "response": response.content}

# def plan_tasks(state: PlannerState) -> dict:
#     llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    
#     system_message = "Break down these requirements into implementation tasks."
#     response = llm.invoke([
#         {"role": "system", "content": system_message},
#         {"role": "user", "content": state.requirements}
#     ])
    
#     # print(f"Planner response: {response.content}")  # Debug log
#     # Return a dict instead of PlannerState
#     return {"requirements": state.requirements, "tasks": response.content}



# def generate_code(state: CodegenState) -> dict:
#     print("Generate code called")
#     try:
#         llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))

#         system_message = """
#         Generate code files for the following tasks. 
#         Return the result as a valid JSON object mapping filenames to code, like:
#         {
#             "main.py": "code here...",
#             "utils.py": "code here..."
#         }
#         """

#         # print(state.tasks)
#         response = llm.invoke([
#             {"role": "system", "content": system_message},
#             {"role": "user", "content": state.tasks}
#         ])
#         print(f"Codegen response: {response.content}")  # Debug log
#         cleaned_content = response.content.strip()

#         if cleaned_content.startswith("```"):
#             cleaned_content = re.sub(r"^```[a-zA-Z]*\n", "", cleaned_content)
#             cleaned_content = re.sub(r"\n```$", "", cleaned_content)

#         parsed_files = {}
#         try:
#             parsed_files = json.loads(cleaned_content)
#             if not isinstance(parsed_files, dict):
#                 parsed_files = {}
#         except json.JSONDecodeError as e:
#             print(f"JSON decoding failed: {e}")

#         return {"tasks": state.tasks, "code": parsed_files}

#     except Exception as e:
#         print(f"Exception in generate_code: {e}")
#         return {"tasks": state.tasks, "code": {}}



# def update_code(state: UpdaterState) -> dict:
#     llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))

#     system_message = """
#     Update the following codebase according to the user instruction.
#     Return ONLY the updated files as a valid JSON object mapping filename to updated code.
#     Example:
#     {
#         "main.py": "updated code...",
#         "utils.py": "updated code..."
#     }
#     Include only the files that were changed.
#     """

#     user_content = f"Requirements:\n{state.requirements}\n" \
#                    f"Current files:\n{state.file_map}\n" \
#                    f"Original code:\n{state.original_code}\n" \
#                    f"Instruction:\n{state.instruction}"

#     response = llm.invoke([
#         {"role": "system", "content": system_message},
#         {"role": "user", "content": user_content}
#     ])
#     print(f"Updater response: {response.content}")  # Debug log
#     cleaned_content = response.content.strip()

#     # Remove code fences if present
#     if cleaned_content.startswith("```"):
#         cleaned_content = re.sub(r"^```[a-zA-Z]*\n", "", cleaned_content)
#         cleaned_content = re.sub(r"\n```$", "", cleaned_content)

#     try:
#         parsed_files = json.loads(cleaned_content)
#     except json.JSONDecodeError as e:
#         print(f"JSON decoding failed: {e}")
#         parsed_files = {}

#     # Return a dict instead of UpdaterState
#     return {
#         "requirements": state.requirements,
#         "file_map": state.file_map,
#         "instruction": state.instruction,
#         "original_code": state.original_code,
#         "updated_files": parsed_files
#     }

# # Create agent graphs
# def create_extractor_agent():
#     workflow = StateGraph(ExtractorState)
#     workflow.add_node("extractor", extract_requirements)
#     workflow.set_entry_point("extractor")
#     workflow.add_edge("extractor", END)
#     return workflow.compile()

# def create_planner_agent():
#     workflow = StateGraph(PlannerState)
#     workflow.add_node("planner", plan_tasks)
#     workflow.set_entry_point("planner")
#     workflow.add_edge("planner", END)
#     return workflow.compile()

# def create_codegen_agent():
#     workflow = StateGraph(CodegenState)
#     workflow.add_node("codegen", generate_code)
#     workflow.set_entry_point("codegen")
#     workflow.add_edge("codegen", END)
#     return workflow.compile()

# def create_updater_agent():
#     workflow = StateGraph(UpdaterState)
#     workflow.add_node("updater", update_code)
#     workflow.set_entry_point("updater")
#     workflow.add_edge("updater", END)
#     return workflow.compile()

# # Initialize agents
# extractor_agent = create_extractor_agent()
# planner_agent = create_planner_agent()
# codegen_agent = create_codegen_agent()
# updater_agent = create_updater_agent()

# # Helper functions
# def get_session_dir(session_id):
#     return os.path.join(PROJECTS_DIR, session_id)

# def write_file(session_id, filepath, content):
#     session_dir = get_session_dir(session_id)
#     if not os.path.exists(session_dir):
#         os.makedirs(session_dir)
        
#     # Ensure directory exists for the file
#     file_dir = os.path.dirname(os.path.join(session_dir, filepath))
#     if file_dir and not os.path.exists(file_dir):
#         os.makedirs(file_dir)
        
#     with open(os.path.join(session_dir, filepath), 'w', encoding='utf-8') as f:
#         f.write(content)

# def read_file(session_id, filepath):
#     try:
#         with open(os.path.join(get_session_dir(session_id), filepath), 'r', encoding='utf-8') as f:
#             return f.read()
#     except Exception as e:
#         print(f"Error reading file {filepath}: {e}")
#         return ""

# def get_project_file_paths(session_id):
#     session_dir = get_session_dir(session_id)
#     if not os.path.exists(session_dir):
#         return []
    
#     file_paths = []
#     for root, _, files in os.walk(session_dir):
#         for file in files:
#             if file != "session.json":  # Exclude session metadata
#                 rel_path = os.path.relpath(os.path.join(root, file), session_dir)
#                 file_paths.append(rel_path)
#     return file_paths

# def save_session(session_id, data):
#     session_dir = get_session_dir(session_id)
#     if not os.path.exists(session_dir):
#         os.makedirs(session_dir)
        
#     with open(os.path.join(session_dir, "session.json"), 'w', encoding='utf-8') as f:
#         json.dump(data, f, indent=2)

# def load_session(session_id):
#     try:
#         with open(os.path.join(get_session_dir(session_id), "session.json"), 'r', encoding='utf-8') as f:
#             return json.load(f)
#     except:
#         return None

# def push_to_github(session_id, repo_name, github_username):
#     # Mock GitHub push for now
#     return f"https://github.com/{github_username}/{repo_name}"

# # API endpoints
# @app.route("/start_session", methods=["POST"])
# def start_session():
#     try:
#         # Handle both form data and JSON input
#         if request.is_json:
#             data = request.json
#             input_text = data.get("input_text", "")
#         else:
#             input_text = request.form.get("input_text", "")
            
#         if not input_text:
#             return jsonify({"error": "Missing input_text parameter"}), 400
            
#         session_id = str(uuid.uuid4())
#         print("Input text:", input_text)

#         print("Extracting requirements...")
#         extract_result = extractor_agent.invoke({"input": input_text})
#         requirements = extract_result["response"] 
#         print("Requirements:", requirements)  # Debug log

#         print("Planning tasks...")
#         plan_result = planner_agent.invoke({"requirements": requirements})
#         tasks = plan_result["tasks"]  # Direct dictionary access
#         # print("Tasks:", tasks)
#         # print(str(tasks))# Debug log

#         print("Generating code...")
#         code_result = codegen_agent.invoke({"tasks": tasks})
#         print("Code result:", code_result)  # Debug log
#         generated_files = code_result["code"]  # Direct dictionary access

#         for filepath, code in generated_files.items():
#             write_file(session_id, filepath, code)

#         session_data = {
#             "requirements": requirements,
#             "tasks": tasks,
#             "file_map": list(generated_files.keys()),
#             "history": [{"user": input_text, "assistant": "initial code generated"}]
#         }
#         save_session(session_id, session_data)
        
#         return jsonify({
#             "sessionId": session_id,
#             "fileMap": session_data["file_map"],
#             "requirements": requirements,
#             "tasks": tasks
#         })

#     except Exception as e:
#         print(f"Error in /start_session: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route("/update_code", methods=["POST"])
# def update_code_endpoint():
#     try:
#         # Handle both form data and JSON input
#         if request.is_json:
#             data = request.json
#             session_id = data.get("session_id", "")
#             user_instruction = data.get("user_instruction", "")
#         else:
#             session_id = request.form.get("session_id", "")
#             user_instruction = request.form.get("user_instruction", "")
            
#         if not session_id or not user_instruction:
#             return jsonify({"error": "Missing session_id or user_instruction parameter"}), 400
        
#         session_data = load_session(session_id)
#         if not session_data:
#             return jsonify({"error": "Session not found"}), 404
            
#         original_code = ""
#         for filepath in session_data["file_map"]:
#             content = read_file(session_id, filepath)
#             original_code += f"\n### File: {filepath}\n{content}\n"

#         update_result = updater_agent.invoke({
#             "requirements": session_data.get("requirements", ""),
#             "file_map": "\n".join(session_data["file_map"]),
#             "instruction": user_instruction,
#             "original_code": original_code
#         })

#         # Updated to directly access the result dictionary
#         updated_files = update_result.get("updated_files", {})
        
#         if not updated_files:
#             return jsonify({"error": "No updated files returned from updater agent"}), 500

#         for filepath, code in updated_files.items():
#             write_file(session_id, filepath, code)

#         for f in updated_files.keys():
#             if f not in session_data["file_map"]:
#                 session_data["file_map"].append(f)

#         session_data["history"].append({"user": user_instruction, "assistant": "Updated files"})
#         save_session(session_id, session_data)

#         return jsonify({"updatedFiles": list(updated_files.keys())})

#     except Exception as e:
#         print(f"Error in /update_code: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route("/get_file/<session_id>/<path:filepath>", methods=["GET"])
# def get_file(session_id, filepath):
#     try:
#         content = read_file(session_id, filepath)
#         return jsonify({"filepath": filepath, "content": content})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/list_files/<session_id>", methods=["GET"])
# def list_files(session_id):
#     session_data = load_session(session_id)
#     if not session_data:
#         return jsonify({"files": []})
#     return jsonify({"files": session_data.get("file_map", [])})

# @app.route("/push_to_github", methods=["POST"])
# def push_to_github_api():
#     try:
#         # Handle both form data and JSON input
#         if request.is_json:
#             data = request.json
#             session_id = data.get("session_id", "")
#             repo_name = data.get("repo_name", "")
#             github_username = data.get("github_username", "")
#         else:
#             session_id = request.form.get("session_id", "")
#             repo_name = request.form.get("repo_name", "")
#             github_username = request.form.get("github_username", "")
            
#         if not session_id or not repo_name or not github_username:
#             return jsonify({"error": "Missing required parameters"}), 400
            
#         repo_url = push_to_github(session_id, repo_name, github_username)
#         return jsonify({"repo_url": repo_url})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/health", methods=["GET"])
# def health_check():
#     return jsonify({'status': 'ok', 'message': 'Python LangGraph backend is running'})

# if __name__ == '__main__':
#     print("Starting Python LangGraph backend...")
#     print(f"OpenAI API Key is {'set' if os.getenv('OPENAI_API_KEY') else 'NOT SET'}")
#     app.run(debug=True, port=5000)


from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
import json
import re
from dotenv import load_dotenv
from typing import Dict, List, Any, Optional


# Import LangChain and LangGraph components
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define project storage paths
PROJECTS_DIR = os.path.join(os.path.dirname(__file__), "projects")
if not os.path.exists(PROJECTS_DIR):
    os.makedirs(PROJECTS_DIR)

# Define agent state models
class ExtractorState(BaseModel):
    input: str
    response: Optional[str] = Field(default=None)

class PlannerState(BaseModel):
    requirements: str
    tasks: Optional[str] = Field(default=None)

class CodegenState(BaseModel):
    tasks: str
    code: Dict[str, str] = Field(default_factory=dict)

class UpdaterState(BaseModel):
    requirements: str
    file_map: str
    instruction: str
    original_code: str = Field(default="")
    updated_files: Dict[str, str] = Field(default_factory=dict)

# Agent functions
def extract_requirements(state: ExtractorState) -> dict:
    llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    
    system_message = "Extract clear, actionable software requirements from the following text."
    response = llm.invoke([
        {"role": "system", "content": system_message},
        {"role": "user", "content": state.input}
    ])
    print(f"Extractor state: {state.input}")  # Debug log
    print(f"Extractor response: {response.content}")  # Debug log
    # Return a dict instead of ExtractorState
    return {"input": state.input, "response": response.content}

def plan_tasks(state: PlannerState) -> dict:
    llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    
    system_message = "Break down these requirements into implementation tasks."
    response = llm.invoke([
        {"role": "system", "content": system_message},
        {"role": "user", "content": state.requirements}
    ])
    
    # print(f"Planner response: {response.content}")  # Debug log
    # Return a dict instead of PlannerState
    return {"requirements": state.requirements, "tasks": response.content}



def generate_code(state: CodegenState) -> dict:
    print("Generate code called")
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))

        system_message = """
        Generate code files for the following tasks. 
        Return the result as a valid JSON object mapping filenames to code, like:
        {
            "main.py": "code here...",
            "utils.py": "code here..."
        }
        """

        response = llm.invoke([
            {"role": "system", "content": system_message},
            {"role": "user", "content": state.tasks}
        ])
        # print(f"Codegen response: {response.content}")  # Debug log
        cleaned_content = response.content.strip()
        print("clineeeeeeed",cleaned_content)
        if cleaned_content.startswith("```"):
            cleaned_content = re.sub(r"^```[a-zA-Z]*\n", "", cleaned_content)
            cleaned_content = re.sub(r"\n```$", "", cleaned_content)
        
        try:
            parsed_files = json.loads(cleaned_content)
            print(f"parsed filee  {parsed_files}")
            # print(f"Parsed files: {parsed_files}")  # Debug parsed JSON
        except json.JSONDecodeError as e:
            print(f"JSON decoding failed: {e}")
            parsed_files = {}
        # Make sure we're returning a dictionary with the expected structure
        return {"tasks": state.tasks, "code": parsed_files}

    except Exception as e:
        print(f"Exception in generate_code: {e}")
        # Always return a valid dictionary with the expected structure
        return {"tasks": state.tasks, "code": {}}



def update_code(state: UpdaterState) -> dict:
    llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    print("updater agent hit")
    system_message = """
    Update the following codebase according to the user instruction.
    Return ONLY the updated files as a valid JSON object mapping filename to updated code.
    Example:
    {
        "main.py": "updated code...",
        "utils.py": "updated code..."
    }
    Include only the files that were changed.
    """

    user_content = f"Requirements:\n{state.requirements}\n" \
                   f"Current files:\n{state.file_map}\n" \
                   f"Original code:\n{state.original_code}\n" \
                   f"Instruction:\n{state.instruction}"

    response = llm.invoke([
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_content}
    ])
    print(f"Updater response: {response.content}")  # Debug log
    cleaned_content = response.content.strip()
    print("clineeeeeeed",cleaned_content)
    if cleaned_content.startswith("```"):
        cleaned_content = re.sub(r"^```[a-zA-Z]*\n", "", cleaned_content)
        cleaned_content = re.sub(r"\n```$", "", cleaned_content)
    
    try:
        parsed_files = json.loads(cleaned_content)
        print(f"parsed filee  {parsed_files}")
        # print(f"Parsed files: {parsed_files}")  # Debug parsed JSON
    except json.JSONDecodeError as e:
        print(f"JSON decoding failed: {e}")
        parsed_files = {}

    # Return a dict instead of UpdaterState
    return {
        "requirements": state.requirements,
        "file_map": state.file_map,
        "instruction": state.instruction,
        "original_code": state.original_code,
        "updated_files": parsed_files
    }

# Create agent graphs
def create_extractor_agent():
    workflow = StateGraph(ExtractorState)
    workflow.add_node("extractor", extract_requirements)
    workflow.set_entry_point("extractor")
    workflow.add_edge("extractor", END)
    return workflow.compile()

def create_planner_agent():
    workflow = StateGraph(PlannerState)
    workflow.add_node("planner", plan_tasks)
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", END)
    return workflow.compile()

def create_codegen_agent():
    workflow = StateGraph(CodegenState)
    workflow.add_node("codegen", generate_code)
    workflow.set_entry_point("codegen")
    workflow.add_edge("codegen", END)
    return workflow.compile()

def create_updater_agent():
    workflow = StateGraph(UpdaterState)
    workflow.add_node("updater", update_code)
    workflow.set_entry_point("updater")
    workflow.add_edge("updater", END)
    return workflow.compile()

# Initialize agents
extractor_agent = create_extractor_agent()
planner_agent = create_planner_agent()
codegen_agent = create_codegen_agent()
updater_agent = create_updater_agent()

# Helper functions
def get_session_dir(session_id):
    return os.path.join(PROJECTS_DIR, session_id)

def write_file(session_id, filepath, content):
    session_dir = get_session_dir(session_id)
    if not os.path.exists(session_dir):
        os.makedirs(session_dir)
        
    # Ensure directory exists for the file
    file_dir = os.path.dirname(os.path.join(session_dir, filepath))
    if file_dir and not os.path.exists(file_dir):
        os.makedirs(file_dir)
        
    with open(os.path.join(session_dir, filepath), 'w', encoding='utf-8') as f:
        f.write(content)

def read_file(session_id, filepath):
    try:
        with open(os.path.join(get_session_dir(session_id), filepath), 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return ""

def get_project_file_paths(session_id):
    session_dir = get_session_dir(session_id)
    if not os.path.exists(session_dir):
        return []
    
    file_paths = []
    for root, _, files in os.walk(session_dir):
        for file in files:
            if file != "session.json":  # Exclude session metadata
                rel_path = os.path.relpath(os.path.join(root, file), session_dir)
                file_paths.append(rel_path)
    return file_paths

def save_session(session_id, data):
    session_dir = get_session_dir(session_id)
    if not os.path.exists(session_dir):
        os.makedirs(session_dir)
        
    with open(os.path.join(session_dir, "session.json"), 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def load_session(session_id):
    try:
        with open(os.path.join(get_session_dir(session_id), "session.json"), 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return None

def push_to_github(session_id, repo_name, github_username):
    # Mock GitHub push for now
    return f"https://github.com/{github_username}/{repo_name}"

# API endpoints
@app.route("/start_session", methods=["POST"])
def start_session():
    try:
        # Handle both form data and JSON input
        if request.is_json:
            data = request.json
            input_text = data.get("input_text", "")
        else:
            input_text = request.form.get("input_text", "")
            
        if not input_text:
            return jsonify({"error": "Missing input_text parameter"}), 400
            
        session_id = str(uuid.uuid4())
        print("Input text:", input_text)

        print("Extracting requirements...")
        extract_result = extractor_agent.invoke({"input": input_text})
        # print("Extract result:", extract_result)  # Debug log
        requirements = extract_result["response"] 
        # print("Requirements:", requirements)  # Debug log

        print("Planning tasks...")
        plan_result = planner_agent.invoke({"requirements": requirements})
        # print("Plan Result",plan_result)
        tasks = plan_result["tasks"]  # Direct dictionary access
        # print("Tasks:", tasks)
        # print(str(tasks))# Debug log

        print("Generating code...")
        # Make sure we're passing a properly structured input
        code_result = codegen_agent.invoke({"tasks": tasks, "code": {}})
        print("Code result:", code_result)
        generated_files = code_result["code"]
        # print(generated_files)

        for filepath, code in generated_files.items():
            write_file(session_id, filepath, code)

        session_data = {
            "requirements": requirements,
            "tasks": tasks,
            "file_map": list(generated_files.keys()),
            "history": [{"user": input_text, "assistant": "initial code generated"}]
        }
        save_session(session_id, session_data)
        print(session_data["file_map"])
        return jsonify({
            "sessionId": session_id,
            "fileMap": session_data["file_map"],
            "requirements": requirements,
            "tasks": tasks
        })

    except Exception as e:
        print(f"Error in /start_session: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/update_code", methods=["POST"])
def update_code_endpoint():
    print("Updating code...")
    try:
        # Handle both form data and JSON input
        if request.is_json:
            data = request.json
            print("Received JSON data:", data)
            session_id = data.get("session_id", "")
            print("Session ID:", session_id)
            user_instruction = data.get("user_instruction", "")
            print("User instruction:", user_instruction)
        else:
            session_id = request.form.get("session_id", "")
            user_instruction = request.form.get("user_instruction", "")
            print("User instruction of else block:", user_instruction)
            
        if not session_id or not user_instruction:
            return jsonify({"error": "Missing session_id or user_instruction parameter"}), 400
        
        session_data = load_session(session_id)
        if not session_data:
            return jsonify({"error": "Session not found"}), 404
            
        original_code = ""
        for filepath in session_data["file_map"]:
            content = read_file(session_id, filepath)
            original_code += f"\n### File: {filepath}\n{content}\n"
        print("original code")
        update_result = {"updated_files": {}}
        try:
            update_result = updater_agent.invoke({
                "requirements": session_data.get("requirements", ""),
                "file_map": "\n".join(session_data["file_map"]),
                "instruction": user_instruction,
                "original_code": original_code,
                "updated_files": {} 
            })
        except Exception as e:
            print(e)
        # Updated to directly access the result dictionary
        updated_files = update_result.get("updated_files", {})
        
        if not updated_files:
            return jsonify({"error": "No updated files returned from updater agent"}), 500

        for filepath, code in updated_files.items():
            write_file(session_id, filepath, code)

        for f in updated_files.keys():
            if f not in session_data["file_map"]:
                session_data["file_map"].append(f)

        session_data["history"].append({"user": user_instruction, "assistant": "Updated files"})
        save_session(session_id, session_data)

        return jsonify({"updatedFiles": list(updated_files.keys())})

    except Exception as e:
        print(f"Error in /update_code: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/get_file/<session_id>/<path:filepath>", methods=["GET"])
def get_file(session_id, filepath):
    try:
        content = read_file(session_id, filepath)
        return jsonify({"filepath": filepath, "content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/list_files/<session_id>", methods=["GET"])
def list_files(session_id):
    session_data = load_session(session_id)
    if not session_data:
        return jsonify({"files": []})
    return jsonify({"files": session_data.get("file_map", [])})

@app.route("/push_to_github", methods=["POST"])
def push_to_github_api():
    try:
        # Handle both form data and JSON input
        if request.is_json:
            data = request.json
            session_id = data.get("session_id", "")
            repo_name = data.get("repo_name", "")
            github_username = data.get("github_username", "")
        else:
            session_id = request.form.get("session_id", "")
            repo_name = request.form.get("repo_name", "")
            github_username = request.form.get("github_username", "")
            
        if not session_id or not repo_name or not github_username:
            return jsonify({"error": "Missing required parameters"}), 400
            
        repo_url = push_to_github(session_id, repo_name, github_username)
        return jsonify({"repo_url": repo_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Python LangGraph backend is running'})

if __name__ == '__main__':
    print("Starting Python LangGraph backend...")
    print(f"OpenAI API Key is {'set' if os.getenv('OPENAI_API_KEY') else 'NOT SET'}")
    app.run(debug=True, port=5000)

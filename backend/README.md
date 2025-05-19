
# LangGraph Python Backend

This is a Flask-based backend that integrates LangGraph with OpenAI to provide AI code generation capabilities.

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
- On Windows: `venv\Scripts\activate`
- On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Create a `.env` file from the example:
```
cp .env.example .env
```

5. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_actual_api_key_here
```

## Running the Server

Start the Flask server:
```
python app.py
```

The server will run on http://localhost:5000

## API Endpoints

- `POST /api/chat` - Send a chat message to the LangGraph agent
- `GET /api/health` - Health check endpoint

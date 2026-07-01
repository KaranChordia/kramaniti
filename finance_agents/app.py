import streamlit as st
import os
import glob
import json
import PyPDF2
from dotenv import load_dotenv

load_dotenv(override=True)

from cerebras.cloud.sdk import Cerebras
from finance_tools import create_invoice, maintain_monthly_record, list_invoices, FINANCE_DIR

st.set_page_config(page_title="Finance Agent", page_icon="💸", layout="wide")

st.title("💸 Kramaniti Finance Agent (Powered by Cerebras)")
st.markdown("I can create invoices, summarize your monthly records, and answer questions about your finances.")

# Initialize Cerebras client
try:
    client = Cerebras(api_key=os.environ.get("CEREBRAS_API_KEY"))
except Exception as e:
    st.error(f"Failed to initialize Cerebras client: {e}")
    st.stop()

# Load all existing PDFs as context for the first turn (cache this)
@st.cache_data
def get_initial_system_context():
    pdf_contexts = []
    for filepath in glob.glob(os.path.join(FINANCE_DIR, "**/*.pdf"), recursive=True):
        try:
            with open(filepath, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                pdf_contexts.append(f"Invoice Document: {os.path.basename(filepath)}\nContent:\n{text}")
        except Exception as e:
            print(f"Failed to read {filepath}: {e}")
            
    system_prompt = (
        "You are the Kramaniti Finance Agent.\n"
        "You can help manage invoices, create new ones, and maintain monthly records.\n"
        "When answering questions about finances, use your tools or the documents provided below.\n"
        "If a user asks about an invoice, use list_invoices to see what's available.\n\n"
        "--- EXISTING INVOICE CONTENTS ---\n"
        + "\n\n".join(pdf_contexts)
    )
    return system_prompt

# Setup persistence
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": get_initial_system_context()}
    ]

# Display chat history (excluding system prompt)
for msg in st.session_state.messages:
    if msg.get("role") != "system":
        with st.chat_message(msg.get("role")):
            if msg.get("content"):
                st.markdown(msg.get("content"))
            elif msg.get("tool_calls"):
                for tool in msg.get("tool_calls"):
                    tool_func = tool.get("function", {}) if isinstance(tool, dict) else tool.function
                    name = tool_func.get("name") if isinstance(tool_func, dict) else tool_func.name
                    st.markdown(f"*Calling tool: `{name}`*")

tools = [
    {
        "type": "function",
        "function": {
            "name": "create_invoice",
            "description": "Creates a new PDF invoice with the specified details. Uses the next available invoice number.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_name": {"type": "string", "description": "Name of the client"},
                    "amount": {"type": "number", "description": "Total payable amount in INR"},
                    "description": {"type": "string", "description": "Description of the services"},
                    "date_str": {"type": "string", "description": "Optional Date of the invoice (e.g. '4 June 2026'). Defaults to today."}
                },
                "required": ["client_name", "amount", "description"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "maintain_monthly_record",
            "description": "Creates or updates the monthly_records.xlsx file with the totals for a specific month.",
            "parameters": {
                "type": "object",
                "properties": {
                    "month": {"type": "string", "description": "The month name (e.g. 'June', 'July')"},
                    "year": {"type": "string", "description": "The year (e.g. '2026')"},
                    "income_total": {"type": "number", "description": "Total income calculated for that month"},
                    "expense_total": {"type": "number", "description": "Total expenses calculated for that month"}
                },
                "required": ["month", "year", "income_total", "expense_total"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_invoices",
            "description": "Lists all available invoice PDFs to provide context on what exists in the folder.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]

def execute_tool_call(tool_call):
    name = tool_call.function.name
    try:
        args = json.loads(tool_call.function.arguments)
        if name == "create_invoice":
            return create_invoice(**args)
        elif name == "maintain_monthly_record":
            return maintain_monthly_record(**args)
        elif name == "list_invoices":
            return list_invoices()
        else:
            return f"Error: Unknown function {name}"
    except Exception as e:
        return f"Error executing {name}: {str(e)}"

# Chat input
if prompt := st.chat_input("Ask about invoices, or tell me to create one..."):
    # Add user message to state and display
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
        
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        
        # Loop for tool calls
        while True:
            try:
                response = client.chat.completions.create(
                    messages=st.session_state.messages,
                    model="gemma-4-31b",
                    tools=tools,
                    temperature=0.3,
                )
                
                response_message = response.choices[0].message
                response_message_dict = response_message.model_dump(exclude_none=True)
                st.session_state.messages.append(response_message_dict)
                
                if response_message.tool_calls:
                    for tool_call in response_message.tool_calls:
                        message_placeholder.markdown(f"*Executing `{tool_call.function.name}`...*")
                        result = execute_tool_call(tool_call)
                        
                        st.session_state.messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "name": tool_call.function.name,
                            "content": str(result)
                        })
                    # Loop continues and sends the tool responses back to model
                else:
                    # Final text response
                    message_placeholder.markdown(response_message.content)
                    break
                    
            except Exception as e:
                message_placeholder.error(f"Error communicating with Cerebras: {str(e)}")
                break

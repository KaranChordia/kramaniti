# Kramaniti Finance Agents

A Streamlit application powered by Google Antigravity SDK to manage Kramaniti's finances.

## Setup

1. Make sure you have python installed.
2. Navigate to this directory in your terminal:
   ```bash
   cd /Users/karanchordia/Documents/GitHub/kramaniti/finance_agents
   ```
3. Activate the virtual environment (if not already active):
   ```bash
   source venv/bin/activate
   ```
4. Run the application:
   ```bash
   streamlit run app.py
   ```

## Capabilities
- **Create Invoices**: Ask the agent to create a new invoice for a company. It will use the next available invoice number and format it appropriately.
- **Query Invoices**: The agent reads all existing invoices in the `Finance_Kramaniti` directory and can answer questions like "what are the total dues?" or "what are my total incomes?".
- **Monthly Records**: Ask the agent to generate or update the monthly record file, and it will compute the totals and save them to an Excel file (`monthly_records.xlsx`).

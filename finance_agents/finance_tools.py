import os
import glob
import pandas as pd
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch

FINANCE_DIR = "/Users/karanchordia/Documents/GitHub/kramaniti/Finance_Kramaniti"
INCOME_DIR = os.path.join(FINANCE_DIR, "Invoices - Income")
EXPENSE_DIR = os.path.join(FINANCE_DIR, "Incvoices - Expense")
RECORDS_FILE = os.path.join(FINANCE_DIR, "monthly_records.xlsx")

def get_last_invoice_number():
    """Helper to find the last invoice number in the Income directory."""
    files = glob.glob(os.path.join(INCOME_DIR, "*.pdf"))
    count = len(files)
    return f"KKC/MD/ADV-{count + 1:03d}"

def create_invoice(client_name: str, amount: float, description: str, date_str: str = None) -> str:
    """
    Creates a new PDF invoice in the Income directory with the specified details.
    Uses the next available invoice number.
    
    Args:
        client_name: Name of the client (e.g. 'Maitri Dolls')
        amount: Total payable amount in INR.
        description: Description of the services.
        date_str: Date of the invoice (e.g. '4 June 2026'). Defaults to today.
    """
    if not date_str:
        date_str = datetime.now().strftime("%d %B %Y")
        
    invoice_no = get_last_invoice_number()
    filename = f"{client_name.replace(' ', '_').lower()}_{invoice_no.replace('/', '_')}.pdf"
    filepath = os.path.join(INCOME_DIR, filename)
    
    # Generate PDF using reportlab to approximate the design
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4
    
    # Yellow Header Line
    c.setStrokeColorRGB(0.85, 0.65, 0)
    c.setLineWidth(5)
    c.line(0, height - 1.5 * inch, width, height - 1.5 * inch)
    
    # Header Text
    c.setFont("Helvetica-Bold", 16)
    c.setFillColorRGB(0, 0, 0)
    c.drawString(1 * inch, height - 0.8 * inch, f"{client_name} x Kramaniti")
    c.setFont("Helvetica", 10)
    c.setFillColorRGB(0.4, 0.4, 0.4)
    c.drawString(1 * inch, height - 1.0 * inch, "Monthly Digital Growth, AI Systems, and Pre-Launch Brand Building")
    
    c.setFont("Helvetica", 24)
    c.setFillColorRGB(0, 0, 0)
    c.drawString(width - 2.5 * inch, height - 0.8 * inch, "INVOICE")
    
    # Invoice Details Box
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.setLineWidth(1)
    c.rect(1 * inch, height - 2.5 * inch, width - 2 * inch, 0.8 * inch)
    
    c.setFont("Helvetica-Bold", 8)
    c.drawString(1.2 * inch, height - 1.9 * inch, "INVOICE NO.")
    c.setFont("Helvetica", 10)
    c.drawString(1.2 * inch, height - 2.3 * inch, invoice_no)
    
    c.setFont("Helvetica-Bold", 8)
    c.drawString(3.5 * inch, height - 1.9 * inch, "INVOICE DATE")
    c.setFont("Helvetica", 10)
    c.drawString(3.5 * inch, height - 2.3 * inch, date_str)
    
    c.setFont("Helvetica-Bold", 8)
    c.drawString(5.5 * inch, height - 1.9 * inch, "PAYMENT DUE")
    c.setFont("Helvetica", 10)
    c.drawString(5.5 * inch, height - 2.3 * inch, "On Receipt")
    
    # Raised By & Bill To
    c.rect(1 * inch, height - 4.5 * inch, 3 * inch, 1.8 * inch)
    c.rect(4.2 * inch, height - 4.5 * inch, 3.07 * inch, 1.8 * inch)
    
    c.setFont("Helvetica-Bold", 8)
    c.drawString(1.2 * inch, height - 2.9 * inch, "INVOICE RAISED BY")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1.2 * inch, height - 3.3 * inch, "Karan Kumar Chordia")
    c.setFont("Helvetica", 10)
    c.drawString(1.2 * inch, height - 3.5 * inch, "Working under the Kramaniti brand name")
    c.drawString(1.2 * inch, height - 3.7 * inch, "PAN: BBEPC2617M")
    
    c.setFont("Helvetica-Bold", 8)
    c.drawString(4.4 * inch, height - 2.9 * inch, "BILL TO")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(4.4 * inch, height - 3.3 * inch, client_name)
    
    # Table Header
    c.setFillColorRGB(0, 0, 0)
    c.rect(1 * inch, height - 5 * inch, width - 2 * inch, 0.3 * inch, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(1.2 * inch, height - 4.9 * inch, "Description")
    c.drawString(6 * inch, height - 4.9 * inch, "Amount")
    
    # Table Content
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica", 10)
    
    # Wrap text for description (simple split for demo)
    y_pos = height - 5.3 * inch
    for line in description.split('\\n'):
        c.drawString(1.2 * inch, y_pos, line)
        y_pos -= 0.2 * inch
        
    c.drawString(6 * inch, height - 5.3 * inch, f"Rs {amount:,.2f}")
    
    # Total Box
    c.setFillColorRGB(0, 0, 0)
    c.rect(4.2 * inch, height - 7.5 * inch, 3.07 * inch, 0.4 * inch, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(4.4 * inch, height - 7.4 * inch, "Total Payable")
    c.drawString(6 * inch, height - 7.4 * inch, f"Rs {amount:,.2f}")
    
    # Bank Details
    c.setFillColorRGB(0, 0, 0)
    c.rect(1 * inch, height - 9 * inch, width - 2 * inch, 1.2 * inch)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(1.2 * inch, height - 8 * inch, "Bank Details")
    c.setFont("Helvetica", 9)
    c.drawString(1.2 * inch, height - 8.3 * inch, "Account Holder: Karan Kumar Chordia")
    c.drawString(1.2 * inch, height - 8.5 * inch, "Account Number: 5010 0211 0446 33")
    c.drawString(4 * inch, height - 8.3 * inch, "Branch: Frazer Town")
    c.drawString(4 * inch, height - 8.5 * inch, "IFSC: HDFC0000714")
    
    c.save()
    return f"Successfully created invoice {invoice_no} for {client_name} at {filepath}"

def maintain_monthly_record(month: str, year: str, income_total: float, expense_total: float) -> str:
    """
    Creates or updates the monthly_records.xlsx file with the totals for a specific month.
    The agent should first use query_invoices to determine the totals for the month.
    
    Args:
        month: The month name (e.g. 'June', 'July')
        year: The year (e.g. '2026')
        income_total: Total income calculated for that month
        expense_total: Total expenses calculated for that month
    """
    columns = ["Month", "Year", "Total Income (Rs)", "Total Expense (Rs)", "Net Profit (Rs)"]
    
    new_row = {
        "Month": month,
        "Year": str(year),
        "Total Income (Rs)": income_total,
        "Total Expense (Rs)": expense_total,
        "Net Profit (Rs)": income_total - expense_total
    }
    
    if os.path.exists(RECORDS_FILE):
        df = pd.read_excel(RECORDS_FILE)
    else:
        df = pd.DataFrame(columns=columns)
        
    # Check if record for month/year exists and update
    mask = (df["Month"] == month) & (df["Year"] == str(year))
    if mask.any():
        idx = df.index[mask].tolist()[0]
        df.loc[idx, "Total Income (Rs)"] = income_total
        df.loc[idx, "Total Expense (Rs)"] = expense_total
        df.loc[idx, "Net Profit (Rs)"] = income_total - expense_total
    else:
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        
    df.to_excel(RECORDS_FILE, index=False)
    return f"Successfully updated monthly records for {month} {year}. File saved to {RECORDS_FILE}"

def list_invoices() -> str:
    """
    Lists all available invoice PDFs to provide context on what exists in the folder.
    """
    income = glob.glob(os.path.join(INCOME_DIR, "*.pdf"))
    expense = glob.glob(os.path.join(EXPENSE_DIR, "*.pdf"))
    
    res = "Income Invoices:\n" + "\n".join([os.path.basename(f) for f in income]) + "\n\n"
    res += "Expense Invoices:\n" + "\n".join([os.path.basename(f) for f in expense])
    return res

import os
from finance_tools import create_invoice, get_last_invoice_number

print(f"Next invoice number will be: {get_last_invoice_number()}")
result = create_invoice("Test Client", 15000.0, "Test Description")
print(result)

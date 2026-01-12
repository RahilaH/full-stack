Run the mock backend for the frontend demo:

1. Install dependencies

```powershell
pip install -r requirements.txt
```

2. Start the server

```powershell
python server.py
```

The mock API will run on http://localhost:5000 with endpoints:
- GET /enquiries
- POST /enquiries/add
- POST /enquiries/upload-csv (form-data file field name: `file`)

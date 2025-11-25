
import functions_framework
from flask import abort
# from firebase_admin import initialize_app, firestore
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Initialize Firebase Admin SDK
# if not os.getenv("FUNCTION_NAME"):
#     initialize_app()

# db = firestore.client()

def calculate_credit_score_logic(monthly_revenue, monthly_transactions, business_age):
    # Normalize each input to a scale of 0 to 100
    normalized_revenue = min(max(monthly_revenue, 0), 1000000) / 1000000 * 100
    normalized_transactions = min(max(monthly_transactions, 0), 1000) / 1000 * 100
    normalized_age = min(max(business_age, 0), 20) / 20 * 100

    # Calculate the credit score using the weighted formula
    credit_score = (
        0.5 * normalized_revenue
        + 0.3 * normalized_transactions
        + 0.2 * normalized_age
    )

    # Return the final credit score as a number between 0 and 100
    return round(credit_score)

@functions_framework.http
def calculateCreditScore(request):
    if request.method != 'POST':
        abort(405, description='Method Not Allowed')

    request_json = request.get_json(silent=True)
    if not request_json:
        abort(400, description='Invalid JSON')

    monthly_revenue = request_json.get('monthlyRevenue')
    monthly_transactions = request_json.get('monthlyTransactions')
    business_age = request_json.get('businessAge')

    if any(x is None for x in [monthly_revenue, monthly_transactions, business_age]):
        abort(400, description='Missing one or more required parameters: monthlyRevenue, monthlyTransactions, businessAge')

    try:
        score = calculate_credit_score_logic(float(monthly_revenue), float(monthly_transactions), float(business_age))
        return {'creditScore': score}
    except ValueError:
        abort(400, description='Invalid input types. All parameters must be numbers.')
    except Exception as e:
        print(f"Error calculating credit score: {e}")
        abort(500, description='Error calculating credit score')

@functions_framework.http
def submitContactForm(request):
    if request.method != 'POST':
        abort(405, description='Method Not Allowed')

    request_json = request.get_json(silent=True)
    if not request_json:
        abort(400, description='Invalid JSON')

    # Extract form data
    name = request_json.get('name')
    email = request_json.get('email')
    phone = request_json.get('phone')
    company = request_json.get('company')
    inquiry_type = request_json.get('inquiryType')
    message = request_json.get('message')

    if any(x is None for x in [name, email, phone, company, inquiry_type, message]):
        abort(400, description='Missing one or more required parameters')

    lead_data = {
        'name': name,
        'email': email,
        'phone': phone,
        'company': company,
        'inquiryType': inquiry_type,
        'message': message,
        'timestamp': firestore.SERVER_TIMESTAMP
    }

    try:
        # Store lead in Firestore (Removed)
        # db.collection('leads').add(lead_data)

        # Send email notification using SendGrid
        message = Mail(
            from_email='noreply@yourdomain.com', # TODO: Replace with your verified sender email
            to_emails='chaitanyasethi3336@gmail.com',
            subject=f'New Contact Form Inquiry: {inquiry_type}',
            html_content=f'''
                <strong>Name:</strong> {name}<br>
                <strong>Email:</strong> {email}<br>
                <strong>Phone:</strong> {phone}<br>
                <strong>Company:</strong> {company}<br>
                <strong>Inquiry Type:</strong> {inquiry_type}<br>
                <strong>Message:</strong> {message}<br>
            '''
        )
        try:
            sendgrid_client = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sendgrid_client.send(message)
            print(f"SendGrid Email Sent: Status Code: {response.status_code}, Body: {response.body}, Headers: {response.headers}")
        except Exception as e:
            print(f"Error sending email with SendGrid: {e}")

        return {'status': 'success', 'message': 'Lead submitted successfully'}, 200
    except Exception as e:
        print(f"Error processing contact form: {e}")
        abort(500, description=f'Error processing contact form: {e}')

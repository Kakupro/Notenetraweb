
import functions_framework
from flask import abort

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

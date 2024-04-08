import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from transformers import pipeline

@csrf_exempt
def predict_sentiment(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            input_text = request_data.get('text', '')  # Extract text from JSON data
            print('Received input text:', input_text)  # Log the input text for debugging

            if input_text:
                # Initialize sentiment analysis pipeline
                sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")

                # Perform sentiment analysis
                results = sentiment_pipeline(input_text)

                # Extract sentiment label
                sentiment_label = results[0]['label']

                # Return the sentiment label as JSON response
                return JsonResponse({'sentiment': sentiment_label})

        except Exception as e:
            print('Error processing request:', str(e))  # Log any exceptions for debugging

    # Handle invalid or missing input
    return JsonResponse({'error': 'Invalid input or method not allowed'}, status=400)

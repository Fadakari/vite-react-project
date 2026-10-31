from django.urls import path
from .views import ActiveQuizAPIView, QuizSubmissionAPIView, QuizStartPaymentAPIView, CardImageGeneratorAPIView

urlpatterns = [
    path('active/', ActiveQuizAPIView.as_view(), name='active_quiz'),
    path('submit/', QuizSubmissionAPIView.as_view(), name='submit_quiz'),
    path('start-payment/', QuizStartPaymentAPIView.as_view(), name='start_quiz_payment'),
    path('card-image/', CardImageGeneratorAPIView.as_view(), name='card_image_generator'),
]

from django.urls import path
from .views import ActiveQuizAPIView, QuizSubmissionAPIView

urlpatterns = [
    path('active/', ActiveQuizAPIView.as_view(), name='active_quiz'),
    path('submit/', QuizSubmissionAPIView.as_view(), name='submit_quiz'),
]

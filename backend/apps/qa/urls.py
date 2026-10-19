from django.urls import path
from .views import FAQListAPIView, UserQuestionListCreateAPIView

urlpatterns = [
    path('faqs/', FAQListAPIView.as_view(), name='faq_list'),
    path('questions/', UserQuestionListCreateAPIView.as_view(), name='user_questions'),
]

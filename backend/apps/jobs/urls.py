from django.urls import path
from .views import JobListAPIView, JobDetailAPIView, CategoryListAPIView

urlpatterns = [
    path('', JobListAPIView.as_view(), name='job_list'),
    path('categories/', CategoryListAPIView.as_view(), name='category_list'),
    path('<int:pk>/', JobDetailAPIView.as_view(), name='job_detail'),
]

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import FAQ, UserQuestion
from .serializers import (
    FAQSerializer, 
    UserQuestionCreateSerializer, 
    UserQuestionPublicSerializer
)

class FAQListAPIView(generics.ListAPIView):
    """
    دریافت لیست سوالات متداول:
    - فیلتر بر اساس دسته‌بندی: ?category=نام_دسته
    - جستجو: ?search=کلمه
    """
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = FAQ.objects.filter(is_published=True)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(question__icontains=search) | Q(answer__icontains=search)
            )
        return queryset


class UserQuestionListCreateAPIView(generics.ListCreateAPIView):
    """
    - GET: مشاهده لیست پرسش و پاسخ‌های عمومی و تایید شده
    - POST: ارسال پرسش جدید توسط کاربران سایت
    """
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserQuestionCreateSerializer
        return UserQuestionPublicSerializer

    def get_queryset(self):
        return UserQuestion.objects.filter(is_public=True, is_answered=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "status": "success",
            "message": "پرسش شما با موفقیت ثبت شد و پس از بررسی کارشناسان پاسخ داده خواهد شد.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

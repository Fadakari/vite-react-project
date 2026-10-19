from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Job, Category
from .serializers import JobSerializer, CategorySerializer

class JobListAPIView(generics.ListAPIView):
    """
    لیست مشاغل فعال:
    - فیلتر مشاغل ویژه: ?featured=true
    - جستجو در عنوان، توضیحات یا آدرس: ?search=کلمه
    - فیلتر بر اساس دسته: ?category=شناسه_یا_اسلاگ
    """
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True).select_related('category')

        # فیلتر مشاغل ویژه برای صفحه اول
        is_featured = self.request.query_params.get('featured')
        if is_featured in ['true', '1', 'True']:
            queryset = queryset.filter(is_featured=True)

        # جستجو
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(address__icontains=search)
            )

        # فیلتر دسته‌بندی
        category = self.request.query_params.get('category')
        if category:
            if category.isdigit():
                queryset = queryset.filter(category_id=int(category))
            else:
                queryset = queryset.filter(category__slug=category)

        return queryset


class JobDetailAPIView(generics.RetrieveAPIView):
    """مشاهده جزئیات یک شغل"""
    queryset = Job.objects.filter(is_active=True).select_related('category')
    serializer_class = JobSerializer
    permission_classes = [AllowAny]


class CategoryListAPIView(generics.ListAPIView):
    """لیست دسته‌بندی‌های مشاغل"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

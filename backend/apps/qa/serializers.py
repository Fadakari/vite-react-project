from rest_framework import serializers
from .models import FAQ, UserQuestion

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'order', 'created_at']


class UserQuestionCreateSerializer(serializers.ModelSerializer):
    """سریالایزر دریافت سوال از سمت کاربر در سایت"""
    class Meta:
        model = UserQuestion
        fields = ['id', 'full_name', 'contact_info', 'subject', 'question', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserQuestionPublicSerializer(serializers.ModelSerializer):
    """سریالایزر نمایش عمومی پرسش و پاسخ‌ها (حفظ حریم خصوصی با مخفی‌کردن اطلاعات تماس)"""
    class Meta:
        model = UserQuestion
        fields = ['id', 'full_name', 'subject', 'question', 'answer', 'created_at', 'answered_at']

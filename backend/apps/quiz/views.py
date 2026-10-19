from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import IntegrityError
from .models import QuizQuestion, QuizSubmission
from .serializers import QuizQuestionPublicSerializer, QuizSubmissionCreateSerializer

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class ActiveQuizAPIView(APIView):
    """دریافت جدیدترین مسابقه فعال به همراه لیست گزینه‌های پویا"""
    permission_classes = [AllowAny]

    def get(self, request):
        active_quiz = QuizQuestion.objects.filter(is_active=True).prefetch_related('options').first()
        if not active_quiz:
            return Response({
                "active": False,
                "message": "در حال حاضر مسابقه‌ای فعال نیست."
            }, status=status.HTTP_200_OK)

        serializer = QuizQuestionPublicSerializer(active_quiz)
        return Response({
            "active": True,
            "quiz": serializer.data
        }, status=status.HTTP_200_OK)


class QuizSubmissionAPIView(APIView):
    """
    ثبت پاسخ مسابقه:
    - بررسی فرمت 09 شماره
    - بررسی یکتایی شماره تماس و اثر انگشت دستگاه
    - ذخیره وضعیت درستی در دیتابیس
    - ارسال پیام بی‌طرفانه به کاربر (بدون لو رفتن پاسخ درست یا نادرست)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizSubmissionCreateSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return Response({
                "status": "error",
                "message": str(first_error),
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        question = validated_data['question_obj']
        option = validated_data['option_obj']
        phone = validated_data['phone_number']
        national_code = validated_data['national_code']
        device_fingerprint = validated_data.get('device_fingerprint', '')

        # محاسبه درستی پاسخ در دیتابیس برای پنل ادمین
        is_correct = option.is_correct
        client_ip = get_client_ip(request)

        try:
            QuizSubmission.objects.create(
                question=question,
                selected_option=option,
                phone_number=phone,
                national_code=national_code,
                device_fingerprint=device_fingerprint or None,
                is_correct=is_correct,
                ip_address=client_ip
            )
        except IntegrityError:
            return Response({
                "status": "error",
                "message": "شما قبلاً با این شماره در این مسابقه شرکت کرده‌اید."
            }, status=status.HTTP_400_BAD_REQUEST)

        # پیام امن و استاندارد بدون فاش کردن نتیجه پاسخ برای جلوگیری از آزمون و خطا
        return Response({
            "status": "success",
            "message": "پاسخ شما با موفقیت ثبت شد. در صورت صحت پاسخ، شماره شما در لیست قرعه‌کشی قرار خواهد گرفت. با تشکر از همراهی شما!"
        }, status=status.HTTP_201_CREATED)

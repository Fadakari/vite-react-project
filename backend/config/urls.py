from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# شخصی‌سازی پنل مدیریت جنگو با متن‌های فارسی و شکیل
admin.site.site_header = "سامانه مدیریت گره‌گشا ایساتیس"
admin.site.site_title = "پنل مدیریت گره‌گشا"
admin.site.index_title = "مدیریت مشاغل، سوال و جواب و محتوا"

def api_root(request):
    return JsonResponse({
        "status": "success",
        "message": "به API سامانه گره‌گشا ایساتیس خوش آمدید",
        "endpoints": {
            "jobs_list": "/api/jobs/",
            "categories_list": "/api/jobs/categories/",
            "faqs_list": "/api/qa/faqs/",
            "questions_list_and_create": "/api/qa/questions/",
            "quiz_active": "/api/quiz/active/",
            "quiz_submit": "/api/quiz/submit/",
            "admin_panel": "/admin/",
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/jobs/', include('apps.jobs.urls')),
    path('api/qa/', include('apps.qa.urls')),
    path('api/quiz/', include('apps.quiz.urls')),
]

# در هاست و لوکال فایل‌های آپلود شده (مدیا) در دسترس باشند
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # برای سرو مدیا در مواقعی که وب‌سرور تنظیم نشده
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

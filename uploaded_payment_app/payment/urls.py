from django.urls import path
from . import views

urlpatterns = [
    path("payment/donate/", views.donate_page, name="donate_page"),
    path("payment/start/", views.start_payment, name="start_payment"),
    path("payment/callback/", views.payment_callback, name="payment_callback"),
    
    # ⚠️ فقط برای تست — بعد از پیدا کردن آدرس صحیح، حذف کنید
    path("payment/test-verify/", views.test_verify_view, name="test_verify"),
]
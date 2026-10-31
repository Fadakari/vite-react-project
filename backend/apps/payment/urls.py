from django.urls import path
from . import views

urlpatterns = [
    path('donate/', views.donate_page, name='donate_page'),
    path('start/', views.start_payment, name='start_payment'),
    path('callback/', views.payment_callback, name='payment_callback'),
    path('simulator/', views.payment_simulator_view, name='payment_simulator'),
    path('test-verify/', views.test_verify_view, name='test_verify'),
]

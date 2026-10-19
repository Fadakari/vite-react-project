import os
import sys

# اضافه کردن مسیر پروژه به sys.path جهت اجرای صحیح در هاست سی‌پنل و مسنجر (Passenger)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# مشخص کردن فایل تنظیمات جنگو
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# لود کردن هندلر WSGI
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

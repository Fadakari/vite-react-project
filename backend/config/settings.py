import os
from pathlib import Path
from dotenv import load_dotenv

# مسیر پایه پروژه
BASE_DIR = Path(__file__).resolve().parent.parent

# لود کردن فایل .env
load_dotenv(BASE_DIR / '.env')

# کلید امنیتی جنگو
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-gerahgosha-key-change-this-in-production-123456')

# وضعیت دیباگ (در محیط توسعه True و در محیط واقعی False)
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1')

# دامنه‌های مجاز
allowed_hosts_str = os.getenv('ALLOWED_HOSTS', '*')
ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_str.split(',') if h.strip()]

# اپلیکیشن‌های نصب شده
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # پکیج‌های شخص ثالث
    'rest_framework',
    'corsheaders',

    # اپ‌های اختصاصی پروژه
    'apps.jobs',
    'apps.qa',
    'apps.quiz',
    'apps.payment',
]

# تنظیمات درگاه پرداخت سامان شاپرک (SEP)
SEP_TERMINAL_ID = os.getenv('SEP_TERMINAL_ID', '21689219')
SEP_DONATE_AMOUNT = int(os.getenv('SEP_DONATE_AMOUNT', 150000))

# تنظیمات پروکسی معکوس و HTTPS در سرور لینوکس / cPanel
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True

# میدلورها (CORS باید در ابتدای لیست باشد)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# تنظیمات هوشمند دیتابیس:
# به صورت پیش‌فرض از SQLite داخلی استفاده می‌شود تا روی لوکال یا بدون دیتابیس هم سریع کار کند.
# در هاست سی‌پنل، کافیست USE_MYSQL=True و اطلاعات دیتابیس را در .env قرار دهید.
USE_MYSQL = os.getenv('USE_MYSQL', 'False').lower() in ('true', '1')

if USE_MYSQL:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'gerahgosha_db'),
            'USER': os.getenv('DB_USER', 'root'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'OPTIONS': {
                'charset': 'utf8mb4',
            },
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# اعتبارسنجی رمز عبور
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# بین‌المللی‌سازی و زبان فارسی
LANGUAGE_CODE = 'fa-ir'
TIME_ZONE = 'Asia/Tehran'
USE_I18N = True
USE_TZ = True

# فایل‌های استاتیک و رسانه
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static'] if (BASE_DIR / 'static').exists() else []

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# تنظیمات جنگو رست فریم‌ورک (DRF)
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# تنظیمات CORS برای دسترسی فرانت به بک‌اند
CORS_ALLOW_ALL_ORIGINS = DEBUG  # در حالت دیباگ به همه اوریجین‌ها دسترسی می‌دهد

cors_origins_env = os.getenv('CORS_ALLOWED_ORIGINS', '')
if cors_origins_env:
    CORS_ALLOWED_ORIGINS = [url.strip() for url in cors_origins_env.split(',') if url.strip()]
else:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

CORS_ALLOW_CREDENTIALS = True

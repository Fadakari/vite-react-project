# فعال‌سازی خودکار PyMySQL برای سازگاری ۱۰۰٪ با هاست‌های اشتراکی سی‌پنل بدون نیاز به کامپایلرهای لینوکس
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

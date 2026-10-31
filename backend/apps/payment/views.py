import os
import uuid
import html
import json
import base64
import io
import requests
import jdatetime
from PIL import Image, ImageDraw, ImageFont

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from apps.quiz.models import QuizSubmission, generate_golden_card_code, get_current_and_expiry_jalali, to_persian_digits


# =========================================================
# تنظیمات درگاه پرداخت سامان (SEP)
# =========================================================

TERMINAL_ID   = getattr(settings, 'SEP_TERMINAL_ID', '21689219')
DONATE_AMOUNT = getattr(settings, 'SEP_DONATE_AMOUNT', 150000)

TOKEN_URL   = "https://sep.shaparak.ir/onlinepg/onlinepg"
PAYMENT_URL = "https://sep.shaparak.ir/OnlinePG/OnlinePG"

VERIFY_URL_CANDIDATES = [
    "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction",
    "https://sep.shaparak.ir/onlinepg/onlinepg/verify",
    "https://sep.shaparak.ir/OnlinePG/OnlinePG/Verify",
    "https://sep.shaparak.ir/VerifyTransaction",
]

REVERSE_URL_CANDIDATES = [
    "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/ReverseTransaction",
    "https://sep.shaparak.ir/onlinepg/onlinepg/reverse",
    "https://sep.shaparak.ir/OnlinePG/OnlinePG/Reverse",
    "https://sep.shaparak.ir/ReverseTransaction",
]

VERIFY_URL  = VERIFY_URL_CANDIDATES[0]
REVERSE_URL = REVERSE_URL_CANDIDATES[0]


def get_sep_callback_url(request=None):
    """
    تولید آدرس بازگشت دقیقاً منطبق بر آدرس ثبت‌شده در پنل شاپرک سامان:
    https://gerahgosha.ir/payment/callback/
    (دقیقاً مطابق سورس اصلی زیپ ارسالی و لاگ‌های موفق تراکنش در سرور)
    """
    env_cb = os.getenv('SEP_CALLBACK_URL', '').strip()
    if env_cb:
        return env_cb

    if request is not None:
        try:
            host = request.get_host().split(':')[0].lower()
            if host in ('localhost', '127.0.0.1', 'testserver'):
                return request.build_absolute_uri('/payment/callback/')
        except Exception:
            pass

    # درگاه شاپرک سامان دقیقاً روی دامنه اصلی بدون ساب‌دامین رجیستر شده است
    return "https://gerahgosha.ir/payment/callback/"


def generate_burned_card_base64(code, created_jalali, expires_jalali):
    """
    تولید تصویر کارت طلایی با درج مستقیم کد و تاریخ روی پیکسل‌ها و تبدیل به Base64
    جهت جلوگیری قطعی از ارور ۴۰۴ در هاست و بارگذاری درجا
    """
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        candidates = [
            os.path.join(settings.BASE_DIR, 'static', 'card_clean_template.png'),
            os.path.join(settings.BASE_DIR, 'static', 'card_clean_template.jpg'),
            os.path.join(current_dir, '..', '..', 'static', 'card_clean_template.png'),
            os.path.join(current_dir, '..', '..', 'static', 'card_clean_template.jpg'),
            os.path.join(settings.BASE_DIR, '..', 'public', 'card_clean_template.png'),
            os.path.join(settings.BASE_DIR, '..', 'src', 'assets', 'card_clean_template.png'),
        ]
        template_path = next((p for p in candidates if os.path.exists(p)), None)
        if not template_path:
            return ""

        img = Image.open(template_path).convert('RGB')
        draw = ImageDraw.Draw(img)

        # جستجوی فونت وزیرمتن و فونت‌های استاندارد
        font_code_path = next((p for p in [
            os.path.join(settings.BASE_DIR, 'static', 'fonts', 'Vazirmatn-Bold.ttf'),
            os.path.join(current_dir, '..', '..', 'static', 'fonts', 'Vazirmatn-Bold.ttf'),
            'arialbd.ttf',
            'DejaVuSans-Bold.ttf',
        ] if os.path.exists(p)), None)

        font_date_path = next((p for p in [
            os.path.join(settings.BASE_DIR, 'static', 'fonts', 'Vazirmatn-Medium.ttf'),
            os.path.join(current_dir, '..', '..', 'static', 'fonts', 'Vazirmatn-Medium.ttf'),
            os.path.join(settings.BASE_DIR, 'static', 'fonts', 'Vazirmatn-Bold.ttf'),
            'tahoma.ttf',
            'DejaVuSans.ttf',
        ] if os.path.exists(p)), None)

        try:
            font_code = ImageFont.truetype(font_code_path or 'arialbd.ttf', 38)
        except Exception:
            font_code = ImageFont.load_default()

        try:
            font_date = ImageFont.truetype(font_date_path or 'tahoma.ttf', 24)
        except Exception:
            font_date = ImageFont.load_default()

        # درج کد کارت
        draw.text((380, 328), str(code), fill=(15, 23, 42), font=font_code, anchor='mm')
        # درج تاریخ ایجاد شمسی (باکس چپ)
        draw.text((262, 432), str(created_jalali), fill=(15, 23, 42), font=font_date, anchor='mm')
        # درج تاریخ انقضا شمسی (باکس راست)
        draw.text((530, 432), str(expires_jalali), fill=(15, 23, 42), font=font_date, anchor='mm')

        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=88, optimize=True)
        return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode('ascii')
    except Exception as e:
        print("Error generating base64 card image:", e)
        return ""


# =========================================================
# صفحه حمایت مالی مستقل (Donate)
# =========================================================

def donate_page(request):
    return render(request, "payment/donate.html")


# =========================================================
# تابع کمکی نمایش خطا
# =========================================================

def payment_error(message, status_code=400):
    safe_message = html.escape(str(message))
    return HttpResponse(
        f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>خطا در عملیات پرداخت</title>
<style>
body{{font-family:Tahoma, Arial, sans-serif;background:#f3f4f6;padding:40px 15px;margin:0;}}
.box{{max-width:550px;margin:auto;background:white;padding:35px 25px;border-radius:18px;
box-shadow:0 10px 30px rgba(0,0,0,.08);text-align:center;border:1px solid #fee2e2;}}
h2{{color:#dc2626;margin-top:0;}}
p{{color:#4b5563;line-height:1.8;font-size:15px;}}
.btn{{display:inline-block;margin-top:20px;padding:12px 30px;background:#1e3a8a;
color:white;text-decoration:none;border-radius:12px;font-weight:bold;font-size:14px;}}
</style>
</head>
<body>
<div class="box">
<h2>❌ خطا در فرآیند پرداخت</h2>
<p>{safe_message}</p>
<a href="/" class="btn">بازگشت به صفحه اصلی</a>
</div>
</body>
</html>""",
        status=status_code,
    )


# =========================================================
# شروع پرداخت مستقل (Start Payment)
# =========================================================

def start_payment(request):
    if request.method != "POST":
        return payment_error("روش درخواست نامعتبر است.")

    res_num = uuid.uuid4().hex[:20]
    callback_url = get_sep_callback_url(request)

    amount = int(request.POST.get("amount", DONATE_AMOUNT))

    payload = {
        "action": "token",
        "TerminalId": int(TERMINAL_ID),
        "Amount": amount,
        "ResNum": res_num,
        "RedirectUrl": callback_url,
    }

    try:
        response = requests.post(TOKEN_URL, json=payload, timeout=5)
        data = response.json()
        if data.get("status") == 1 and data.get("token"):
            token = data.get("token")
            request.session["sep_token"]   = token
            request.session["sep_res_num"] = res_num
            request.session["sep_amount"]  = amount

            form_html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="UTF-8"><meta name="referrer" content="origin">
<title>انتقال به درگاه سامان</title></head>
<body onload="document.getElementById('f').submit();">
<p style="text-align:center;font-family:Tahoma;margin-top:80px;">در حال انتقال به درگاه پرداخت شاپرک...</p>
<form id="f" action="{PAYMENT_URL}" method="POST">
<input type="hidden" name="Token" value="{token}" />
<input type="hidden" name="GetMethod" value="true" />
</form></body></html>"""
            return HttpResponse(form_html)
    except Exception as e:
        print("SEP connection failed, checking fallback simulator:", e)

    return redirect(f"/payment/simulator/?res_num={res_num}&amount={amount}&is_standalone=1")


# =========================================================
# Decode هوشمند برای پاسخ‌های شاپرک
# =========================================================

def smart_decode_response(response):
    raw_bytes = response.content
    if not raw_bytes:
        return None
    encodings_to_try = ["utf-8", "utf-8-sig", "windows-1256", "iso-8859-6", "cp1256"]
    for encoding in encodings_to_try:
        try:
            decoded = raw_bytes.decode(encoding)
            try:
                json.loads(decoded)
                return decoded
            except ValueError:
                continue
        except UnicodeDecodeError:
            continue
    return raw_bytes.decode("utf-8", errors="replace")


# =========================================================
# Verify تراکنش در شاپرک
# =========================================================

def verify_transaction(ref_num, terminal_id):
    payload = {
        "RefNum": ref_num,
        "TerminalNumber": int(terminal_id),
    }
    try:
        response = requests.post(
            VERIFY_URL,
            json=payload,
            timeout=15,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
            },
        )
        if response.status_code != 200:
            return None
        decoded_text = smart_decode_response(response)
        if not decoded_text:
            return None
        return json.loads(decoded_text)
    except Exception as e:
        print("VERIFY ERROR:", e)
        return None


# =========================================================
# Reverse تراکنش در شاپرک
# =========================================================

def reverse_transaction(ref_num, terminal_id):
    payload = {
        "RefNum": ref_num,
        "TerminalNumber": int(terminal_id),
    }
    try:
        response = requests.post(
            REVERSE_URL,
            json=payload,
            timeout=15,
            headers={"Content-Type": "application/json; charset=utf-8"},
        )
        if response.status_code != 200:
            return None
        decoded_text = smart_decode_response(response)
        return json.loads(decoded_text) if decoded_text else None
    except Exception as e:
        print("REVERSE ERROR:", e)
        return None


# =========================================================
# شبیه‌ساز پرداخت تستی (برای تست لوکال بدون کارت واقعی)
# =========================================================

def payment_simulator_view(request):
    res_num = request.GET.get("res_num", "")
    amount = request.GET.get("amount", str(DONATE_AMOUNT))
    toman = int(amount) // 10 if amount.isdigit() else 15000

    submission = QuizSubmission.objects.filter(payment_res_num=res_num).first()
    phone = submission.phone_number if submission else "—"

    html_content = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>درگاه پرداخت تستی شاپرک (محیط توسعه)</title>
<style>
body{{font-family:Tahoma, Arial, sans-serif;background:linear-gradient(135deg, #1e3a8a, #0f172a);min-height:100vh;margin:0;display:flex;align-items:center;justify-content:center;padding:20px;}}
.card{{background:white;border-radius:24px;max-width:480px;width:100%;padding:35px 30px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);text-align:center;}}
.badge{{background:#fef3c7;color:#92400e;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:bold;display:inline-block;margin-bottom:15px;border:1px solid #fde68a;}}
h1{{font-size:20px;color:#1e293b;margin:0 0 10px 0;}}
.amount-box{{background:#f8fafc;border:2px dashed #cbd5e1;border-radius:16px;padding:20px;margin:20px 0;}}
.amount-val{{font-size:26px;font-weight:bold;color:#15803d;}}
.info-row{{display:flex;justify-content:space-between;font-size:13px;color:#64748b;margin:8px 0;border-bottom:1px solid #f1f5f9;padding-bottom:6px;}}
.info-val{{font-weight:bold;color:#334155;direction:ltr;}}
.btn{{width:100%;border:none;padding:14px;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;transition:all 0.2s;margin-top:10px;}}
.btn-success{{background:#16a34a;color:white;}}
.btn-success:hover{{background:#15803d;}}
.btn-cancel{{background:#f1f5f9;color:#64748b;}}
.btn-cancel:hover{{background:#e2e8f0;color:#334155;}}
</style>
</head>
<body>
<div class="card">
<span class="badge">⚙️ حالت تستی شبیه‌ساز پرداخت شاپرک</span>
<h1>درگاه پرداخت الکترونیک سامان (SEP)</h1>
<p style="font-size:13px;color:#64748b;margin-top:0;">جهت تست فرآیند دونیت و قرعه‌کشی در لوکال</p>

<div class="amount-box">
<div style="font-size:12px;color:#64748b;margin-bottom:5px;">مبلغ حمایت مالی (دونیت):</div>
<div class="amount-val">{toman:,} تومان</div>
<div style="font-size:12px;color:#94a3b8;margin-top:4px;">({int(amount):,} ریال)</div>
</div>

<div class="info-row">
<span>شناسه خرید (ResNum):</span>
<span class="info-val">{res_num}</span>
</div>
<div class="info-row">
<span>شماره همراه شرکت‌کننده:</span>
<span class="info-val">{phone}</span>
</div>
<div class="info-row">
<span>پذیرنده:</span>
<span class="info-val" style="direction:rtl;">سامانه گره‌گشا ایساتیس</span>
</div>

<form method="POST" action="/payment/callback/">
<input type="hidden" name="State" value="OK">
<input type="hidden" name="Status" value="2">
<input type="hidden" name="ResNum" value="{res_num}">
<input type="hidden" name="RefNum" value="TEST_REF_{uuid.uuid4().hex[:12].upper()}">
<input type="hidden" name="Amount" value="{amount}">
<input type="hidden" name="TraceNo" value="987654">
<input type="hidden" name="SecurePan" value="603799******1234">
<button type="submit" class="btn btn-success">✅ شبیه‌سازی پرداخت موفق و بررسی نتیجه</button>
</form>

<form method="POST" action="/payment/callback/">
<input type="hidden" name="State" value="CanceledByUser">
<input type="hidden" name="ResNum" value="{res_num}">
<button type="submit" class="btn btn-cancel">❌ انصراف از پرداخت</button>
</form>
</div>
</body>
</html>"""
    return HttpResponse(html_content)


# =========================================================
# Callback درگاه پرداخت
# =========================================================

@csrf_exempt
def payment_callback(request):
    data = {}
    if request.method == "POST":
        data.update(request.POST.dict())
    data.update(request.GET.dict())

    state      = data.get("State", "Unknown")
    ref_num    = data.get("RefNum", "")
    res_num    = data.get("ResNum", "")
    amount     = data.get("Amount", "0")
    trace_no   = data.get("TraceNo", "")
    secure_pan = data.get("SecurePan", "")

    submission = QuizSubmission.objects.filter(payment_res_num=res_num).first() if res_num else None

    verify_success = False
    verify_message = ""

    # بررسی پرداخت تستی لوکال
    is_simulated = ref_num.startswith("TEST_REF_")

    if state == "OK" and ref_num:
        if is_simulated:
            verify_success = True
            verify_message = "پرداخت تستی با موفقیت شبیه‌سازی شد."
        else:
            verify_data = verify_transaction(ref_num, TERMINAL_ID)
            if verify_data and verify_data.get("Success") is True and verify_data.get("ResultCode") == 0:
                returned_amount = verify_data.get("TransactionDetail", {}).get("OrginalAmount", 0)
                if int(returned_amount) == int(amount):
                    verify_success = True
                    verify_message = "پرداخت با موفقیت در شاپرک تایید شد."
                else:
                    verify_message = f"مبلغ برگشتی {returned_amount} با {amount} مطابقت ندارد."
                    reverse_transaction(ref_num, TERMINAL_ID)
            else:
                rc = verify_data.get("ResultCode", "?") if verify_data else "Error"
                rd = verify_data.get("ResultDescription", "خطا در تایید تراکنش شاپرک") if verify_data else "ارتباط برقرار نشد"
                verify_message = f"تایید ناموفق: {rd} (کد {rc})"
    elif state == "CanceledByUser":
        verify_message = "پرداخت توسط کاربر لغو گردید."
    elif state == "Failed":
        verify_message = "عملیات پرداخت ناموفق بود."
    elif state == "InvalidParameters":
        verify_message = "پارامترهای ارسالی یا آدرس بازگشت با پنل شاپرک همخوانی ندارد."
    else:
        verify_message = f"وضعیت پرداخت: {state}"

    # اگر مربوط به پاسخ مسابقه باشد:
    if submission:
        if verify_success:
            submission.payment_status = 'paid'
            submission.has_donated = True
            submission.payment_ref_num = ref_num
            submission.payment_trace_no = trace_no
            submission.payment_card_pan = secure_pan
            submission.donation_amount = int(amount) if str(amount).isdigit() else DONATE_AMOUNT
            submission.save()
            return render_quiz_payment_result(submission, True, verify_message, amount, ref_num, trace_no)
        else:
            # در صورت عدم پرداخت موفق، اطلاعات حذف می‌شود تا هیچ ثبتی در سامانه نماند
            phone_num = submission.phone_number
            submission.delete()
            return render_quiz_payment_result(None, False, verify_message, amount, ref_num, trace_no, phone_number=phone_num)

    # در صورتی که پرداخت مستقل دونیت عمومی بوده باشد
    return render_general_payment_result(verify_success, verify_message, state, ref_num, res_num, amount, trace_no, secure_pan)


# =========================================================
# صفحه نتیجه پرداخت مسابقه + نمایش بدون نقص کارت طلایی (Base64)
# =========================================================

def render_quiz_payment_result(submission, is_success, message, amount, ref_num, trace_no, phone_number=""):
    toman = int(amount) // 10 if str(amount).isdigit() else 15000
    phone = submission.phone_number if submission else phone_number

    if is_success and submission:
        card_code = submission.golden_card_code
        created_jalali = submission.golden_card_created_jalali
        expires_jalali = submission.golden_card_expires_jalali
        card_base64 = generate_burned_card_base64(card_code, created_jalali, expires_jalali)

        if submission.is_correct:
            badge_title = "🎉 تبریک! پاسخ شما صحیح بود و وارد قرعه‌کشی شدید"
            badge_desc = "پرداخت حمایت مالی شما با موفقیت ثبت شد و چون به سوال مسابقه پاسخ صحیح دادید، شماره همراه شما رسماً در لیست قرعه‌کشی جوایز ویژه قرار گرفت و کارت طلایی تخفیف ۱ ساله زیر نیز تقدیم شما می‌گردد."
            lottery_pill = '<div style="background:#dcfce7;color:#15803d;padding:10px 18px;border-radius:14px;font-weight:bold;font-size:14px;display:inline-flex;align-items:center;gap:6px;border:1px solid #bbf7d0;">🎯 شرکت داده شده در قرعه‌کشی رسمی جوایز + دارنده کارت طلایی</div>'
        else:
            badge_title = "متأسفانه پاسخ شما نادرست بود"
            badge_desc = "پاسخ انتخابی شما به سوال مسابقه نادرست بود و در قرعه‌کشی جوایز ویژه شرکت داده نشدید. با این حال به پاس حمایت مالی و همراهی شما، کارت طلایی تخفیف ۱ ساله گره‌گشا تقدیم شما می‌گردد."
            lottery_pill = '<div style="background:#fef3c7;color:#92400e;padding:10px 18px;border-radius:14px;font-weight:bold;font-size:14px;display:inline-flex;align-items:center;gap:6px;border:1px solid #fde68a;">🎟️ اهدا شده: کارت طلایی تخفیف ۱ ساله (بدون ورود به قرعه‌کشی)</div>'

        header_color = "#15803d"
        status_icon = "✅"

        card_section = f"""
        <!-- کارت طلایی داینامیک حک‌شده (بدون ارور ۴۰۴) -->
        <div class="golden-card-wrapper" id="goldenCardWrapper">
            <img src="{card_base64}" class="golden-card-img" alt="کارت طلایی گره گشا" />
        </div>

        <div class="actions-row">
            <button onclick="copyCardCode('{card_code}')" class="btn btn-gold">
                📋 کپی کد کارت طلایی ({card_code})
            </button>
            <button onclick="downloadCardImage()" class="btn btn-outline">
                📥 دانلود مستقیم تصویر کارت
            </button>
            <a href="/" class="btn btn-primary">
                🏠 بازگشت به صفحه اصلی
            </a>
        </div>

        <table class="receipt-table">
            <tr style="background:#f8fafc;"><td style="font-weight:bold;color:#64748b;">مبلغ پرداختی:</td><td style="font-weight:bold;color:#15803d;">{toman:,} تومان</td></tr>
            <tr><td style="font-weight:bold;color:#64748b;">شماره مرجع بانکی (RefNum):</td><td style="direction:ltr;font-family:monospace;">{ref_num or "—"}</td></tr>
            <tr style="background:#f8fafc;"><td style="font-weight:bold;color:#64748b;">کد پیگیری تراکنش:</td><td style="direction:ltr;font-family:monospace;">{trace_no or "—"}</td></tr>
            <tr><td style="font-weight:bold;color:#64748b;">شماره همراه شرکت‌کننده:</td><td style="direction:ltr;">{phone}</td></tr>
        </table>
        """
    else:
        # در صورت عدم پرداخت یا لغو تراکنش، کارت نمایش داده نمی‌شود و هیچ ثبتی نمی‌ماند
        status_icon = "❌"
        header_color = "#dc2626"
        badge_title = "عملیات پرداخت انجام نشد"
        badge_desc = f"{message} — هیچ پاسخی در مسابقه ثبت نشد و اطلاعاتی ذخیره نگردید. جهت شرکت در مسابقه و دریافت کارت طلایی می‌توانید مجدداً اقدام نمایید."
        lottery_pill = '<div style="background:#fee2e2;color:#991b1b;padding:8px 14px;border-radius:12px;font-size:13px;font-weight:bold;">⚠️ پرداخت ناموفق (اطلاعاتی در سیستم ثبت نشد)</div>'
        card_section = f"""
        <div class="actions-row" style="margin-top:30px;">
            <a href="/" class="btn btn-primary">
                🔄 بازگشت و تلاش مجدد
            </a>
        </div>
        """

    html_page = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>نتیجه مسابقه و دریافت کارت طلایی</title>
<style>
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
*{{box-sizing:border-box;}}
body{{font-family:Vazirmatn, Tahoma, sans-serif;background:linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);min-height:100vh;margin:0;padding:25px 15px;color:#1e293b;}}
.container{{max-width:680px;margin:auto;}}
.card-box{{background:white;border-radius:24px;padding:30px 24px;box-shadow:0 15px 35px rgba(0,0,0,0.06);border:1px solid #e2e8f0;margin-bottom:25px;text-align:center;}}
.icon-circle{{width:70px;height:70px;border-radius:50%;background:#f0fdf4;color:{header_color};display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 15px auto;box-shadow:0 4px 12px rgba(0,0,0,0.05);}}
h1{{font-size:22px;color:{header_color};margin:0 0 10px 0;line-height:1.4;}}
p{{color:#475569;font-size:14px;line-height:1.8;margin:8px 0 16px 0;}}
.golden-card-wrapper{{position:relative;width:100%;max-width:520px;margin:20px auto;border-radius:20px;overflow:hidden;box-shadow:0 18px 40px rgba(180, 83, 9, 0.25);border:2px solid #fef08a;background:#0f172a;}}
.golden-card-img{{width:100%;height:auto;display:block;border-radius:18px;}}
.actions-row{{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}}
.btn{{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 22px;border-radius:14px;font-size:14px;font-weight:bold;text-decoration:none;cursor:pointer;border:none;transition:all 0.2s;}}
.btn-primary{{background:#1e3a8a;color:white;}}
.btn-primary:hover{{background:#1e40af;}}
.btn-gold{{background:linear-gradient(135deg, #d97706, #b45309);color:white;box-shadow:0 4px 15px rgba(217, 119, 6, 0.35);}}
.btn-gold:hover{{opacity:0.95;}}
.btn-outline{{background:#f8fafc;color:#334155;border:1px solid #cbd5e1;}}
.btn-outline:hover{{background:#e2e8f0;}}
.receipt-table{{width:100%;border-collapse:collapse;margin:20px 0 10px 0;font-size:13px;text-align:right;}}
.receipt-table td{{padding:10px 14px;border-bottom:1px solid #f1f5f9;}}
.receipt-table tr:last-child td{{border-bottom:none;}}
.toast{{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0f172a;color:white;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:bold;display:none;z-index:999;}}
</style>
</head>
<body>

<div class="container">
<div class="card-box">
<div class="icon-circle">{status_icon}</div>
<h1>{badge_title}</h1>
<p>{badge_desc}</p>
<div style="margin:10px 0 20px 0;">{lottery_pill}</div>

{card_section}

</div>
</div>

<div id="toast" class="toast">کد کارت طلایی کپی شد! ✅</div>

<script>
function copyCardCode(code) {{
    navigator.clipboard.writeText(code).then(() => {{
        const t = document.getElementById('toast');
        t.style.display = 'block';
        setTimeout(() => {{ t.style.display = 'none'; }}, 2500);
    }});
}}

function downloadCardImage() {{
    const imgEl = document.querySelector('#goldenCardWrapper img');
    if (!imgEl || !imgEl.src) return;
    const a = document.createElement('a');
    a.download = 'Golden-Card.jpg';
    a.href = imgEl.src;
    a.click();
}}
</script>
</body>
</html>"""
    return HttpResponse(html_page)


# =========================================================
# صفحه نتیجه پرداخت عمومی (دونیت مستقل)
# =========================================================

def render_general_payment_result(is_success, message, state, ref_num, res_num, amount, trace_no, secure_pan):
    toman = int(amount) // 10 if str(amount).isdigit() else 15000
    title = "پرداخت موفق" if is_success else "پرداخت ناموفق"
    color = "#15803d" if is_success else "#dc2626"
    icon = "✅" if is_success else "❌"

    html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>
body{{font-family:Tahoma, Arial, sans-serif;background:#f3f4f6;padding:40px 15px;margin:0;}}
.box{{max-width:600px;margin:auto;background:white;padding:35px 25px;border-radius:20px;
box-shadow:0 10px 30px rgba(0,0,0,.08);text-align:center;}}
.icon{{font-size:55px;}}h2{{color:{color};margin-top:10px;}}p{{color:#555;font-size:15px;line-height:1.8;}}
table{{width:100%;border-collapse:collapse;margin-top:20px;font-size:14px;text-align:right;}}
td{{padding:10px;border-bottom:1px solid #eee;}}
.btn{{display:inline-block;margin-top:25px;padding:12px 30px;background:#1e3a8a;
color:white;text-decoration:none;border-radius:12px;font-weight:bold;}}
</style></head>
<body><div class="box"><div class="icon">{icon}</div>
<h2>{title}</h2><p>{message}</p>
<table>
<tr><td><b>وضعیت:</b></td><td>{html.escape(state)}</td></tr>
<tr><td><b>کد پیگیری بانکی (RefNum):</b></td><td style="direction:ltr;">{html.escape(ref_num) or "—"}</td></tr>
<tr><td><b>شناسه خرید (ResNum):</b></td><td style="direction:ltr;">{html.escape(res_num)}</td></tr>
<tr><td><b>مبلغ:</b></td><td>{toman:,} تومان ({html.escape(amount)} ریال)</td></tr>
<tr><td><b>شماره کارت:</b></td><td style="direction:ltr;">{html.escape(secure_pan) or "—"}</td></tr>
</table>
<a href="/" class="btn">بازگشت به سایت</a>
</div></body></html>"""
    return HttpResponse(html)


# =========================================================
# صفحه تست Verify تراکنش‌ها
# =========================================================

def test_verify_view(request):
    ref_num  = request.GET.get("ref_num", "").strip()
    terminal = request.GET.get("terminal", TERMINAL_ID).strip()

    if not ref_num:
        return HttpResponse(
            "<h3>لطفا ref_num را ارسال کنید</h3>"
            f"<p>مثال: /payment/test-verify/?ref_num=XXX&terminal={TERMINAL_ID}</p>"
        )

    payload = {"RefNum": ref_num, "TerminalNumber": int(terminal)}
    results_html = ""

    for i, url in enumerate(VERIFY_URL_CANDIDATES, 1):
        try:
            r = requests.post(url, json=payload, timeout=10, headers={"Content-Type": "application/json; charset=utf-8"})
            decoded = smart_decode_response(r)
            if r.status_code == 200 and decoded:
                try:
                    parsed = json.loads(decoded)
                    cls = "background:#e8f5e9;border:1px solid #4caf50;"
                    status_text = f"✅ HTTP {r.status_code} — JSON معتبر"
                    body = json.dumps(parsed, indent=2, ensure_ascii=False)
                except ValueError:
                    cls = "background:#fff3e0;border:1px solid #ff9800;"
                    status_text = f"⚠️ HTTP {r.status_code} — پاسخ غیر JSON"
                    body = decoded[:1000]
            else:
                cls = "background:#ffebee;border:1px solid #f44336;"
                status_text = f"❌ HTTP {r.status_code}"
                body = decoded[:1000] if decoded else "(خالی)"
        except Exception as e:
            cls = "background:#ffebee;border:1px solid #f44336;"
            status_text = f"❌ خطا: {e}"
            body = str(e)

        results_html += f"""
        <div style="{cls}border-radius:10px;padding:15px;margin-bottom:15px;text-align:right;">
            <p><b>آدرس {i}:</b> <code style="direction:ltr;">{html.escape(url)}</code></p>
            <p style="font-weight:bold;">{status_text}</p>
            <pre style="background:#263238;color:#aed581;padding:10px;border-radius:6px;direction:ltr;text-align:left;overflow-x:auto;">{html.escape(body)}</pre>
        </div>"""

    return HttpResponse(f"""<!DOCTYPE html>
<html lang="fa" dir="rtl"><head><meta charset="UTF-8"><title>تست Verify</title></head>
<body style="font-family:Tahoma;background:#f0f4f8;padding:30px;">
<div style="max-width:850px;margin:auto;background:white;padding:30px;border-radius:16px;box-shadow:0 5px 20px rgba(0,0,0,.08);">
<h2>تست آدرس‌های تایید (Verify) سامان</h2>
<p>RefNum: <code style="direction:ltr;">{html.escape(ref_num)}</code></p>
<hr>{results_html}<p><a href="/">بازگشت</a></p></div></body></html>""")

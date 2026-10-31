import uuid
import html
import json
import requests

from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt


# =========================================================
# تنظیمات SEP
# =========================================================

TERMINAL_ID   = "21689219"
DONATE_AMOUNT = 150000

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


# =========================================================
# صفحه حمایت مالی
# =========================================================

def donate_page(request):
    return render(request, "payment/donate.html")


# =========================================================
# تابع کمکی خطا
# =========================================================

def payment_error(message, status_code=400):
    safe_message = html.escape(str(message))
    return HttpResponse(
        f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="UTF-8"><title>خطا</title>
<style>body{{font-family:Tahoma;background:#f5f5f5;padding:50px;text-align:center;}}
.box{{max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;
box-shadow:0 5px 20px rgba(0,0,0,.08);}}h2{{color:#c62828;}}</style></head>
<body><div class="box"><h2>خطا در پرداخت</h2><p>{safe_message}</p>
<p><a href="/">بازگشت</a></p></div></body></html>""",
        status=status_code,
    )


# =========================================================
# شروع پرداخت
# =========================================================

def start_payment(request):
    if request.method != "POST":
        return payment_error("روش درخواست نامعتبر است.")

    res_num = uuid.uuid4().hex[:20]
    callback_url = request.build_absolute_uri(reverse("payment_callback"))

    print("=" * 70)
    print("SEP CALLBACK URL:", callback_url)

    payload = {
        "action": "token",
        "TerminalId": int(TERMINAL_ID),
        "Amount": DONATE_AMOUNT,
        "ResNum": res_num,
        "RedirectUrl": callback_url,
    }
    print("SEP PAYLOAD:", payload)

    try:
        response = requests.post(TOKEN_URL, json=payload, timeout=30)
    except requests.exceptions.RequestException as e:
        print("SEP ERROR:", e)
        return payment_error("خطا در ارتباط با درگاه پرداخت.")

    print("SEP RESPONSE:", response.text)

    try:
        data = response.json()
    except ValueError:
        return payment_error("پاسخ درگاه نامعتبر است.")

    if data.get("status") != 1:
        return payment_error(data.get("errorDesc", "خطا در دریافت توکن"))

    token = data.get("token")
    if not token:
        return payment_error("توکن دریافت نشد.")

    request.session["sep_token"]   = token
    request.session["sep_res_num"] = res_num
    request.session["sep_amount"]  = DONATE_AMOUNT

    form_html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="UTF-8"><meta name="referrer" content="origin">
<title>انتقال</title></head>
<body onload="document.getElementById('f').submit();">
<p style="text-align:center;font-family:Tahoma;">در حال انتقال...</p>
<form id="f" action="{PAYMENT_URL}" method="POST">
<input type="hidden" name="Token" value="{token}" />
<input type="hidden" name="GetMethod" value="true" />
</form></body></html>"""
    return HttpResponse(form_html)


# =========================================================
# تابع decode هوشمند (با پشتیبانی از انکودینگ‌های مختلف)
# =========================================================

def smart_decode_response(response):
    """
    پاسخ requests را با انکودینگ صحیح decode می‌کند.
    سامان گاهی windows-1256 برمی‌گرداند.
    """
    raw_bytes = response.content
    
    print("RAW BYTES LENGTH:", len(raw_bytes))
    print("RAW BYTES (first 200):", raw_bytes[:200])
    print("CONTENT-TYPE:", response.headers.get("Content-Type"))
    
    if not raw_bytes:
        return None
    
    # تلاش با انکودینگ‌های مختلف
    encodings_to_try = [
        "utf-8",
        "utf-8-sig",
        "windows-1256",
        "iso-8859-6",
        "cp1256",
    ]
    
    for encoding in encodings_to_try:
        try:
            decoded = raw_bytes.decode(encoding)
            # بررسی که آیا JSON معتبر است
            try:
                json.loads(decoded)
                print(f"✅ SUCCESS with encoding: {encoding}")
                return decoded
            except ValueError:
                print(f"⚠️ Decoded with {encoding} but not valid JSON")
                # ادامه بده و انکودینگ بعدی را امتحان کن
                continue
        except UnicodeDecodeError as e:
            print(f"❌ Failed with {encoding}: {e}")
            continue
    
    # اگر هیچ‌کدام کار نکرد، با replace استفاده کن
    print("⚠️ FALLBACK to utf-8 with replace")
    return raw_bytes.decode("utf-8", errors="replace")


# =========================================================
# Verify تراکنش
# =========================================================

def verify_transaction(ref_num, terminal_id):
    payload = {
        "RefNum": ref_num,
        "TerminalNumber": int(terminal_id),
    }

    print("=" * 70)
    print("VERIFY URL:", VERIFY_URL)
    print("VERIFY PAYLOAD:", payload)

    try:
        response = requests.post(
            VERIFY_URL,
            json=payload,
            timeout=30,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
            },
        )
    except requests.exceptions.RequestException as e:
        print("VERIFY REQUEST ERROR:", e)
        return None

    print("VERIFY HTTP STATUS:", response.status_code)

    if response.status_code != 200:
        print("VERIFY NON-200 STATUS:", response.status_code)
        print("VERIFY RAW TEXT:", repr(response.text[:500]))
        return None

    # Decode هوشمند
    decoded_text = smart_decode_response(response)
    
    if not decoded_text:
        print("⚠️ DECODED TEXT IS EMPTY")
        return None
    
    print("VERIFY DECODED TEXT:", repr(decoded_text[:500]))
    
    # پارس JSON
    try:
        return json.loads(decoded_text)
    except ValueError as e:
        print("VERIFY JSON PARSE ERROR:", e)
        return None


# =========================================================
# Reverse تراکنش
# =========================================================

def reverse_transaction(ref_num, terminal_id):
    payload = {
        "RefNum": ref_num,
        "TerminalNumber": int(terminal_id),
    }

    print("=" * 70)
    print("REVERSE URL:", REVERSE_URL)
    print("REVERSE PAYLOAD:", payload)

    try:
        response = requests.post(
            REVERSE_URL,
            json=payload,
            timeout=30,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
            },
        )
    except requests.exceptions.RequestException as e:
        print("REVERSE REQUEST ERROR:", e)
        return None

    print("REVERSE HTTP STATUS:", response.status_code)

    if response.status_code != 200:
        return None

    decoded_text = smart_decode_response(response)
    if not decoded_text:
        return None

    try:
        return json.loads(decoded_text)
    except ValueError as e:
        print("REVERSE JSON PARSE ERROR:", e)
        return None


# =========================================================
# View تست
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

    html_output = """<!DOCTYPE html>
<html lang="fa" dir="rtl"><head><meta charset="UTF-8">
<title>تست Verify</title>
<style>
body{font-family:Tahoma;background:#f0f4f8;padding:30px;}
.box{max-width:1000px;margin:auto;background:white;padding:30px;
border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,.08);}
h2{color:#1976d2;}
.result{border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:15px;}
.success{background:#e8f5e9;border-color:#4caf50;}
.fail{background:#ffebee;border-color:#f44336;}
.warn{background:#fff3e0;border-color:#ff9800;}
code{background:#f5f5f5;padding:2px 6px;border-radius:4px;direction:ltr;}
pre{background:#263238;color:#aed581;padding:15px;border-radius:6px;
overflow-x:auto;direction:ltr;text-align:left;font-size:13px;}
</style></head><body><div class="box">
<h2>تست آدرس‌های Verify</h2>
<p>RefNum: <code>""" + html.escape(ref_num) + """</code></p>
<hr>"""

    for i, url in enumerate(VERIFY_URL_CANDIDATES, 1):
        print(f"\n{'='*60}\nTESTING: {url}")
        
        try:
            r = requests.post(
                url, json=payload, timeout=15,
                headers={"Content-Type": "application/json; charset=utf-8"}
            )
            
            decoded = smart_decode_response(r)
            
            if r.status_code == 200 and decoded:
                try:
                    parsed = json.loads(decoded)
                    cls = "success"
                    status_text = f"✅ HTTP {r.status_code} — JSON معتبر"
                    body_preview = json.dumps(parsed, indent=2, ensure_ascii=False)
                except ValueError:
                    cls = "warn"
                    status_text = f"⚠️ HTTP {r.status_code} — JSON نامعتبر"
                    body_preview = decoded[:1000]
            elif r.status_code == 200:
                cls = "warn"
                status_text = f"⚠️ HTTP {r.status_code} — پاسخ خالی"
                body_preview = "(خالی)"
            else:
                cls = "fail"
                status_text = f"❌ HTTP {r.status_code}"
                body_preview = decoded[:1000] if decoded else "(خالی)"
                
        except Exception as e:
            cls = "fail"
            status_text = f"❌ خطا: {e}"
            body_preview = str(e)

        html_output += f"""
        <div class="result {cls}">
            <p><b>تست {i}:</b> <code>{html.escape(url)}</code></p>
            <p style="font-weight:bold;font-size:16px;">{status_text}</p>
            <pre>{html.escape(body_preview)}</pre>
        </div>"""

    html_output += """
    <hr>
    <p><b>راهنما:</b></p>
    <ul>
    <li>🟢 سبز = آدرس صحیح (JSON معتبر)</li>
    <li>🟠 نارنجی = آدرس درست ولی پاسخ خالی یا JSON نامعتبر</li>
    <li>🔴 قرمز = HTTP 404 یا خطای اتصال</li>
    </ul>
    <p><a href="/">بازگشت</a></p></div></body></html>"""

    return HttpResponse(html_output)


# =========================================================
# Callback
# =========================================================

@csrf_exempt
def payment_callback(request):
    print("=" * 70)
    print("SEP CALLBACK RECEIVED")
    print("METHOD:", request.method)

    data = {}
    if request.method == "POST":
        data.update(request.POST.dict())
    data.update(request.GET.dict())

    print("SEP CALLBACK DATA:", data)
    print("=" * 70)

    state      = data.get("State", "Unknown")
    status     = data.get("Status", "0")
    ref_num    = data.get("RefNum", "")
    res_num    = data.get("ResNum", "")
    amount     = data.get("Amount", "0")
    trace_no   = data.get("TraceNo", "")
    secure_pan = data.get("SecurePan", "")

    verify_success = False
    verify_message = ""
    verify_data    = {}

    if state == "OK" and ref_num:
        used_ref_nums = request.session.get("used_ref_nums", [])

        if ref_num in used_ref_nums:
            verify_message = "این تراکنش قبلا تایید شده است."
            print("DOUBLE SPENDING:", ref_num)
        else:
            verify_data = verify_transaction(ref_num, TERMINAL_ID)

            if verify_data is None:
                verify_message = (
                    "خطا در ارتباط با سرویس تایید. "
                    "لاگ سرور را بررسی کنید یا از /payment/test-verify/ استفاده کنید."
                )
            elif verify_data.get("Success") is True and verify_data.get("ResultCode") == 0:
                txn_detail      = verify_data.get("TransactionDetail", {})
                returned_amount = txn_detail.get("OrginalAmount", 0)

                print("RETURNED:", returned_amount, "EXPECTED:", amount)

                if int(returned_amount) == int(amount):
                    verify_success = True
                    verify_message = "پرداخت با موفقیت تایید شد."
                    used_ref_nums.append(ref_num)
                    request.session["used_ref_nums"] = used_ref_nums
                    print(f"✅ Transaction {ref_num} verified!")
                else:
                    verify_message = f"مبلغ برگشتی {returned_amount} با {amount} مطابقت ندارد."
                    reverse_transaction(ref_num, TERMINAL_ID)
            else:
                rc = verify_data.get("ResultCode", "?")
                rd = verify_data.get("ResultDescription", "خطای ناشناخته")
                verify_message = f"تایید ناموفق: {rd} (کد {rc})"

    elif state == "CanceledByUser":
        verify_message = "پرداخت لغو شد."
    elif state == "Failed":
        verify_message = "پرداخت انجام نشد."
    elif state == "SessionIsNull":
        verify_message = "زمان پرداخت تمام شد."
    else:
        verify_message = f"وضعیت: {state}"

    if verify_success:
        title, color, icon = "پرداخت موفق", "#2e7d32", "✅"
        message = "از حمایت شما سپاسگزاریم."
    else:
        title, color, icon = "پرداخت ناموفق", "#c62828", "❌"
        message = verify_message

    details_html = f"""
    <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px;">
    <tr style="background:#f5f5f5;"><td style="padding:10px;border:1px solid #ddd;width:40%;"><b>وضعیت</b></td>
    <td style="padding:10px;border:1px solid #ddd;">{html.escape(state)}</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;"><b>RefNum</b></td>
    <td style="padding:10px;border:1px solid #ddd;direction:ltr;text-align:left;">{html.escape(ref_num) or "-"}</td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:10px;border:1px solid #ddd;"><b>ResNum</b></td>
    <td style="padding:10px;border:1px solid #ddd;">{html.escape(res_num)}</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;"><b>مبلغ</b></td>
    <td style="padding:10px;border:1px solid #ddd;">{html.escape(amount)} ریال</td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:10px;border:1px solid #ddd;"><b>TraceNo</b></td>
    <td style="padding:10px;border:1px solid #ddd;">{html.escape(trace_no) or "-"}</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd;"><b>کارت</b></td>
    <td style="padding:10px;border:1px solid #ddd;">{html.escape(secure_pan) or "-"}</td></tr>
    </table>"""

    response_html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl"><head><meta charset="UTF-8"><title>نتیجه</title>
<style>body{{font-family:Tahoma;background:#f0f4f8;padding:40px 20px;}}
.box{{max-width:700px;margin:auto;background:white;padding:30px;border-radius:12px;
box-shadow:0 5px 20px rgba(0,0,0,.08);text-align:center;}}
.icon{{font-size:60px;}}h2{{color:{color};}}p{{color:#555;}}
.btn{{display:inline-block;margin-top:20px;padding:12px 30px;background:#1976d2;
color:white;text-decoration:none;border-radius:8px;font-weight:bold;}}</style>
</head><body><div class="box"><div class="icon">{icon}</div>
<h2>{title}</h2><p>{message}</p>{details_html}
<a href="/" class="btn">بازگشت</a></div></body></html>"""
    return HttpResponse(response_html)
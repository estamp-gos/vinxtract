<?php
// payments.docukit.site/vinxtract.php
// Payment page for VinXtract (3rd party integration)

error_reporting(E_ALL);
ini_set('display_errors', 1);

// ============================================
// GET DATA FROM QUERY STRING
// ============================================
$name = isset($_GET['name']) ? htmlspecialchars(urldecode($_GET['name'])) : '';
$email = isset($_GET['email']) ? htmlspecialchars(urldecode($_GET['email'])) : '';
$phone = isset($_GET['phone']) ? htmlspecialchars(urldecode($_GET['phone'])) : '';
$vin = isset($_GET['vin']) ? htmlspecialchars(urldecode($_GET['vin'])) : '';
$vehicleType = isset($_GET['vehicle_type']) ? htmlspecialchars(urldecode($_GET['vehicle_type'])) : 'Car';
$package = isset($_GET['package']) ? htmlspecialchars(urldecode($_GET['package'])) : 'basic';
$amount = isset($_GET['amount']) ? (float)$_GET['amount'] : 29;
$currency = isset($_GET['currency']) ? htmlspecialchars(urldecode($_GET['currency'])) : 'USD';

// Validate required fields
if (empty($name) || empty($email) || empty($vin)) {
    die("Error: Missing required fields. Please go back and fill all required information.");
}

// Package display name
$packageNames = [
    'basic' => 'Basic Report',
    'premium' => 'Premium Report',
    'ultimate' => 'Ultimate Report'
];
$displayPackage = $packageNames[$package] ?? 'Basic Report';

// Currency symbol
$currencySymbol = '$';
if ($currency == 'GBP') $currencySymbol = '£';
if ($currency == 'EUR') $currencySymbol = '€';

// Paddle Price IDs
$priceIds = [
    'basic' => 'pri_01krk1p8r73ba0kv41bfy09k89',
    'premium' => 'pri_01krk1n9tnjg7nyex9e4n6akkw',
    'ultimate' => 'pri_01krk1kkza3vmnvdbgj69m09c8'
];

$paddleToken = 'live_4d8274c2bffeec3a2558df9da5a';
$selectedPriceId = $priceIds[$package] ?? $priceIds['basic'];

// VinXtract Logo
$vinxtractLogo = 'https://img.stitchnhide.com//upload/6a1e35e919f14.png';

// FIXED: Payment ke baad hamesha yehi URL use hogi
$successUrl = 'https://www.vinxtract.com/thankyou';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Payment | VinXtract × DocuKit</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .payment-container { max-width: 550px; width: 100%; }
        .payment-card {
            background: white;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .logo { text-align: center; margin-bottom: 25px; }
        .logo img { height: 60px; }
        .order-summary {
            background: #F8F9FF;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 25px;
        }
        .order-summary h3 { color: #03045E; margin-bottom: 15px; font-size: 18px; }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E5E7EB;
        }
        .summary-row:last-child { border-bottom: none; }
        .summary-label { color: #6C757D; font-size: 14px; }
        .summary-value { font-weight: 600; color: #03045E; }
        .total-row .summary-value { color: #6C63FF; font-size: 18px; }
        .checkbox-group { margin: 20px 0; }
        .checkbox-container {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            cursor: pointer;
            font-size: 13px;
        }
        .checkbox-container input { width: 18px; height: 18px; margin-top: 2px; cursor: pointer; }
        .btn-paddle {
            width: 100%;
            background: linear-gradient(135deg, #6C63FF, #00B4D8);
            color: white;
            border: none;
            padding: 16px;
            font-size: 18px;
            font-weight: 700;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
        }
        .btn-paddle:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(108,99,255,0.3); }
        .btn-paddle:disabled { opacity: 0.6; cursor: not-allowed; }
        .loading { display: none; text-align: center; margin-top: 20px; color: #6C63FF; }
        .error-msg { color: red; font-size: 13px; text-align: center; margin-top: 10px; display: none; }
        .docukit-credit { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6C757D; }
        .location-note {
            background: #E8E6FF;
            border-radius: 12px;
            padding: 10px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 12px;
            color: #6C63FF;
        }
    </style>
    <script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
</head>
<body>
    <div class="payment-container">
        <div class="payment-card">
            <div class="logo">
                <img src="<?php echo $vinxtractLogo; ?>" alt="VinXtract">
                <h2 style="color:#03045E; margin-top:10px; font-size:22px;">Secure Payment</h2>
            </div>
            
            <div class="location-note">
                Complete your payment securely. Your report will be delivered to your email.
            </div>
            
            <div class="order-summary">
                <h3>Order Summary</h3>
                <div class="summary-row"><span class="summary-label">Name</span><span class="summary-value"><?php echo $name ?: '—'; ?></span></div>
                <div class="summary-row"><span class="summary-label">Email</span><span class="summary-value"><?php echo $email ?: '—'; ?></span></div>
                <div class="summary-row"><span class="summary-label">VIN Number</span><span class="summary-value"><?php echo $vin ?: '—'; ?></span></div>
                <div class="summary-row"><span class="summary-label">Vehicle Type</span><span class="summary-value"><?php echo $vehicleType ?: '—'; ?></span></div>
                <div class="summary-row"><span class="summary-label">Package</span><span class="summary-value"><?php echo $displayPackage; ?></span></div>
                <div class="summary-row total-row"><span class="summary-label">Total Amount</span><span class="summary-value"><?php echo $currencySymbol . number_format($amount); ?> <?php echo $currency; ?></span></div>
            </div>
            
            <div class="checkbox-group">
                <label class="checkbox-container">
                    <input type="checkbox" id="agreeCheckbox">
                    <span>I confirm that all information is accurate. After payment, your report will be sent to your email within 1-2 hours. If not received, please check your spam folder.</span>
                </label>
            </div>
            
            <button class="btn-paddle" id="payNowBtn" disabled>
                <span>Proceed to Payment (<?php echo $currencySymbol . number_format($amount); ?>)</span>
            </button>
            
            <div class="loading" id="loading">
                <span>Loading secure checkout...</span>
            </div>
            <div class="error-msg" id="errorMsg"></div>
            
            <div class="docukit-credit">
                <p>Secure Payments by <strong>Paddle</strong> | Powered by <strong>DocuKit</strong></p>
                <p style="margin-top: 5px;">© VinXtract | Vehicle History Reports</p>
            </div>
        </div>
    </div>
    
    <script>
        const payBtn = document.getElementById('payNowBtn');
        const agreeCheckbox = document.getElementById('agreeCheckbox');
        const loading = document.getElementById('loading');
        const errorMsg = document.getElementById('errorMsg');
        
        const successUrl = '<?php echo $successUrl; ?>';
        
        agreeCheckbox.addEventListener('change', function() {
            payBtn.disabled = !this.checked;
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            Paddle.Environment.set('production');
            Paddle.Initialize({
                token: '<?php echo $paddleToken; ?>'
            });
        });
        
        payBtn.addEventListener('click', function() {
            payBtn.disabled = true;
            loading.style.display = 'block';
            errorMsg.style.display = 'none';
            
            Paddle.Checkout.open({
                settings: {
                    successUrl: successUrl,
                },
                items: [{ priceId: '<?php echo $selectedPriceId; ?>', quantity: 1 }],
                customer: {
                    email: '<?php echo $email; ?>',
                    name: '<?php echo $name; ?>'
                },
                errorCallback: function(error) {
                    loading.style.display = 'none';
                    errorMsg.style.display = 'block';
                    errorMsg.innerText = 'Payment failed: ' + (error.message || 'Unknown error');
                    payBtn.disabled = false;
                }
            });
        });
    </script>
</body>
</html>
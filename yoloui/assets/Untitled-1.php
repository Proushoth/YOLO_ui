<?php 

// Open the text file
$file = fopen("invoiceNumbers.txt", "r");

// Read the contents of the file
$content = fread($file, filesize("invoiceNumbers.txt"));

// Close the file
fclose($file);

require_once("inc/conn.php");
if (isset($_GET['submit'])) {
  $advance = isset($_GET['advance']) ? $_GET['advance'] : null;
  $Cname = isset($_GET['Cname']) ? $_GET['Cname'] : null;
  $Cphone1 = isset($_GET['Cphone1']) ? $_GET['Cphone1'] : null;
  $Cphone2 = isset($_GET['Cphone2']) ? $_GET['Cphone2'] : null;
  $fdate = isset($_GET['fdate']) ? $_GET['fdate'] : null;
  $time = isset($_GET['time']) ? $_GET['time'] : null;
  $ftype = isset($_GET['ftype']) ? $_GET['ftype'] : null;
  $pax = isset($_GET['pax']) ? $_GET['pax'] : null;
  $hall1 = isset($_GET['hall1']) ? $_GET['hall1'] : null;
  $hall2 = isset($_GET['hall2']) ? $_GET['hall2'] : null;
  $hall3 = isset($_GET['hall3']) ? $_GET['hall3'] : null;
  $totalPrice = isset($_GET['totalPrice']) ? $_GET['totalPrice'] : null;
  $discount = isset($_GET['discount']) ? $_GET['discount'] : null;
  $finalTotalPrice = isset($_GET['finalTotalPrice']) ? $_GET['finalTotalPrice'] : null;
  $throne = isset($_GET['throne']) ? $_GET['throne'] : null;
  $DJ = isset($_GET['DJ']) ? $_GET['DJ'] : null;
  $photo  = isset($_GET['photo']) ? $_GET['photo'] : null;
  $catering = isset($_GET['catering']) ? $_GET['catering'] : null;
  $notes = isset($_GET['notes']) ? $_GET['notes'] : null;
  $wdCateringName = isset($_GET['wdCateringName']) ? $_GET['wdCateringName'] : "OTHER";
  $platePrice = isset($_GET['platePrice']) ? $_GET['platePrice'] : null;
  $plateCost = isset($_GET['plateCost']) ? $_GET['plateCost'] : null;
  $todayDate = isset($_GET['todayDate']) ? $_GET['todayDate'] : null;
  $booking_id = isset($_GET['booking_id']) ? $_GET['booking_id'] : null;
  $parking = isset($_GET['parking']) ? $_GET['parking'] : null;
  $submit = isset($_GET['submit']) ? $_GET['submit'] : null;
  $fullPay = 0;
  
  $fdate = strval(date('Y-m-d', strtotime($fdate)));
  $todayDate = strval(date('Y-m-d', strtotime($todayDate)));
  
  if ($advance == intval($_GET['finalTotalPrice']) + 10000) {
    $fullPay = 1;
  }


    $query1 = "UPDATE booking SET 
              advancePayment='$advance',
              customer_name='$Cname',
              customer_phone1='$Cphone1',
              customer_phone2='$Cphone2',
              function_date='$fdate',
              time='$time',
              function_type='$ftype',
              PAX='$pax',
              totalPrice='$totalPrice',
              discountAllowed='$discount',
              finalPrice='$finalTotalPrice',
              throne='$throne',
              dj='$DJ',
              photo='$photo',
              catering_id='$catering',
              cateringType='$wdCateringName',
              perPlatePrice='$platePrice',
              perPlateCost='$plateCost',
              confirmed_date='$todayDate',
              situation = 'confirmed',
              notes= '$notes',
              FullPayment = '$fullPay',
                parking = '$parking'
          WHERE book_id='$booking_id'";
          echo "echo '<script>alert(\"$query1\");</script>';";

  $query2 = "DELETE FROM booking_halls WHERE booking_id = $booking_id";
  if ($hall1 == "yes") {
      $query3 = "INSERT INTO booking_halls (booking_id, hall_id) VALUES ('$booking_id','1')";
  }
  if ($hall2 == "yes") {
      $query4 = "INSERT INTO booking_halls (booking_id, hall_id) VALUES ('$booking_id','2')";
  }
  if ($hall3 == "yes") {
      $query5 = "INSERT INTO booking_halls (booking_id, hall_id) VALUES ('$booking_id','3')";
  }

  // Execute the queries
  $result1 = mysqli_query($conn, $query1);
  $result2 = mysqli_query($conn, $query2);
  if (isset($query3)) {
      $result3 = mysqli_query($conn, $query3);
  }
  if (isset($query4)) {
      $result4 = mysqli_query($conn, $query4);
  }
  if (isset($query5)) {
      $result5 = mysqli_query($conn, $query5);
  }


  // Free up the memory associated with the previous result sets
  /*mysqli_free_result($result1);
  mysqli_free_result($result2);
  if (isset($result3)) {
      mysqli_free_result($result3);
  }*/

  $query6 = "INSERT INTO cashbook (date, inflow, description, InvoiceID) VALUES ('$todayDate', '$advance', 'advance from booking $booking_id', '$content')";

  // Execute the INSERT INTO cashbook query
 if (mysqli_query($conn, $query6)) {
    echo "<script>alert('Data inserted successfully')</script>";

    $todayDate = date("Y-m-d");
    $fourteenDaysBefore = date("Y-m-d", strtotime($fdate . " -14 days"));

    // Save the invoice data
    $saveQuery = "INSERT INTO invoices (
        InvoiceNumber, BookingNumber, BookingConfirmedOn, CustomerName, CustomerPhone,
        FunctionDateTimeType, Pax, Throne, DJ, photo, Parking, Catering, SpecialNotes,
        TotalPrice, PricePerHead, Discount, TotalPayable, RefundableDeposit,
        TotalPayablePriorFunction, AdvancePaid, RemainingBalance,
        PaymentDate, BalanceToPayBefore
    ) VALUES (
        '$content', '$booking_id', '$todayDate', '$Cname', '$Cphone1 / $Cphone2',
        '$fdate | $time | $ftype', $pax, '$throne', '$DJ', '$photo', '$parking', '$catering', '$notes',
        $totalPrice, $totalPrice/$pax, $discount, $finalTotalPrice, 10000.00, $finalTotalPrice+10000.00,
        $advance, $finalTotalPrice+10000.00-$advance,
        '$todayDate', '$fourteenDaysBefore'
    )";

    if (mysqli_query($conn, $saveQuery)) {
        echo "<script>alert('Data inserted successfully')</script>";
    } else {
        echo "Error: " . mysqli_error($conn);
    }

      
        // Open the text file
        $file = fopen("invoiceNumbers.txt", "r+");

        // Lock the file for exclusive writing
        if (flock($file, LOCK_EX)) {
            // Read the contents of the file
            $content = fread($file, filesize("invoiceNumbers.txt"));

            // Increment the invoice number
            $content = intval($content) + 1;

            // Set the file pointer to the beginning of the file
            rewind($file);

            // Write the new value to the file
            fwrite($file, $content);

            // Truncate the file to the current position
            ftruncate($file, ftell($file));

            // Release the file lock
            flock($file, LOCK_UN);
        }

        // Close the file
        fclose($file);


  } else {
      echo "Error: " . mysqli_error($conn);
  }

}

function formatCurrency($input) {
  // Convert input to integer
  $input = (int) $input;
  
  // Convert to float with 2 decimal places
  $float = number_format((float) $input, 2, '.', '');
  
  // Format with commas every 3 digits
  $formatted = number_format($float);
  
  return $formatted;
}

 ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-AK6n0+6fkuhe6eCHV7va+N9X5aP7Fq5ue4j4H4fyByiRgVKhE2PC4/xHr0t/8XjRd/2z1jkiNl7tZ8fNbdOj3g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap">
  <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v6.0.0-beta2/css/all.css" integrity="..." crossorigin="anonymous">
<script defer src="https://pro.fontawesome.com/releases/v6.0.0-beta2/js/all.js" integrity="..." crossorigin="anonymous"></script>



</head>
<style>.Quotation {
  font-family: 'poppins';
  max-width: 700px;
  margin: 0 auto;
  text-align: left;
  border: 2px solid #ccc;
  padding: 10px;
  padding-top: 5;
  margin-top: -50px;
}

.Quotation img {
  display: block;
  margin: 0 auto;
  max-width: 200px;
  width: 60px;
  height: 80px;
  float: left;
}

.Quotation h4 {
  margin: 0 auto; 
  
}

.Quotation table {
  margin: 10px auto;
  border-collapse: collapse;
  width: 100%;
}

.Quotation table td {
  padding: 5px;
  border: 1px solid black;
  font-size: 10px;
}

.Quotation table td:first-child {
  font-weight: bold;
  font-size: 10px;
  width: 50%;
  text-align: left;
}

.Quotation button {
  margin-top: 20px;
}
p{
  font-weight: normal;
  font-size: 8px;
}
.mainTxt{
  float: right;
  text-align: right;
  margin-bottom: 10px;
}
.txt{
  margin: 0;
  padding: 0;
}
@media print {
  @page {
    margin: 0;
  }
  body {
    padding-top: 20mm;
    padding-bottom: 20mm;
  }
  header,
  footer {
    display: none;
  }
}
.priceValues{
  text-align: right;
  align-items: right;
}

  .signature-block {
    width: 30%;
    margin-right: 3%;
    border-top: 1px dotted black;
    padding-top: 10px;
    display: inline-block;
    margin-top: 40px;
  }

  
  .signature-line {
    font-size: 12px;
    font-weight: bold;

  }
#notes {
    display: block;
    width: 90%;
    max-width: 100%;
    min-height: 3.2em;
    max-height: 9.6em; /* 3 lines x 3.2em */
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    border: 1px solid #ccc;
    padding: 5px;
    box-sizing: border-box;
  }
  #notes:focus {
    outline: none;
  }
</style>
<body style="font-family: 'Playfair Display', serif;">
  <!--invoice Starts from here -->
  <div class="Quotation">
  <img src="assets/img/org-logo.png" alt="Organization Logo"><br>
  <div class="mainTxt">
  <p class="txt">Wedding Zone Banquet Hall</p>
  <p class="txt">423 granpass rd colombo 14</p>
  <p class="txt">077-555-4262</p>
  <p class="txt">www.weddingzone.lk</p>
  </div>
  <table>
    <tr>
      <td colspan="2" style="text-align: center;font-size: 16px;"><h4>Invoice - <?=$content;?></h4></td>
    </tr>
    <tr><td>Booking Number</td><td>00<?=$_GET['booking_id'];?></td></tr>
    <tr>
      <td>Booking Confirmed On:</td>
      <td id="issuedDate"><?=$_GET['todayDate'];?></td>
    </tr>
    <tr>
      <td>Customer Details:</td>
      <td id="issuedDate">Name: <?=$_GET['Cname'];?> <br> Phone No.:  <?=$_GET['Cphone1'];?> / <?=$_GET['Cphone2'];?></td>
    </tr>
    <tr>
      <td>Halls Booked</td>
      <td id="expiryDate">
        <ul style="text-align: left;">
          <li>Ground Floor: <?=$_GET['hall1'];?></li>
          <li>1st Floor: <?=$_GET['hall2'];?></li>
          <li>2nd Floor: <?=$_GET['hall3'];?></li>
        </ul>

      </td>
    </tr>
    <tr>
      <td>Function Date | Time | Type:</td>
      <td><?=$_GET['fdate'];?> | <?=$_GET['time'];?> | <?=$_GET['ftype'];?></td>
    </tr>
    <tr>
      <td>Pax:</td>
      <td><?=$_GET['pax'];?></td>
    </tr>
    <tr>
      <td>Facilities Provided:</td>
      <td>
        <ul style="text-align: left;">
          <li>Throne: <?=$_GET['throne'];?></li>
          <li>DJ: <?=$_GET['DJ'];?></li>
          <li>Photography: <?=$_GET['photo'];?></li>
          <li>Parking: <?=$_GET['parking'];?></li>
          <li>Catering (Wedding Zone): <?=$_GET['catering'];?></li>
        </ul>
      </td>  
    </tr>
    <tr>
    <td>Catering From</td>
    <td><?= isset($_GET['wdCateringName']) ? "Wedding Zone Catering" : 'Outside Catering'; ?></td>
  </tr>
  <tr>
      <td>Special Notes (Catering / Deco)</p></td>
      <td>
        <form id="myForm" method="get" action="invoice.php">
          <div id="notes" contenteditable="true"><?php if(isset($_GET['notes'])){echo $_GET['notes'];}?></div>

          <input type="hidden" name="notes" id="notes-input" value="<?php if(isset($_GET['notes'])){echo $_GET['notes'];}?>">
          <script>
            const notesDiv = document.querySelector('#notes');
            const notesInput = document.querySelector('#notes-input');

            notesDiv.addEventListener('input', () => {
              const lines = notesDiv.innerHTML.split('<br>').length;
              if (lines > 3) {
                const lastChild = notesDiv.lastElementChild;
                notesDiv.removeChild(lastChild);
              }
              notesInput.value = notesDiv.innerHTML;
            });
          </script>

        </td>
    </tr>
    <tr>
      <td class="d-flex">Price: &nbsp;&nbsp;<span style="color: gray;font-weight: normal;"> (hall charges + facilites + Other)</span></td>
      <td  class="priceValues">Rs. <?=formatCurrency($_GET['totalPrice']);?>.00</td>
    </tr>
    <tr>
      <td class="d-flex">Per Head Price:</td>
      <td  class="priceValues">Rs. <?= formatCurrency(ceil($_GET['totalPrice']/$_GET['pax'])); ?>.00</td>
    </tr>
    <tr>
      <td>Discount:</td>
      <td  class="priceValues">Rs. <?=formatCurrency($_GET['discount']);?>.00</td>
    </tr>
    <tr>
      <td>Total Price: (Per head x Pax)</td>
      <td  class="priceValues" style="border-top: 2px solid gray;border-bottom: 3px double black;">Rs. <?=formatCurrency($_GET['finalTotalPrice']);?>.00</td>
    </tr>
    <tr>
      <td>Refundable Deposit:</span></td>
      <td  class="priceValues">Rs. 10,000.00</td>
    </tr>
    <tr>
  <td>Total Payable prior function:</td>
  <td  class="priceValues">Rs. <?= formatCurrency($_GET['finalTotalPrice']+10000); ?>.00</td>
</tr>
<tr>
  <td>Advance/Full Payment:</td>
  <td class="priceValues">
    
    
  <input  class="priceValues" type="number" min="10000" value="<?= isset($advance) ? $advance : ''; ?>" id="advance-payment" name="advance" required="" <?php if(isset($_GET['submit'])){echo "readonly";}?>>    
  <input type="hidden" name="Cname" value="<?=$_GET['Cname'];?>">
  <input type="hidden" name="Cphone1" value="<?=$_GET['Cphone1'];?>">
  <input type="hidden" name="Cphone2" value="<?=$_GET['Cphone2'];?>">
  <input type="hidden" name="fdate" value="<?=$_GET['fdate'];?>">
  <input type="hidden" name="time" value="<?=$_GET['time'];?>">
  <input type="hidden" name="ftype" value="<?=$_GET['ftype'];?>">
  <input type="hidden" name="pax" value="<?=$_GET['pax'];?>">
  <input type="hidden" name="hall1" value="<?=$_GET['hall1'];?>">
  <input type="hidden" name="hall2" value="<?=$_GET['hall2'];?>">
  <input type="hidden" name="hall3" value="<?=$_GET['hall3'];?>">
  <input type="hidden" name="totalPrice" value="<?=$_GET['totalPrice'];?>">
  <input type="hidden" name="discount" value="<?=$_GET['discount'];?>">
  <input type="hidden" name="finalTotalPrice" value="<?=$_GET['finalTotalPrice'];?>">
  <input type="hidden" name="throne" value="<?=$_GET['throne'];?>">
  <input type="hidden" name="DJ" value="<?=$_GET['DJ'];?>">
  <input type="hidden" name="photo" value="<?=$_GET['photo'];?>">
  <input type="hidden" name="parking" value="<?=$_GET['parking'];?>">
  <input type="hidden" name="catering" value="<?=$_GET['catering'];?>">
  <?php if(isset($_GET['wdCateringName'])): ?>
    <input type="hidden" name="wdCateringName" value="<?=$_GET['wdCateringName'];?>">
    <input type="hidden" name="platePrice" value="<?=$_GET['platePrice'];?>">
    <input type="hidden" name="plateCost" value="<?=$_GET['plateCost'];?>">
  <?php else: ?>
    <input type="hidden" name="wdCateringName" value="Outside Catering">
    <input type="hidden" name="platePrice" value="">
    <input type="hidden" name="plateCost" value="">
  <?php endif; ?>
  <input type="hidden" name="todayDate" value="<?=$_GET['todayDate'];?>">
  <input type="hidden" name="booking_id" value="<?=$_GET['booking_id'];?>">


  </td>
</tr>
<tr>
  <td>Balance to pay before <?= date('Y-m-d', strtotime('-14 days', strtotime($_GET['fdate']))); ?>:</td>
  <td  class="priceValues">
    <span id="balance-to-pay"></span>
  </td>
</tr>

<script>
 const finalTotalPrice = <?= $_GET['finalTotalPrice']; ?>;
const advancePaymentInput = document.getElementById('advance-payment');
const balanceToPaySpan = document.getElementById('balance-to-pay');
function formatCurrency(input) {
  // Convert input to integer
  input = parseInt(input);
  
  // Convert to float with 2 decimal places
  var float = parseFloat(input).toFixed(2);
  
  // Format with commas every 3 digits
  var formatted = float.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return formatted;
}
function calculateBalance() {
  const advancePayment = parseInt(advancePaymentInput.value);
  if (isNaN(advancePayment)) {
    return;
  }
  if (advancePayment < 10000) {
    alert('Minimum advance payment is 10000');
    advancePaymentInput.value = '';
    balanceToPaySpan.innerText = '';
    return;
  }else{
    const balanceToPay = formatCurrency(finalTotalPrice + 10000 - advancePayment);
    balanceToPaySpan.innerText = `Rs. ${balanceToPay}`;
  }
}

advancePaymentInput.addEventListener('change', calculateBalance);

// Call the function on load
calculateBalance();



</script>
<tr>
  <td colspan="2">
    <div class="signature-block">
      <div class="signature-line">Customer Signature</div>
    </div>
    <div class="signature-block">
      <div class="signature-line">Authorized Officer's Signature</div>
    </div>
    <div class="signature-block">
      <div class="signature-line">Date: <span style="font-weight: normal;font-size: 10px;"><?php echo date("d/m/Y"); ?></span></div>
    </div>
  </td>
</tr>

  <tr>
    <td colspan="2">
    <ul>
      <li><span style="font-size: 10px;font-weight: lighter;">Damages or extra charges will be deducted for unexpected/uninformed costs from refundable Deposit</span></li> 
      <li><span style="font-size: 10px;font-weight: lighter;">Minimum Advance : 30,000/- will not be refunded under any circumstance</span></li>
    </ul></td>
  </tr>
    <tr><td colspan="2" style="font-weight: lighter;font-size: 12px;color: blue;text-align: center;">Please Bring this Invoice for Next Payment and to Redeem Your Refundable balance.<br>ThankYou for working with us!</td></tr>
  </table>
  <div style="width: 100%; text-align: center;align-items: center;max-height:20px;">
 <?php if (isset($_GET['submit'])) { ?>
  <button onclick="printQuotation(event)" style="padding: 5px 15px 5px 15px;margin:0;"><i class="fa-solid fa-print" style="font-size: 20px"></i></button>
<?php } else { ?>
  <button type="submit" name="submit" onclick="verify(event)" style="padding:10px; background: orange;border: none;border-radius: 7px;cursor: pointer;box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">Proceed to Receipt</button>
<?php } ?>
</form>
</div>
</div>

<script>
function verify(event){
  if (confirm("Make Sure the Cash Received correctly, Are you sure you need to proceed?")) {

  }else{
    event.preventDefault();
  }
}
function printQuotation() {
event.preventDefault();
  const quotationDiv = document.querySelector('.Quotation');
  window.print();
}
</script>

 <!--invoice ends from here -->
</body>
</html>
<?php $conn->close(); ?>
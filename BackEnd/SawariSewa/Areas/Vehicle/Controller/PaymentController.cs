//using Microsoft.AspNetCore.Mvc;
//using SawariSewa.Areas.Vehicle.Services;
//using System.Threading.Tasks;

//namespace SawariSewa.Controllers
//{
//    [Route("api/payment")]
//    [ApiController]
//    public class PaymentController : ControllerBase
//    {
//        private readonly IPaymentService _paymentService;

//        public PaymentController(IPaymentService paymentService)
//        {
//            _paymentService = paymentService;
//        }

//        [HttpPost("initiate")]
//        public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentRequest model)
//        {
//            var paymentUrl = await _paymentService.InitiatePaymentAsync(model.Amount, model.OrderId, model.OrderName, model.CustomerName, model.CustomerEmail, model.CustomerPhone);

//            if (string.IsNullOrEmpty(paymentUrl))
//                return BadRequest("Payment initiation failed.");

//            return Ok(new { payment_url = paymentUrl });
//        }

//        [HttpPost("verify")]
//        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest model)
//        {
//            bool isVerified = await _paymentService.VerifyPaymentAsync(model.PaymentToken, model.Amount);

//            if (!isVerified)
//                return BadRequest("Payment verification failed.");

//            return Ok("Payment verified successfully.");
//        }
//    }

//    public class InitiatePaymentRequest
//    {
//        public decimal Amount { get; set; }
//        public string OrderId { get; set; }
//        public string OrderName { get; set; }
//        public string CustomerName { get; set; }
//        public string CustomerEmail { get; set; }
//        public string CustomerPhone { get; set; }
//    }

//    public class VerifyPaymentRequest
//    {
//        public string PaymentToken { get; set; }
//        public decimal Amount { get; set; }
//    }
//}


//Aadarsh code
//using Microsoft.AspNetCore.Mvc;
//using SawariSewa.Areas.Vehicle.Services;
//using System.Threading.Tasks;

//namespace SawariSewa.Controllers
//{
//    [Route("api/payment")]
//    [ApiController]
//    public class PaymentController : ControllerBase
//    {
//        private readonly IPaymentService _paymentService;

//        public PaymentController(IPaymentService paymentService)
//        {
//            _paymentService = paymentService;
//        }

//        [HttpPost("initiate")]
//        public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentRequest model)
//        {
//            var paymentUrl = await _paymentService.InitiatePaymentAsync(model.Amount, model.OrderId, model.OrderName, model.CustomerName, model.CustomerEmail, model.CustomerPhone);

//            if (string.IsNullOrEmpty(paymentUrl))
//                return BadRequest("Payment initiation failed.");

//            return Ok(new { payment_url = paymentUrl });
//        }

//        [HttpPost("verify")]
//        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest model)
//        {
//            // Updated to pass paymentId and transactionId instead of paymentToken
//            bool isVerified = await _paymentService.VerifyPaymentAsync(model.PaymentId, model.TransactionId, model.Amount);

//            if (!isVerified)
//                return BadRequest("Payment verification failed.");

//            return Ok("Payment verified successfully.");
//        }
//    }

//    public class InitiatePaymentRequest
//    {
//        public decimal Amount { get; set; }
//        public string OrderId { get; set; }
//        public string OrderName { get; set; }
//        public string CustomerName { get; set; }
//        public string CustomerEmail { get; set; }
//        public string CustomerPhone { get; set; }
//    }

//    public class VerifyPaymentRequest
//    {
//        // Updated properties to include paymentId and transactionId
//        public string PaymentId { get; set; }
//        public string TransactionId { get; set; }
//        public decimal Amount { get; set; }
//    }
//}

//final code
//using Microsoft.AspNetCore.Mvc;
//using System.Threading.Tasks;
//using SawariSewa.Areas.Vehicle.Services;
//using System;

//namespace SawariSewa.Areas.Vehicle.Controllers
//{
//    [ApiController]
//    [Route("api/payment")]
//    public class PaymentController : ControllerBase
//    {
//        private readonly IPaymentService _paymentService;

//        public PaymentController(IPaymentService paymentService)
//        {
//            _paymentService = paymentService;
//        }

//        /// <summary>
//        /// Initiates a payment and returns the Khalti payment URL.
//        /// </summary>
//        [HttpPost("initiate")]
//        public async Task<IActionResult> InitiatePayment([FromBody] PaymentRequestModel request)
//        {
//            if (request == null || request.Amount <= 0 || string.IsNullOrEmpty(request.OrderId))
//            {
//                return BadRequest(new { message = "Invalid payment request" });
//            }

//            try
//            {
//                var paymentUrl = await _paymentService.InitiatePaymentAsync(
//                    request.Amount, request.OrderId, request.OrderName,
//                    request.CustomerName, request.CustomerEmail, request.CustomerPhone
//                );

//                if (string.IsNullOrEmpty(paymentUrl))
//                {
//                    return BadRequest(new { message = "Failed to initiate payment" });
//                }

//                return Ok(new { paymentUrl });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "An error occurred while initiating payment", error = ex.Message });
//            }
//        }

//        /// <summary>
//        /// Verifies a payment when Khalti redirects to this API.
//        /// </summary>
//        [HttpGet("verify")]
//        public async Task<IActionResult> VerifyPayment(
//            [FromQuery] string pidx,
//            [FromQuery] string transaction_id,
//            [FromQuery] decimal amount,
//            [FromQuery] string status)
//        {
//            if (string.IsNullOrEmpty(pidx) || string.IsNullOrEmpty(status))
//            {
//                return BadRequest(new { message = "Invalid payment data received" });
//            }

//            if (status.ToLower() != "completed")
//            {
//                return BadRequest(new { message = "Payment was not successful", status });
//            }

//            try
//            {
//                // Call Khalti API to verify the payment
//                bool isVerified = await _paymentService.VerifyPaymentAsync(pidx, amount);

//                if (!isVerified)
//                {
//                    return BadRequest(new { message = "Payment verification failed" });
//                }

//                // TODO: Update your database here (e.g., mark the order as paid)
//                // Example:
//                // await _orderService.MarkOrderAsPaid(pidx, transaction_id, amount);

//                return Ok(new { message = "Payment successful", transactionId = transaction_id });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "An error occurred while verifying payment", error = ex.Message });
//            }
//        }
//    }

//    /// <summary>
//    /// Model for payment initiation request.
//    /// </summary>
//    public class PaymentRequestModel
//    {
//        public decimal Amount { get; set; }
//        public string OrderId { get; set; }
//        public string OrderName { get; set; }
//        public string CustomerName { get; set; }
//        public string CustomerEmail { get; set; }
//        public string CustomerPhone { get; set; }
//    }
//}

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SawariSewa.Areas.Vehicle.Services;
using System;
using System.Security.Claims;

namespace SawariSewa.Areas.Vehicle.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        /// <summary>
        /// Initiates a payment and returns the Khalti payment URL.
        /// </summary>
        [HttpPost("initiate")]
        public async Task<IActionResult> InitiatePayment([FromBody] PaymentRequestModel request)
        {
            if (request == null || request.Amount <= 0 || string.IsNullOrEmpty(request.OrderId))
            {
                return BadRequest(new { message = "Invalid payment request" });
            }

            try
            {
                var paymentUrl = await _paymentService.InitiatePaymentAsync(
                    request.Amount, request.OrderId, request.OrderName,
                    request.CustomerName, request.CustomerEmail, request.CustomerPhone
                );

                if (string.IsNullOrEmpty(paymentUrl))
                {
                    return BadRequest(new { message = "Failed to initiate payment" });
                }

                return Ok(new { paymentUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while initiating payment", error = ex.Message });
            }
        }

        /// <summary>
        /// Verifies a payment when Khalti redirects to this API.
        /// </summary>
        [HttpPost("verify-payment")]  // ✅ Ensure it's POST since your frontend is sending POST
        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Pidx) || request.Amount <= 0)
            {
                return BadRequest(new { message = "Invalid payment request" });  // ✅ Improve error message
            }

            bool isVerified = await _paymentService.VerifyPaymentAsync(request.Pidx, request.Amount);

            if (!isVerified)
            {
                return BadRequest(new { message = "Payment verification failed" });
            }

            return Ok(new { message = "Payment verified successfully" });
        }

        // ✅ Create a request model
        public class VerifyPaymentRequest
        {
            public string Pidx { get; set; }
            public decimal Amount { get; set; }
        }

    }


    /// <summary>
    /// Model for payment initiation request.
    /// </summary>
    public class PaymentRequestModel
    {
        public decimal Amount { get; set; }
        public string OrderId { get; set; }
        public string OrderName { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
    }

    /// <summary>
    /// Model for payment verification request.
    /// </summary>
    public class PaymentVerificationRequest
    {
        public string pidx { get; set; }

        public decimal amount { get; set; }

    }
}
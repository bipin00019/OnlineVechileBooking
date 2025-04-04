﻿//using Newtonsoft.Json;
//using System.Net.Http;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.Extensions.Configuration;

//namespace SawariSewa.Areas.Vehicle.Services
//{
//    public class PaymentService : IPaymentService
//    {
//        private readonly IConfiguration _configuration;
//        private readonly HttpClient _httpClient;

//        public PaymentService(IConfiguration configuration, HttpClient httpClient)
//        {
//            _configuration = configuration;
//            _httpClient = httpClient;
//        }

//        /// <summary>
//        /// Initiates a payment request to Khalti.
//        /// </summary>
//        public async Task<string> InitiatePaymentAsync(decimal amount, string orderId, string orderName, string customerName, string customerEmail, string customerPhone)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiInitiateUrl = "https://dev.khalti.com/api/v2/epayment/initiate/";

//            var data = new
//            {
//                return_url = "http://localhost:5178/api/payment/verify",
//                website_url = "http://localhost:5178/",
//                amount = amount * 100, // Convert to paisa
//                purchase_order_id = orderId,
//                purchase_order_name = orderName,
//                customer_info = new
//                {
//                    name = customerName,
//                    email = customerEmail,
//                    phone = customerPhone
//                }
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            // Create HttpRequestMessage and add Authorization header
//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiInitiateUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            // Send the request
//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return null; // Payment initiation failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            return khaltiResponse?.payment_url; // Return the payment URL from the response
//        }

//        /// <summary>
//        /// Verifies a payment using the token received from Khalti.
//        /// </summary>
//        public async Task<bool> VerifyPaymentAsync(string paymentToken, decimal amount)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiVerificationUrl = "https://dev.khalti.com/api/v2/payment/verify/";

//            var data = new
//            {
//                token = paymentToken,
//                amount = amount * 100 // Convert to paisa
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            // Create HttpRequestMessage and add Authorization header
//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiVerificationUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            // Send the request
//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return false; // Payment verification failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            return khaltiResponse != null && khaltiResponse.status == "success"; // Verify if the payment was successful
//        }
//    }
//}

//Aadarsh Code
//using Newtonsoft.Json;
//using System.Net.Http;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.Extensions.Configuration;

//namespace SawariSewa.Areas.Vehicle.Services
//{
//    public class PaymentService : IPaymentService
//    {
//        private readonly IConfiguration _configuration;
//        private readonly HttpClient _httpClient;

//        public PaymentService(IConfiguration configuration, HttpClient httpClient)
//        {
//            _configuration = configuration;
//            _httpClient = httpClient;
//        }

//        /// <summary>
//        /// Initiates a payment request to Khalti.
//        /// </summary>
//        public async Task<string> InitiatePaymentAsync(decimal amount, string orderId, string orderName, string customerName, string customerEmail, string customerPhone)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiInitiateUrl = "https://dev.khalti.com/api/v2/epayment/initiate/";

//            var data = new
//            {
//                return_url = "http://localhost:5178/api/payment/initiate",
//                website_url = "http://localhost:5178/",
//                amount = amount * 100, // Convert to paisa
//                purchase_order_id = orderId,
//                purchase_order_name = orderName,
//                customer_info = new
//                {
//                    name = customerName,
//                    email = customerEmail,
//                    phone = customerPhone
//                }
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            // Create HttpRequestMessage and add Authorization header
//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiInitiateUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            // Send the request
//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return null; // Payment initiation failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            return khaltiResponse?.payment_url; // Return the payment URL from the response
//        }

//        /// <summary>
//        /// Verifies a payment using the payment_id and transaction_id.
//        /// </summary>
//        public async Task<bool> VerifyPaymentAsync(string paymentId, string transactionId, decimal amount)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiVerificationUrl = "https://dev.khalti.com/api/v2/payment/verify/";

//            var data = new
//            {
//                payment_id = paymentId,
//                transaction_id = transactionId,
//                amount = amount * 100 // Convert to paisa
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            // Create HttpRequestMessage and add Authorization header
//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiVerificationUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            // Send the request
//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return false; // Payment verification failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            // Verify if the payment was successful based on the status field
//            return khaltiResponse != null && khaltiResponse.status == "success";
//        }
//    }
//}


//Final Code
//using Newtonsoft.Json;
//using System.Net.Http;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.Extensions.Configuration;

//namespace SawariSewa.Areas.Vehicle.Services
//{
//    public class PaymentService : IPaymentService
//    {
//        private readonly IConfiguration _configuration;
//        private readonly HttpClient _httpClient;

//        public PaymentService(IConfiguration configuration, HttpClient httpClient)
//        {
//            _configuration = configuration;
//            _httpClient = httpClient;
//        }

//        /// <summary>
//        /// Initiates a payment request to Khalti.
//        /// </summary>
//        public async Task<string> InitiatePaymentAsync(decimal amount, string orderId, string orderName, string customerName, string customerEmail, string customerPhone)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiInitiateUrl = "https://dev.khalti.com/api/v2/epayment/initiate/";

//            var data = new
//            {
//                return_url = "http://localhost:5178/api/payment/verify",  // Update return URL to our verification API
//                website_url = "http://localhost:5178/",
//                amount = amount * 100, // Convert to paisa
//                purchase_order_id = orderId,
//                purchase_order_name = orderName,
//                customer_info = new
//                {
//                    name = customerName,
//                    email = customerEmail,
//                    phone = customerPhone
//                }
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiInitiateUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return null; // Payment initiation failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            return khaltiResponse?.payment_url; // Return the payment URL from the response
//        }

//        /// <summary>
//        /// Verifies a payment using the pidx received from Khalti.
//        /// </summary>
//        public async Task<bool> VerifyPaymentAsync(string pidx, decimal amount)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiVerificationUrl = "https://dev.khalti.com/api/v2/epayment/lookup/";

//            var data = new
//            {
//                pidx = pidx,
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiVerificationUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return false; // Payment verification failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            return khaltiResponse != null && khaltiResponse.status == "Completed"; // Verify if the payment was successful
//        }
//    }
//}


//using Newtonsoft.Json;
//using System.Net.Http;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.Extensions.Configuration;

//namespace SawariSewa.Areas.Vehicle.Services
//{
//    public class PaymentService : IPaymentService
//    {
//        private readonly IConfiguration _configuration;
//        private readonly HttpClient _httpClient;

//        public PaymentService(IConfiguration configuration, HttpClient httpClient)
//        {
//            _configuration = configuration;
//            _httpClient = httpClient;
//        }

//        /// <summary>
//        /// Initiates a payment request to Khalti.
//        /// </summary>
//        public async Task<string> InitiatePaymentAsync(decimal amount, string orderId, string orderName, string customerName, string customerEmail, string customerPhone)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiInitiateUrl = "https://dev.khalti.com/api/v2/epayment/initiate/";

//            var data = new
//            {
//                return_url = "http://localhost:5173/verify-payment",  // Update return URL to our verification API
//                website_url = "http://localhost:5178/",
//                amount = amount * 100, // Convert to paisa
//                purchase_order_id = orderId,
//                purchase_order_name = orderName,
//                customer_info = new
//                {
//                    name = customerName,
//                    email = customerEmail,
//                    phone = customerPhone
//                }
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiInitiateUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return null; // Payment initiation failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            return khaltiResponse?.payment_url; // Return the payment URL from the response
//        }

//        /// <summary>
//        /// Verifies a payment using the pidx received from Khalti.
//        /// </summary>
//        public async Task<bool> VerifyPaymentAsync(string pidx, decimal amount)
//        {
//            var khaltiApiKey = _configuration["Khalti:ApiKey"];
//            var khaltiVerificationUrl = "https://dev.khalti.com/api/v2/epayment/lookup/";

//            var data = new
//            {
//                pidx = pidx,
//            };

//            var jsonPayload = JsonConvert.SerializeObject(data);
//            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

//            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiVerificationUrl)
//            {
//                Content = content
//            };
//            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

//            var response = await _httpClient.SendAsync(requestMessage);

//            if (!response.IsSuccessStatusCode)
//            {
//                return false; // Payment verification failed
//            }

//            var responseContent = await response.Content.ReadAsStringAsync();
//            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

//            return khaltiResponse != null && khaltiResponse.status == "Completed"; // Verify if the payment was successful
//        }
//    }
//}

//with frontend
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace SawariSewa.Areas.Vehicle.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public PaymentService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        /// <summary>
        /// Initiates a payment request to Khalti.
        /// </summary>
        public async Task<string> InitiatePaymentAsync(decimal amount, string orderId, string orderName, string customerName, string customerEmail, string customerPhone)
        {
            var khaltiApiKey = _configuration["Khalti:ApiKey"];
            var khaltiInitiateUrl = "https://dev.khalti.com/api/v2/epayment/initiate/";

            var data = new
            {
                return_url = "http://localhost:5173/verify-payment",  // Update return URL to our verification API
                website_url = "http://localhost:5178/",
                amount = amount * 100, // Convert to paisa
                purchase_order_id = orderId,
                purchase_order_name = orderName,
                customer_info = new
                {
                    name = customerName,
                    email = customerEmail,
                    phone = customerPhone
                }
            };
            Console.WriteLine($"Return URL: {data.return_url}");

            var jsonPayload = JsonConvert.SerializeObject(data);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiInitiateUrl)
            {
                Content = content
            };
            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

            var response = await _httpClient.SendAsync(requestMessage);

            if (!response.IsSuccessStatusCode)
            {
                return null; // Payment initiation failed
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

            return khaltiResponse?.payment_url; // Return the payment URL from the response
        }

        /// <summary>
        /// Verifies a payment using the pidx received from Khalti.
        /// </summary>
        public async Task<bool> VerifyPaymentAsync(string pidx, decimal amount)
        {
            var khaltiApiKey = _configuration["Khalti:ApiKey"];
            var khaltiVerificationUrl = "https://dev.khalti.com/api/v2/epayment/lookup/";

            var data = new
            {
                pidx = pidx,
            };

            var jsonPayload = JsonConvert.SerializeObject(data);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, khaltiVerificationUrl)
            {
                Content = content
            };
            requestMessage.Headers.Add("Authorization", $"Key {khaltiApiKey}");

            var response = await _httpClient.SendAsync(requestMessage);

            if (!response.IsSuccessStatusCode)
            {
                return false; // Payment verification failed
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var khaltiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

            return khaltiResponse != null && khaltiResponse.status == "Completed"; // Verify if the payment was successful
        }
    }
}
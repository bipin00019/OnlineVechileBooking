// import React, { useState } from "react";
// import { sendVerificationCode, verifyCode } from "../../services/otpService";

// const VerifyEmail = () => {
//   const [email, setEmail] = useState("");

//   const handleSendCode = async () => {
//     try {
//       const response = await sendVerificationCode(email);
//       console.log("Send Code Response:", response);
//       alert("Verification code sent successfully!");
//     } catch (error) {
//       console.error("Error sending code:", error);
//       alert("Failed to send verification code.");
//     }
//   };

//   return (
//     <div>
//       <h1>Send Verification Code</h1>
//       <input
//         type="email"
//         placeholder="Enter email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button onClick={handleSendCode}>Send Verification Code</button>
//     </div>
//   );
// };

// export default VerifyEmail;


import React, { useState } from "react";
import { sendVerificationCode, verifyCode } from "../../services/otpService";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // State to store the verification code
  const [isCodeSent, setIsCodeSent] = useState(false); // State to track if the code has been sent

  // Function to send the verification code
  const handleSendCode = async () => {
    try {
      const response = await sendVerificationCode(email);
      console.log("Send Code Response:", response);
      alert("Verification code sent successfully!");
      setIsCodeSent(true); // Set the state to true when the code is sent
    } catch (error) {
      console.error("Error sending code:", error);
      alert("Failed to send verification code.");
    }
  };

  // Function to verify the code entered by the user
  const handleVerifyCode = async () => {
    try {
      const response = await verifyCode(email, code);
      console.log("Verify Code Response:", response);
      alert("Code verified successfully!");
    } catch (error) {
      console.error("Error verifying code:", error);
      alert("Failed to verify code.");
    }
  };

  return (
    <div>
      <h1>Send Verification Code</h1>
      <div>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSendCode}>Send Verification Code</button>
      </div>

      {/* Render the input field for the verification code only after the code is sent */}
      {isCodeSent && (
        <div>
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;

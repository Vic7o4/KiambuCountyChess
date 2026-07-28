# M-Pesa STK Push Integration

This project provides a server implementation for handling M-Pesa STK push requests using Deno. It allows you to initiate payments through the M-Pesa API by processing incoming requests with the necessary parameters.

## Project Structure

```
mpesa-stk-push
├── src
│   ├── index.ts          # Main logic for handling M-Pesa STK push requests
│   └── types
│       └── index.ts      # TypeScript types and interfaces for M-Pesa transactions
├── deno.json             # Deno configuration file
├── import_map.json       # Module specifier mapping for easier imports
├── .env.example          # Example environment variables for configuration
└── README.md             # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mpesa-stk-push
   ```

2. **Install Deno**: Follow the instructions on the [Deno website](https://deno.land/) to install Deno.

3. **Configure environment variables**: Copy the `.env.example` file to `.env` and fill in the required M-Pesa credentials and other configuration settings.

4. **Run the server**:
   ```bash
   deno run --allow-net --allow-env --allow-read src/index.ts
   ```

## Usage

To initiate a payment, send a POST request to the server with the following JSON body:

```json
{
  "phone": "2547XXXXXXXX",
  "amount": 100,
  "accountReference": "YourAccountReference"
}
```

### Response

The server will respond with a JSON object indicating the success or failure of the payment request, including relevant details such as `checkoutRequestID` and `merchantRequestID`.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
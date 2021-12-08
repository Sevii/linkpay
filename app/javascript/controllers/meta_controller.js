import { Controller } from "stimulus";
import {
  connect_accounts,
  pay,
  onboard,
  walletCompatible,
  pay_bitcoin_qr,
  encode
} from "../metamask/index";
import Rails from "@rails/ujs";
import BigNumber from "bignumber.js";
import QRCode from "qrcode";

var quoteToTrack = null

export default class extends Controller {
  static targets = [
    "install",
    "orderStatus",
    "payEthereumButton",
    "payBitcoinButton",
    "orderButton",
    "results",
    "emailfield",
    "paymentform",
    "bitcoinQRCode",
    "qrCanvas"
  ];
  static values = {
    metamaskconnected: Boolean,
    ethereumaddress: String,
    inovice: String,
    productprice: String,
    bitcoinaddress: String,
    expiration: String,
    productname: String
  };


  pay_bitcoin_button() {
    this.payBitcoinButtonTarget.disabled = true;
    let customerEmail = this.emailfieldTarget.value;
    if (customerEmail == null || customerEmail === "" || customerEmail < 5) {
      this.orderStatusTarget.textContent = "Email not long enough";
      this.payBitcoinButtonTarget.disabled = false;
      console.log("email: " + customerEmail);
      return false;
    }

    console.log(this.inoviceValue);
    console.log("address: " + this.bitcoinaddressValue);
    let quoteData = {
      inovice: this.inoviceValue,
      currency: "bitcoin",
      customer_email: customerEmail
    }
    console.log(this.productnameValue)
    Rails.ajax({
          type: "POST",
          context: this,
          url: "/quote/new",
          data: new URLSearchParams(quoteData).toString(),
          success: function(quote){
            console.log("inside the Rails.ajax")
            console.log(quote)
            var payment_url = pay_bitcoin_qr(
              quote.address,
              quote.currency_amount,
              quote.currency,
              this.context.productnameValue);
            console.log(payment_url)
            console.log(this.context.qrCanvasTarget)

              let satoshi_amount = new BigNumber(quote.currency_amount);

              //Divide by 100 Million to convert from sats to fractional bitcoin
              let bitcoin_amount = satoshi_amount.div(100000000);

              //amount must be in decimal format BTC unlike eth which is in wei.
              let options = {
                amount:  bitcoin_amount.toFixed(),
                label: "Purchasing via Seviipay",
                message: this.context.productnameValue
              }

              let url = encode(quote.address, options, null);


            QRCode.toCanvas(this.context.qrCanvasTarget, url, function(error) {
              if (error) console.error(error);
            });
            this.context.qrCanvasTarget.hidden = false;
            quoteToTrack = quote
          },
          error: function(response){
            console.log("failure: ")
            console.log(response)
          }
        });

    console.log("Bitcoin payment");
  }

  pay_ethereum_button() {
    this.payEthereumButtonTarget.disabled = true;
    console.log("inoviceId: " + this.inoviceValue);

    let customerEmail = this.emailfieldTarget.value;
    if (customerEmail == null || customerEmail === "" || customerEmail < 5) {
      this.orderStatusTarget.textContent = "Email not long enough";
      this.payEthereumButtonTarget.disabled = false;
      console.log("email: " + customerEmail);
      return false;
    }

    return fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
      .then(response => response.json())
      .then(pair => pair.ethereum)
      .then(pair => pair.usd)
      .then(usdt_price =>
        pay(this.ethereumaddressValue, usdt_price, this.productpriceValue)
      )
      .then(orderDetails => {
        //payment placed
        this.orderStatusTarget.textContent =
          "Payment Placed txn: " + orderDetails.txn;
        // console.log(this.orderButtonTarget.innerHTML);

        //AJAX - Save Order details
        let orderData = {
          transaction_hash: orderDetails.transaction_hash,
          inovice_id: this.inoviceValue,
          currency_to_usd: orderDetails.currency_to_usd,
          currency_amount: orderDetails.currency_amount,
          customer_email: customerEmail,
          currency: "ethereum",
          account: orderDetails.customer_account
        };

        console.log("orderData");
        console.log(orderData);

        Rails.ajax({
          type: "POST",
          url: "/pay/create",
          data: new URLSearchParams(orderData).toString(),
          success: function(repsonse) {
            console.log(
              "success: " + new URLSearchParams(orderData).toString()
            );
            console.log(repsonse);
          },
          error: function(repsonse) {
            console.log(
              "failure: " + new URLSearchParams(orderData).toString()
            );
            console.log(repsonse);
          }
        });

        //JS redirect to Order page
      })
      .catch(err => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          this.payEthereumButtonTarget.disabled = false;
          this.orderStatusTarget.textContent = "Payment Rejected";
        } else if (err.code === -32602) {
          this.payEthereumButtonTarget.disabled = false;
          this.orderStatusTarget.textContent =
            "Please connect with Metamask Wallet.";
        } else {
          if(typeof err.code === 'undefined') {
            this.orderStatusTarget.textContent = err.message
          } 
          else {
             this.payEthereumButtonTarget.disabled = false;
             this.orderStatusTarget.textContent =
            "Payment failed error code: " + err.code;
          }
         
        }
      });
  }

  onboard_meta() {
    onboard();
  }

  //The first time this controller connects to the DOM
  initialize() {
    // startApp();
  }

  // Anytime this controller connects to the DOM
  connect() {
    if (this.expirationValue) {
      this.startRefreshing();
      this.quoteTracking();
    }

    console.log("address: " + this.addressValue);
    this.metamaskconnectedValue = false;

    walletCompatible().then(compatible => {
      if (compatible) {
        this.metamaskconnectedValue = true;
        this.payEthereumButtonTarget.disabled = false;
        console.log("compatible: " + compatible);
      } else {
        this.installTarget.hidden = false;
        this.paymentformTarget.hidden = true;
        this.payEthereumButtonTarget.disabled = true;
        console.log("compatible: " + compatible);
      }
    });

    console.log(this.metamaskconnectedValue);
    console.log(typeof this.metamaskconnectedValue);
  }

  // Anytime this controller disconnects from the DOM
  disconnect() {}

  startRefreshing() {
    setInterval(() => {
      console.log("Reloading");
      location.reload();
    }, 600000);
  }

  quoteTracking() {
      setInterval(() => {
        if(quoteToTrack) {
          console.log("Tracking quote: " + quoteToTrack.id);
          Rails.ajax({
            type: "GET",
            context: this,
            url: "/quote/paid/" + quoteToTrack.id,
            success: function(paid){
              
            },
              
            error: function(response){
              console.log("failure: ")
              console.log(response)
            }
          });

        }
      }, 1000);
  }
}

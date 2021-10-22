import { Controller } from "stimulus"
import { connect_accounts, pay, onboard, walletCompatible } from '../metamask/index';
import Rails from '@rails/ujs';

import Web3 from 'web3';
const web3 = new Web3('ws://localhost:8546');

export default class extends Controller {
static targets = [ "install", "orderStatus", "payEthereumButton","payBitcoinButton", "orderButton", "results", "emailfield", "paymentform", "bitcoinQRCode" ]
static values = { metamaskconnected: Boolean, address: String, inovice: String, productprice: String}


  pay_bitcoin_button() {
    this.payBitcoinButtonTarget.disabled = true;

    
    console.log("Bitcoin payment");
  }

  pay_ethereum_button() {
    this.payEthereumButtonTarget.disabled = true;
    console.log("inoviceId: " + this.inoviceValue);

    let customerEmail = this.emailfieldTarget.value;
    if(customerEmail == null || customerEmail === "" || customerEmail < 5) {
      this.orderStatusTarget.textContent = "Email not long enough";
      this.payEthereumButtonTarget.disabled = false;
      console.log("email: " + customerEmail);
      return false;
    }

    return fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    .then(response => response.json())
    .then(pair => pair.ethereum)
    .then(pair => pair.usd)
    .then(usdt_price => pay(this.addressValue, usdt_price, this.productpriceValue))
    .then((orderDetails) => {
        //payment placed
        this.orderStatusTarget.textContent="Payment Placed txn: " + orderDetails.txn;
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
        }
        
        console.log("orderData");
        console.log(orderData);
  
        Rails.ajax({
          type: "POST", 
          url: "/pay/create",
          data: new URLSearchParams(orderData).toString(),
          success: function(repsonse){
            console.log("success: " + new URLSearchParams(orderData).toString())
            console.log(repsonse)
          },
          error: function(repsonse){
            console.log("failure: " + new URLSearchParams(orderData).toString())
            console.log(repsonse)
          }
        })

        //JS redirect to Order page 

    })
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        this.payEthereumButtonTarget.disabled = false;
        this.orderStatusTarget.textContent="Payment Rejected";
      } else if(err.code === -32602) {
        this.payEthereumButtonTarget.disabled = false;
        this.orderStatusTarget.textContent="Please connect with Metamask Wallet.";
      } else {
        console.error(err);
        this.payEthereumButtonTarget.disabled = false;
        this.orderStatusTarget.textContent="Payment failed error code: " + err.code;
      }
    });
}

  onboard_meta(){
    onboard();
  }

  //The first time this controller connects to the DOM
      initialize() {

        // startApp();
      }

  // Anytime this controller connects to the DOM
      connect() {
       console.log("hello");
       console.log("address: " + this.addressValue);
        this.metamaskconnectedValue = false;

        walletCompatible().then(compatible => {
          if(compatible) {
            this.metamaskconnectedValue = true;
            this.payEthereumButtonTarget.disabled = false;
            console.log("compatible: " + compatible);
          }
          else {
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
      disconnect() {
      }

}   

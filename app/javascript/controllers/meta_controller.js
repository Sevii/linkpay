import { Controller } from "stimulus"
import { connect_accounts, startApp, pay } from '../metamask/index';
import Rails from '@rails/ujs';

export default class extends Controller {
static targets = [ "connected", "orderStatus", "payButton", "connectButon", "orderButton", "results" ]
static values = { metamaskConnected: Boolean, address: String, inovice: String }

  connect_metamask() {
    this.metamaskConnectedValue = connect_accounts();
    console.log("Connection Status: " + this.metamaskConnectedValue)
    this.connectedTarget.hidden = this.metamaskConnectedValue; 
  }


  pay_button() {
    console.log("Paying!!", this.element)
    this.payButtonTarget.disabled = true;
    console.log("inoviceId: " + this.inoviceValue);

    return fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT")
    .then(response => response.json())
    .then(pair => pair.price)
    .then(price => pay(this.addressValue, price))
    .then((txn) => {
        //payment placed
        this.orderStatusTarget.textContent="Payment Placed txn: " + txn;
        // console.log(this.orderButtonTarget.innerHTML);


        //AJAX - Save Order details
        let orderData = {
          transaction_hash: txn,
          inovice_id: this.inoviceValue,
        }
  
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
        this.payButtonTarget.disabled = false;
        this.orderStatusTarget.textContent="Payment Rejected";
      } else {
        console.error(err);
        this.payButtonTarget.disabled = false;
        this.orderStatusTarget.textContent="Payment failed error code: " + err.code;
      }
    });
}

  //The first time this controller connects to the DOM
      initialize() {
        this.metamaskConnectedValue = false;
        console.log(this.metamaskConnectedValue);
        console.log(typeof this.metamaskConnectedValue);
        startApp();
      }

      // Anytime this controller connects to the DOM
      connect() {
       this.connectedTarget.hidden = this.metamaskConnectedValue; 
       console.log("hello");
       console.log("address: " + this.addressValue);

      }

      // Anytime this controller disconnects from the DOM
      disconnect() {
      }

}   

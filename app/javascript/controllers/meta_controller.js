import { Controller } from "stimulus"
import { connect_accounts, startApp, pay } from '../metamask/index';


export default class extends Controller {
static targets = [ "connected", "orderStatus", "payButton", "connectButon" ]
static values = { metamaskConnected: Boolean, address: String }

  connect_metamask() {
    this.metamaskConnectedValue = connect_accounts();
    console.log("Connection Status: " + this.metamaskConnectedValue)
    this.connectedTarget.hidden = this.metamaskConnectedValue; 
  }


  pay_button() {
    console.log("Paying!!", this.element)
    this.payButtonTarget.disabled = true;

    let payResult =  pay(this.addressValue);
    console.log("Pay result " + payResult);
    payResult
    .then((txn) => {
        //payment placed
        this.orderStatusTarget.textContent="Payment Placed txn: " + txn;
        //Redirect 

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

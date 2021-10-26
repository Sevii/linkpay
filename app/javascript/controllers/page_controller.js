import { Controller } from "stimulus"

export default class extends Controller {
    sendToPaymentPage() {
        console.log("clicked");
        window.location.replace("/pay");
    }
}
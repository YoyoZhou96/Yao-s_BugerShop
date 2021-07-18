/* 
  Author : Yao Zhou 
  Student ID: 8725164
*/

const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  SIZE: Symbol("size"),
  TOPPINGS: Symbol("toppings"),
  SIDES: Symbol("sides"),
  DRINKS: Symbol("drinks"),
  PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sItem = "";
    this.sSize = "";
    this.sToppings = "";
    this.sSIDES = "";
    this.sDrinks = "";
    this.sPayment = "";
    this.sTotal = 0;
    this.sAddress = "";
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.ITEM;
        aReturn.push("Welcome to Yao's Burger Shop! Here is the Menu.");
        //aReturn.push("Buger: $12, Wrap: $10, Sandwiches: $8; \r (Small: +$0, Medium: +$2, Big: +$4;) \r Toppings: For free \r Tenders: $6, Fries: $2, Salad: $3; \r Drinks: Coke, Sprite, Ginger Ale, Nestea $2 for each");
        aReturn.push("What would you like? Buger, Wrap or Sandwiches?")
        break;
      case OrderState.ITEM:
        if (sInput.toLowerCase() == "buger") {
          this.stateCur = OrderState.SIZE
          this.sItem = sInput;
          aReturn.push("What size would you like?");
          aReturn.push("Large, Medium OR Small");
          this.sTotal += 12;
        }
        else if (sInput.toLowerCase() == "wrap") {
          this.stateCur = OrderState.SIZE
          this.sItem = sInput;
          aReturn.push("What size would you like?");
          aReturn.push("Large, Medium OR Small");
          this.sTotal += 10;
        }
        else if (sInput.toLowerCase() == "sandwiches") {
          this.stateCur = OrderState.SIZE
          this.sItem = sInput;
          aReturn.push("What size would you like?");
          aReturn.push("Large, Medium OR Small");
          this.sTotal += 8;
        }
        else {
          aReturn.push("Please enter valid product!");
        }
        break;
      case OrderState.SIZE:
        if (sInput.toLowerCase() == "large") {
          this.stateCur = OrderState.TOPPINGS
          this.sSize = sInput;
          aReturn.push("What toppings would you like?");
          this.sTotal += 4;
        }
        else if (sInput.toLowerCase() == "medium") {
          this.stateCur = OrderState.TOPPINGS
          this.sSize = sInput;
          aReturn.push("What toppings would you like?");
          this.sTotal += 2;
        }
        else if (sInput.toLowerCase() == "small") {
          this.stateCur = OrderState.TOPPINGS
          this.sSize = sInput;
          aReturn.push("What toppings would you like?");
        }
        else {
          aReturn.push("Please enter valid size!");
        }
        break;
      case OrderState.TOPPINGS:
        this.stateCur = OrderState.SIDES
        this.sToppings = sInput;
        aReturn.push("Would you like some sides?");
        aReturn.push("Tenders, Fries OR Salad");
        break;
      case OrderState.SIDES:
        if (sInput.toLowerCase() == "tenders") {
          this.stateCur = OrderState.DRINKS
          this.sSIDES = sInput;
          aReturn.push("Would you like drinks with that?");
          aReturn.push("We provide Coke, Sprite, Ginger Ale, Nestea");
          this.sTotal += 6;
        }
        else if (sInput.toLowerCase() == "fries") {
          this.stateCur = OrderState.DRINKS
          this.sSIDES = sInput;
          aReturn.push("Would you like drinks with that?");
          aReturn.push("We provide Coke, Sprite, Ginger Ale, Nestea");
          this.sTotal += 2;
        }
        else if (sInput.toLowerCase() == "salad") {
          this.stateCur = OrderState.DRINKS
          this.sSIDES = sInput;
          aReturn.push("Would you like drinks with that?");
          aReturn.push("We provide Coke, Sprite, Ginger Ale, Nestea");
          this.sTotal += 3;
        }
        else if (sInput.toLowerCase() == "no") {
          this.stateCur = OrderState.DRINKS
          this.sSIDES = sInput;
          aReturn.push("Would you like drinks with that?");
          aReturn.push("We provide Coke, Sprite, Ginger Ale, Nestea");
          this.sTotal += 0;
        }
        else {
          aReturn.push("Please enter valid content!");
        }
        break;
      case OrderState.DRINKS:
        if (sInput.toLowerCase() != "no") {
          this.sDrinks = sInput;
          this.sTotal += 0;
        }
        else {
          //this.stateCur = OrderState.PAYMENT;
          this.sDrinks = sInput;
          this.sTotal += 2;
        }
        aReturn.push("Thank-you for your order of");
        aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings} ${this.sSIDES}`);
        if (this.sDrinks) {
          aReturn.push(this.sDrinks);
        }
        if (this.sTotal > 0) {
          this.stateCur = OrderState.PAYMENT;
          aReturn.push(`This will cost $${this.sTotal}`);
          aReturn.push(`Please pay for your order here`);
          aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
        }
        else {
          aReturn.push("Thank-you, but your order beyond our service.Welcome your new order.");
          this.isDone(true);
          this.stateCur = OrderState.WELCOMING;
        }
        break;
      case OrderState.PAYMENT:
        var obj = JSON.parse(JSON.stringify(sInput));
        var target = obj.purchase_units[0].shipping;
        var address = target.address.address_line_1 + " " +
          target.address.admin_area_2 + " " +
          target.address.postal_code;
        this.isDone(true);
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Please pick it up at ${address} at ${d.toTimeString()}`);
        break;
    }
    return aReturn;
  }

  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.sTotal = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || 'ATHEOkqcwlPevRBdkgnafhlf_Bzco2va7MS-yFvgWwdFLLa0rGzxShB19mc8jblYZKtMX5fWlYdhBr6_'//(This is my client_ID, I tested SMS with it)
    return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.sTotal}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.sTotal}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

  }
}

// Make a cell (1 or 2 column) for the basics help page.
class McBasicsCol extends HTMLElement {

  constructor() {
    super();  // required call
  }
  connectedCallback() {
    const emptyHtmlContent = `
       <div class="col ">
        <div class="text-center">
          <p class="m-0"> </p>
          <img src="" width="20px" class="img-fluid">
        </div>
        </div>
        <div class="col-1 ">
          <div style="margin: 40px;"></div>
          <div class="d-flex justify-content-evenly">
            <h4> </h4>
          </div>
        </div>
   `;
    const colSum = this.getAttribute("col-sum");
    const imgCaption = this.getAttribute("img-caption");
    const imgUrl = this.getAttribute("img-url");
    const colOp = this.getAttribute("col-op");
    const sumHtmlContent = `
      <div class="col ">
        <p class="mt-2 py-2"></p>
        <div class="d-flex justify-content-evenly">
          <h4>${colSum} &cent;</h4>
        </div>
      </div>
    `;

    const addendHtmlContent = `
       <div class="col ">
        <div class="text-center">
          <p class="m-0">${imgCaption}</p>
          <img src="${imgUrl}" class="img-fluid">
        </div>
        </div>
        <div class="col-1 ">
          <div style="margin: 40px;"></div>
          <div class="d-flex justify-content-evenly">
            <h4>${colOp}</h4>
          </div>
        </div>
   `;
    // Create a shadow root
    //    const shadow = this.attachShadow({ mode: "open" });
    this.colType = this.getAttribute("col-type");
    const colTypeValues = ["empty", "sum", "addend"];
    if (!colTypeValues.includes(this.colType)) {
      // error
    }
    switch (this.colType) {
      case "empty":
        console.log("empty column start");
        this.outerHTML = emptyHtmlContent;
        break;
      case "sum":
        console.log("sum column start");
        //        const colValue = this.getAttribute("col-value");
        this.outerHTML = sumHtmlContent;
        break;
      case "addend":
        console.log("addend column start")
        this.outerHTML = addendHtmlContent;
        break;
    }

    //shadow.append() ???
  }
}
// Define new element
customElements.define("mc-basics-col", McBasicsCol)
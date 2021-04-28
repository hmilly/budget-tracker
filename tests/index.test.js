Object.defineProperty(global.Element.prototype, 'innerText', {
    get() {
      return this.textContent;
    },
    set(str) {
        this.innerHTML = this.textContent = str;
    }
  });

document.body.innerHTML = `
    <nav>
    Emergency Ration Budget Tool
    </nav>
    <main>
        <div id="cart">
            <div id="products">
                <h3>Choose your products</h3>
            </div>
            <div id="remaining">Remaining budget: <span>£50.00</span></div>
        </div>
    </main>
`;

const products = [
  {
    id: 1,
    name: "Hand sanitiser",
    img:
      "https://i5.walmartimages.com/asr/f1728857-3120-4a4e-b474-d66f8ad1bc77_1.7e41f79bcada186bbbc136d1094be906.jpeg?odnWidth=450&odnHeight=450&odnBg=ffffff",
    price: 12.99,
    max_quantity: 3,
  },
  {
    id: 2,
    name: "Toilet roll",
    img: "https://images.allianceonline.co.uk/Products/HBTR0010.jpg",
    price: 7.99,
    max_quantity: 4,
  },
  {
    id: 3,
    name: "Pasta",
    img:
      "https://www.italianfoodexperts.com/wp-content/uploads/2017/11/Vera-pasta-italiana.jpg",
    price: 4.99,
    max_quantity: 5,
  },
  {
    id: 4,
    name: "Eggs",
    img:
      "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/why-are-eggs-good-for-you-1296x728-feature.jpg?w=1155&h=1528",
    price: 5.99,
    max_quantity: 2,
  },
];

//Hi, I think I defo passed number 2 3 and 4 but not passing in my console.. Thanks 

const productsContainer = document.querySelector("#products");
let count = 0;
let costs = { 1: 0, 2: 0, 3: 0, 4: 0 }

for (let i in products) {
  let container = document.createElement("div");
  let img = document.createElement("img");
  img.src = `${products[i].img}`;
  container.appendChild(img);

  let h3 = document.createElement("h3");
  h3.innerText = `${products[i].name}`;
  container.appendChild(h3);

  let p = document.createElement("p");
  p.innerText = `${products[i].price}`;
  container.appendChild(p);

  let select = document.createElement("select");
  select.id = `${products[i].id}`;

  select.addEventListener("change", (e) => {
    let moneyDiv = document.querySelector("#remaining > span");
    costs[e.target.id] = Number(e.target.value);
    let tot = 0
    for (let i in costs) {
      tot += costs[i]
    }
    budget = 50.00;
    budget -= tot
    budget = budget.toFixed(2)
    moneyDiv.innerText = `£${budget}`;
    if (budget < 0) {
      let connectingDiv = document.querySelector("#remaining");
      budget = (Number(budget) + Number(e.target.value)).toFixed(2);
      e.target.value = 0
      costs[e.target.id] = Number(e.target.value)
      moneyDiv.innerText = `£${budget}`;
      let cont = document.createElement("div");
      setTimeout(() => {
        cont.className = `error`;
        cont.innerText = "Not enough money left for that!";
        connectingDiv.appendChild(cont);
        setTimeout(() => {
          let newDiv = document.querySelector(".error");
          connectingDiv.removeChild(newDiv);
        }, 4000);
      }, 2000);
    }
  });
  container.appendChild(select);

  let option = document.createElement("option");
  option.innerText = `${count++}`;
  select.appendChild(option);

  while (products[i].max_quantity !== 0) {
    let opt = document.createElement("option");
    opt.innerText = `${count++}`;
    opt.value = ((count - 1) * products[i].price).toFixed(2);
    select.appendChild(opt);
    products[i].max_quantity--;
  }

  productsContainer.appendChild(container);
  count = 0;
}

const {
  fireEvent,
} = require("@testing-library/dom/dist/@testing-library/dom.umd.js");

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

const productDivs = document.querySelectorAll("#products > div");
const remainingBudgetSpan = document.querySelector("#remaining > span");

describe("1. Products rendered", () => {
  test("4 products rendered", () => {
    expect(productDivs.length).toBe(products.length);
  });

  test("each product div contains an img tag", () => {
    productDivs.forEach((productDiv) => {
      expect(Boolean(productDiv.querySelector("img"))).toBe(true);
    });
  });

  test("each product div contains an h3 tag", () => {
    productDivs.forEach((productDiv) => {
      expect(Boolean(productDiv.querySelector("h3"))).toBe(true);
    });
  });

  test("each product div contains an p tag", () => {
    productDivs.forEach((productDiv) => {
      expect(Boolean(productDiv.querySelector("p"))).toBe(true);
    });
  });

  test("each product div contains a select tag", () => {
    productDivs.forEach((productDiv) => {
      expect(Boolean(productDiv.querySelector("select"))).toBe(true);
    });
  });

  test("each product div contains elements in the correct order", () => {
    productDivs.forEach((productDiv) => {
      expect([...productDiv.children].map((el) => el.tagName)).toEqual([
        "IMG",
        "H3",
        "P",
        "SELECT",
      ]);
    });
  });
});

describe("2. Dropdowns to select quantity", () => {
  test("each product dropdown contains the correct options", () => {
    products.forEach((product, i) => {
      const options = productDivs[i].querySelectorAll("option");
      const optionValues = [...options].map((option) => option.innerText);
      const expectedOptionValues = [];
      for (let index = 0; index <= product.max_quantity; index++) {
        expectedOptionValues.push(index.toString());
      }

      expect(optionValues).toEqual(expectedOptionValues);
    });
  });
});

describe("3. Budget updates", () => {
  const firstDiv = productDivs[0];
  const firstProduct = products[0];

  test("selecting some of any product updates the budget displayed", async () => {
    fireEvent.input(firstDiv.querySelector("select"), {
      target: { value: "1" },
    });

    expect(remainingBudgetSpan.innerHTML).toBe(
      `£${budget - firstProduct.price}`
    );
  });
});

describe("4. Budget limit", () => {
  const [firstDiv, secondDiv] = productDivs;
  const [firstProduct] = products;

  beforeAll(() => {
    productDivs.forEach(productDiv => {
      fireEvent.input(productDiv.querySelector("select"), {
        target: { value: "0" },
      });
    })
  })

  test("selecting products over budget doesn't allow selection", async () => {
    fireEvent.input(firstDiv.querySelector("select"), {
      target: { value: "3" },
    });
    fireEvent.input(secondDiv.querySelector("select"), {
      target: { value: "4" },
    });

    expect(remainingBudgetSpan.innerHTML).toBe(
      `£${(budget - firstProduct.price * 3).toFixed(2)}`
    );
  });

  test("selecting products over budget displays error message for 3 seconds", async () => {
    fireEvent.input(firstDiv.querySelector("select"), {
      target: { value: "3" },
    });
    fireEvent.input(secondDiv.querySelector("select"), {
      target: { value: "4" },
    });

    expect(Boolean(document.querySelector(".error"))).toBe(true);

    await wait(2500);

    expect(Boolean(document.querySelector(".error"))).toBe(true);
    
    await wait(1000);

    expect(Boolean(document.querySelector(".error"))).toBe(false);
  });
});

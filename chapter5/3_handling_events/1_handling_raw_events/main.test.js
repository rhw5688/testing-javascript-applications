const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText, createEvent } = require("@testing-library/dom");

beforeEach(() => {
  document.body.innerHTML = initialHtml;

  // You must execute main.js again so that it can attach the
  // event listener to the form every time the body changes.
  // Here you must use `jest.resetModules` because otherwise
  // Jest will have cached `main.js` and it will _not_ run again.
  jest.resetModules();
  require("./main");
});

test("adding items through the form", () => {
  screen.getByPlaceholderText("Item name").value = "cheesecake";
  screen.getByPlaceholderText("Quantity").value = "6";

  const event = new Event("submit");
  const form = document.getElementById("add-item-form");
  form.dispatchEvent(event);

  const itemList = document.getElementById("item-list");
  expect(getByText(itemList, "cheesecake - Quantity: 6")).toBeInTheDocument();
});

describe("item name validation", () => {
  test("entering valid item names ", () => {
    const itemField = screen.getByPlaceholderText("Item name");
    // TODO line below must be native
    const inputEvent = createEvent.input(itemField, {
      target: { value: "cheesecake" }
    });
    itemField.dispatchEvent(inputEvent);

    expect(screen.getByText("cheesecake is valid!")).toBeInTheDocument();
  });
});

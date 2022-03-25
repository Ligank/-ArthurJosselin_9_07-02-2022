/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import store from "../__mocks__/store.js";
import localStorage from "../__mocks__/localStorage.js";
import { getByRole, fireEvent } from '@testing-library/dom';
import { ROUTES } from '../constants/routes.js'
import BillsUI from "../views/BillsUI.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't upload a file who are not jpg, jpeg or png", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html;
      const file = new File(['hello'], 'hello.gif', {type: 'image/gif'})
      const input = screen.getByLabelText(/Justificatif/i)
      new NewBill({ document, onNavigate, store, localStorage });
      userEvent.upload(input, file)
      
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files).toHaveLength(1)
    
      expect(document.querySelector(`input[data-testid="file"]`).value).toEqual("");
    })

    test("Then I can submit my bill", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html;
      const file = new File(['hello'], 'hello.png', {type: 'image/png'})
      const input = screen.getByLabelText(/Justificatif/i)
      new NewBill({ document, onNavigate, store, localStorage });
      userEvent.upload(input, file)
      
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files).toHaveLength(1)

      const handleSubmit = jest.fn();
      document.querySelector(`form[data-testid="form-new-bill"]`).onsubmit = handleSubmit;
      
      fireEvent.submit(document.querySelector(`form[data-testid="form-new-bill"]`));
      expect(handleSubmit).toHaveBeenCalledTimes(1);

    })

  })
})


// test d'integration Post 404 et 500
describe("Given I am connected as an employee", () => {
  describe("When i navigate to Dashboard employee", () => {
    test("Add a bill from mock API POST", async () => {
      const postSpy = jest.spyOn(store, "post");
      const bill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
        "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20,
      };
      const bills = await store.post(bill);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(5);
      

    });

    test("Add bills from an API and fails with 404 message error", async () => {
      store.post.mockImplementationOnce(() => Promise.reject(new Error("erreur 404")));
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();

    })

    test("Then, fetches message from an API and fails with 500 messages error", async () => {
      store.post.mockImplementationOnce(() => Promise.reject(new Error("erreur 404")));
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();

    })
    
  })
})

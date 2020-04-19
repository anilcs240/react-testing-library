import React from "react";
import { render, fireEvent, cleanup, wait } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import { fetchUsers as fetchUserData } from "../Services/user.service";
import { selectedClass } from "../constants/const";
import App from "../App";

jest.mock("../Services/user.service");

const testId = "2";
const mockData = [
  {
    id: 2,
    name: "user Name",
    username: "demoTestMail",
    address: { street: "Kulas Light" },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: { name: "userName" },
    email: "userName@april.biz"
  }
];
describe("test user list component", () => {
  afterEach(cleanup);
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("after user-data loading finish loader should hide", async () => {
    const {queryByTestId } = render(<App />);
    expect(queryByTestId("loader")).toBeInTheDocument();
    await act(async () => {
      await wait(() => expect(fetchUserData).toHaveBeenCalledTimes(1));
      expect(queryByTestId("loader")).toBeNull();
    });
  });

  it(`load user data correctly and data length should ${mockData.length}`, async () => {
    fetchUserData.mockResolvedValueOnce(mockData);
    const { getByText, getByTestId } = render(<App />);
    expect(fetchUserData).toHaveBeenCalledTimes(1);
    await wait(() => expect(getByText("demoTestMail")).toBeInTheDocument());
    expect(getByTestId("userList").children.length).toBe(mockData.length);
  });

  it("'no data' label should show if api error", async () => {
    fetchUserData.mockRejectedValueOnce({});
    const {getByTestId } = render(<App />);
    expect(fetchUserData).toHaveBeenCalledTimes(1);
    await wait(() => expect(getByTestId("noData")).toBeInTheDocument());
  });

  it(`select table row on click and add class ${selectedClass}`, async () => {
    fetchUserData.mockResolvedValueOnce(mockData);
    const { getByText, getByTestId } = render(<App />);
    await wait(() => expect(getByText("demoTestMail")).toBeInTheDocument());
    expect(getByTestId(testId).className).toBe("");
    fireEvent.click(getByTestId(testId));
    expect(getByTestId(testId).className).toBe(selectedClass);
  });
});

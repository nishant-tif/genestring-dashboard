import uiReducer, { openModal, closeModal } from "../uiSlice";

describe("uiSlice", () => {
  const initialState = {
    activeModal: null,
  };

  it("should return the initial state", () => {
    expect(uiReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle openModal", () => {
    const actual = uiReducer(initialState, openModal("addPolicy"));
    expect(actual.activeModal).toEqual("addPolicy");
  });

  it("should handle closeModal", () => {
    const previousState = { activeModal: "addPolicy" as const };
    const actual = uiReducer(previousState, closeModal());
    expect(actual.activeModal).toBeNull();
  });
});

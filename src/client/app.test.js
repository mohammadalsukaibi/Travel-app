import { performAction } from './js/app'

describe("Testing the submit functionality", () => {
    test("Testing the performAction() function", () => {
        expect(performAction).toBeDefined();
    })
});

describe('Test, the function "performAction()" should be a function' , () => {
    test('It should be a function', () => {
        expect(typeof performAction).toBe("function");
    })
});
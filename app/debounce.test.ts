// debounce.test.ts
import debounce from './debounce'; // Adjust the path according to your file structure

jest.useFakeTimers();

describe('debounce', () => {
  let func: jest.Mock;
  let debouncedFunc: (...args: any[]) => void;

  beforeEach(() => {
    func = jest.fn(); // Mock the function to track calls
    debouncedFunc = debounce(func, 500); // Initialize the debounce function with 500ms delay
  });

  it('calls the function after the specified delay', () => {
    debouncedFunc('test');

    // Before the delay, the function should not have been called
    expect(func).not.toHaveBeenCalled();

    // Fast forward time to the debounce delay
    jest.advanceTimersByTime(500);

    // After the delay, the function should have been called
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('test');
  });

  it('does not call the function if invoked again before the delay', () => {
    debouncedFunc('test1');
    jest.advanceTimersByTime(200); // Move time forward by 200ms
    debouncedFunc('test2');

    // The function should not have been called yet, since the delay hasn't passed
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500); // Move time forward by the remaining 500ms

    // The function should only have been called once, with the second set of arguments
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('test2');
  });

  it('resets the delay when called repeatedly', () => {
    debouncedFunc('test1');
    jest.advanceTimersByTime(300); // Move time forward by 300ms
    debouncedFunc('test2');
    jest.advanceTimersByTime(300); // Another 300ms forward (should still not trigger)

    // Function should not have been called yet because the second call reset the delay
    expect(func).not.toHaveBeenCalled();

    // Advance time by 500ms after the last invocation
    jest.advanceTimersByTime(500);

    // Now the function should have been called once
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('test2');
  });
});

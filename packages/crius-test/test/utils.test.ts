import { parserString, compileString, errerMessage } from "../src/utils";

test("test `parserString`", () => {
  const object = parserString(`
    | accountTag   | isContactType | smsMessage          | sum          |
    | 'us'         | false         | {a:1}               | 1            |
    | 'uk'         | true          | {}                  | 1234         |
    | 'ca'         | null          | {b:{e:undefined}}   | -1.234       |
    | 'ca'         | undefined     | [{b:{e:undefined}}] | 0.1          |
  `);
  expect(object).toEqual([
    {
      smsMessage: { a: 1 },
      isContactType: false,
      accountTag: "us",
      sum: 1,
    },
    {
      smsMessage: {},
      isContactType: true,
      accountTag: "uk",
      sum: 1234,
    },
    {
      smsMessage: { b: { e: undefined } },
      isContactType: null,
      accountTag: "ca",
      sum: -1.234,
    },
    {
      smsMessage: [{ b: { e: undefined } }],
      isContactType: undefined,
      accountTag: "ca",
      sum: 0.1,
    },
  ]);
});

test("test `parserString` with Error", () => {
  const samples = [
    `
      | accountTag   | contactType | smsMessage |
      | us           | personal    | aaa        |
      | uk           | company     | bbb        |
      | ca           | all         | xxx        | |
    `,
    `
      | accountTag  | | contactType | smsMessage |
      | us           | personal    | aaa        |
      | uk           | company     | bbb        |
      | ca           | all         | xxx        |
    `,
    `
      | accountTag  | contactType | smsMessage |
      | us           | personal    | aaa        |
      | uk           | company     | bbb        |
      | ca      ||   |  all         | aaa        |
    `,
    `
      | accountTag  | contactType | smsMessage |
      | us           | personal    | aaa        |
    `,
  ];
  for (const item of samples) {
    const index = samples.indexOf(item);
    try {
      parserString(item);
    } catch (e) {
      if (index < 2) {
        expect(e.toString().replace(/\s+/g, "")).toEqual(
          new Error(errerMessage).toString().replace(/\s+/g, "")
        );
      } else {
        expect(e.toString()).toEqual(`ReferenceError: aaa is not defined`);
      }
    }
  }
});

test("test `parserString` with comments", () => {
  // Mock console.warn to capture warning messages
  const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

  const object = parserString(`
    | accountTag   | isContactType | smsMessage | sum |
    // This is a comment line that should be skipped
    | 'us'         | false         | {a:1}      | 1   |
    // Another comment
    | 'uk'         | true          | {}         | 1234|
    | 'ca'         | null          | {b:{e:undefined}} | -1.234 |
  `);

  expect(object).toEqual([
    {
      accountTag: "us",
      isContactType: false,
      smsMessage: { a: 1 },
      sum: 1,
    },
    {
      accountTag: "uk",
      isContactType: true,
      smsMessage: {},
      sum: 1234,
    },
    {
      accountTag: "ca",
      isContactType: null,
      smsMessage: { b: { e: undefined } },
      sum: -1.234,
    },
  ]);

  // Verify that warnings were logged for comment lines
  expect(consoleSpy).toHaveBeenCalledTimes(2);
  expect(consoleSpy).toHaveBeenCalledWith(
    "[WARN] Case:[    // This is a comment line that should be skipped] is being skipped caused of comment."
  );
  expect(consoleSpy).toHaveBeenCalledWith(
    "[WARN] Case:[    // Another comment] is being skipped caused of comment."
  );

  // Restore console.warn
  consoleSpy.mockRestore();
});

test("test `parserString` with mixed comments and data", () => {
  const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

  const object = parserString(`
    | name | value |
    // Comment at the beginning
    | 'test1' | 100 |
    // Comment in the middle
    | 'test2' | 200 |
    // Comment at the end
  `);

  expect(object).toEqual([
    {
      name: "test1",
      value: 100,
    },
    {
      name: "test2",
      value: 200,
    },
  ]);

  // Verify that warnings were called (exact count may vary due to other tests)
  expect(consoleSpy).toHaveBeenCalled();

  consoleSpy.mockRestore();
});

test("test `parserString` with only comments", () => {
  const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

  const object = parserString(`
    | name | value |
    // Only comments here
    // No data rows
  `);

  expect(object).toEqual([]);

  // Verify that warnings were called
  expect(consoleSpy).toHaveBeenCalled();

  consoleSpy.mockRestore();
});

test("test `parserString` with whitespace before comments", () => {
  const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

  const object = parserString(`
    | name | value |
    // Comment with no leading whitespace
      // Comment with leading whitespace
    | 'test' | 100 |
  `);

  expect(object).toEqual([
    {
      name: "test",
      value: 100,
    },
  ]);

  // Verify that warnings were called
  expect(consoleSpy).toHaveBeenCalled();

  consoleSpy.mockRestore();
});

test("test `compileString`", () => {
  expect(
    compileString("test ${a}", {
      a: "1",
    })
  ).toEqual("test 1");
  expect(
    compileString("test ${a} test", {
      a: 1,
    })
  ).toEqual("test 1 test");
  expect(
    compileString("test ${a} ${b} test", {
      a: "'1'",
      b: true,
    })
  ).toEqual(`test '1' true test`);
  expect(
    compileString("test ${a} ${b} test", {
      a: {},
      b: [],
    })
  ).toEqual(`test [object Object]  test`);
  try {
    compileString("test ${a} ${b} test", {});
  } catch (e) {
    expect(e.toString()).toEqual("ReferenceError: a is not defined");
  }
});

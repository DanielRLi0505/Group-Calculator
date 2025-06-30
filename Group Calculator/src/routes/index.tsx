import { Title } from "@solidjs/meta";
import { createEffect, createSignal } from "solid-js";


export default function Home() {
  const [numEntries, setNumEntries] = createSignal(0);
  const [entries, setEntries] = createSignal<number[]>([]);
  const [secondEntry, setSecondEntry] = createSignal<number>(0);
  const [results, setResults] = createSignal<number[]>([]);
  type Operation = "add" | "subtract" | "multiply" | "divide" | "modulo" | "power" | "avg" | "groupdiscount";
  const [operation, setOperation] = createSignal<Operation>("add");
  const [multipleOperators, setMultipleOperators] = createSignal<boolean>(false);
  const [operations, setOperations] = createSignal<Operation[]>([]);
  const [errors, setErrors] = createSignal<(string | null)[]>([]);
  const [groupThreshold, setGroupThreshold] = createSignal<number>(10);
  const [discount, setDiscount] = createSignal<number>(0);
  const [inputRefs, setInputRefs] = createSignal<(HTMLInputElement | HTMLSelectElement | null)[]>([]);
  const [secondInputRefs, setSecondInputRefs] = createSignal<(HTMLInputElement | null)[]>([]);
  const [multipleModifiers, setMultipleModifiers] = createSignal<boolean>(false);
  const [secondEntries, setSecondEntries] = createSignal<number[]>([]);
  const [groupDiscountRefs, setGroupDiscountRefs] = createSignal<(HTMLInputElement | null)[]>([]);
  const [discounts, setDiscounts] = createSignal<number[]>([]);
  const [groupThresholds, setGroupThresholds] = createSignal<number[]>([]);
  const OP_DICT: Record<Operation, (a: number, b: number) => number> = {
    add: (a: number, b: number) => {
      return a + b;
    },
    subtract: (a: number, b: number) => {
      return a - b;
    },
    multiply: (a: number, b: number) => {
      return a * b;
    },
    divide: (a: number, b: number) => {
      if (b === 0) {
        return NaN;
      }
      return a / b;
    },
    power: (a: number, b: number) => {
      return Math.pow(a, b);
    },
    avg: (a: number, b: number) => {
      return entries().reduce((acc, curr) => acc + curr, 0) / entries().length;
    },
    groupdiscount: (a: number, b: number) => {
      if (a < groupThreshold()) {
        return a * b;
      }
      return a * discount();
    },
    modulo: (a: number, b: number) => {
      if (b === 0) {
        return NaN;
      }
      return a % b
    },
  };

  const OP_STR_DICT: Record<Operation, string> = {
    add: "+",
    subtract: "-",
    multiply: "*",
    divide: "/",
    power: "^",
    avg: "Average",
    groupdiscount: "Group Discount",
    modulo: "% (modulo)",
  };

  function updateError(index: number, message: string | null) {
    const errs = [...errors()];
    errs[index] = message;
    setErrors(errs);
  }
  
  const createEntries = () => {
    if (entries().length <= 0) {
      const newEntries = Array.from({ length: numEntries() }, () => 0);
      setEntries(newEntries);
    }
    else {
      const newEntries = Array.from({ length: numEntries() }, (_, i) => {
        return entries()[i] !== undefined ? entries()[i] : 0;
      });
      setEntries(newEntries);
    }
    if (secondEntries().length <= 0) {
      const newSecondEntries = Array.from({ length: numEntries() }, () => 0);
      setSecondEntries(newSecondEntries);
    }
    else {
      const newSecondEntries = Array.from({ length: numEntries() }, (_, i) => {
        return secondEntries()[i] !== undefined ? secondEntries()[i] : 0;
      });
      setSecondEntries(newSecondEntries);
    }
    if (operations().length <= 0) {
      const newOperations = Array.from({ length: numEntries() }, () => "add" as Operation);
      setOperations(newOperations);
    }
    else {
      const newOperations = Array.from({ length: numEntries() }, (_, i) => {
        return operations()[i] !== undefined ? operations()[i] : "add" as Operation;
      });
      setOperations(newOperations);
    }
    if (discounts().length <= 0) {
      const newDiscounts = Array.from({ length: numEntries() }, () => 0);
      setDiscounts(newDiscounts);
    }
    else {
      const newDiscounts = Array.from({ length: numEntries() }, (_, i) => {
        return discounts()[i] !== undefined ? discounts()[i] : 0;
      });
      setDiscounts(newDiscounts);
    }
    if (groupThresholds().length <= 0) {
      const newGroupThresholds = Array.from({ length: numEntries() }, () => 10);
      setGroupThresholds(newGroupThresholds);
    }
    else {
      const newGroupThresholds = Array.from({ length: numEntries() }, (_, i) => {
        return groupThresholds()[i] !== undefined ? groupThresholds()[i] : 10;
      });
      setGroupThresholds(newGroupThresholds);
    }
    console.log(operations().toString());
  };

  const moveToNextInputFieldOnEnter = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const refs = inputRefs();
      if (refs[index + 1]) {
        refs[index + 1]?.focus();
      }
    }
  };

  const moveToNextSecondInputFieldOnEnter = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const refs = secondInputRefs();
      if (refs[index + 1]) {
        refs[index + 1]?.focus();
      }
    }
  };

  const moveToNextGroupDiscountInputFieldOnEnter = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const refs = groupDiscountRefs();
      if (refs[index + 1]) {
        refs[index + 1]?.focus();
      }
    }
  };

  createEffect(() => {
    const errs: (string | null)[] = [];
    const res: number[] = [];

    for (let i = 0; i < entries().length; i++) {
      let op: Operation = multipleOperators() ? operations()[i] : operation();
      let a = entries()[i];
      let b = multipleModifiers()
        ? secondEntries()[i]
        : (operation() === "groupdiscount" ? secondEntry() : secondEntry());

      let result: number;
      let error: string | null = null;

      if (op === "divide" || op === "modulo") {
        if (b === 0) {
          error = "Cannot divide by zero";
          result = 0;
        } else {
          result = OP_DICT[op](a, b);
        }
      } else if (op === "avg" && multipleOperators()) {
        error = "Cannot calculate average with multiple operations";
        result = 0;
      } else {
        result = op in OP_DICT ? OP_DICT[op](a, b) : OP_DICT["add"](a, b);
      }

      errs[i] = error;
      res[i] = result;
    }

    setErrors(errs);
    setResults(res);
  });

  return (
    <main>
      <Title>Group Calculator</Title>
      <h1>Group Calculator</h1>
      <div class="calc-body">
        <div class="calc-row">
          <input
            type="number"
            min={0}
            onChange={(e) => {
              setNumEntries(parseInt(e.currentTarget.value))
              createEntries();
            }}
            placeholder="How many numbers?">
          </input>
          <label>
            <input
              type="checkbox"
              checked={multipleModifiers()}
              onChange={(e) => {
                setMultipleModifiers(e.currentTarget.checked);
                createEntries();
              }}
            />
            Multiple modifiers?
          </label>
          <label>
            <input
              type="checkbox"
              checked={multipleOperators()}
              onChange={(e) => {
                setMultipleOperators(e.currentTarget.checked);
                createEntries();
              }}
            />
            Multiple operators?
          </label>
        </div>
        <br/>
        <div class="calc-row">
          <table>
            <thead>
              <tr>
                <th>
                  <h2>
                    Enter your numbers
                  </h2>
                </th>
                <th>
                  <h2>
                    Operation
                  </h2>
                </th>
                <th>
                  <h2>
                    Modifier
                  </h2>
                </th>
                <th>
                  <h2>
                    Results
                  </h2>
                </th>
              </tr>
            </thead>
            <tbody>
              {entries().map((entry, index) => (
                <tr>
                  <td>
                    <input
                      ref={e1 => {
                        const refs = [...inputRefs()];
                        refs[index] = e1;
                        setInputRefs(refs);
                      }}
                      type="number"
                      value={entry}
                      onChange={(e) => {
                        const newEntries = [...entries()];
                        newEntries[index] = parseFloat(e.currentTarget.value);
                        setEntries(newEntries);
                      }}
                      onKeyDown={e => moveToNextInputFieldOnEnter(e, index)}
                    />
                  </td>
                  <td>
                    {index === 0 && !multipleOperators() &&
                      <select value={operation()} onChange={(e) => setOperation(e.currentTarget.value as Operation)}>
                        <option value="add">+</option>
                        <option value="subtract">-</option>
                        <option value="multiply">*</option>
                        <option value="divide">/</option>
                        <option value="modulo">%</option>
                        <option value="avg">Average</option>
                        <option value="power">^</option>
                        <option value="groupdiscount">Group Discount</option>
                      </select>
                    }
                    {index !== 0 && !multipleOperators() && (
                      <span>{OP_STR_DICT[operation()]}</span>
                    )}
                    {multipleOperators() &&
                      <select value={operations()[index]} onChange={(e) => {
                        const newOperations = [...operations()];
                        newOperations[index] = e.currentTarget.value as Operation;
                        setOperations(newOperations);
                      }}>
                        <option value="add">+</option>
                        <option value="subtract">-</option>
                        <option value="multiply">*</option>
                        <option value="divide">/</option>
                        <option value="modulo">%</option>
                        <option value="avg">Average</option>
                        <option value="power">^</option>
                        <option value="groupdiscount">Group Discount</option>
                      </select>
                    }
                  </td>
                  <td>
                    {index === 0 && operation() !== "groupdiscount" && operation() !== "avg" && !multipleModifiers() &&
                      <input
                        type="number"
                        value={secondEntry()}
                        onChange={(e) => {
                          setSecondEntry(parseFloat(e.currentTarget.value))}
                        }
                    />}
                    {index === 0 && operation() === "groupdiscount" && !multipleModifiers() &&
                      <div class="grdsc">
                        <span class="grdsc-row">
                          <input
                            ref={e1 => {
                              const refs = [...groupDiscountRefs()];
                              refs[index] = e1;
                              setGroupDiscountRefs(refs);
                            }}
                            type="number"
                            value={secondEntry()}
                            onChange={(e) => setSecondEntry(parseFloat(e.currentTarget.value))}
                            onKeyDown={(e) => moveToNextGroupDiscountInputFieldOnEnter(e, index)}
                          />
                          <p> {" normally, "} </p>
                        </span>
                        <span class="grdsc-row">
                          <input
                            ref={e1 => {
                              const refs = [...groupDiscountRefs()];
                              refs[index] = e1;
                              setGroupDiscountRefs(refs);
                            }}
                            type="number"
                            value={discount()}
                            onChange={(e) => setDiscount(parseFloat(e.currentTarget.value))}
                            onKeyDown={(e) => moveToNextGroupDiscountInputFieldOnEnter(e, index)}
                          />
                          <p> {" if >= "} </p>
                          <input
                            ref={e1 => {
                              const refs = [...groupDiscountRefs()];
                              refs[index] = e1;
                              setGroupDiscountRefs(refs);
                            }}
                            type="number"
                            value={groupThreshold()}
                            onChange={(e) => setGroupThreshold(parseFloat(e.currentTarget.value))}
                            onKeyDown={(e) => moveToNextGroupDiscountInputFieldOnEnter(e, index)}
                          />
                        </span>
                      </div>
                    }
                    {index !== 0 && operation() !== "avg" && !multipleModifiers() && (
                      <span>{secondEntry() !== null ? secondEntry() : 0}</span>
                    )}
                    {multipleModifiers() && operation() !== "groupdiscount" &&
                      <input
                        ref={e2 => {
                          const refs = [...secondInputRefs()];
                          refs[index] = e2;
                          setSecondInputRefs(refs);
                        }}
                        type="number"
                        value={secondEntries()[index]}
                        onChange={(e) => {
                          const newEntries = [...secondEntries()];
                          newEntries[index] = parseFloat(e.currentTarget.value);
                          setSecondEntries(newEntries);
                        }}
                        onKeyDown={e => moveToNextSecondInputFieldOnEnter(e, index)}
                      />
                    }
                    {(multipleModifiers() || multipleOperators()) && operation() === "groupdiscount" &&
                      <div class="grdsc">
                        <span class="grdsc-row">
                          <input
                            ref={e2 => {
                              const refs = [...groupDiscountRefs()];
                              refs[index] = e2;
                              setGroupDiscountRefs(refs);
                            }}
                            type="number"
                            value={secondEntries()[index]}
                            onChange={(e) => {
                              const newEntries = [...secondEntries()];
                              newEntries[index] = parseFloat(e.currentTarget.value);
                              setSecondEntries(newEntries);
                            }}
                            onKeyDown={e => moveToNextGroupDiscountInputFieldOnEnter(e, index)}
                          />
                          <p> {" normally, "} </p>
                        </span>
                        <span class="grdsc-row">
                          <input
                            ref={e2 => {
                              const refs = [...groupDiscountRefs()];
                              refs[index] = e2;
                              setGroupDiscountRefs(refs);
                            }}
                            type="number"
                            value={discounts()[index]}
                            onChange={(e) => {
                              const newDiscounts = [...discounts()];
                              newDiscounts[index] = parseFloat(e.currentTarget.value);
                              setDiscounts(newDiscounts);
                            }}
                            onKeyDown={e => moveToNextSecondInputFieldOnEnter(e, index)}
                          />
                          <p> {" if >= "} </p>
                          <input
                            ref={e2 => {
                              const refs = [...groupDiscountRefs()];
                              refs[index] = e2;
                              setGroupDiscountRefs(refs);
                            }}
                            type="number"
                            value={groupThresholds()[index]}
                            onChange={(e) => {
                              const newGroupThresholds = [...groupThresholds()];
                              newGroupThresholds[index] = parseFloat(e.currentTarget.value);
                              setGroupThresholds(newGroupThresholds);
                            }}
                            onKeyDown={e => moveToNextSecondInputFieldOnEnter(e, index)}
                          />
                        </span>
                      </div>
                    }
                  </td>
                  <td>
                    {errors()[index]
                      ? <span>{errors()[index]}</span>
                      : <span>{results()[index]}</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
    </main>
  );
}

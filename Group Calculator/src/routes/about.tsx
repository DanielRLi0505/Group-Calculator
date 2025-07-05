import { Title } from "@solidjs/meta";

export default function About() {
  return (
    <main>
      <Title>About</Title>
      <h1>About</h1>
      <h2>What is this app?</h2>
      <p>
        This is an app that allows users to perform batch calculations
        without the need for repetitive inputs.
      </p>
      <h2>Why was this made?</h2>
      <p>
        This calculator was made to streamline repetitive calculations.
        Whether it's adding the same number to several different ones,
        demonstrating how to compare fractions, or showing each different
        operation on the same set of numbers, this calculator can make
        it so much easier to calculate these things without having to keep
        typing the same inputs.
      </p>
      <h2>How to Use</h2>
      <p>
        By default, you can enter multiple numbers to perform a single
        calculation on.  Just enter how many calculations you would like
        to perform, and each row will be created.  If you would like to 
        modify only one number in various ways, uncheck the "multiple 
        entries" box.  If you would like to perform different operations, 
        check the "multiple operations" box.  If you would like to modify 
        any number with multiple, check the "multiple modifiers" box.
      </p>
    </main>
  );
}
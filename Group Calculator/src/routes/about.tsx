import { Title } from "@solidjs/meta";

export default function About() {
  return (
    <main>
      <Title>About</Title>
      <h1>About</h1>
      <h2>How to Use</h2>
      <p>
        This calculator allows you to perform operations on a list of numbers.
        You can add, subtract, multiply, divide, or calculate the average of
        these numbers. Additionally, you can apply a group discount based on the
        number of entries.
      </p>
      <h2>Why was this made?</h2>
      <p>
        This calculator was created to simplify the process of performing
        calculations on multiple numbers, especially in group settings. It
        aims to provide a user-friendly interface for managing and computing
        various mathematical operations efficiently.
      </p>
    </main>
  );
}
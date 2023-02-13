import React from "react";
import { Tab, Tabs } from "react-tabs";

function App() {
  return (
    <Tabs>
      <Tab>
        <h2>Tab 1</h2>
        <p>Content for tab 1 goes here</p>
      </Tab>
      <Tab>
        <h2>Tab 2</h2>
        <p>Content for tab 2 goes here</p>
      </Tab>
    </Tabs>
  );
}

export default App;

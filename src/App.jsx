import CommandPanel from "./components/CommandPanel";
import Core from "./components/Core";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <MainLayout>
      <CommandPanel></CommandPanel>
      <Core></Core>
    </MainLayout>
  );
}

export default App;

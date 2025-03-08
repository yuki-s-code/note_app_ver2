// Appコンポーネント
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import { Root } from "./Root";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Root />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
